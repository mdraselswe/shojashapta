import { appConfig } from "@/config/app.config";
import type { AppUser, DishWithPlace, Experience, Reaction } from "@/core/domain";
import type { CacheInvalidator, Repositories } from "@/core/ports";
import { fail, ok, type Result } from "@/lib/result";
import { containsProfanity } from "@/lib/text/profanity";

// "আমি খেয়েছি": one experience per user per dish (decision P6). Pure: ports only.

type Deps = {
  repos: Pick<Repositories, "dishes" | "experiences" | "foods" | "places">;
  cache: CacheInvalidator;
};

/** Which dish: an existing one, or a (place, food) pair whose dish is created on first use. */
export type DishRef = { dishId: string } | { placeId: string; foodId: string };

export type AddExperienceInput = DishRef & {
  reaction: Reaction;
  comment?: string | null | undefined;
  pricePaid?: number | null | undefined;
};

/** Trims and collapses whitespace; empty becomes null; never longer than the configured maximum. */
export function cleanComment(value: string | null | undefined): string | null {
  const text = (value ?? "").replace(/\s+/g, " ").trim();
  if (text === "") return null;
  return [...text].slice(0, appConfig.text.commentMax).join("");
}

export type AddedExperience = {
  experience: Experience;
  dish: DishWithPlace;
  /** True when this user had no experience of the dish before (adds, not edits). */
  isNew: boolean;
};

export function createExperienceService({ repos, cache }: Deps) {
  return {
    async add(user: AppUser, input: AddExperienceInput): Promise<Result<AddedExperience>> {
      const comment = cleanComment(input.comment);
      if (comment && containsProfanity(comment)) {
        return fail("validation", { fields: { comment: "profanity" } });
      }

      let dish: DishWithPlace | null;
      if ("dishId" in input) {
        dish = await repos.dishes.byId(input.dishId);
      } else {
        const [place, food] = await Promise.all([
          repos.places.byId(input.placeId),
          repos.foods.byId(input.foodId),
        ]);
        dish = place && food ? await repos.dishes.findOrCreate(place.id, food.id) : null;
      }
      if (!dish || dish.status !== "active") return fail("not_found");

      const before = await repos.experiences.forDish(dish.id, { limit: 200 });
      const isNew = !before.items.some((experience) => experience.user.id === user.id);

      const experience = await repos.experiences.upsert({
        dishId: dish.id,
        userId: user.id,
        reaction: input.reaction,
        comment,
        pricePaid: input.pricePaid ?? null,
      });

      await cache.invalidate([`food:${dish.foodId}`, `place:${dish.placeId}`, `dish:${dish.id}`]);
      return ok({ experience, dish, isNew });
    },
  };
}

export type ExperienceService = ReturnType<typeof createExperienceService>;
