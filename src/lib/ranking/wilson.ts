import { appConfig } from "@/config/app.config";

/**
 * Lower bound of the Wilson score interval — the dish sort key (decision P10): 3/3 loved must not
 * outrank 950/1000. Mirrors SQL `wilson_lower_bound` (docs/04-database.md); keep the two identical.
 * `positive` = 😋 only; 😐 and 👎 count as not positive.
 */
export function wilsonLowerBound(
  positive: number,
  total: number,
  z: number = appConfig.ranking.wilsonZ,
): number {
  if (total === 0) return 0;
  const p = positive / total;
  const z2 = z * z;
  return (
    (p + z2 / (2 * total) - z * Math.sqrt((p * (1 - p) + z2 / (4 * total)) / total)) /
    (1 + z2 / total)
  );
}
