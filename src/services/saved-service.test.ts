import { describe, expect, it } from "vitest";

import { demoUser, fixtureIds } from "@/infrastructure/mock/fixtures";
import { createMockRepositories } from "@/infrastructure/mock/repositories";

import { createSavedService } from "./saved-service";

const target = { entity: "food", entityId: fixtureIds.foods.doi } as const;

describe("savedService.toggle", () => {
  it("saves, then removes, and reports the new state each time", async () => {
    const service = createSavedService({ repos: createMockRepositories() });
    expect(await service.isSaved(demoUser.id, target)).toBe(false);
    expect(await service.toggle(demoUser, target)).toEqual({ ok: true, data: { saved: true } });
    expect(await service.isSaved(demoUser.id, target)).toBe(true);
    expect(await service.toggle(demoUser, target)).toEqual({ ok: true, data: { saved: false } });
    expect(await service.isSaved(demoUser.id, target)).toBe(false);
  });

  it("keeps saves private to each user", async () => {
    const service = createSavedService({ repos: createMockRepositories() });
    await service.toggle(demoUser, target);
    expect(await service.isSaved("someone-else", target)).toBe(false);
  });

  it("answers not_found for something that does not exist", async () => {
    const service = createSavedService({ repos: createMockRepositories() });
    const result = await service.toggle(demoUser, { entity: "place", entityId: "nope" });
    expect(result.ok).toBe(false);
  });
});
