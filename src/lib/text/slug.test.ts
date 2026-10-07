import { describe, expect, it } from "vitest";

import { nextAvailableSlug, slugify } from "./slug";

describe("slugify (Bangla)", () => {
  it.each([
    ["দই", "doi"],
    ["কাচ্চি", "kachchi"],
    ["কাচ্চি বিরিয়ানি", "kachchi-biriyani"],
    ["বগুড়া", "bogura"],
    ["ঢাকা", "dhaka"],
    ["চট্টগ্রাম", "chottogram"],
    ["মেজবানি", "mejbani"],
    ["কাঁচাগোল্লা", "kachagolla"],
    ["নাটোর", "nator"],
    ["রং", "rong"],
    ["চিকেন চাপ ২৪", "chiken-chap-24"],
  ])("%s → %s", (bn, slug) => {
    expect(slugify(bn)).toBe(slug);
  });

  it("handles decomposed nukta letters (ড + ়)", () => {
    expect(slugify("বগুড়া")).toBe("bogura");
  });
});

describe("slugify (English name)", () => {
  it("prefers the English name when given", () => {
    expect(slugify("দই", "Bogura Doi")).toBe("bogura-doi");
  });

  it("strips accents and punctuation", () => {
    expect(slugify("x", "  Star Kabab & Restaurant (Dhanmondi)  ")).toBe(
      "star-kabab-restaurant-dhanmondi",
    );
    expect(slugify("x", "Café Crème")).toBe("cafe-creme");
  });

  it("falls back to Bangla when the English name has no usable characters", () => {
    expect(slugify("দই", "!!!")).toBe("doi");
  });
});

describe("nextAvailableSlug", () => {
  it("returns the base when free, else the first free numeric suffix", () => {
    expect(nextAvailableSlug("doi", [])).toBe("doi");
    expect(nextAvailableSlug("doi", ["doi"])).toBe("doi-2");
    expect(nextAvailableSlug("doi", ["doi", "doi-2", "doi-3"])).toBe("doi-4");
  });
});
