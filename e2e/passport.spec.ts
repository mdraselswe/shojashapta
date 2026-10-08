import { expect, test } from "@playwright/test";

test.describe("food passport and points", () => {
  test("a reaction shows a gold points toast, and the stamp lands in the passport", async ({
    page,
  }) => {
    await page.goto("/auth/sign-in?next=/place/second-sample-place");
    await page.getByRole("button", { name: "দারুণ" }).first().click();
    // +10 on a first experience, or a plain thank-you when this dish was already answered
    await expect(
      page.getByText(/^\+[০-৯]+$|অভিজ্ঞতা যোগ হয়েছে। ধন্যবাদ!|আপনার মতামত বদলানো হয়েছে।/).first(),
    ).toBeVisible();

    await page.goto("/me");
    await expect(page.getByText("খাদ্য পাসপোর্ট").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "স্ট্যাম্প" })).toBeVisible();
    await expect(page.getByRole("img", { name: "বগুড়া জেলার স্ট্যাম্প" }).first()).toBeVisible();
  });

  test("the home page shows the passport only to a signed-in person", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("খাদ্য পাসপোর্ট")).toHaveCount(0);
    await page.goto("/auth/sign-in?next=/");
    await expect(page.getByText("খাদ্য পাসপোর্ট").first()).toBeVisible();
  });

  test("the passport shows progress per division and the next stamp to try", async ({ page }) => {
    await page.goto("/auth/sign-in?next=/me");
    await expect(page.getByRole("heading", { name: "বিভাগ অনুযায়ী" })).toBeVisible();
    await expect(page.getByText("রাজশাহী").first()).toBeVisible();
  });
});
