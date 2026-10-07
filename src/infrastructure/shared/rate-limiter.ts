import "server-only";

import { appConfig } from "@/config/app.config";
import type { RateLimiter, RateLimitRepository } from "@/core/ports";

const WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * Daily per-user limits (appConfig.limits.perDay, docs/09-security-and-limits.md §2) on top of any
 * RateLimitRepository. A rolling 24-hour window, so a burst at midnight can't double the limit.
 */
export function createRateLimiter(
  repo: RateLimitRepository,
  limits: Record<string, number> = appConfig.limits.perDay,
  now: () => Date = () => new Date(),
): RateLimiter {
  return {
    async consume(userId, action) {
      const limit = limits[action];
      if (limit === undefined) throw new Error(`No daily limit configured for "${action}"`);
      const since = new Date(now().getTime() - WINDOW_MS);
      const used = await repo.countSince(userId, action, since);
      if (used >= limit) {
        // Conservative: the oldest counted use leaves the window within at most 24 hours.
        return { allowed: false, retryAfter: Math.ceil(WINDOW_MS / 1000) };
      }
      await repo.record(userId, action);
      return { allowed: true };
    },
  };
}
