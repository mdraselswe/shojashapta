import { expect, test } from "@playwright/test";

import { measureCls, throttleNetwork } from "./utils/cls";

test.describe("skeleton parity (/dev/skeletons)", () => {
  test("every skeleton has the same height as its component at 360px", async ({ page }) => {
    await page.goto("/dev/skeletons");
    await page.evaluate(() => document.fonts.ready);
    const pairs = await page.evaluate(() => {
      const byName = new Map<string, { real?: number; skeleton?: number }>();
      for (const element of document.querySelectorAll<HTMLElement>("[data-pair]")) {
        const name = element.dataset.pair ?? "";
        const kind = element.dataset.kind === "real" ? "real" : "skeleton";
        const entry = byName.get(name) ?? {};
        entry[kind] = element.getBoundingClientRect().height;
        byName.set(name, entry);
      }
      return [...byName].map(([name, heights]) => ({ name, ...heights }));
    });
    expect(pairs.length).toBeGreaterThan(0);
    for (const { name, real, skeleton } of pairs) {
      expect(real, name).toBeDefined();
      expect(
        Math.abs((real ?? 0) - (skeleton ?? -1)),
        `${name}: ${real} vs ${skeleton}`,
      ).toBeLessThanOrEqual(1);
    }
  });
});

test.describe("layout stability", () => {
  for (const path of ["/", "/coming-soon"]) {
    test(`CLS < 0.01 on a slow network: ${path}`, async ({ page }) => {
      await throttleNetwork(page);
      expect(await measureCls(page, path)).toBeLessThan(0.01);
    });
  }
});
