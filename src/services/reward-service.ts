import { appConfig } from "@/config/app.config";
import type { AppUser, StampKind } from "@/core/domain";
import type { Repositories } from "@/core/ports";
import {
  divisionProgress,
  nextStampSuggestion,
  type DivisionProgress,
  type NextStamp,
} from "@/lib/passport/stamps";

// Points and the food passport (docs/01-product-spec.md §3.11b). Points are a score, never spent;
// the database refuses to pay the same action twice, and hidden content loses its points.
// Pure: ports only.

type Deps = { repos: Pick<Repositories, "rewards" | "districts" | "foods"> };

export type NewStamp = { districtName: string; kind: StampKind };

/** What one action earned, shown as a gold "+১০" toast and, for a first, a stamp. */
export type Reward = { points: number; newStamps: NewStamp[] };

export const NO_REWARD: Reward = { points: 0, newStamps: [] };

export function mergeRewards(...rewards: Reward[]): Reward {
  return {
    points: rewards.reduce((sum, reward) => sum + reward.points, 0),
    newStamps: rewards.flatMap((reward) => reward.newStamps),
  };
}

export type PassportSummary = {
  points: number;
  stamps: { districtId: number; kind: StampKind; createdAt: Date }[];
  unlockedCount: number;
  totalDistricts: number;
  divisions: DivisionProgress[];
  next: NextStamp | null;
};

export function createRewardService({ repos }: Deps) {
  return {
    /** +10 for a new experience, and a stamp the first time someone eats in a district. */
    async forExperience(
      user: AppUser,
      input: { experienceId: string; isNew: boolean; district: { id: number; nameBn: string } },
    ): Promise<Reward> {
      if (!input.isNew) return NO_REWARD;
      const points = await repos.rewards.award({
        userId: user.id,
        kind: "experience",
        entity: "experience",
        entityId: input.experienceId,
        points: appConfig.points.experience,
      });
      const isNewStamp = await repos.rewards.unlockStamp({
        userId: user.id,
        districtId: input.district.id,
        kind: "visit",
      });
      return {
        points,
        newStamps: isNewStamp ? [{ districtName: input.district.nameBn, kind: "visit" }] : [],
      };
    },

    /** +20 for a new place, +20 and an "আবিষ্কারক" stamp when it is the first for a famous food. */
    async forNewPlace(
      user: AppUser,
      input: {
        placeId: string;
        foodId: string;
        district: { id: number; nameBn: string };
        /** No place in this district served the food before (checked before it was created). */
        firstForFood: boolean;
      },
    ): Promise<Reward> {
      let points = await repos.rewards.award({
        userId: user.id,
        kind: "place_create",
        entity: "place",
        entityId: input.placeId,
        points: appConfig.points.place_create,
      });
      const newStamps: NewStamp[] = [];
      if (input.firstForFood) {
        const famous = (await repos.districts.fame(input.district.id)).some(
          (entry) => entry.food.id === input.foodId,
        );
        if (famous) {
          points += await repos.rewards.award({
            userId: user.id,
            kind: "discoverer",
            entity: "place",
            entityId: input.placeId,
            points: appConfig.points.discoverer,
          });
          const isNewStamp = await repos.rewards.unlockStamp({
            userId: user.id,
            districtId: input.district.id,
            kind: "discoverer",
            foodId: input.foodId,
          });
          if (isNewStamp)
            newStamps.push({ districtName: input.district.nameBn, kind: "discoverer" });
        }
      }
      return { points, newStamps };
    },

    /** +5 for checking a fact; once per claim, however often the vote is changed. */
    async forVote(user: AppUser, claimId: string): Promise<Reward> {
      const points = await repos.rewards.award({
        userId: user.id,
        kind: "claim_vote",
        entity: "claim",
        entityId: claimId,
        points: appConfig.points.claim_vote,
      });
      return { points, newStamps: [] };
    },

    /** Content that was hidden or removed no longer counts. */
    revokeFor(entity: "experience" | "place" | "claim" | "edit_suggestion", id: string) {
      return repos.rewards.revoke(entity, id);
    },

    /** The passport: points, stamps, progress per division and the next stamp to go for. */
    async summary(userId: string): Promise<PassportSummary> {
      const [points, stamps, districts, fame] = await Promise.all([
        repos.rewards.total(userId),
        repos.rewards.stamps(userId),
        repos.districts.list(),
        repos.districts.allFame(),
      ]);
      const unlocked = new Set(
        stamps.filter((stamp) => stamp.kind === "visit").map((s) => s.districtId),
      );
      return {
        points,
        stamps: stamps.map(({ districtId, kind, createdAt }) => ({ districtId, kind, createdAt })),
        unlockedCount: unlocked.size,
        totalDistricts: appConfig.passport.totalDistricts,
        divisions: divisionProgress(districts, unlocked),
        next: nextStampSuggestion(
          fame.map((entry) => ({
            districtId: entry.districtId,
            food: { slug: entry.food.slug, nameBn: entry.food.nameBn },
          })),
          districts,
          unlocked,
        ),
      };
    },
  };
}

export type RewardService = ReturnType<typeof createRewardService>;
