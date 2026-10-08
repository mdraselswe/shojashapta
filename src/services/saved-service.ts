import type { AppUser, SavedItem } from "@/core/domain";
import type { Repositories } from "@/core/ports";
import { fail, ok, type Result } from "@/lib/result";

// "খেতে চাই": a private bookmark on a food or place. Pure: ports only.

type Deps = { repos: Pick<Repositories, "saved" | "foods" | "places"> };

export type SaveTarget = {
  entity: Extract<SavedItem["entity"], "food" | "place">;
  entityId: string;
};

export function createSavedService({ repos }: Deps) {
  return {
    isSaved: (userId: string, target: SaveTarget) =>
      repos.saved.isSaved(userId, target.entity, target.entityId),

    /** Saves when not saved, removes when saved; returns the new state. */
    async toggle(user: AppUser, target: SaveTarget): Promise<Result<{ saved: boolean }>> {
      const exists =
        target.entity === "food"
          ? await repos.foods.byId(target.entityId)
          : await repos.places.byId(target.entityId);
      if (!exists) return fail("not_found");
      const saved = await repos.saved.isSaved(user.id, target.entity, target.entityId);
      if (saved) await repos.saved.remove(user.id, target.entity, target.entityId);
      else await repos.saved.save(user.id, target.entity, target.entityId);
      return ok({ saved: !saved });
    },
  };
}

export type SavedService = ReturnType<typeof createSavedService>;
