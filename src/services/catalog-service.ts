import { appConfig } from "@/config/app.config";
import type { ClaimStatus, ClaimType, Dish, PlaceType, PriceRange, Reaction } from "@/core/domain";
import type { Repositories } from "@/core/ports";
import { dishDisplay, type DishDisplay } from "@/lib/ranking/display";
import { lovedPercent } from "@/lib/ranking/percent";

// Read-side business logic for the catalog pages (docs/03-architecture.md §2). Pure: depends on
// ports only, so it runs the same on mock data, Supabase and in plain Vitest.

type Deps = {
  repos: Pick<Repositories, "districts" | "foods" | "places" | "dishes" | "experiences" | "claims">;
};

export type FoodRef = { slug: string; nameBn: string };
export type DistrictRef = { slug: string; nameBn: string };

export type HomeFamous = { district: DistrictRef; food: FoodRef; noteBn: string | null };
export type HomeDistrict = DistrictRef & { famous: FoodRef | null };
export type HomeDivision = { nameBn: string; districts: HomeDistrict[] };

export type HomeData = {
  /** Every curated "famous for" pair, in editor order. */
  famous: HomeFamous[];
  /** Districts that have a famous food, for the quick-pick row. */
  famousDistricts: HomeDistrict[];
  /** All districts grouped by division, in division order. */
  divisions: HomeDivision[];
};

/** A dish as listed on a food page: where to get it and how it is doing. */
export type DishRow = {
  id: string;
  place: {
    slug: string;
    nameBn: string;
    type: PlaceType;
    districtNameBn: string;
    areaNameBn: string | null;
  };
  price: PriceRange;
  experienceCount: number;
  display: DishDisplay;
};

export type FoodHeader = {
  id: string;
  slug: string;
  nameBn: string;
  nameEn: string | null;
  aboutBn: string | null;
  experienceCount: number;
  /** ❤️ % over all dishes of this food; null until there are experiences. */
  percent: number | null;
  /** Districts the editors list this food under. */
  famousIn: DistrictRef[];
};

export type FoodDishes = { items: DishRow[]; hasMore: boolean; priceRange: PriceRange };

export type ExperienceRow = {
  id: string;
  userName: string;
  reaction: Reaction;
  comment: string | null;
  pricePaid: number | null;
  createdAt: Date;
};

export type PlaceHeader = {
  id: string;
  slug: string;
  nameBn: string;
  nameEn: string | null;
  type: PlaceType;
  district: DistrictRef;
  areaNameBn: string | null;
  address: string | null;
  /** Text a map search can use to find the place (no coordinates are stored yet). */
  mapQuery: string;
};

/** A dish on a place page ("প্রথমবার? এগুলো অর্ডার করুন"). */
export type PlaceDishRow = {
  id: string;
  food: FoodRef;
  displayName: string | null;
  price: PriceRange;
  experienceCount: number;
  display: DishDisplay;
};

export type PlaceClaimRow = {
  type: ClaimType;
  status: ClaimStatus;
  lastConfirmedAt: Date | null;
  expiresAt: Date | null;
};

export type DistrictHeader = {
  id: number;
  slug: string;
  nameBn: string;
  divisionBn: string;
  /** Curated "famous for" foods, in editor order. */
  famous: { food: FoodRef; noteBn: string | null }[];
};

export type DistrictPlaceRow = {
  slug: string;
  nameBn: string;
  type: PlaceType;
  areaNameBn: string | null;
  price: PriceRange;
};

export type DistrictFoodPage = {
  district: DistrictRef;
  food: FoodRef & { id: string; aboutBn: string | null };
  /** Why the editors list this food here. */
  noteBn: string | null;
  dishes: FoodDishes;
};

function priceRangeOf(dishes: Pick<Dish, "price">[]): PriceRange {
  const lows = dishes.flatMap((dish) => (dish.price.min === null ? [] : [dish.price.min]));
  const highs = dishes.flatMap((dish) => (dish.price.max === null ? [] : [dish.price.max]));
  return {
    min: lows.length ? Math.min(...lows) : null,
    max: highs.length ? Math.max(...highs) : null,
  };
}

