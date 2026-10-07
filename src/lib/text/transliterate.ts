// Bangla → Latin transliteration shared by slugs (text/slug) and search keys (text/normalize).

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

/** NFC splits ড়/ঢ়/য় into letter + nukta (they are composition exclusions); rejoin them. */
export function rejoinNukta(text: string): string {
  return text.normalize("NFC").replace(NUKTA_FORMS, (pair) => NUKTA_LETTERS[pair] ?? pair);
}

/**
 * Phonetic Bangla → Latin ("কাচ্চি বিরিয়ানি" → "kachchi biriyani"). Latin, digits and other
 * characters pass through; Bangla digits become Latin digits. Used for slugs and search keys.
 */
export function transliterateBn(text: string): string {
  const chars = [...rejoinNukta(text)];
  let out = "";
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i] ?? "";
    const next = chars[i + 1] ?? "";
    const consonant = CONSONANTS[char];
    if (consonant !== undefined) {
      // After a hasant, য is the য-ফলা ("ব্যাংক" → "byangk").
      out += char === "য" && chars[i - 1] === HASANT ? "y" : consonant;
      const prev = chars[i - 1] ?? "";
      const followedByLetter =
        CONSONANTS[next] !== undefined || INDEPENDENT_VOWELS[next] !== undefined;
      // Schwa deletion: a consonant that closes a syllable (vowel before it, consonant + vowel sign
      // after it) has no inherent vowel — ফুচকা "fuchka", মেজবানি "mejbani", ঝালমুড়ি "jhalmuri".
      const closesSyllable =
        (VOWEL_SIGNS[prev] !== undefined || INDEPENDENT_VOWELS[prev] !== undefined) &&
        CONSONANTS[next] !== undefined &&
        VOWEL_SIGNS[chars[i + 2] ?? ""] !== undefined;
      // Otherwise the inherent "o" is spoken before another letter or a nasal sign, silent at word end.
      if ((followedByLetter && !closesSyllable) || NASAL_SIGNS[next] !== undefined) out += "o";
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
