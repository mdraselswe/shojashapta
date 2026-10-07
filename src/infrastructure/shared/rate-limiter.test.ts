import { describe, expect, it } from "vitest";

import type { RateLimitRepository } from "@/core/ports";

import { createRateLimiter } from "./rate-limiter";

function memoryRepo(): RateLimitRepository & {
  events: { userId: string; action: string; at: Date }[];
} {
  const events: { userId: string; action: string; at: Date }[] = [];
  let clock = new Date("2026-10-07T00:00:00Z").getTime();
  return {
    events,
    countSince: async (userId, action, since) =>
      events.filter((e) => e.userId === userId && e.action === action && e.at >= since).length,
    record: async (userId, action) => {
      events.push({ userId, action, at: new Date((clock += 1000)) });
    },
  };
}

describe("createRateLimiter", () => {
  it("allows up to the daily limit, then refuses with a retry time", async () => {
    const repo = memoryRepo();
    const limiter = createRateLimiter(
      repo,
      { experience: 2 },
      () => new Date("2026-10-07T01:00:00Z"),
    );
    expect(await limiter.consume("u1", "experience")).toEqual({ allowed: true });
    expect(await limiter.consume("u1", "experience")).toEqual({ allowed: true });
    const third = await limiter.consume("u1", "experience");
    expect(third.allowed).toBe(false);
    expect(third.allowed === false && third.retryAfter).toBeGreaterThan(0);
    expect(repo.events).toHaveLength(2); // refused uses are not counted
  });

  it("counts per user and per action", async () => {
    const repo = memoryRepo();
    const limiter = createRateLimiter(
      repo,
      { experience: 1, report: 1 },
      () => new Date("2026-10-07T01:00:00Z"),
    );
    expect((await limiter.consume("u1", "experience")).allowed).toBe(true);
    expect((await limiter.consume("u2", "experience")).allowed).toBe(true);
    expect((await limiter.consume("u1", "report")).allowed).toBe(true);
  });

  it("frees uses older than 24 hours", async () => {
    const repo = memoryRepo();
    let now = new Date("2026-10-07T01:00:00Z");
    const limiter = createRateLimiter(repo, { experience: 1 }, () => now);
    expect((await limiter.consume("u1", "experience")).allowed).toBe(true);
    expect((await limiter.consume("u1", "experience")).allowed).toBe(false);
    now = new Date("2026-10-08T02:00:00Z");
    expect((await limiter.consume("u1", "experience")).allowed).toBe(true);
  });
});
