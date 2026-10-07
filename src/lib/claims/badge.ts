import { daysSince } from "@/lib/format/date";

import { isStale, type ClaimStatus } from "./status";

// Which badge a claim shows. Status is always icon + text, never colour alone (design system §2).

export type ClaimBadgeKind = "confirmed" | "stale" | "mixed" | "disputed" | "unverified";

export type ClaimBadge = { kind: ClaimBadgeKind; days: number | null };

type ClaimLike = {
  status: ClaimStatus;
  lastConfirmedAt: Date | null;
  expiresAt: Date | null;
};

/**
 * A confirmed claim whose freshness window has passed shows ⏳ with its age ("শেষ নিশ্চিত ৩৪ দিন আগে")
 * instead of "কমিউনিটি নিশ্চিত"; the other statuses are shown as they are.
 */
export function claimBadge(claim: ClaimLike, now: Date = new Date()): ClaimBadge {
  if (claim.status === "confirmed") {
    if (isStale(claim, now) && claim.lastConfirmedAt) {
      return { kind: "stale", days: daysSince(claim.lastConfirmedAt, now) };
    }
    return { kind: "confirmed", days: null };
  }
  return { kind: claim.status, days: null };
}
