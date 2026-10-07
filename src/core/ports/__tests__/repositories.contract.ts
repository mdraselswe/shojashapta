import { describe, expect, it } from "vitest";

import type { Repositories } from "@/core/ports";
import { toSearchQuery } from "@/lib/text/normalize";

/**
 * Behaviour every Repositories adapter must have (add-provider skill, step 7). Each adapter's
 * `*.contract.test.ts` calls this with a factory returning fresh repositories loaded with the
 * standard fixtures (src/infrastructure/mock/fixtures.ts — the seed for real adapters too).
 */
/** Fixture ids the contract refers to (src/infrastructure/mock/fixtures.ts → fixtureIds). */
export type ContractIds = {
  foods: { doi: string };
  places: { sample: string; second: string };
  users: { contract: string };
};

export function repositoryContract(
  adapter: string,
  make: () => Promise<Repositories> | Repositories,
  {
    ids,
    writes = true,
  }: { ids: ContractIds; /** false while an adapter is read-only. */ writes?: boolean },
) {
  const writeIt = writes ? it : it.skip;
  describe(`${adapter} repositories (contract)`, () => {
    it("finds the pipeline's smoke-test entities by slug", async () => {
      const repos = await make();
      expect(await repos.foods.bySlug("doi")).toMatchObject({ slug: "doi", nameBn: "দই" });
      expect(await repos.places.bySlug("sample-place")).toMatchObject({ slug: "sample-place" });
      expect(await repos.districts.bySlug("bogura")).toMatchObject({ slug: "bogura" });
      expect(await repos.foods.bySlug("no-such-food")).toBeNull();
    });

    it("ranks a food's dishes by Wilson score, not raw %", async () => {
      const repos = await make();
      const doi = await repos.foods.bySlug("doi");
      if (!doi) throw new Error("fixture food missing");
      const { items } = await repos.foods.topDishes(doi.id);
      expect(items.length).toBeGreaterThan(1);
      const scores = items.map((d) => d.wilsonScore);
      expect(scores).toEqual([...scores].sort((a, b) => b - a));
      // 25 experiences at 92% beat 3/3 at 100% (decision P10).
      expect(items[0]?.experienceCount).toBeGreaterThan(items[1]?.experienceCount ?? 0);
      expect(items[0]?.place.district.slug).toBe("bogura");
    });

    it("paginates with a cursor", async () => {
      const repos = await make();
      const doi = await repos.foods.bySlug("doi");
      if (!doi) throw new Error("fixture food missing");
      const first = await repos.foods.topDishes(doi.id, { limit: 1 });
      expect(first.items).toHaveLength(1);
      expect(first.nextCursor).not.toBeNull();
      const second = await repos.foods.topDishes(doi.id, { limit: 1, cursor: first.nextCursor });
      expect(second.items[0]?.id).not.toBe(first.items[0]?.id);
    });

    it("lists the curated famous foods of a district", async () => {
      const repos = await make();
      const bogura = await repos.districts.bySlug("bogura");
      if (!bogura) throw new Error("fixture district missing");
      const fame = await repos.districts.fame(bogura.id);
      expect(fame.map((f) => f.food.slug)).toContain("doi");
    });

    writeIt("keeps one experience per user per dish and updates dish counts", async () => {
      const repos = await make();
      const dish = (await repos.places.dishes(ids.places.second))[0];
      if (!dish) throw new Error("fixture dish missing");
      const before = dish.experienceCount;
      await repos.experiences.upsert({
        dishId: dish.id,
        userId: ids.users.contract,
        reaction: "loved",
      });
      await repos.experiences.upsert({
        dishId: dish.id,
        userId: ids.users.contract,
        reaction: "okay",
      });
      const after = await repos.dishes.byId(dish.id);
      expect(after?.experienceCount).toBe(before + 1);
      expect(after?.okayCount).toBe(dish.okayCount + 1);
      const mine = await repos.experiences.byUser(ids.users.contract);
      expect(mine.items).toHaveLength(1);
      expect(mine.items[0]?.reaction).toBe("okay");
    });

    writeIt("replaces a user's earlier claim vote instead of adding another", async () => {
      const repos = await make();
      const [claim] = await repos.claims.forEntity("place", ids.places.sample);
      if (!claim) throw new Error("fixture claim missing");
      const total = (c: typeof claim) => c.counts.correct + c.counts.partial + c.counts.wrong;
      const vote = {
        claimId: claim.id,
        userId: ids.users.contract,
        reason: null,
        note: null,
        evidence: null,
      };
      const first = await repos.claims.vote({ ...vote, verdict: "correct" });
      const second = await repos.claims.vote({ ...vote, verdict: "wrong", reason: "closed" });
      expect(total(first)).toBe(total(claim) + 1);
      expect(total(second)).toBe(total(first));
      expect(second.counts.wrong).toBe(claim.counts.wrong + 1);
    });

    writeIt("saves and unsaves without duplicates", async () => {
      const repos = await make();
      await repos.saved.save(ids.users.contract, "food", ids.foods.doi);
      await repos.saved.save(ids.users.contract, "food", ids.foods.doi);
      expect((await repos.saved.list(ids.users.contract)).items).toHaveLength(1);
      await repos.saved.remove(ids.users.contract, "food", ids.foods.doi);
      expect(await repos.saved.isSaved(ids.users.contract, "food", ids.foods.doi)).toBe(false);
    });

    it("finds foods by Bangla and Banglish spellings", async () => {
      const repos = await make();
      for (const query of ["দই", "doi", "kacchi", "kachchi", "কাচ্চি"]) {
        const { items } = await repos.search.search(toSearchQuery(query));
        const slugs = items.flatMap((hit) => (hit.kind === "food" ? [hit.food.slug] : []));
        expect(slugs.length, query).toBeGreaterThan(0);
      }
      const doi = await repos.search.search(toSearchQuery("দই"));
      expect(doi.items.some((hit) => hit.kind === "food" && hit.food.slug === "doi")).toBe(true);
    });

    it("finds places and districts too", async () => {
      const repos = await make();
      const district = await repos.search.search(toSearchQuery("bogura"));
      expect(
        district.items.some((hit) => hit.kind === "district" && hit.district.slug === "bogura"),
      ).toBe(true);
      const place = await repos.search.search(toSearchQuery("নমুনা দই ঘর"));
      expect(
        place.items.some((hit) => hit.kind === "place" && hit.place.slug === "sample-place"),
      ).toBe(true);
    });
  });
}
