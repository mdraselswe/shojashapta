import { describe, expect, it } from "vitest";

import type { Repositories } from "@/core/ports";

/**
 * Behaviour every Repositories adapter must have (add-provider skill, step 7). Each adapter's
 * `*.contract.test.ts` calls this with a factory returning fresh repositories loaded with the
 * standard fixtures (src/infrastructure/mock/fixtures.ts — the seed for real adapters too).
 */
export function repositoryContract(
  adapter: string,
  make: () => Promise<Repositories> | Repositories,
) {
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

    it("keeps one experience per user per dish and updates dish counts", async () => {
      const repos = await make();
      const dish = (await repos.places.dishes("p-second"))[0];
      if (!dish) throw new Error("fixture dish missing");
      const before = dish.experienceCount;
      await repos.experiences.upsert({
        dishId: dish.id,
        userId: "contract-user",
        reaction: "loved",
      });
      await repos.experiences.upsert({
        dishId: dish.id,
        userId: "contract-user",
        reaction: "okay",
      });
      const after = await repos.dishes.byId(dish.id);
      expect(after?.experienceCount).toBe(before + 1);
      expect(after?.okayCount).toBe(dish.okayCount + 1);
      const mine = await repos.experiences.byUser("contract-user");
      expect(mine.items).toHaveLength(1);
      expect(mine.items[0]?.reaction).toBe("okay");
    });

    it("replaces a user's earlier claim vote instead of adding another", async () => {
      const repos = await make();
      const [claim] = await repos.claims.forEntity("place", "p-sample");
      if (!claim) throw new Error("fixture claim missing");
      const total = (c: typeof claim) => c.counts.correct + c.counts.partial + c.counts.wrong;
      const vote = {
        claimId: claim.id,
        userId: "contract-user",
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

    it("saves and unsaves without duplicates", async () => {
      const repos = await make();
      await repos.saved.save("contract-user", "food", "f-doi");
      await repos.saved.save("contract-user", "food", "f-doi");
      expect((await repos.saved.list("contract-user")).items).toHaveLength(1);
      await repos.saved.remove("contract-user", "food", "f-doi");
      expect(await repos.saved.isSaved("contract-user", "food", "f-doi")).toBe(false);
    });

    it("finds foods, places and districts by name", async () => {
      const repos = await make();
      const { items } = await repos.search.search({ text: "দই", key: "doi" });
      expect(items.some((hit) => hit.kind === "food" && hit.food.slug === "doi")).toBe(true);
    });
  });
}
