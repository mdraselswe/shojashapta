import { describe, expect, it } from "vitest";
import { z } from "zod";

import { ok } from "@/lib/result";

import { defineAction, getServices } from "./container";

// Without provider env vars the container wires the mock adapters (CI, e2e, offline work).
describe("container", () => {
  it("wires mock adapters by default and keeps one instance per process", async () => {
    const services = getServices();
    expect(services).toBe(getServices());
    expect(await services.repos.foods.bySlug("doi")).toMatchObject({ nameBn: "দই" });
    expect(services.storage.url("/brand/mark.svg", "thumb")).toBe("/brand/mark.svg");
  });

  it("builds actions that reach the wired services", async () => {
    const findFood = defineAction(z.object({ slug: z.string() }), async ({ slug }, { services }) =>
      ok((await services.repos.foods.bySlug(slug))?.nameBn ?? null),
    );
    expect(await findFood({ slug: "doi" })).toEqual({ ok: true, data: "দই" });
    expect(await findFood({})).toMatchObject({ ok: false, error: { code: "validation" } });
  });
});
