import { appConfig } from "@/config/app.config";

import { lovedPercent } from "./percent";

// How a dish's numbers are shown (decisions P9/P10, docs/01-product-spec.md §3.10):
// the % is what people read, Wilson (see wilson.ts) is only the sort order.

export type DishCounts = { lovedCount: number; experienceCount: number };

export type DishDisplay = {
  /** ❤️ % to show, or null while there is nothing to show. */
  percent: number | null;
  /** Enough experiences to be ranked (#1, #2…). Below this the dish stays visible as "নতুন". */
  rankable: boolean;
  /** Earns the "কমিউনিটির প্রিয়" label. Never "সেরা" (decision P9). */
  favorite: boolean;
};

type Rules = {
  minExperiencesToRank: number;
  favoriteMinExperiences: number;
  favoriteMinPercent: number;
};

export function dishDisplay(dish: DishCounts, rules: Rules = appConfig.ranking): DishDisplay {
  const percent = lovedPercent(dish.lovedCount, dish.experienceCount);
  const rankable = dish.experienceCount >= rules.minExperiencesToRank;
  const favorite =
    dish.experienceCount >= rules.favoriteMinExperiences &&
    percent !== null &&
    percent >= rules.favoriteMinPercent;
  return { percent: rankable ? percent : null, rankable, favorite };
}
