import { describe, expect, it } from "vitest";

import { demoUser, fixtureIds } from "@/infrastructure/mock/fixtures";
import { createMockRepositories } from "@/infrastructure/mock/repositories";

import { createMeService } from "./me-service";

const me = { ...demoUser, id: fixtureIds.users.contract };

describe("meService", () => {
  it("lists what a person ate, with the food and place, newest first", async () => {
    const repos = createMockRepositories();
    const service = createMeService({ repos });
    const [dish] = await repos.places.dishes(fixtureIds.places.second);
    await repos.experiences.upsert({ dishId: dish?.id ?? "", userId: me.id, reaction: "loved" });
    const rows = await service.ate(me.id);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      reaction: "loved",
      food: { slug: "doi" },
      place: { slug: "second-sample-place" },
    });
    expect(await service.ate("nobody")).toEqual([]);
  });

  it("lists places the person added", async () => {
    const repos = createMockRepositories();
    const service = createMeService({ repos });
    await repos.places.create(
      { nameBn: "আমার দোকান", type: "shop", districtId: 2, slug: "amar-dokan" },
      me.id,
    );
    const { places } = await service.contributions(me.id);
    expect(places.map((place) => place.slug)).toEqual(["amar-dokan"]);
    expect((await service.contributions("nobody")).places).toEqual([]);
  });

  it("lists saved foods and places and skips ones that are gone", async () => {
    const repos = createMockRepositories();
    const service = createMeService({ repos });
    await repos.saved.save(me.id, "food", fixtureIds.foods.doi);
    await repos.saved.save(me.id, "place", fixtureIds.places.sample);
    await repos.saved.save(me.id, "place", "deleted-place");
    const rows = await service.saved(me.id);
    expect(rows.map((row) => [row.kind, row.slug])).toEqual([
      ["food", "doi"],
      ["place", "sample-place"],
    ]);
  });
});
