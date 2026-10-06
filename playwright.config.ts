import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3000);
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["html", { open: "never" }], ["github"]] : "list",
  use: { baseURL, trace: "on-first-retry" },
  projects: [
    {
      // Mobile-first: every screen must work at 360px (AGENTS.md §5).
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"], viewport: { width: 360, height: 780 } },
    },
  ],
  webServer: {
    // Runs against the production build (`pnpm build` first), like CI and Lighthouse.
    command: "pnpm start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
