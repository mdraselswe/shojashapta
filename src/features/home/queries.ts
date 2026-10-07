import { cacheLife, cacheTag } from "next/cache";

import { getServices } from "@/infrastructure/container";

/**
 * Everything the home page reads, in one cached call. The curated list changes only when an editor
 * edits it, so it is cached for hours and refreshed through the "districts" tag.
 */
export async function getHomeData() {
  "use cache";
  cacheTag("districts");
  cacheLife("hours");
  return getServices().catalog.home();
}
