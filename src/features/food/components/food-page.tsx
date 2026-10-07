import { Suspense } from "react";

import { PageShell } from "@/components/layout/page-shell";
import { SubPageBar } from "@/components/layout/sub-page-bar";
import { LoadingRegion } from "@/components/ui/skeleton";
import { routes } from "@/config/routes";
import { getT } from "@/i18n/server";
import type { FoodHeader } from "@/services/catalog-service";

import { FoodDishesSection, FoodDishesSectionSkeleton } from "./food-dishes-section";
import { FoodHero, FoodHeroSkeleton } from "./food-hero";
import { FoodVoicesSection, FoodVoicesSectionSkeleton } from "./food-voices-section";

/** Food page: the hero is ready with the header; dishes and comments stream in behind skeletons. */
export function FoodPage({ food }: { food: FoodHeader }) {
  return (
    <PageShell header={<SubPageBar backHref={routes.home()} />}>
      <FoodHero food={food} />
      <Suspense fallback={<FoodDishesSectionSkeleton />}>
        <FoodDishesSection foodId={food.id} />
      </Suspense>
      <Suspense fallback={<FoodVoicesSectionSkeleton />}>
        <FoodVoicesSection foodId={food.id} />
      </Suspense>
    </PageShell>
  );
}

export function FoodPageSkeleton() {
  const t = getT();
  return (
    <LoadingRegion label={t("common.loading")}>
      <PageShell header={<SubPageBar backHref={routes.home()} />}>
        <FoodHeroSkeleton />
        <FoodDishesSectionSkeleton />
        <FoodVoicesSectionSkeleton />
      </PageShell>
    </LoadingRegion>
  );
}
