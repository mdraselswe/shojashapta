import { cacheLife, cacheTag } from "next/cache";
import { after } from "next/server";

import { getServices } from "@/infrastructure/container";

async function searchCached(input: string) {
  "use cache";
  cacheTag("search");
  cacheLife("minutes");
  return getServices().search.search(input);
}

/**
 * Runs a search. The lookup is cached per query for a few minutes; the "nothing found" note is
 * written after the response (never inside the cache, never blocking the visitor).
 */
export async function searchCatalog(input: string) {
  const outcome = await searchCached(input);
  if (outcome.total === 0 && outcome.query.key !== "") {
    after(() => getServices().repos.search.recordMiss(outcome.query));
  }
  return outcome;
}
