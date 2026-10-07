// URL slugs: always Latin, lowercase, hyphenated. An English name wins when given; otherwise the
// Bangla name is transliterated phonetically ("কাচ্চি বিরিয়ানি" → "kachchi-biriyani").

import { transliterateBn } from "./transliterate";

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
  return fromEnglish || toSlug(transliterateBn(nameBn));
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
