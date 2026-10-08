import { expect, test } from "@playwright/test";

test.describe("খেতে চাই bookmark", () => {
  test("a signed-out tap asks for login and returns to the page", async ({ page }) => {
    await page.goto("/food/doi");
    await page.getByRole("button", { name: "খেতে চাই তালিকায় রাখুন" }).first().click();
    await expect(page).toHaveURL(/\/login\?next=%2Ffood%2Fdoi/);
  });

  test("a signed-in tap saves, remembers it after reload, and a second tap removes it", async ({
    page,
  }) => {
    await page.goto("/auth/sign-in?next=/place/second-sample-place");
    const bookmark = page.getByRole("button", { name: "খেতে চাই তালিকায় রাখুন" }).first();
    // other specs share this demo user, so start from a known state
    if ((await bookmark.getAttribute("aria-pressed")) === "true") {
      await bookmark.click();
      await expect(page.getByText("তালিকা থেকে সরানো হয়েছে।")).toBeVisible();
    }
    await expect(bookmark).toHaveAttribute("aria-pressed", "false");
    await bookmark.click();
    await expect(page.getByText("খেতে চাই তালিকায় রাখা হয়েছে।")).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("button", { name: "খেতে চাই তালিকায় রাখুন" }).first(),
    ).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "খেতে চাই তালিকায় রাখুন" }).first().click();
    await expect(page.getByText("তালিকা থেকে সরানো হয়েছে।")).toBeVisible();
  });
});
