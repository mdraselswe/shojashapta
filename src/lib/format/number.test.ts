import { describe, expect, it } from "vitest";

import { formatNumber, formatPercent, formatPriceRange, formatTaka, toBnDigits } from "./number";

describe("toBnDigits", () => {
  it("replaces every Latin digit and keeps everything else", () => {
    expect(toBnDigits(7)).toBe("৭");
    expect(toBnDigits("7/64 জেলা")).toBe("৭/৬৪ জেলা");
    expect(toBnDigits("1234567890")).toBe("১২৩৪৫৬৭৮৯০");
  });
});

describe("formatNumber", () => {
  it("uses Bangla digits and lakh grouping", () => {
    expect(formatNumber(0)).toBe("০");
    expect(formatNumber(1234567)).toBe("১২,৩৪,৫৬৭");
  });

  it("rounds to whole numbers by default", () => {
    expect(formatNumber(92.6)).toBe("৯৩");
  });
});

describe("formatTaka / formatPriceRange", () => {
  it("formats a single price", () => {
    expect(formatTaka(250)).toBe("৳২৫০");
  });

  it("formats a range low to high", () => {
    expect(formatPriceRange(250, 380)).toBe("৳২৫০–৳৩৮০");
    expect(formatPriceRange(380, 250)).toBe("৳২৫০–৳৩৮০");
  });

  it("collapses equal or one-sided ranges to one price", () => {
    expect(formatPriceRange(250, 250)).toBe("৳২৫০");
    expect(formatPriceRange(250, null)).toBe("৳২৫০");
    expect(formatPriceRange(null, 380)).toBe("৳৩৮০");
  });

  it("returns null when no price is known", () => {
    expect(formatPriceRange(null, null)).toBeNull();
  });
});

describe("formatPercent", () => {
  it("formats whole percentages", () => {
    expect(formatPercent(92)).toBe("৯২%");
  });
});
