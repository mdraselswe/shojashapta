import { HeartIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getT } from "@/i18n/server";
import { formatPercent } from "@/lib/format/number";
import type { DishDisplay } from "@/lib/ranking/display";

/**
 * The ❤️ % pill on a dish (design: green on success-soft). Below the minimum number of experiences it
 * says "নতুন" instead: a score from three people is not shown as a score (decision P10).
 */
export function ScorePill({ display }: { display: Pick<DishDisplay, "percent"> }) {
  const t = getT();
  if (display.percent === null) return <Badge variant="muted">{t("dish.new")}</Badge>;
  const percent = formatPercent(display.percent);
  return (
    <Badge variant="success" aria-label={t("dish.likedLabel", { percent })}>
      <HeartIcon className="fill-current" aria-hidden />
      {percent}
    </Badge>
  );
}
