import { rejoinNukta, transliterateBn } from "./transliterate";

// Search normalization (docs/04-database.md §6) — the heart of search quality. The same functions
// write foods/places `search_text` + `search_key` and normalize every query, so "kacchi", "kachchi",
// "kacci", "কাচ্চি" and "কাচি" all meet at one key; pg_trgm similarity handles remaining typos.

const ZERO_WIDTH = /[\u200B-\u200D\u2060\uFEFF]/g;

/** Words that only add noise to a food search ("ঢাকার ভালো কাচ্চি কোথায়"). */
const STOP_WORDS: ReadonlySet<string> = new Set(
  ["er", "ar", "r", "kothay", "kotha", "ভালো", "কোথায়", "এর"].map((word) => normalizeBn(word)),
);

/**
 * Canonical display-ish text: NFC, no zero-width joiners, one form of ড়/ঢ়/য়, single spaces,
 * lowercase Latin. Bangla is kept as Bangla.
 */
export function normalizeBn(input: string): string {
  return rejoinNukta(input.normalize("NFC").replace(ZERO_WIDTH, ""))
    .replace(/[\s\u00A0]+/g, " ")
    .trim()
    .toLowerCase();
}

/** Drops stop words (whole words only); keeps the query if that would empty it. */
export function stripStopWords(input: string): string {
  const words = normalizeBn(input).split(" ");
  const kept = words.filter((word) => !STOP_WORDS.has(word));
  return kept.length > 0 ? kept.join(" ") : words.join(" ");
}

// Applied in order to Latin text. Digraphs fold before single letters.
const FOLDS: readonly [RegExp, string][] = [
  [/ck/g, "k"], // English "chicken" — before ch→c, so "fuchka" (ch + k) is untouched
  [/chh|ch|c/g, "c"],
  [/q/g, "k"],
  [/x/g, "ks"],
  [/sh|s/g, "s"],
  [/z|j/g, "j"],
  [/ph|f/g, "f"],
  [/w|v/g, "b"],
  [/kh/g, "k"],
  [/gh/g, "g"],
  [/th/g, "t"],
  [/dh/g, "d"],
  [/bh/g, "b"],
  [/ee|i/g, "i"],
  [/oo|u/g, "u"],
  [/o|a/g, "a"],
  [/y/g, "i"],
  [/([bcdfgjklmnprstv])h/g, "$1"], // silent h after a consonant ("rh", "jh")
  [/([a-z])\1+/g, "$1"], // collapse doubled letters ("kacci" → "kaci")
];

/**
 * Phonetic search key: Bangla transliterated, Latin folded so common spelling variants collide.
 * Vowels are kept (stripping them merges unrelated foods). Words stay space-separated.
 */
export function toSearchKey(input: string): string {
  let key = transliterateBn(normalizeBn(input))
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  for (const [pattern, replacement] of FOLDS) key = key.replace(pattern, replacement);
  return key.replace(/ +/g, " ").trim();
}

/** What the search runs on: normalized text and its key, stop words removed. */
export function toSearchQuery(input: string): { text: string; key: string } {
  const text = stripStopWords(input);
  return { text, key: toSearchKey(text) };
}
