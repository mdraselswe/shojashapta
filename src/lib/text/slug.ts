// URL slugs: always Latin, lowercase, hyphenated. An English name wins when given; otherwise the
// Bangla name is transliterated phonetically ("কাচ্চি বিরিয়ানি" → "kachchi-biriyani").

const INDEPENDENT_VOWELS: Record<string, string> = {
  অ: "o",
  আ: "a",
  ই: "i",
  ঈ: "i",
  উ: "u",
  ঊ: "u",
  ঋ: "ri",
  এ: "e",
  ঐ: "oi",
  ও: "o",
  ঔ: "ou",
};

const CONSONANTS: Record<string, string> = {
  ক: "k",
  খ: "kh",
  গ: "g",
  ঘ: "gh",
  ঙ: "ng",
  চ: "ch",
  ছ: "chh",
  জ: "j",
  ঝ: "jh",
  ঞ: "n",
  ট: "t",
  ঠ: "th",
  ড: "d",
  ঢ: "dh",
  ণ: "n",
  ত: "t",
  থ: "th",
  দ: "d",
  ধ: "dh",
  ন: "n",
  প: "p",
  ফ: "f",
  ব: "b",
  ভ: "bh",
  ম: "m",
  য: "j",
  র: "r",
  ল: "l",
  শ: "sh",
  ষ: "sh",
  স: "s",
  হ: "h",
  ড়: "r", // ড়
  ঢ়: "rh", // ঢ়
  য়: "y", // য়
  ৎ: "t",
};

const VOWEL_SIGNS: Record<string, string> = {
  "া": "a",
  "ি": "i",
  "ী": "i",
  "ু": "u",
  "ূ": "u",
  "ৃ": "ri",
  "ে": "e",
  "ৈ": "oi",
  "ো": "o",
  "ৌ": "ou",
};

/** Signs that follow a consonant whose inherent vowel is still spoken ("রং" → "rong"). */
const NASAL_SIGNS: Record<string, string> = { "ং": "ng", "ঃ": "h", "ঁ": "" };

const HASANT = "্";

const NUKTA_LETTERS: Record<string, string> = {
  ড়: "ড়",
  ঢ়: "ঢ়",
  য়: "য়",
};
const NUKTA_FORMS = /[ডঢয]়/g;
const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

function transliterate(text: string): string {
  // NFC splits ড়/ঢ়/য় into letter + nukta (they are composition exclusions); rejoin them.
  const chars = [
    ...text.normalize("NFC").replace(NUKTA_FORMS, (pair) => NUKTA_LETTERS[pair] ?? pair),
  ];
  let out = "";
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i] ?? "";
    const next = chars[i + 1] ?? "";
    const consonant = CONSONANTS[char];
    if (consonant !== undefined) {
      // After a hasant, য is the য-ফলা ("ব্যাংক" → "byangk").
      out += char === "য" && chars[i - 1] === HASANT ? "y" : consonant;
      const followedByLetter =
        CONSONANTS[next] !== undefined || INDEPENDENT_VOWELS[next] !== undefined;
      // Inherent "o" is spoken before another letter or a nasal sign, silent at the end of a word.
      if (followedByLetter || NASAL_SIGNS[next] !== undefined) out += "o";
      continue;
    }
    out +=
      VOWEL_SIGNS[char] ??
      INDEPENDENT_VOWELS[char] ??
      NASAL_SIGNS[char] ??
      (char === HASANT ? "" : BN_DIGITS.includes(char) ? String(BN_DIGITS.indexOf(char)) : char);
  }
  return out;
}

function toSlug(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // drop Latin accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Slug from an English name if given, else the transliterated Bangla name. */
export function slugify(nameBn: string, nameEn?: string | null): string {
  const fromEnglish = nameEn ? toSlug(nameEn) : "";
  return fromEnglish || toSlug(transliterate(nameBn));
}

/** First free slug: "doi", then "doi-2", "doi-3", … */
export function nextAvailableSlug(base: string, taken: Iterable<string>): string {
  const used = new Set(taken);
  if (!used.has(base)) return base;
  for (let n = 2; ; n++) {
    const candidate = `${base}-${n}`;
    if (!used.has(candidate)) return candidate;
  }
}
