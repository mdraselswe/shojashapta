import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { toSearchKey } from "../../src/lib/text/normalize";
import { buildSeedSql, SEED_MIGRATION_PATH } from "./build-sql";
import { DISTRICTS, DIVISIONS, FAME, FOODS, PLACES } from "./data";

const unique = (values: string[]) => new Set(values).size === values.length;

describe("seed data: districts", () => {
  it("has all 64 districts across the 8 divisions", () => {
    expect(DISTRICTS).toHaveLength(64);
    const perDivision = Object.fromEntries(
      Object.keys(DIVISIONS).map((key) => [
        key,
        DISTRICTS.filter((d) => d.division === key).length,
      ]),
    );
    expect(perDivision).toEqual({
      barishal: 6,
      chattogram: 11,
      dhaka: 13,
      khulna: 10,
      mymensingh: 4,
      rajshahi: 8,
      rangpur: 8,
      sylhet: 4,
    });
  });

  it("has unique slugs, Bangla names and English names", () => {
    expect(unique(DISTRICTS.map((d) => d.slug))).toBe(true);
    expect(unique(DISTRICTS.map((d) => d.nameBn))).toBe(true);
    expect(unique(DISTRICTS.map((d) => d.nameEn))).toBe(true);
  });

  it("uses plain URL slugs and Bangla letters for Bangla names", () => {
    for (const district of DISTRICTS) {
      expect(district.slug, district.nameEn).toMatch(/^[a-z]+(-[a-z]+)*$/);
      expect(district.nameBn, district.nameEn).toMatch(/^[ঀ-৿\s]+$/);
    }
  });

  it("lets every spelling variant find its district", () => {
    for (const district of DISTRICTS) {
      const keys = [district.nameEn, ...(district.aliases ?? [])].map(toSearchKey);
      for (const key of keys) expect(key, district.slug).not.toBe("");
    }
  });

  it("keeps the spellings from docs/04-database.md §8", () => {
    const aliasesOf = (slug: string) => DISTRICTS.find((d) => d.slug === slug)?.aliases ?? [];
    expect(aliasesOf("bogura")).toContain("bogra");
    expect(aliasesOf("chattogram")).toEqual(expect.arrayContaining(["chittagong", "ctg"]));
    expect(aliasesOf("cumilla")).toContain("comilla");
    expect(aliasesOf("barishal")).toContain("barisal");
    expect(aliasesOf("jashore")).toContain("jessore");
  });
});

describe("seed data: foods, fame and places", () => {
  const districtSlugs = new Set(DISTRICTS.map((d) => d.slug));
  const foodSlugs = new Set(FOODS.map((f) => f.slug));

  it("has unique food and place slugs", () => {
    expect(unique(FOODS.map((f) => f.slug))).toBe(true);
    expect(unique(PLACES.map((p) => p.slug))).toBe(true);
  });

  it("points every famous food and place at a real district and food", () => {
    for (const fame of FAME) {
      expect(districtSlugs.has(fame.district), fame.district).toBe(true);
      expect(foodSlugs.has(fame.food), fame.food).toBe(true);
    }
    for (const place of PLACES) {
      expect(districtSlugs.has(place.district), place.slug).toBe(true);
      for (const food of place.famousFor)
        expect(foodSlugs.has(food), `${place.slug}: ${food}`).toBe(true);
    }
  });

  it("lists a food only once per district", () => {
    expect(unique(FAME.map((f) => `${f.district}/${f.food}`))).toBe(true);
  });

  it("uses every food somewhere", () => {
    const used = new Set([...FAME.map((f) => f.food), ...PLACES.flatMap((p) => p.famousFor)]);
    for (const food of FOODS) expect(used.has(food.slug), food.slug).toBe(true);
  });

  it("includes the pipeline's smoke-test food and kacchi's spellings", () => {
    expect(foodSlugs.has("doi")).toBe(true);
    const kacchi = FOODS.find((f) => f.slug === "kacchi");
    const keys = new Set(
      [kacchi?.nameBn, kacchi?.nameEn, ...(kacchi?.aliases ?? [])].map((s) => toSearchKey(s ?? "")),
    );
    expect(keys).toEqual(new Set(["kaci biriani", "kaci"]));
  });

  it("invents no facts: places carry no counts, prices or review fields", () => {
    for (const place of PLACES) {
      expect(Object.keys(place).sort()).toEqual([
        "district",
        "famousFor",
        "nameBn",
        "nameEn",
        "slug",
        "type",
      ]);
    }
  });

  it("never uses the banned words (AGENTS.md §5)", () => {
    const all = JSON.stringify([FOODS, FAME, PLACES]);
    expect(all).not.toMatch(/সেরা|Verified|যাচাইকৃত/);
  });
});

describe("generated seed migration", () => {
  const sql = buildSeedSql();

  it("is up to date with scripts/seed/data.ts (run pnpm db:seed)", () => {
    expect(readFileSync(SEED_MIGRATION_PATH, "utf8")).toBe(sql);
  });

  it("is idempotent and flags everything except districts", () => {
    const inserts = sql.match(/^insert into \w+/gm) ?? [];
    expect(inserts.length).toBeGreaterThan(5);
    const withoutConflict = sql
      .split(/^insert into /m)
      .slice(1)
      .filter((statement) => !statement.split(";")[0]?.includes("on conflict"));
    expect(withoutConflict).toEqual([]);
    for (const table of ["foods", "regional_fame", "places", "dishes"]) {
      const statement = sql.split(`insert into ${table} `)[1]?.split(";")[0] ?? "";
      expect(statement, table).toContain("is_seed");
    }
    expect(sql.split("insert into districts ")[1]?.split(";")[0] ?? "").not.toContain("is_seed");
  });

  it("escapes quotes in names", () => {
    expect(sql).toContain("'Cox''s Bazar'");
  });
});
