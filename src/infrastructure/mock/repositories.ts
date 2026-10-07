import "server-only";

import { appConfig } from "@/config/app.config";
import type {
  Claim,
  District,
  Dish,
  DishWithFood,
  DishWithPlace,
  EditSuggestion,
  Food,
  MediaRef,
  Page,
  PageOpts,
  Place,
  Report,
  SavedItem,
} from "@/core/domain";
import type { Repositories, SearchHit } from "@/core/ports";
import { wilsonLowerBound } from "@/lib/ranking/wilson";

import * as fixtures from "./fixtures";

// In-memory repositories over fixtures (DB_PROVIDER=mock). Writes live for the server process only.

function paginate<T>(items: T[], opts: PageOpts = {}): Page<T> {
  const limit = Math.min(opts.limit ?? appConfig.pagination.default, appConfig.pagination.max);
  const start = Number(opts.cursor ?? 0) || 0;
  const pageItems = items.slice(start, start + limit);
  const next = start + limit;
  return { items: pageItems, nextCursor: next < items.length ? String(next) : null };
}

const byWilson = (a: Dish, b: Dish) => b.wilsonScore - a.wilsonScore;
const clone = <T>(value: T): T => structuredClone(value);
let sequence = 0;
const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${(sequence++).toString(36)}`;

export function createMockRepositories(): Repositories {
  const db = {
    districts: clone(fixtures.districts),
    foods: clone(fixtures.foods),
    fame: clone(fixtures.regionalFame),
    places: clone(fixtures.places),
    dishes: clone(fixtures.dishes),
    experiences: clone(fixtures.experiences),
    claims: clone(fixtures.claims),
    votes: new Map<string, Map<string, "correct" | "partial" | "wrong">>(),
    edits: [] as EditSuggestion[],
    reports: [] as Report[],
    saved: [] as (SavedItem & { userId: string })[],
    media: [] as (MediaRef & { entity: string; entityId: string })[],
    rateEvents: [] as { userId: string; action: string; at: Date }[],
  };

  const foodWithStats = (food: Food): Food => {
    const ofFood = db.dishes.filter((d) => d.foodId === food.id && d.status === "active");
    return {
      ...food,
      experienceCount: ofFood.reduce((sum, d) => sum + d.experienceCount, 0),
      lovedCount: ofFood.reduce((sum, d) => sum + d.lovedCount, 0),
    };
  };
  const placeOf = (dish: Dish): DishWithPlace["place"] => {
    const place = db.places.find((p) => p.id === dish.placeId);
    if (!place) throw new Error(`mock: dish ${dish.id} has no place`);
    return {
      id: place.id,
      slug: place.slug,
      nameBn: place.nameBn,
      type: place.type,
      district: place.district,
      area: place.area,
    };
  };
  const foodOf = (dish: Dish): DishWithFood["food"] => {
    const food = db.foods.find((f) => f.id === dish.foodId);
    if (!food) throw new Error(`mock: dish ${dish.id} has no food`);
    return { id: food.id, slug: food.slug, nameBn: food.nameBn };
  };
  const withPlace = (dish: Dish): DishWithPlace => ({ ...dish, place: placeOf(dish) });
  const active = <T extends { status: string }>(items: T[]) =>
    items.filter((i) => i.status === "active");
  const district = (id: number): District | undefined => db.districts.find((d) => d.id === id);

  const recount = (dish: Dish) => {
    const mine = active(db.experiences).filter((e) => e.dishId === dish.id);
    dish.lovedCount =
      mine.filter((e) => e.reaction === "loved").length + (fixtureBase.get(dish.id)?.loved ?? 0);
    dish.okayCount =
      mine.filter((e) => e.reaction === "okay").length + (fixtureBase.get(dish.id)?.okay ?? 0);
    dish.dislikedCount =
      mine.filter((e) => e.reaction === "disliked").length +
      (fixtureBase.get(dish.id)?.disliked ?? 0);
    dish.experienceCount = dish.lovedCount + dish.okayCount + dish.dislikedCount;
    dish.wilsonScore = wilsonLowerBound(dish.lovedCount, dish.experienceCount);
    dish.lastExperienceAt = new Date();
  };
  // Fixture dish counts stand for experiences we don't list individually; keep them as a base.
  const fixtureBase = new Map(
    db.dishes.map((d) => {
      const listed = db.experiences.filter((e) => e.dishId === d.id);
      const count = (r: string) => listed.filter((e) => e.reaction === r).length;
      return [
        d.id,
        {
          loved: d.lovedCount - count("loved"),
          okay: d.okayCount - count("okay"),
          disliked: d.dislikedCount - count("disliked"),
        },
      ];
    }),
  );

  return {
    districts: {
      list: async () => clone(db.districts),
      bySlug: async (slug) => clone(db.districts.find((d) => d.slug === slug) ?? null),
      fame: async (districtId) =>
        db.fame
          .filter((f) => f.districtId === districtId)
          .flatMap(({ foodId, ...rest }) => {
            const food = db.foods.find((f) => f.id === foodId);
            return food ? [{ ...rest, food: foodWithStats(food) }] : [];
          }),
    },

    foods: {
      bySlug: async (slug) => {
        const food = db.foods.find((f) => f.slug === slug && f.status === "active");
        return food ? foodWithStats(food) : null;
      },
      byId: async (id) => {
        const food = db.foods.find((f) => f.id === id);
        return food ? foodWithStats(food) : null;
      },
      topDishes: async (foodId, opts = {}) =>
        paginate(
          active(db.dishes)
            .filter((d) => d.foodId === foodId)
            .map(withPlace)
            .filter((d) => opts.districtId === undefined || d.place.district.id === opts.districtId)
            .sort(byWilson),
          opts,
        ),
      create: async (input, createdBy) => {
        void createdBy;
        const food: Food = {
          id: newId("f"),
          slug: input.slug,
          nameBn: input.nameBn,
          nameEn: input.nameEn ?? null,
          aboutBn: null,
          cover: null,
          status: "active",
          experienceCount: 0,
          lovedCount: 0,
        };
        db.foods.push(food);
        return clone(food);
      },
    },

    places: {
      bySlug: async (slug) => clone(db.places.find((p) => p.slug === slug) ?? null),
      byId: async (id) => clone(db.places.find((p) => p.id === id) ?? null),
      inDistrict: async (districtId, opts) =>
        paginate(clone(active(db.places).filter((p) => p.district.id === districtId)), opts),
      dishes: async (placeId) =>
        active(db.dishes)
          .filter((d) => d.placeId === placeId)
          .sort(byWilson)
          .map((d) => ({ ...clone(d), food: foodOf(d) })),
      similar: async (nameBn, districtId) => {
        const needle = nameBn.trim();
        return clone(
          active(db.places).filter(
            (p) =>
              p.district.id === districtId &&
              (p.nameBn.includes(needle) || needle.includes(p.nameBn)),
          ),
        );
      },
      create: async (input, createdBy) => {
        void createdBy;
        const home = district(input.districtId);
        if (!home) throw new Error(`mock: unknown district ${input.districtId}`);
        const place: Place = {
          id: newId("p"),
          slug: input.slug,
          nameBn: input.nameBn,
          nameEn: input.nameEn ?? null,
          type: input.type,
          district: { id: home.id, slug: home.slug, nameBn: home.nameBn },
          area: null,
          address: input.address ?? null,
          location: input.location ?? null,
          openingHours: null,
          price: { min: null, max: null },
          status: "active",
          mergedIntoId: null,
        };
        db.places.push(place);
        return clone(place);
      },
    },

    dishes: {
      byId: async (id) => {
        const dish = db.dishes.find((d) => d.id === id);
        return dish ? clone(withPlace(dish)) : null;
      },
      findOrCreate: async (placeId, foodId) => {
        let dish = db.dishes.find((d) => d.placeId === placeId && d.foodId === foodId);
        if (!dish) {
          dish = {
            id: newId("d"),
            placeId,
            foodId,
            displayName: null,
            price: { min: null, max: null },
            priceConfirmedAt: null,
            lovedCount: 0,
            okayCount: 0,
            dislikedCount: 0,
            experienceCount: 0,
            wilsonScore: 0,
            lastExperienceAt: null,
            status: "active",
          };
          db.dishes.push(dish);
          fixtureBase.set(dish.id, { loved: 0, okay: 0, disliked: 0 });
        }
        return clone(withPlace(dish));
      },
    },

    experiences: {
      forDish: async (dishId, opts) =>
        paginate(clone(active(db.experiences).filter((e) => e.dishId === dishId)), opts),
      forFood: async (foodId, opts) => {
        const dishIds = new Set(db.dishes.filter((d) => d.foodId === foodId).map((d) => d.id));
        return paginate(clone(active(db.experiences).filter((e) => dishIds.has(e.dishId))), opts);
      },
      byUser: async (userId, opts) =>
        paginate(clone(active(db.experiences).filter((e) => e.user.id === userId)), opts),
      upsert: async (input) => {
        const dish = db.dishes.find((d) => d.id === input.dishId);
        if (!dish) throw new Error(`mock: unknown dish ${input.dishId}`);
        let experience = db.experiences.find(
          (e) => e.dishId === input.dishId && e.user.id === input.userId,
        );
        if (experience) {
          experience.reaction = input.reaction;
          experience.comment = input.comment ?? null;
          experience.pricePaid = input.pricePaid ?? null;
          experience.visitedOn = input.visitedOn ?? null;
        } else {
          experience = {
            id: newId("e"),
            dishId: input.dishId,
            user: { id: input.userId, displayName: fixtures.demoUser.displayName, avatarUrl: null },
            reaction: input.reaction,
            comment: input.comment ?? null,
            pricePaid: input.pricePaid ?? null,
            visitedOn: input.visitedOn ?? null,
            photos: [],
            status: "active",
            createdAt: new Date(),
          };
          db.experiences.unshift(experience);
        }
        recount(dish);
        return clone(experience);
      },
    },

    claims: {
      forEntity: async (entity, entityId) =>
        clone(db.claims.filter((c) => c.entity === entity && c.entityId === entityId)),
      byId: async (id) => clone(db.claims.find((c) => c.id === id) ?? null),
      vote: async (vote) => {
        const claim = db.claims.find((c) => c.id === vote.claimId);
        if (!claim) throw new Error(`mock: unknown claim ${vote.claimId}`);
        const votes = db.votes.get(claim.id) ?? new Map<string, "correct" | "partial" | "wrong">();
        const previous = votes.get(vote.userId);
        if (previous) claim.counts[previous] -= 1;
        votes.set(vote.userId, vote.verdict);
        db.votes.set(claim.id, votes);
        claim.counts[vote.verdict] += 1;
        return clone(claim);
      },
      saveStatus: async (claimId, update) => {
        const claim = db.claims.find((c) => c.id === claimId);
        if (claim) Object.assign(claim, update satisfies Partial<Claim>);
      },
    },

    editSuggestions: {
      create: async (input) => {
        const edit: EditSuggestion = {
          ...input,
          id: newId("s"),
          status: "open",
          createdAt: new Date(),
        };
        db.edits.push(edit);
        return clone(edit);
      },
    },

    reports: {
      create: async (input) => {
        const report: Report = { ...input, id: newId("r"), status: "open", createdAt: new Date() };
        db.reports.push(report);
        return clone(report);
      },
    },

    saved: {
      list: async (userId, opts) =>
        paginate(
          db.saved
            .filter((s) => s.userId === userId)
            .map(({ entity, entityId, kind, createdAt }) => ({
              entity,
              entityId,
              kind,
              createdAt,
            })),
          opts,
        ),
      isSaved: async (userId, entity, entityId) =>
        db.saved.some((s) => s.userId === userId && s.entity === entity && s.entityId === entityId),
      save: async (userId, entity, entityId) => {
        if (
          !db.saved.some(
            (s) => s.userId === userId && s.entity === entity && s.entityId === entityId,
          )
        ) {
          db.saved.push({ userId, entity, entityId, kind: "want_to_try", createdAt: new Date() });
        }
      },
      remove: async (userId, entity, entityId) => {
        db.saved = db.saved.filter(
          (s) => !(s.userId === userId && s.entity === entity && s.entityId === entityId),
        );
      },
    },

    media: {
      create: async ({ entity, entityId, id, key, width, height, dominantColor }) => {
        const media = { id, key, width, height, dominantColor, entity, entityId };
        db.media.push(media);
        return { id, key, width, height, dominantColor };
      },
      forEntity: async (entity, entityId) =>
        db.media
          .filter((m) => m.entity === entity && m.entityId === entityId)
          .map(({ id, key, width, height, dominantColor }) => ({
            id,
            key,
            width,
            height,
            dominantColor,
          })),
    },

    search: {
      // Simple substring match; the real fuzzy search is SQL search_all (Phase 1).
      search: async ({ text }, opts) => {
        const q = text.trim().toLowerCase();
        const matches = (...names: (string | null)[]) =>
          names.some((n) => n?.toLowerCase().includes(q));
        const hits: SearchHit[] = q
          ? [
              ...db.foods
                .filter((f) => matches(f.nameBn, f.nameEn, f.slug))
                .map((f) => ({ kind: "food" as const, food: foodWithStats(f) })),
              ...active(db.places)
                .filter((p) => matches(p.nameBn, p.nameEn, p.slug))
                .map((p) => ({ kind: "place" as const, place: clone(p) })),
              ...db.districts
                .filter((d) => matches(d.nameBn, d.nameEn, d.slug))
                .map((d) => ({ kind: "district" as const, district: clone(d) })),
            ]
          : [];
        return paginate(hits, opts);
      },
      recordMiss: async () => {},
    },

    rateLimits: {
      countSince: async (userId, action, since) =>
        db.rateEvents.filter((e) => e.userId === userId && e.action === action && e.at >= since)
          .length,
      record: async (userId, action) => {
        db.rateEvents.push({ userId, action, at: new Date() });
      },
    },

    admin: {
      openReports: async (opts) =>
        paginate(clone(db.reports.filter((r) => r.status === "open")), opts),
      openEditSuggestions: async (opts) =>
        paginate(clone(db.edits.filter((e) => e.status === "open")), opts),
    },
  };
}
