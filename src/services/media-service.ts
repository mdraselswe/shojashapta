import { appConfig } from "@/config/app.config";
import type { AppUser, MediaPurpose, MediaRef, UploadTicket } from "@/core/domain";
import type { CacheInvalidator, Repositories, StorageProvider } from "@/core/ports";
import { fail, ok, type Result } from "@/lib/result";

// Photos on experiences (decision T5): the browser compresses and uploads straight to the image
// host with a short-lived ticket; this service hands out tickets and attaches confirmed uploads.
// Pure: ports only.

type Deps = {
  repos: Pick<Repositories, "experiences" | "media" | "dishes">;
  storage: Pick<StorageProvider, "createUploadTicket" | "confirmUpload">;
  cache: CacheInvalidator;
  /** Recorded on each media row (which provider holds the file). */
  provider: string;
};

export function createMediaService({ repos, storage, cache, provider }: Deps) {
  return {
    ticket(user: AppUser, purpose: MediaPurpose): Promise<UploadTicket> {
      return storage.createUploadTicket({ userId: user.id, purpose });
    },

    /** Confirms uploads (by key) and attaches them to the user's own experience. */
    async attachToExperience(
      user: AppUser,
      input: { experienceId: string; keys: string[] },
    ): Promise<Result<{ photos: MediaRef[] }>> {
      const experience = await repos.experiences.byId(input.experienceId);
      if (!experience || experience.user.id !== user.id) return fail("not_found");

      const room = appConfig.media.maxPhotosPerExperience - experience.photos.length;
      const keys = [...new Set(input.keys)];
      if (keys.length === 0 || keys.length > room) {
        return fail("validation", { fields: { photos: "too_many" } });
      }

      const photos: MediaRef[] = [];
      for (const key of keys) {
        const confirmed = await storage.confirmUpload({ key, userId: user.id });
        photos.push(
          await repos.media.create({
            ...confirmed,
            ownerId: user.id,
            entity: "experience",
            entityId: experience.id,
            provider,
          }),
        );
      }

      const dish = await repos.dishes.byId(experience.dishId);
      if (dish) await cache.invalidate([`food:${dish.foodId}`, `place:${dish.placeId}`]);
      return ok({ photos });
    },
  };
}

export type MediaService = ReturnType<typeof createMediaService>;
