import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { buildDhakaSql, DHAKA_MIGRATION_PATH } from "./build-dhaka-sql";
import { FOODS, PLACES } from "./data";
import {
  DHAKA_AREAS,
  DHAKA_FAME,
  DHAKA_FOODS,
  DHAKA_PLACES,
  EXISTING_FAME_SOURCES,
  EXISTING_PLACE_AREAS,
} from "./dhaka-data";

const unique = (values: string[]) => new Set(values).size === values.length;
const allFoods = new Set([...FOODS, ...DHAKA_FOODS].map((food) => food.slug));
const areas = new Set(DHAKA_AREAS.map((area) => area.slug));

describe("Dhaka seed data", () => {
  it("has unique slugs that do not clash with the first seed", () => {
    expect(unique(DHAKA_PLACES.map((place) => place.slug))).toBe(true);
    expect(unique(DHAKA_FOODS.map((food) => food.slug))).toBe(true);
    expect(unique(DHAKA_AREAS.map((area) => area.slug))).toBe(true);
    for (const place of DHAKA_PLACES) expect(PLACES.map((p) => p.slug)).not.toContain(place.slug);
    for (const food of DHAKA_FOODS) expect(FOODS.map((f) => f.slug)).not.toContain(food.slug);
  });

  it("puts every place in a known area and ties every dish to a known food", () => {
    for (const place of DHAKA_PLACES) {
      expect(areas.has(place.area), place.slug).toBe(true);
      expect(place.famousFor.length, place.slug).toBeGreaterThan(0);
      for (const food of place.famousFor)
        expect(allFoods.has(food), `${place.slug}: ${food}`).toBe(true);
    }
    for (const entry of EXISTING_PLACE_AREAS) {
      expect(areas.has(entry.area)).toBe(true);
      expect(PLACES.some((place) => place.slug === entry.slug)).toBe(true);
    }
  });

  it("gives every famous-for entry an https source and a known food", () => {
    for (const fame of [...DHAKA_FAME, ...EXISTING_FAME_SOURCES]) {
      expect(allFoods.has(fame.food), fame.food).toBe(true);
      expect(fame.sourceUrl, fame.food).toMatch(/^https:\/\//);
    }
  });

  it("writes Bangla names in Bangla letters and plain URL slugs", () => {
    for (const place of DHAKA_PLACES) {
      expect(place.slug).toMatch(/^[a-z]+(-[a-z]+)*$/);
      expect(place.nameBn).toMatch(/[ঀ-৿]/);
    }
  });

  it("invents nothing: no experiences or claims in the generated migration", () => {
    const sql = buildDhakaSql();
    expect(sql).toMatch(/is_seed/);
    expect(sql).not.toMatch(/insert into experiences|insert into claims/i);
  });

  it("matches the committed migration (run pnpm db:seed after changing the data)", () => {
    expect(readFileSync(DHAKA_MIGRATION_PATH, "utf8")).toBe(buildDhakaSql());
  });
});
