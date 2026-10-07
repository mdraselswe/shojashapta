import { describe, expect, it } from "vitest";

import { claimBadge } from "./badge";

const now = new Date("2026-10-07T00:00:00Z");
const day = (n: number) => new Date(now.getTime() - n * 86_400_000);

describe("claimBadge", () => {
  it("shows a fresh confirmed claim as community-confirmed", () => {
    expect(
      claimBadge(
        {
          status: "confirmed",
          lastConfirmedAt: day(5),
          expiresAt: new Date(now.getTime() + 86_400_000),
        },
        now,
      ),
    ).toEqual({ kind: "confirmed", days: null });
  });

  it("turns a confirmed claim past its freshness window into a ⏳ with its age", () => {
    expect(
      claimBadge({ status: "confirmed", lastConfirmedAt: day(40), expiresAt: day(10) }, now),
    ).toEqual({ kind: "stale", days: 40 });
  });

  it("never goes stale without an expiry", () => {
    expect(
      claimBadge({ status: "confirmed", lastConfirmedAt: day(900), expiresAt: null }, now).kind,
    ).toBe("confirmed");
  });

  it.each(["mixed", "disputed", "unverified"] as const)("shows %s as it is", (status) => {
    expect(claimBadge({ status, lastConfirmedAt: null, expiresAt: null }, now)).toEqual({
      kind: status,
      days: null,
    });
  });
});
