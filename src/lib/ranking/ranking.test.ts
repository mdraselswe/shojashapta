import { describe, expect, it } from "vitest";

import { lovedPercent } from "./percent";
import { wilsonLowerBound } from "./wilson";

describe("wilsonLowerBound", () => {
  it("is 0 with no experiences", () => {
    expect(wilsonLowerBound(0, 0)).toBe(0);
  });

  it("matches known values (z = 1.96)", () => {
    expect(wilsonLowerBound(3, 3)).toBeCloseTo(0.4385, 4);
    expect(wilsonLowerBound(950, 1000)).toBeCloseTo(0.9347, 4);
    expect(wilsonLowerBound(5, 10)).toBeCloseTo(0.2366, 4);
  });

  it("ranks 950/1000 above 3/3 (decision P10)", () => {
    expect(wilsonLowerBound(950, 1000)).toBeGreaterThan(wilsonLowerBound(3, 3));
  });

  it("stays within 0..1 and grows with evidence at the same ratio", () => {
    for (const [pos, n] of [
      [0, 5],
      [5, 5],
      [1, 2],
    ] as const) {
      const score = wilsonLowerBound(pos, n);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    }
    expect(wilsonLowerBound(80, 100)).toBeGreaterThan(wilsonLowerBound(8, 10));
  });
});

describe("lovedPercent", () => {
  it("rounds to a whole percent", () => {
    expect(lovedPercent(23, 25)).toBe(92);
    expect(lovedPercent(1, 3)).toBe(33);
  });

  it("is null without experiences", () => {
    expect(lovedPercent(0, 0)).toBeNull();
  });

  it("never exceeds 100", () => {
    expect(lovedPercent(12, 10)).toBe(100);
  });
});