export function createCatalogService({ repos }: Deps) {
  return {
    /** Slugs worth prerendering at build time. */
    async staticSlugs() {
      const [foods, places, districts, fame] = await Promise.all([
        repos.foods.slugs(appConfig.seo.staticFoodCount),
        repos.places.slugs(appConfig.seo.staticPlaceCount),
        repos.districts.list(),
        repos.districts.allFame(),
      ]);
      const slugById = new Map(districts.map((district) => [district.id, district.slug]));
      const withFame = new Set(fame.map((entry) => entry.districtId));
      // Districts with a curated famous food first: they are the ones people land on.
      const ordered = [
        ...districts.filter((district) => withFame.has(district.id)),
        ...districts.filter((district) => !withFame.has(district.id)),
      ];
      return {
        foods,
        places,
        districts: ordered
          .slice(0, appConfig.seo.staticDistrictCount)
          .map((district) => district.slug),
        /** The curated "famous for" pairs: the district×food pages worth prerendering. */
        districtFoods: fame
          .flatMap((entry) => {
            const district = slugById.get(entry.districtId);
            return district ? [{ district, food: entry.food.slug }] : [];
          })
          .slice(0, appConfig.seo.staticDistrictFoodCount),
      };
    },

    async foodHeader(slug: string): Promise<FoodHeader | null> {
      const food = await repos.foods.bySlug(slug);
      if (!food) return null;
      const [fame, districts] = await Promise.all([
        repos.districts.allFame(),
        repos.districts.list(),
      ]);
      const byId = new Map(districts.map((district) => [district.id, district]));
      const famousIn = fame
        .filter((entry) => entry.food.id === food.id)
        .flatMap((entry) => {
          const district = byId.get(entry.districtId);
          return district ? [{ slug: district.slug, nameBn: district.nameBn }] : [];
        });
      return {
        id: food.id,
        slug: food.slug,
        nameBn: food.nameBn,
        nameEn: food.nameEn,
        aboutBn: food.aboutBn,
        experienceCount: food.experienceCount,
        percent: lovedPercent(food.lovedCount, food.experienceCount),
        famousIn,
      };
    },

    async foodDishes(foodId: string, districtId?: number): Promise<FoodDishes> {
      const page = await repos.foods.topDishes(foodId, {
        limit: appConfig.pagination.default,
        ...(districtId === undefined ? {} : { districtId }),
      });
      return {
        items: page.items.map((dish) => ({
          id: dish.id,
          place: {
            slug: dish.place.slug,
            nameBn: dish.place.nameBn,
            type: dish.place.type,
            districtNameBn: dish.place.district.nameBn,
            areaNameBn: dish.place.area?.nameBn ?? null,
          },
          price: dish.price,
          experienceCount: dish.experienceCount,
          display: dishDisplay(dish),
        })),
        hasMore: page.nextCursor !== null,
        priceRange: priceRangeOf(page.items),
      };
    },

    async foodExperiences(foodId: string): Promise<ExperienceRow[]> {
      const page = await repos.experiences.forFood(foodId, { limit: 5 });
      return page.items
        .filter((experience) => experience.comment)
        .map((experience) => ({
          id: experience.id,
          userName: experience.user.displayName,
          reaction: experience.reaction,
          comment: experience.comment,
          pricePaid: experience.pricePaid,
          createdAt: experience.createdAt,
        }));
    },

    async placeHeader(slug: string): Promise<PlaceHeader | null> {
      const place = await repos.places.bySlug(slug);
      if (!place) return null;
      const areaNameBn = place.area?.nameBn ?? null;
      return {
        id: place.id,
        slug: place.slug,
        nameBn: place.nameBn,
        nameEn: place.nameEn,
        type: place.type,
        district: { slug: place.district.slug, nameBn: place.district.nameBn },
        areaNameBn,
        address: place.address,
        mapQuery: [place.nameBn, areaNameBn, place.district.nameBn, "বাংলাদেশ"]
          .filter(Boolean)
          .join(" "),
      };
    },

    async placeDishes(placeId: string): Promise<PlaceDishRow[]> {
      const dishes = await repos.places.dishes(placeId);
      return dishes.map((dish) => ({
        id: dish.id,
        food: { slug: dish.food.slug, nameBn: dish.food.nameBn },
        displayName: dish.displayName,
        price: dish.price,
        experienceCount: dish.experienceCount,
        display: dishDisplay(dish),
      }));
    },

    async placeClaims(placeId: string): Promise<PlaceClaimRow[]> {
      const claims = await repos.claims.forEntity("place", placeId);
      return claims.map((claim) => ({
        type: claim.type,
        status: claim.status,
        lastConfirmedAt: claim.lastConfirmedAt,
        expiresAt: claim.expiresAt,
      }));
    },

    async districtHeader(slug: string): Promise<DistrictHeader | null> {
      const district = await repos.districts.bySlug(slug);
      if (!district) return null;
      const fame = await repos.districts.fame(district.id);
      return {
        id: district.id,
        slug: district.slug,
        nameBn: district.nameBn,
        divisionBn: district.divisionBn,
        famous: fame.map((entry) => ({
          food: { slug: entry.food.slug, nameBn: entry.food.nameBn },
          noteBn: entry.noteBn,
        })),
      };
    },

    async districtPlaces(
      districtId: number,
    ): Promise<{ items: DistrictPlaceRow[]; hasMore: boolean }> {
      const page = await repos.places.inDistrict(districtId, {
        limit: appConfig.pagination.default,
      });
      return {
        items: page.items.map((place) => ({
          slug: place.slug,
          nameBn: place.nameBn,
          type: place.type,
          areaNameBn: place.area?.nameBn ?? null,
          price: place.price,
        })),
        hasMore: page.nextCursor !== null,
      };
    },

    /** "বগুড়ার দই": the dishes of one food inside one district, or null if either is unknown. */
    async districtFood(districtSlug: string, foodSlug: string): Promise<DistrictFoodPage | null> {
      const [district, food] = await Promise.all([
        repos.districts.bySlug(districtSlug),
        repos.foods.bySlug(foodSlug),
      ]);
      if (!district || !food) return null;
      const [fame, dishes] = await Promise.all([
        repos.districts.fame(district.id),
        this.foodDishes(food.id, district.id),
      ]);
      return {
        district: { slug: district.slug, nameBn: district.nameBn },
        food: { id: food.id, slug: food.slug, nameBn: food.nameBn, aboutBn: food.aboutBn },
        noteBn: fame.find((entry) => entry.food.id === food.id)?.noteBn ?? null,
        dishes,
      };
    },

    async home(): Promise<HomeData> {
      const [districts, fame] = await Promise.all([
        repos.districts.list(),
        repos.districts.allFame(),
      ]);
      const byId = new Map(districts.map((district) => [district.id, district]));

      const famous: HomeFamous[] = fame.flatMap((entry) => {
        const district = byId.get(entry.districtId);
        if (!district) return [];
        return [
          {
            district: { slug: district.slug, nameBn: district.nameBn },
            food: { slug: entry.food.slug, nameBn: entry.food.nameBn },
            noteBn: entry.noteBn,
          },
        ];
      });

      const firstFamousOf = new Map<string, FoodRef>();
      for (const entry of famous) {
        if (!firstFamousOf.has(entry.district.slug))
          firstFamousOf.set(entry.district.slug, entry.food);
      }

      const divisions: HomeDivision[] = [];
      for (const district of districts) {
        let division = divisions.find((candidate) => candidate.nameBn === district.divisionBn);
        if (!division) {
          division = { nameBn: district.divisionBn, districts: [] };
          divisions.push(division);
        }
        division.districts.push({
          slug: district.slug,
          nameBn: district.nameBn,
          famous: firstFamousOf.get(district.slug) ?? null,
        });
      }

      const famousDistricts = divisions.flatMap((division) =>
        division.districts.filter((district) => district.famous !== null),
      );
      return { famous, famousDistricts, divisions };
    },
  };
}

export type CatalogService = ReturnType<typeof createCatalogService>;
