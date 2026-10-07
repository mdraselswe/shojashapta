import { expect, test } from "@playwright/test";

// Every screen must work at 360px without sideways scrolling (AGENTS.md §5).
for (const path of ["/", "/coming-soon", "/dev/themes"]) {
  test(`no horizontal overflow at 360px: ${path}`, async ({ page }) => {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
}
