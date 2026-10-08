import { describe, expect, it, vi } from "vitest";

import { demoUser, fixtureIds } from "@/infrastructure/mock/fixtures";
import { createMockRepositories } from "@/infrastructure/mock/repositories";
import { createRateLimiter } from "@/infrastructure/shared/rate-limiter";

import { createAddService } from "./add-service";
import { createClaimService } from "./claim-service";
import { createExperienceService } from "./experience-service";
import { createRewardService, mergeRewards, NO_REWARD } from "./reward-service";

const user = { ...demoUser, id: fixtureIds.users.contract };

function setup() {
  const repos = createMockRepositories();
  const cache = { invalidate: vi.fn(async () => {}) };
  const rewards = createRewardService({ repos });
  const experience = createExperienceService({ repos, cache, rewards });
  const claims = createClaimService({ repos, cache, rewards });
  const rateLimiter = createRateLimiter(repos.rateLimits, { food_create: 10, place_create: 10 });
  const add = createAddService({ repos, experience, claims, rewards, rateLimiter, cache });
  return { repos, rewards, experience, add };
}

describe("points for experiences", () => {
  it("pays +10 and a stamp for the first experience in a district, then only the stamp once", async () => {
    const { experience, rewards } = setup();
    const first = await experience.add(user, {
      placeId: fixtureIds.places.second,
      foodId: fixtureIds.foods.doi,
      reaction: "loved",
    });
    expect(first.ok && first.data.reward).toEqual({
      points: 10,
      newStamps: [{ districtName: "বগুড়া", kind: "visit" }],
    });
    // a second dish in the same district: points again, but the stamp is already in the book
    const second = await experience.add(user, {
      placeId: fixtureIds.places.sample,
      foodId: fixtureIds.foods.doi,
      reaction: "okay",
    });
    expect(second.ok && second.data.reward).toEqual({ points: 10, newStamps: [] });
    expect((await rewards.summary(user.id)).unlockedCount).toBe(1);
  });

  it("never pays the same experience twice when someone changes their mind", async () => {
    const { experience, rewards } = setup();
    const input = { placeId: fixtureIds.places.second, foodId: fixtureIds.foods.doi };
    await experience.add(user, { ...input, reaction: "loved" });
    const edit = await experience.add(user, { ...input, reaction: "okay" });
    expect(edit.ok && edit.data.reward).toEqual(NO_REWARD);
    expect((await rewards.summary(user.id)).points).toBe(10);
  });
});

describe("points for new places", () => {
  it("pays +20 for a new place and +20 with an আবিষ্কারক stamp for the first place of a famous food", async () => {
    const { add, rewards } = setup();
    // Natore is famous for কাঁচাগোল্লা and has no place that serves it yet
    const result = await add.submit(user, {
      food: { id: fixtureIds.foods.kachagolla },
      place: { nameBn: "নাটোরের প্রথম মিষ্টির দোকান", districtId: 4, type: "shop" },
      reaction: "loved",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.reward.points).toBe(10 + 20 + 20);
    expect(result.data.reward.newStamps.map((stamp) => stamp.kind).sort()).toEqual([
      "discoverer",
      "visit",
    ]);
    expect((await rewards.summary(user.id)).points).toBe(50);
  });

  it("does not pay the discoverer bonus when the district already serves the food", async () => {
    const { add } = setup();
    const result = await add.submit(user, {
      food: { id: fixtureIds.foods.doi },
      place: { nameBn: "আরেকটি নতুন দইয়ের দোকান", districtId: 2, type: "shop" },
      reaction: "loved",
    });
    expect(result.ok && result.data.reward.points).toBe(10 + 20);
  });
});

describe("points for checking facts", () => {
  it("pays +5 once per claim, however often the vote is changed", async () => {
    const { repos } = setup();
    const rewards = createRewardService({ repos });
    const claim = await repos.claims.ensure({
      entity: "place",
      entityId: fixtureIds.places.second,
      type: "price",
      value: {},
      createdBy: user.id,
    });
    expect((await rewards.forVote(user, claim.id)).points).toBe(5);
    expect((await rewards.forVote(user, claim.id)).points).toBe(0);
  });
});

describe("revoking points", () => {
  it("takes back what hidden content earned", async () => {
    const { experience, rewards } = setup();
    const added = await experience.add(user, {
      placeId: fixtureIds.places.second,
      foodId: fixtureIds.foods.doi,
      reaction: "loved",
    });
    if (!added.ok) throw new Error("setup failed");
    expect(await rewards.revokeFor("experience", added.data.experience.id)).toBe(10);
    expect((await rewards.summary(user.id)).points).toBe(0);
    expect(await rewards.revokeFor("experience", added.data.experience.id)).toBe(0);
  });
});

describe("passport summary", () => {
  it("shows progress per division and the next stamp to go for", async () => {
    const { experience, rewards } = setup();
    await experience.add(user, {
      placeId: fixtureIds.places.second,
      foodId: fixtureIds.foods.doi,
      reaction: "loved",
    });
    const summary = await rewards.summary(user.id);
    expect(summary).toMatchObject({ unlockedCount: 1, totalDistricts: 64 });
    expect(summary.divisions.find((division) => division.name === "রাজশাহী")).toMatchObject({
      unlocked: 1,
    });
    // Bogura is unlocked, so the suggestion is the next district with a famous food
    expect(summary.next?.district.slug).toBe("chattogram");
  });

  it("merges several rewards", () => {
    expect(
      mergeRewards(
        { points: 10, newStamps: [{ districtName: "ক", kind: "visit" }] },
        { points: 20, newStamps: [] },
      ),
    ).toEqual({ points: 30, newStamps: [{ districtName: "ক", kind: "visit" }] });
  });
});
