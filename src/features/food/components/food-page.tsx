import { Suspense } from "react";

import { PageShell } from "@/components/layout/page-shell";
import { SubPageBar } from "@/components/layout/sub-page-bar";
import { LoadingRegion } from "@/components/ui/skeleton";
import { routes } from "@/config/routes";
import { getT } from "@/i18n/server";
import type { FoodHeader } from "@/services/catalog-service";

import {
  FoodReactionCard,
  ReactionCardSkeleton,
} from "@/features/experience/components/reaction-card";
import { FoodDishesSection, FoodDishesSectionSkeleton } from "./food-dishes-section";
import { FoodHero, FoodHeroSkeleton } from "./food-hero";
import { FoodSummaryCard } from "./food-summary-card";
import { FoodVoicesSection, FoodVoicesSectionSkeleton } from "./food-voices-section";

/**
 * Food page: the hero is ready with the header; dishes and comments stream in behind skeletons.
 * From 1024px the lists take 8 of 12 columns and a sticky summary card the other 4.
 */
export function FoodPage({ food }: { food: FoodHeader }) {
  const t = getT();
  return (
    <PageShell
      header={
        <SubPageBar
          backHref={routes.home()}
          crumbs={[{ label: t("breadcrumb.foods") }, { label: food.nameBn }]}
        />
      }
    >
      <FoodHero food={food} />
      <div className="page-x pt-5 lg:hidden">
        <Suspense fallback={<ReactionCardSkeleton />}>
          <FoodReactionCard foodId={food.id} />
        </Suspense>
      </div>
      <div className="lg:grid lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Suspense fallback={<FoodDishesSectionSkeleton />}>
            <FoodDishesSection foodId={food.id} />
          </Suspense>
          <Suspense fallback={<FoodVoicesSectionSkeleton />}>
            <FoodVoicesSection foodId={food.id} />
          </Suspense>
        </div>
        <aside className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-6 page-x pt-10">
            <FoodSummaryCard food={food} />
            <div className="mt-4">
              <Suspense fallback={<ReactionCardSkeleton />}>
                <FoodReactionCard foodId={food.id} />
              </Suspense>
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

export function FoodPageSkeleton() {
  const t = getT();
  return (
    <LoadingRegion label={t("common.loading")}>
      <PageShell header={<SubPageBar backHref={routes.home()} />}>
        <FoodHeroSkeleton />
        <div className="page-x pt-5 lg:hidden">
          <ReactionCardSkeleton />
        </div>
        <div className="lg:grid lg:grid-cols-12">
          <div className="lg:col-span-8">
            <FoodDishesSectionSkeleton />
            <FoodVoicesSectionSkeleton />
          </div>
        </div>
      </PageShell>
    </LoadingRegion>
  );
}
