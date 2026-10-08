import { describe, expect, it } from "vitest";

import { divisionProgress, nextStampSuggestion, stampInk, stampRotation } from "./stamps";

describe("stamp look", () => {
  it("is fixed per district and stays within the four inks and +-8 degrees", () => {
    for (let id = 1; id <= 64; id++) {
      expect(stampInk(id)).toBe(stampInk(id));
      expect([1, 2, 3, 4]).toContain(stampInk(id));
      expect(Math.abs(stampRotation(id))).toBeLessThanOrEqual(8);
    }
  });

  it("uses all four inks across the country", () => {
    expect(new Set(Array.from({ length: 64 }, (_, index) => stampInk(index + 1))).size).toBe(4);
  });
});

describe("divisionProgress", () => {
  const districts = [
    { id: 1, divisionBn: "ঢাকা" },
    { id: 2, divisionBn: "রাজশাহী" },
    { id: 3, divisionBn: "ঢাকা" },
    { id: 4, divisionBn: "রাজশাহী" },
  ];

  it("counts unlocked and total districts per division in first-seen order", () => {
    expect(divisionProgress(districts, new Set([2, 4, 3]))).toEqual([
      { name: "ঢাকা", unlocked: 1, total: 2 },
      { name: "রাজশাহী", unlocked: 2, total: 2 },
    ]);
  });

  it("is all zero for a new passport", () => {
    expect(divisionProgress(districts, new Set()).map((d) => d.unlocked)).toEqual([0, 0]);
  });
});

describe("nextStampSuggestion", () => {
  const districts = [
    { id: 1, slug: "bogura", nameBn: "বগুড়া" },
    { id: 2, slug: "natore", nameBn: "নাটোর" },
  ];
  const fame = [
    { districtId: 1, food: { slug: "doi", nameBn: "দই" } },
    { districtId: 2, food: { slug: "kacha-golla", nameBn: "কাঁচাগোল্লা" } },
  ];

  it("suggests the first famous food of a district that is still locked", () => {
    expect(nextStampSuggestion(fame, districts, new Set([1]))).toEqual({
      district: { slug: "natore", nameBn: "নাটোর" },
      food: { slug: "kacha-golla", nameBn: "কাঁচাগোল্লা" },
    });
  });

  it("is null once every district with a famous food is unlocked", () => {
    expect(nextStampSuggestion(fame, districts, new Set([1, 2]))).toBeNull();
  });
});
