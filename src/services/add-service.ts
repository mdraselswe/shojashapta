import { appConfig } from "@/config/app.config";
import type { AppUser, Place, PlaceType, Reaction } from "@/core/domain";
import type { CacheInvalidator, RateLimiter, Repositories } from "@/core/ports";
import { fail, ok, type Result } from "@/lib/result";
import { slugify } from "@/lib/text/slug";
import { toSearchKey, toSearchQuery } from "@/lib/text/normalize";

import type { ExperienceService } from "./experience-service";

// The add flow (docs/01-product-spec.md §3.7): "what did you eat, where, how was it" in one
// submission, creating the food and/or place when they are new. Pure: ports only.

type Deps = {
  repos: Pick<Repositories, "foods" | "places" | "search">;
  experience: ExperienceService;
  rateLimiter: RateLimiter;
  cache: CacheInvalidator;
};

export type NewPlaceInput = {
  nameBn: string;
  districtId: number;
  type: PlaceType;
  areaName?: string | null | undefined;
  location?: { lat: number; lng: number } | null | undefined;
};

export type AddInput = {
  food: { id: string } | { nameBn: string };
  place: { id: string } | NewPlaceInput;
  reaction: Reaction;
  comment?: string | null | undefined;
  pricePaid?: number | null | undefined;
  /** The person saw similar places and still wants a new one. */
  confirmNewPlace?: boolean | undefined;
};

export type AddResult = {
  foodSlug: string;
  placeSlug: string;
  createdFood: boolean;
  createdPlace: boolean;
};

export type Suggestion = { id: string; nameBn: string; meta: string | null };

const clean = (value: string) => value.replace(/\s+/g, " ").trim();

async function freeSlug(base: string, exists: (slug: string) => Promise<boolean>) {
  const root = base || "item";
  for (let n = 1; n < 50; n++) {
    const candidate = n === 1 ? root : `${root}-${n}`;
    if (!(await exists(candidate))) return candidate;
  }
  return `${root}-${Date.now().toString(36)}`;
}

export function createAddService({ repos, experience, rateLimiter, cache }: Deps) {
  return {
    /** Foods or places matching what the person is typing, with ids for the form. */
    async suggest(input: {
      kind: "food" | "place";
      q: string;
      districtId?: number | undefined;
    }): Promise<Suggestion[]> {
      const query = toSearchQuery(clean(input.q).slice(0, appConfig.search.maxQueryLength));
      if (query.key === "") return [];
      const page = await repos.search.search(query, { limit: 20 });
      const out: Suggestion[] = [];
      for (const hit of page.items) {
        if (input.kind === "food" && hit.kind === "food") {
          out.push({ id: hit.food.id, nameBn: hit.food.nameBn, meta: null });
        }
        if (input.kind === "place" && hit.kind === "place") {
          if (input.districtId !== undefined && hit.place.district.id !== input.districtId)
            continue;
          out.push({
            id: hit.place.id,
            nameBn: hit.place.nameBn,
            meta: [hit.place.area?.nameBn, hit.place.district.nameBn].filter(Boolean).join(", "),
          });
        }
      }
      return out.slice(0, appConfig.search.suggestionsPerGroup * 2);
    },

    /** Existing places in the district that look like the typed one (duplicate check). */
    async similarPlaces(nameBn: string, districtId: number): Promise<Suggestion[]> {
      const places = await repos.places.similar(clean(nameBn), districtId);
      return places.map((place) => ({
        id: place.id,
        nameBn: place.nameBn,
        meta: [place.area?.nameBn, place.district.nameBn].filter(Boolean).join(", "),
      }));
    },

    async submit(user: AppUser, input: AddInput): Promise<Result<AddResult>> {
      // Food: an existing one, a near-identical existing name, or a new one.
      let foodId: string;
      let foodSlug: string;
      let createdFood = false;
      if ("id" in input.food) {
        const food = await repos.foods.byId(input.food.id);
        if (!food) return fail("not_found");
        foodId = food.id;
        foodSlug = food.slug;
      } else {
        const nameBn = clean(input.food.nameBn).slice(0, appConfig.text.nameMax);
        if (nameBn === "") return fail("validation", { fields: { food: "required" } });
        const found = await repos.search.search(toSearchQuery(nameBn), { limit: 10 });
        const same = found.items.find(
          (hit) => hit.kind === "food" && toSearchKey(hit.food.nameBn) === toSearchKey(nameBn),
        );
        if (same && same.kind === "food") {
          foodId = same.food.id;
          foodSlug = same.food.slug;
        } else {
          const limit = await rateLimiter.consume(user.id, "food_create");
          if (!limit.allowed) return fail("rate_limited", { retryAfter: limit.retryAfter });
          const slug = await freeSlug(
            slugify(nameBn),
            async (s) => (await repos.foods.bySlug(s)) !== null,
          );
          const food = await repos.foods.create({ nameBn, slug }, user.id);
          foodId = food.id;
          foodSlug = food.slug;
          createdFood = true;
        }
      }

      // Place: an existing one, or a new one after the duplicate check.
      let place: Pick<Place, "id" | "slug" | "district">;
      let createdPlace = false;
      if ("id" in input.place) {
        const existing = await repos.places.byId(input.place.id);
        if (!existing) return fail("not_found");
        place = existing;
      } else {
        const draft = input.place;
        const nameBn = clean(draft.nameBn).slice(0, appConfig.text.nameMax);
        if (nameBn === "") return fail("validation", { fields: { place: "required" } });
        if (!input.confirmNewPlace) {
          const similar = await repos.places.similar(nameBn, draft.districtId);
          if (similar.length > 0) return fail("conflict");
        }
        const limit = await rateLimiter.consume(user.id, "place_create");
        if (!limit.allowed) return fail("rate_limited", { retryAfter: limit.retryAfter });
        const slug = await freeSlug(
          slugify(nameBn),
          async (s) => (await repos.places.bySlug(s)) !== null,
        );
        place = await repos.places.create(
          {
            nameBn,
            type: draft.type,
            districtId: draft.districtId,
            areaName: draft.areaName
              ? clean(draft.areaName).slice(0, appConfig.text.nameMax)
              : null,
            location: draft.location ?? null,
            slug,
          },
          user.id,
        );
        createdPlace = true;
      }

      const saved = await experience.add(user, {
        placeId: place.id,
        foodId,
        reaction: input.reaction,
        comment: input.comment,
        pricePaid: input.pricePaid,
      });
      if (!saved.ok) return saved;

      await cache.invalidate([
        "search",
        `district:${place.district.id}`,
        `food:${foodId}`,
        `place:${place.id}`,
      ]);
      return ok({ foodSlug, placeSlug: place.slug, createdFood, createdPlace });
    },
  };
}

export type AddService = ReturnType<typeof createAddService>;
