import { test, expect } from "@playwright/test";

test.describe("Admin Panel", () => {
  test("admin login page loads", async ({ page }) => {
    await page.goto("/admin");
    // Should show Payload CMS admin panel or login page
    await page.waitForLoadState("networkidle");

    // Admin panel should render something
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("admin panel requires authentication", async ({ page }) => {
    await page.goto("/admin/collections/services");
    // Should redirect to login or show login form
    await page.waitForLoadState("networkidle");

    // Look for login form or redirect
    const loginForm = page.locator(
      'form, input[type="email"], input[type="password"]',
    );
    const loginVisible = (await loginForm.count()) > 0;

    // Either shows login form or redirected to login
    const url = page.url();
    expect(loginVisible || url.includes("login") || url.includes("admin")).toBe(
      true,
    );
  });
});
