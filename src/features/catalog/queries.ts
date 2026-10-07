import { cacheLife, cacheTag } from "next/cache";

import { getServices } from "@/infrastructure/container";

/** Slugs prerendered at build time (generateStaticParams). The rest render on first visit. */
export async function getStaticSlugs() {
  "use cache";
  cacheTag("districts");
  cacheLife("hours");
  return getServices().catalog.staticSlugs();
}
