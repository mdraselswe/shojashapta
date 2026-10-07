import { appConfig } from "@/config/app.config";

// Claim status and freshness rules (docs/04-database.md, decision P8). Pure: claimService saves the result.

export type ClaimType = keyof typeof appConfig.claims.ttlDays;
export type ClaimStatus = "unverified" | "confirmed" | "mixed" | "disputed";

export type ClaimVoteCounts = { correct: number; partial: number; wrong: number };

export type ClaimRules = {
  minVotes: number;
  confirmRatio: number;
  disputeRatio: number;
  ttlDays: Record<ClaimType, number>;
};

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * votes = correct + partial + wrong. Below `minVotes` the claim stays as it was (new claims are
 * `unverified`); then correct/votes ≥ confirmRatio → confirmed, wrong/votes ≥ disputeRatio → disputed,
 * otherwise mixed.
 */
export function computeClaimStatus(
  counts: ClaimVoteCounts,
  rules: ClaimRules = appConfig.claims,
  previous: ClaimStatus = "unverified",
): ClaimStatus {
  const votes = counts.correct + counts.partial + counts.wrong;
  if (votes < rules.minVotes) return previous;
  if (counts.correct / votes >= rules.confirmRatio) return "confirmed";
  if (counts.wrong / votes >= rules.disputeRatio) return "disputed";
  return "mixed";
}

/** When a claim confirmed at `lastConfirmedAt` goes stale (⏳ "এখনও ঠিক আছে?"). */
export function claimExpiresAt(
  type: ClaimType,
  lastConfirmedAt: Date,
  rules: Pick<ClaimRules, "ttlDays"> = appConfig.claims,
): Date {
  return new Date(lastConfirmedAt.getTime() + rules.ttlDays[type] * DAY_MS);
}

/** Stale once its expiry has passed. A claim without an expiry never goes stale. */
export function isStale(claim: { expiresAt: Date | null }, now: Date = new Date()): boolean {
  return claim.expiresAt !== null && now.getTime() >= claim.expiresAt.getTime();
}
