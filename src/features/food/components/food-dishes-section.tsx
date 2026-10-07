import { Section } from "@/components/layout/section";
import { GroupedList } from "@/components/ui/grouped-list";
import { routes } from "@/config/routes";
import { DishRow, DishRowSkeleton } from "@/features/dish/components/dish-row";
import { getT } from "@/i18n/server";
import { formatPriceRange } from "@/lib/format/number";
import type { DishRow as DishRowData } from "@/services/catalog-service";

import { getFoodDishes } from "../queries";

const SKELETON_ROWS = 4;

function placeContext(place: { areaNameBn: string | null; districtNameBn: string }) {
  return [place.areaNameBn, place.districtNameBn].filter(Boolean).join(", ");
}

export async function FoodDishesSection({ foodId }: { foodId: string }) {
  const t = getT();
  const { items, priceRange } = await getFoodDishes(foodId);

  if (items.length === 0) {
    return (
      <Section title={t("food.dishesAll")}>
        <p className="text-meta text-muted-foreground">{t("food.noDishes")}</p>
      </Section>
    );
  }

  const ranked = items.filter((dish) => dish.display.rankable);
  const unranked = items.filter((dish) => !dish.display.rankable);
  const range = formatPriceRange(priceRange.min, priceRange.max);
  const row = (dish: DishRowData, rank?: number) => (
    <DishRow
      key={dish.id}
      href={routes.place(dish.place.slug)}
      title={dish.place.nameBn}
      context={placeContext(dish.place)}
      price={dish.price}
      experienceCount={dish.experienceCount}
      display={dish.display}
      rank={rank}
    />
  );

  return (
    <>
      {ranked.length > 0 ? (
        <Section title={t("food.dishesRanked")}>
          {range ? (
            <p className="-mt-1.5 mb-3 text-meta text-muted-foreground">
              {t("food.typicalPrice", { range })}
            </p>
          ) : null}
          <GroupedList>{ranked.map((dish, index) => row(dish, index + 1))}</GroupedList>
        </Section>
      ) : null}
      {unranked.length > 0 ? (
        <Section title={ranked.length > 0 ? t("food.newGroup") : t("food.dishesAll")}>
          <GroupedList>{unranked.map((dish) => row(dish))}</GroupedList>
        </Section>
      ) : null}
    </>
  );
}

export function FoodDishesSectionSkeleton() {
  const t = getT();
  return (
    <Section title={t("food.dishesRanked")}>
      <GroupedList>
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <DishRowSkeleton key={index} />
        ))}
      </GroupedList>
    </Section>
  );
}
