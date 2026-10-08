import { describe, expect, it, vi } from "vitest";

import { demoUser, fixtureIds } from "@/infrastructure/mock/fixtures";
import { createMockRepositories } from "@/infrastructure/mock/repositories";

import { cleanEvidenceUrl, createClaimService } from "./claim-service";
import { createRewardService } from "./reward-service";

const voter = (n: number) => ({ ...demoUser, id: `voter-${n}` });

async function setup() {
  const repos = createMockRepositories();
  const cache = { invalidate: vi.fn(async () => {}) };
  let clock = new Date("2026-10-08T00:00:00Z");
  const rewards = createRewardService({ repos });
  const service = createClaimService({ repos, cache, rewards, now: () => clock });
  const claim = await repos.claims.ensure({
    entity: "place",
    entityId: fixtureIds.places.second,
    type: "price",
    value: { min: 100, max: 150 },
    createdBy: demoUser.id,
  });
  return { repos, cache, service, claim, setNow: (d: Date) => (clock = d) };
}

describe("claimService.vote", () => {
  it("keeps a claim unverified until enough people voted", async () => {
    const { service, claim } = await setup();
    for (const n of [1, 2]) {
      const result = await service.vote(voter(n), { claimId: claim.id, verdict: "correct" });
      expect(result).toMatchObject({
        ok: true,
        data: { status: "unverified", confirmedNow: false },
      });
    }
  });

  it("confirms after enough check votes and starts the freshness clock", async () => {
    const { service, repos, claim } = await setup();
    let last;
    for (const n of [1, 2, 3]) {
      last = await service.vote(voter(n), { claimId: claim.id, verdict: "correct" });
    }
    expect(last).toMatchObject({
      ok: true,
      data: { status: "confirmed", confirmedNow: true },
    });
    const saved = await repos.claims.byId(claim.id);
    expect(saved?.status).toBe("confirmed");
    expect(saved?.lastConfirmedAt).toEqual(new Date("2026-10-08T00:00:00Z"));
    expect(saved?.expiresAt?.getTime()).toBeGreaterThan(saved?.lastConfirmedAt?.getTime() ?? 0);
  });

  it("marks a claim disputed when most votes say it is wrong", async () => {
    const { service, claim } = await setup();
    let last;
    for (const n of [1, 2, 3]) {
      last = await service.vote(voter(n), {
        claimId: claim.id,
        verdict: "wrong",
        reason: "wrong_price",
      });
    }
    expect(last).toMatchObject({
      ok: true,
      data: { status: "disputed", confirmedNow: false },
    });
  });

  it("lets someone change their vote without counting twice", async () => {
    const { service, repos, claim } = await setup();
    await service.vote(voter(1), { claimId: claim.id, verdict: "correct" });
    await service.vote(voter(1), { claimId: claim.id, verdict: "wrong", reason: "closed" });
    const saved = await repos.claims.byId(claim.id);
    expect((saved?.counts.correct ?? 0) + (saved?.counts.wrong ?? 0)).toBe(1);
  });

  it("a fresh check mark on a stale confirmed claim restarts its clock", async () => {
    const { service, repos, claim, setNow } = await setup();
    for (const n of [1, 2, 3])
      await service.vote(voter(n), { claimId: claim.id, verdict: "correct" });
    setNow(new Date("2026-12-31T00:00:00Z"));
    await service.vote(voter(1), { claimId: claim.id, verdict: "correct" });
    const saved = await repos.claims.byId(claim.id);
    expect(saved?.lastConfirmedAt).toEqual(new Date("2026-12-31T00:00:00Z"));
  });

  it("refreshes the place cache tag and answers not_found for an unknown claim", async () => {
    const { service, cache, claim } = await setup();
    await service.vote(voter(1), { claimId: claim.id, verdict: "correct" });
    expect(cache.invalidate).toHaveBeenCalledWith([`place:${fixtureIds.places.second}`]);
    const missing = await service.vote(voter(1), { claimId: "nope", verdict: "correct" });
    expect(missing.ok).toBe(false);
  });
});

describe("cleanEvidenceUrl", () => {
  it("keeps http(s) links and drops everything else", () => {
    expect(cleanEvidenceUrl("https://facebook.com/post/1")).toBe("https://facebook.com/post/1");
    expect(cleanEvidenceUrl("javascript:alert(1)")).toBeNull();
    expect(cleanEvidenceUrl("not a url")).toBeNull();
    expect(cleanEvidenceUrl("  ")).toBeNull();
  });
});
