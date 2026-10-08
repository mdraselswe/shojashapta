import { expect, test } from "@playwright/test";

test.describe("admin", () => {
  test("a visitor and a regular signed-in user get the not-found page", async ({ page }) => {
    const notFound = page.getByText("পাতাটি খুঁজে পাওয়া যায়নি");
    await page.goto("/admin");
    await expect(notFound).toBeVisible();
    await page.goto("/auth/sign-in?next=/admin");
    await expect(notFound).toBeVisible();
    await expect(page.getByText("অ্যাপে এখন যা আছে")).toHaveCount(0);
  });

  test("an admin sees the dashboard and every queue", async ({ page }) => {
    await page.goto("/auth/callback?mock=admin&next=/admin");
    await expect(page.getByRole("heading", { name: "অ্যাডমিন", level: 1 })).toBeVisible();
    await expect(page.getByText("অ্যাপে এখন যা আছে")).toBeVisible();
    for (const [path, title] of [
      ["reports", "রিপোর্ট"],
      ["edits", "সংশোধনের প্রস্তাব"],
      ["places", "নতুন জায়গা"],
      ["claims", "বিতর্কিত তথ্য"],
      ["fame", "বিখ্যাত খাবার"],
      ["maintenance", "রক্ষণাবেক্ষণ"],
    ] as const) {
      await page.goto(`/admin/${path}`);
      await expect(page.getByRole("heading", { name: title, level: 1 })).toBeVisible();
    }
  });
});
