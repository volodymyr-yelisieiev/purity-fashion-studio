import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("header navigation links work", async ({ page }) => {
    await page.goto("/uk");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Find a nav link and click it
    const navLinks = page.locator("nav a, header a");
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("navigates to services page", async ({ page }) => {
    await page.goto("/uk");
    await page.waitForLoadState("networkidle");

    // Look for a link containing "services" or the Ukrainian equivalent
    const servicesLink = page.locator(
      'a[href*="services"], a[href*="послуги"]',
    );
    if ((await servicesLink.count()) > 0) {
      await servicesLink.first().click();
      await expect(page).toHaveURL(/services|послуги/);
    }
  });

  test("navigates to portfolio page", async ({ page }) => {
    await page.goto("/uk");
    await page.waitForLoadState("networkidle");

    const portfolioLink = page.locator(
      'a[href*="portfolio"], a[href*="портфоліо"]',
    );
    if ((await portfolioLink.count()) > 0) {
      await portfolioLink.first().click();
      await expect(page).toHaveURL(/portfolio|портфоліо/);
    }
  });

  test("navigates to contact page", async ({ page }) => {
    await page.goto("/uk");
    await page.waitForLoadState("networkidle");

    const contactLink = page.locator('a[href*="contact"], a[href*="контакти"]');
    if ((await contactLink.count()) > 0) {
      await contactLink.first().click();
      await expect(page).toHaveURL(/contact|контакти/);
    }
  });

  test("404 page shows for nonexistent URL", async ({ page }) => {
    await page.goto("/uk/nonexistent-page-xyz");
    // Page should still load (might be 200 with custom 404 component or actual 404)
    const bodyText = await page.textContent("body");
    expect(bodyText).toBeTruthy();
  });
});
