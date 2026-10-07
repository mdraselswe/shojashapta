import { GroupedList, ListRowSkeleton } from "@/components/ui/grouped-list";
import { EmptyState } from "@/components/layout/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { getT } from "@/i18n/server";
import { filterPlaces } from "@/services/search-service";

import { searchCatalog } from "../queries";
import { parseSearchParams, type RawSearchParams } from "../search-params";
import { DistrictHitRow, FoodHitRow, PlaceHitRow } from "./search-hit-rows";
import { SearchFilters } from "./search-filters";
import { SearchTabs } from "./search-tabs";

const GROUP_HEADING_CLASS = "mb-1.5 px-1 text-caption text-muted-foreground";

/** Tabs + filters + grouped hits for the page's `?q=`. */
export async function SearchResults({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const t = getT();
  const params = parseSearchParams(await searchParams);
  const { q, tab, type, price } = params;

  if (q === "") {
    return (
      <div className="px-5 pt-8 text-center">
        <p className="text-card-title">{t("search.prompt")}</p>
        <p className="mt-1 text-meta text-muted-foreground">{t("search.promptHint")}</p>
      </div>
    );
  }

  const outcome = await searchCatalog(q);
  const places = filterPlaces(outcome.places, { type, price });
  const filtered = type !== undefined || price !== undefined;
  const counts = {
    food: outcome.foods.length,
    place: places.length,
    district: outcome.districts.length,
    all: outcome.foods.length + places.length + outcome.districts.length,
  };

  const showFoods = tab === "all" || tab === "food";
  const showPlaces = tab === "all" || tab === "place";
  const showDistricts = tab === "all" || tab === "district";

  return (
    <div className="flex flex-col gap-4 px-5 pt-1">
      <p className="px-1 text-meta text-muted-foreground">{t("search.resultsFor", { q })}</p>
      <SearchTabs q={q} active={tab} counts={counts} carry={{ type, price }} />
      {(tab === "all" || tab === "place") && <SearchFilters params={params} />}

      {counts[tab] === 0 && (
        <EmptyState
          message={
            <>
              <strong className="block font-semibold">
                {filtered && outcome.total > 0
                  ? t("search.emptyFiltered")
                  : t("search.empty", { q })}
              </strong>
              {filtered && outcome.total > 0
                ? t("search.emptyFilteredHint")
                : t("search.emptyHint")}
            </>
          }
        />
      )}

      {showFoods && outcome.foods.length > 0 && (
        <section aria-label={t("search.groups.foods")}>
          <h2 className={GROUP_HEADING_CLASS}>{t("search.groups.foods")}</h2>
          <GroupedList>
            {outcome.foods.map((hit) => (
              <FoodHitRow key={hit.slug} hit={hit} />
            ))}
          </GroupedList>
        </section>
      )}
      {showPlaces && places.length > 0 && (
        <section aria-label={t("search.groups.places")}>
          <h2 className={GROUP_HEADING_CLASS}>{t("search.groups.places")}</h2>
          <GroupedList>
            {places.map((hit) => (
              <PlaceHitRow key={hit.slug} hit={hit} t={t} />
            ))}
          </GroupedList>
        </section>
      )}
      {showDistricts && outcome.districts.length > 0 && (
        <section aria-label={t("search.groups.districts")}>
          <h2 className={GROUP_HEADING_CLASS}>{t("search.groups.districts")}</h2>
          <GroupedList>
            {outcome.districts.map((hit) => (
              <DistrictHitRow key={hit.slug} hit={hit} t={t} />
            ))}
          </GroupedList>
        </section>
      )}
    </div>
  );
}

/** Tabs, one filter row and two short groups — close to a typical result, not a promise. */
export function SearchResultsSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-5 pt-1" aria-hidden>
      <div className="px-1">
        <Skeleton className="h-[1.4em] w-1/2 text-meta" />
      </div>
      <Skeleton className="h-12 rounded-input" />
      <Skeleton className="h-10 rounded-full" />
      {[2, 3].map((rows) => (
        <section key={rows}>
          <Skeleton className="mb-1.5 ml-1 h-4 w-16" />
          <GroupedList>
            {Array.from({ length: rows }, (_, index) => (
              <ListRowSkeleton key={index} />
            ))}
          </GroupedList>
        </section>
      ))}
    </div>
  );
}
