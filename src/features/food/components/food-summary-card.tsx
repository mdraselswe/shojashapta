import { getT } from "@/i18n/server";
import { formatNumber, formatPercent } from "@/lib/format/number";
import type { FoodHeader } from "@/services/catalog-service";

/** Desktop sidebar: the overall score. On phones the same facts are one line under the title. */
export function FoodSummaryCard({ food }: { food: FoodHeader }) {
  const t = getT();
  const hasScore = food.percent !== null && food.experienceCount > 0;
  return (
    <div className="rounded-card-lg border border-border bg-card p-5.5">
      {hasScore ? (
        <>
          <div className="flex items-baseline gap-2">
            <span className="text-stat">{formatPercent(food.percent ?? 0)}</span>
            <span className="text-body text-muted-foreground">{t("food.likedSuffix")}</span>
          </div>
          <p className="mt-2 text-meta text-muted-foreground">
            {t("food.experienceCount", { count: formatNumber(food.experienceCount) })}
          </p>
        </>
      ) : (
        <p className="text-meta text-muted-foreground">{t("food.noExperiences")}</p>
      )}
    </div>
  );
}
