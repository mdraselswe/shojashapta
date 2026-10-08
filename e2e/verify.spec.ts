import { expect, test } from "@playwright/test";

test.describe("verify a fact", () => {
  test("a signed-out visitor is sent to login and brought back", async ({ page }) => {
    await page.goto("/place/sample-place");
    await page.getByRole("button", { name: "যাচাই করুন" }).first().click();
    await page.getByRole("button", { name: "জমা দিন" }).click();
    await expect(page).toHaveURL(/\/login\?next=%2Fplace%2Fsample-place/);
  });

  test("says what was wrong, with a reason, and thanks the person", async ({ page }) => {
    await page.goto("/auth/sign-in?next=/place/sample-place");
    await page.getByRole("button", { name: "যাচাই করুন" }).first().click();
    await expect(page.getByRole("heading", { name: "তথ্য ঠিক আছে?" })).toBeVisible();
    await page.getByRole("button", { name: "ভুল", exact: true }).click();
    await page.getByRole("button", { name: "দাম ভুল" }).click();
    await page.getByPlaceholder("আর কিছু বলবেন?").fill("এখন আরও বেশি");
    await page.getByRole("button", { name: "জমা দিন" }).click();
    await expect(page.getByText("ধন্যবাদ, আপনার মতামত যোগ হয়েছে।")).toBeVisible();
  });
});
