import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Accessibility (docs/06-design-system.md §9): no serious or critical axe violations on the main
// screens, in both themes.
const PAGES = [
  "/",
  "/search?q=%E0%A6%A6%E0%A6%87",
  "/food/doi",
  "/place/sample-place",
  "/district/bogura",
  "/district/bogura/doi",
  "/about",
  "/policy",
  "/login",
];

for (const scheme of ["light", "dark"] as const) {
  test.describe(`axe (${scheme})`, () => {
    test.use({ colorScheme: scheme });
    for (const path of PAGES) {
      test(`${path} has no serious accessibility issues`, async ({ page }) => {
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        const serious = results.violations.filter((violation) =>
          ["serious", "critical"].includes(violation.impact ?? ""),
        );
        expect(
          serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`),
        ).toEqual([]);
      });
    }
  });
}
