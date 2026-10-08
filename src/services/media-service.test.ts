import { describe, expect, it, vi } from "vitest";

import { demoUser, fixtureIds } from "@/infrastructure/mock/fixtures";
import { createMockRepositories } from "@/infrastructure/mock/repositories";
import { createMockStorage } from "@/infrastructure/mock/storage";

import { createMediaService } from "./media-service";

async function setup() {
  const repos = createMockRepositories();
  const cache = { invalidate: vi.fn(async () => {}) };
  const service = createMediaService({
    repos,
    storage: createMockStorage(),
    cache,
    provider: "mock",
  });
  const [dish] = await repos.places.dishes(fixtureIds.places.second);
  const experience = await repos.experiences.upsert({
    dishId: dish?.id ?? "",
    userId: demoUser.id,
    reaction: "loved",
  });
  return { repos, cache, service, experience, dish };
}

describe("mediaService.attachToExperience", () => {
  it("attaches confirmed uploads to the person's own experience and refreshes the pages", async () => {
    const { service, repos, experience, cache, dish } = await setup();
    const result = await service.attachToExperience(demoUser, {
      experienceId: experience.id,
      keys: ["mock-uploads/a", "mock-uploads/b"],
    });
    expect(result.ok && result.data.photos).toHaveLength(2);
    expect((await repos.experiences.byId(experience.id))?.photos).toHaveLength(2);
    expect(cache.invalidate).toHaveBeenCalledWith([
      `food:${dish?.foodId}`,
      `place:${dish?.placeId}`,
    ]);
  });

  it("allows at most two photos per experience", async () => {
    const { service, experience } = await setup();
    const tooMany = await service.attachToExperience(demoUser, {
      experienceId: experience.id,
      keys: ["a", "b", "c"],
    });
    expect(tooMany.ok).toBe(false);
    await service.attachToExperience(demoUser, { experienceId: experience.id, keys: ["a", "b"] });
    const more = await service.attachToExperience(demoUser, {
      experienceId: experience.id,
      keys: ["c"],
    });
    expect(more.ok).toBe(false);
  });

  it("refuses someone else's experience and an unknown one", async () => {
    const { service, experience } = await setup();
    const stranger = { ...demoUser, id: "stranger" };
    for (const [user, id] of [
      [stranger, experience.id],
      [demoUser, "nope"],
    ] as const) {
      const result = await service.attachToExperience(user, { experienceId: id, keys: ["a"] });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.code).toBe("not_found");
    }
  });
});
