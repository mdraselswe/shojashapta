import { describe, expect, it } from "vitest";

import { normalizeBn, stripStopWords, toSearchKey, toSearchQuery } from "./normalize";

// Each group lists spellings people type for the same thing; all must share one search key
// (docs/04-database.md §6: kacchi/kachchi/kacci/কাচ্চি/কাচি → same key).
const SAME_KEY: Record<string, string[]> = {
  kacchi: ["kacchi", "kachchi", "kacci", "kachi", "কাচ্চি", "কাচি", "KACCHI", "Kachchi"],
  biryani: ["biryani", "biriyani", "biriani", "বিরিয়ানি", "বিরিয়ানী"],
  "kacchi biryani": [
    "kacchi biryani",
    "kachchi biriyani",
    "কাচ্চি বিরিয়ানি",
    "  kacchi   biryani ",
  ],
  doi: ["doi", "doy", "dai", "দই"],
  "mishti doi": ["mishti doi", "misti doi", "mishti doy", "মিষ্টি দই"],
  fuchka: ["fuchka", "phuchka", "fuchkaa", "ফুচকা"],
  haleem: ["haleem", "halim", "hallim", "হালিম"],
  khichuri: ["khichuri", "kichuri", "khichhuri", "খিচুড়ি", "খিচুড়ি"],
  "bhuna khichuri": ["bhuna khichuri", "vuna khichuri", "buna kichuri", "ভুনা খিচুড়ি"],
  mezbani: ["mezbani", "mejbani", "mezbanee", "মেজবানি"],
  chicken: ["chicken", "chiken", "chikken", "চিকেন"],
  jhalmuri: ["jhalmuri", "jalmuri", "ঝালমুড়ি"],
  shingara: ["shingara", "singara", "সিঙ্গারা"],
  dhaka: ["dhaka", "daka", "ঢাকা"],
  chattogram: ["chottogram", "chattogram", "চট্টগ্রাম"],
  bhorta: ["bhorta", "vorta", "borta", "ভর্তা"],
};

describe("toSearchKey: spelling variants meet", () => {
  for (const [name, variants] of Object.entries(SAME_KEY)) {
    const expected = toSearchKey(variants[0] ?? "");
    it.each(variants)(`${name}: %s`, (variant) => {
      expect(toSearchKey(variant)).toBe(expected);
    });
  }
});

describe("toSearchKey: different foods stay different", () => {
  it.each([
    ["kacchi", "tehari"],
    ["doi", "dal"],
    ["haleem", "nihari"],
    ["mishti", "misti doi"],
    ["chicken", "chingri"],
    ["biryani", "bhuna"],
    ["fuchka", "chotpoti"],
    ["bogura", "barishal"],
  ])("%s ≠ %s", (a, b) => {
    expect(toSearchKey(a)).not.toBe(toSearchKey(b));
  });

  it("keeps vowels (stripping them would merge unrelated foods)", () => {
    expect(toSearchKey("dal")).not.toBe(toSearchKey("dul"));
    expect(toSearchKey("kacchi")).toMatch(/[aeiou]/);
  });
});

describe("toSearchKey: shape", () => {
  it.each([
    ["কাচ্চি", "kaci"],
    ["দই", "dai"],
    ["biryani", "biriani"],
    ["কাচ্চি বিরিয়ানি", "kaci biriani"],
  ])("%s → %s", (input, key) => {
    expect(toSearchKey(input)).toBe(key);
  });

  it("keeps words separated and digits", () => {
    expect(toSearchKey("chicken chap 24")).toBe("ciken cap 24");
    expect(toSearchKey("চিকেন চাপ ২৪")).toBe("ciken cap 24");
  });

  it("drops punctuation and symbols", () => {
    expect(toSearchKey("kacchi!!! (biryani)")).toBe(toSearchKey("kacchi biryani"));
    expect(toSearchKey("কাচ্চি, বিরিয়ানি।")).toBe(toSearchKey("কাচ্চি বিরিয়ানি"));
  });

  it("is empty for empty or symbol-only input", () => {
    expect(toSearchKey("")).toBe("");
    expect(toSearchKey("   ")).toBe("");
    expect(toSearchKey("?!…")).toBe("");
  });

  it("is idempotent", () => {
    for (const input of ["kacchi biryani", "মিষ্টি দই", "Star Kabab", "ঝালমুড়ি"]) {
      const key = toSearchKey(input);
      expect(toSearchKey(key)).toBe(key);
    }
  });
});

describe("normalizeBn", () => {
  it("removes zero-width joiners and non-joiners", () => {
    expect(normalizeBn("ক\u200Dা\u200Cচ্চি")).toBe("কাচ্চি");
    expect(normalizeBn("দ\uFEFFই")).toBe("দই");
  });

  it("unifies decomposed and precomposed nukta letters", () => {
    expect(normalizeBn("বগুড়া")).toBe(normalizeBn("বগুড়া"));
    expect(normalizeBn("বিরিয়ানি")).toBe(normalizeBn("বিরিয়ানি"));
    expect(normalizeBn("ঢ়")).toBe("ঢ়");
  });

  it("collapses whitespace including no-break space", () => {
    expect(normalizeBn("  মিষ্টি\u00A0\u00A0 দই \n")).toBe("মিষ্টি দই");
  });

  it("lowercases Latin and keeps Bangla", () => {
    expect(normalizeBn("Bogura দই")).toBe("bogura দই");
  });
});

describe("stripStopWords / toSearchQuery", () => {
  it.each([
    ["dhaka r kacchi", "dhaka kacchi"],
    ["bogura er doi kothay", "bogura doi"],
    ["ঢাকার ভালো কাচ্চি কোথায়", "ঢাকার কাচ্চি"],
    ["পুরান ঢাকা এর বিরিয়ানি", "পুরান ঢাকা বিরিয়ানি"],
  ])("%s → %s", (input, output) => {
    expect(stripStopWords(input)).toBe(normalizeBn(output));
  });

  it("only removes whole words", () => {
    expect(stripStopWords("ruti")).toBe("ruti");
    expect(stripStopWords("kotha bari")).toBe("bari");
  });

  it("keeps the query when it is only stop words", () => {
    expect(stripStopWords("kothay")).toBe("kothay");
  });

  it("builds text and key together", () => {
    expect(toSearchQuery("Dhaka r KACCHI")).toEqual({
      text: "dhaka kacchi",
      key: toSearchKey("dhaka kacchi"),
    });
  });
});
