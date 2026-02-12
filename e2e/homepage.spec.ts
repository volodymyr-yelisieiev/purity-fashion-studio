import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and shows main content", async ({ page }) => {
    await page.goto("/");
    // Should redirect to default locale /uk
    await expect(page).toHaveURL(/\/(uk|en|ru)/);
  });

  test("has correct title", async ({ page }) => {
    await page.goto("/uk");
    await expect(page).toHaveTitle(/PURITY/i);
  });

  test("shows navigation", async ({ page }) => {
    await page.goto("/uk");
    const nav = page.locator("nav, header");
    await expect(nav.first()).toBeVisible();
  });

  test("shows footer", async ({ page }) => {
    await page.goto("/uk");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });
});
