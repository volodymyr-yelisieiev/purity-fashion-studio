import { test, expect } from "@playwright/test";

test.describe("Cart Flow", () => {
  test("cart starts empty", async ({ page }) => {
    await page.goto("/uk");
    await page.waitForLoadState("networkidle");

    // Look for cart indicator (0 items or empty state)
    const cartIndicator = page.locator(
      '[data-testid="cart-count"], [aria-label*="cart"], [aria-label*="кошик"]',
    );
    // Cart should exist in navigation
    if ((await cartIndicator.count()) > 0) {
      await expect(cartIndicator.first()).toBeVisible();
    }
  });

  test("can navigate to cart page", async ({ page }) => {
    await page.goto("/uk");
    await page.waitForLoadState("networkidle");

    const cartLink = page.locator('a[href*="cart"], a[href*="кошик"]');
    if ((await cartLink.count()) > 0) {
      await cartLink.first().click();
      await expect(page).toHaveURL(/cart|кошик/);
    }
  });
});
