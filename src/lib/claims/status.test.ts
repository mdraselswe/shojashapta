import { describe, expect, it } from "vitest";

import { claimExpiresAt, computeClaimStatus, isStale, type ClaimRules } from "./status";

const rules: ClaimRules = {
  minVotes: 3,
  confirmRatio: 0.7,
  disputeRatio: 0.6,
  ttlDays: { price: 30, opening_hours: 30, availability: 60, place_status: 180, location: 180 },
};

describe("computeClaimStatus", () => {
  it("keeps the previous status below the minimum votes", () => {
    expect(computeClaimStatus({ correct: 2, partial: 0, wrong: 0 }, rules)).toBe("unverified");
    expect(computeClaimStatus({ correct: 0, partial: 0, wrong: 2 }, rules, "confirmed")).toBe(
      "confirmed",
    );
  });

  it("confirms at the confirm ratio", () => {
    expect(computeClaimStatus({ correct: 7, partial: 2, wrong: 1 }, rules)).toBe("confirmed");
    expect(computeClaimStatus({ correct: 3, partial: 0, wrong: 0 }, rules)).toBe("confirmed");
  });

  it("disputes at the dispute ratio", () => {
    expect(computeClaimStatus({ correct: 2, partial: 2, wrong: 6 }, rules)).toBe("disputed");
  });

  it("is mixed in between", () => {
    expect(computeClaimStatus({ correct: 5, partial: 3, wrong: 2 }, rules)).toBe("mixed");
    expect(computeClaimStatus({ correct: 0, partial: 3, wrong: 0 }, rules)).toBe("mixed");
  });

  it("checks confirmed before disputed", () => {
    const strict: ClaimRules = { ...rules, confirmRatio: 0.5, disputeRatio: 0.5 };
    expect(computeClaimStatus({ correct: 2, partial: 0, wrong: 2 }, strict)).toBe("confirmed");
  });
});

describe("freshness", () => {
  const confirmed = new Date("2026-10-01T00:00:00Z");

  it("expires after the type's TTL", () => {
    expect(claimExpiresAt("price", confirmed, rules).toISOString()).toBe(
      "2026-10-31T00:00:00.000Z",
    );
    expect(claimExpiresAt("location", confirmed, rules).toISOString()).toBe(
      "2027-03-30T00:00:00.000Z",
    );
  });

  it("is stale from the expiry moment on", () => {
    const expiresAt = claimExpiresAt("price", confirmed, rules);
    expect(isStale({ expiresAt }, new Date("2026-10-30T23:59:59Z"))).toBe(false);
    expect(isStale({ expiresAt }, expiresAt)).toBe(true);
  });

  it("never goes stale without an expiry", () => {
    expect(isStale({ expiresAt: null }, new Date("2100-01-01"))).toBe(false);
  });
});
