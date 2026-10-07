import { describe, expect, it } from "vitest";

import { createMockRepositories } from "@/infrastructure/mock/repositories";

import { createCatalogService } from "./catalog-service";

const service = () => createCatalogService({ repos: createMockRepositories() });

describe("catalogService.home", () => {
  it("lists the curated famous foods with their district", async () => {
    const { famous } = await service().home();
    expect(famous).toContainEqual({
      district: { slug: "bogura", nameBn: "বগুড়া" },
      food: { slug: "doi", nameBn: "দই" },
      noteBn: null,
    });
  });

  it("groups districts by division, in order, with each district's first famous food", async () => {
    const { divisions } = await service().home();
    expect(divisions.map((d) => d.nameBn)).toEqual(["ঢাকা", "রাজশাহী", "চট্টগ্রাম"]);
    const rajshahi = divisions.find((d) => d.nameBn === "রাজশাহী");
    expect(rajshahi?.districts.map((d) => d.slug)).toEqual(["bogura", "natore"]);
    expect(rajshahi?.districts[0]?.famous).toEqual({ slug: "doi", nameBn: "দই" });
  });

  it("quick-pick row holds only districts with a famous food", async () => {
    const { famousDistricts, divisions } = await service().home();
    const total = divisions.reduce((sum, division) => sum + division.districts.length, 0);
    expect(famousDistricts.length).toBeGreaterThan(0);
    expect(famousDistricts.length).toBeLessThan(total); // Dhaka has none in the fixtures
    expect(famousDistricts.every((district) => district.famous !== null)).toBe(true);
  });
});
