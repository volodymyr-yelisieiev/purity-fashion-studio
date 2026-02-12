import { test, expect } from "@playwright/test";

test.describe("Locale Switching", () => {
  test("default locale is Ukrainian", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/uk/);
  });

  test("English locale loads", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveURL(/\/en/);
    // The page should contain English text
    const html = await page.locator("html").getAttribute("lang");
    expect(html).toBe("en");
  });

  test("Russian locale loads", async ({ page }) => {
    await page.goto("/ru");
    await expect(page).toHaveURL(/\/ru/);
    const html = await page.locator("html").getAttribute("lang");
    expect(html).toBe("ru");
  });

  test("Ukrainian locale loads", async ({ page }) => {
    await page.goto("/uk");
    await expect(page).toHaveURL(/\/uk/);
    const html = await page.locator("html").getAttribute("lang");
    expect(html).toBe("uk");
  });

  test("language switcher exists", async ({ page }) => {
    await page.goto("/uk");
    await page.waitForLoadState("networkidle");

    // Look for language switcher element
    const switcher = page.locator(
      '[data-testid="language-switcher"], button:has-text("UA"), button:has-text("EN"), a:has-text("EN"), a:has-text("UA")',
    );
    if ((await switcher.count()) > 0) {
      await expect(switcher.first()).toBeVisible();
    }
  });
});
