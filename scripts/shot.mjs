// Dev helper: screenshots of a path at 360px in light and dark. Usage: node scripts/shot.mjs /path out-prefix
import { chromium } from "@playwright/test";

const [path = "/", prefix = "shot"] = process.argv.slice(2);
const base = process.env.SHOT_BASE ?? "http://localhost:3100";
const browser = await chromium.launch();
for (const scheme of ["light", "dark"]) {
  const context = await browser.newContext({
    viewport: { width: 360, height: 780 },
    deviceScaleFactor: 2,
    colorScheme: scheme,
  });
  const page = await context.newPage();
  await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${prefix}-${scheme}.png`, fullPage: false });
  await context.close();
}
await browser.close();
