import "server-only";

import { revalidateTag } from "next/cache";

import type { CacheInvalidator } from "@/core/ports";

/**
 * Next.js cache tags. `expire: 0` so the contributor sees their change on the next request
 * (works from Server Actions and Route Handlers alike).
 */
export const nextCacheInvalidator: CacheInvalidator = {
  async invalidate(tags) {
    for (const tag of new Set(tags)) revalidateTag(tag, { expire: 0 });
  },
};
