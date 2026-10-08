import { describe, expect, it, vi } from "vitest";

import { demoUser, fixtureIds } from "@/infrastructure/mock/fixtures";
import { createMockRepositories } from "@/infrastructure/mock/repositories";

import { createModerationService } from "./moderation-service";
import { createRewardService } from "./reward-service";

const person = (n: number) => ({ ...demoUser, id: `person-${n}` });

function setup() {
  const repos = createMockRepositories();
  const cache = { invalidate: vi.fn(async () => {}) };
  const rewards = createRewardService({ repos });
  return { repos, cache, service: createModerationService({ repos, cache, rewards }) };
}

describe("moderationService.suggestEdit", () => {
  it("queues a suggestion with the value it would replace", async () => {
    const { repos, service } = setup();
    const result = await service.suggestEdit(person(1), {
      entity: "place",
      entityId: fixtureIds.places.sample,
      field: "name_bn",
      proposedValue: "  নতুন   নাম ",
      note: "সাইনবোর্ডে এটাই লেখা",
    });
    expect(result.ok).toBe(true);
    const queue = await repos.admin.openEditSuggestions();
    expect(queue.items[0]).toMatchObject({
      field: "name_bn",
      currentValue: "নমুনা দই ঘর",
      proposedValue: "নতুন নাম",
    });
  });

  it("rejects unknown fields, empty values, offensive text and unknown content", async () => {
    const { service } = setup();
    const base = { entity: "food" as const, entityId: fixtureIds.foods.doi, field: "name_bn" };
    const codes = async (input: Parameters<typeof service.suggestEdit>[1]) => {
      const result = await service.suggestEdit(person(1), input);
      return result.ok ? "ok" : result.error.code;
    };
    expect(await codes({ ...base, field: "price", proposedValue: "x" })).toBe("validation");
    expect(await codes({ ...base, proposedValue: "   " })).toBe("validation");
    expect(await codes({ ...base, proposedValue: "you bastard" })).toBe("validation");
    expect(await codes({ ...base, entityId: "nope", proposedValue: "দই" })).toBe("not_found");
  });
});

describe("moderationService.report", () => {
  const target = { entity: "place" as const, entityId: fixtureIds.places.sample };

  it("records a report and leaves the place visible below the threshold", async () => {
    const { repos, service } = setup();
    expect(await service.report(person(1), { ...target, reason: "closed" })).toEqual({
      ok: true,
      data: { hidden: false },
    });
    expect((await repos.places.byId(fixtureIds.places.sample))?.status).toBe("active");
  });

  it("does not let one person report the same thing twice", async () => {
    const { service } = setup();
    await service.report(person(1), { ...target, reason: "closed" });
    const again = await service.report(person(1), { ...target, reason: "offensive" });
    expect(again.ok).toBe(false);
    if (!again.ok) expect(again.error.code).toBe("conflict");
  });

  it("hides content once enough different people reported it, and refreshes caches", async () => {
    const { repos, service, cache } = setup();
    await service.report(person(1), { ...target, reason: "wrong_info" });
    await service.report(person(2), { ...target, reason: "wrong_info" });
    const third = await service.report(person(3), { ...target, reason: "misleading" });
    expect(third).toEqual({ ok: true, data: { hidden: true } });
    expect(await repos.places.byId(fixtureIds.places.sample)).toBeNull();
    expect(cache.invalidate).toHaveBeenCalledWith(
      expect.arrayContaining([`place:${fixtureIds.places.sample}`, "search"]),
    );
  });
});
