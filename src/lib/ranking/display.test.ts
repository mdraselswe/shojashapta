import { describe, expect, it } from "vitest";

import { dishDisplay } from "./display";

const rules = { minExperiencesToRank: 5, favoriteMinExperiences: 10, favoriteMinPercent: 80 };

describe("dishDisplay", () => {
  it("shows no percent and no rank for a brand-new dish", () => {
    expect(dishDisplay({ lovedCount: 0, experienceCount: 0 }, rules)).toEqual({
      percent: null,
      rankable: false,
      favorite: false,
    });
  });

  it("keeps 3/3 unranked: a perfect score from three people is not a ranking (decision P10)", () => {
    expect(dishDisplay({ lovedCount: 3, experienceCount: 3 }, rules)).toEqual({
      percent: null,
      rankable: false,
      favorite: false,
    });
  });

  it("ranks and shows the percent from the minimum experiences on", () => {
    expect(dishDisplay({ lovedCount: 4, experienceCount: 5 }, rules)).toEqual({
      percent: 80,
      rankable: true,
      favorite: false, // 5 < 10 experiences
    });
  });

  it("labels a well-loved, well-known dish as a community favorite", () => {
    expect(dishDisplay({ lovedCount: 23, experienceCount: 25 }, rules)).toEqual({
      percent: 92,
      rankable: true,
      favorite: true,
    });
  });

  it("needs both enough experiences and a high enough share", () => {
    expect(dishDisplay({ lovedCount: 7, experienceCount: 10 }, rules).favorite).toBe(false); // 70%
    expect(dishDisplay({ lovedCount: 8, experienceCount: 10 }, rules).favorite).toBe(true); // 80%
    expect(dishDisplay({ lovedCount: 9, experienceCount: 9 }, rules).favorite).toBe(false); // 9 < 10
  });

  it("reads thresholds from appConfig by default", () => {
    expect(dishDisplay({ lovedCount: 40, experienceCount: 52 }).rankable).toBe(true);
  });
});
