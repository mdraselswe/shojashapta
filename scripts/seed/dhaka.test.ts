import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { buildDhakaSql, DHAKA_SETS, migrationPath } from "./build-dhaka-sql";
import { FOODS, PLACES } from "./data";

const unique = (values: string[]) => new Set(values).size === values.length;

const allPlaces = DHAKA_SETS.flatMap((set) => set.places);
const allFoods = [...FOODS, ...DHAKA_SETS.flatMap((set) => set.foods)];
const allAreas = DHAKA_SETS.flatMap((set) => set.areas);
const foodSlugs = new Set(allFoods.map((food) => food.slug));
const areaSlugs = new Set(allAreas.map((area) => area.slug));

describe("Dhaka seed data (all parts)", () => {
  it("has unique slugs, also against the first seed", () => {
    expect(unique(allPlaces.map((place) => place.slug))).toBe(true);
    expect(unique(allFoods.map((food) => food.slug))).toBe(true);
    expect(unique(allAreas.map((area) => area.slug))).toBe(true);
    for (const place of allPlaces) expect(PLACES.map((p) => p.slug)).not.toContain(place.slug);
  });

  it("puts every place in a known area and ties every dish to a known food", () => {
    for (const place of allPlaces) {
      expect(areaSlugs.has(place.area), place.slug).toBe(true);
      expect(place.famousFor.length, place.slug).toBeGreaterThan(0);
      for (const food of place.famousFor)
        expect(foodSlugs.has(food), `${place.slug}: ${food}`).toBe(true);
    }
    for (const set of DHAKA_SETS) {
      for (const entry of set.existingAreas) {
        expect(areaSlugs.has(entry.area)).toBe(true);
        expect(PLACES.some((place) => place.slug === entry.slug)).toBe(true);
      }
    }
  });

  it("gives every famous-for entry an https source and a known food", () => {
    for (const set of DHAKA_SETS) {
      for (const fame of [...set.fame, ...set.fameSources]) {
        expect(foodSlugs.has(fame.food), fame.food).toBe(true);
        expect(fame.sourceUrl, fame.food).toMatch(/^https:\/\//);
      }
    }
  });

  it("writes Bangla names in Bangla letters and plain URL slugs", () => {
    for (const place of allPlaces) {
      expect(place.slug).toMatch(/^[a-z]+(-[a-z]+)*$/);
      expect(place.nameBn).toMatch(/[ঀ-৿]/);
    }
  });
});

describe.each(DHAKA_SETS.map((set) => [set.migration, set] as const))("migration %s", (_, set) => {
  it("invents nothing: no experiences or claims", () => {
    const sql = buildDhakaSql(set);
    expect(sql).toMatch(/is_seed/);
    expect(sql).not.toMatch(/insert into experiences|insert into claims/i);
  });

  it("matches the committed file (run pnpm db:seed after changing the data)", () => {
    expect(readFileSync(migrationPath(set), "utf8")).toBe(buildDhakaSql(set));
  });
});
