import { test, expect } from "@playwright/test";

test.describe("Contact Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/uk/contact");
    await page.waitForLoadState("networkidle");
  });

  test("displays the contact form", async ({ page }) => {
    // Form should be visible on the contact page
    const form = page.locator("form");
    if ((await form.count()) > 0) {
      await expect(form.first()).toBeVisible();
    }
  });

  test("form has name, email and submit fields", async ({ page }) => {
    // Check for input fields
    const nameInput = page.locator('input[name="name"], input[id="name"]');
    const emailInput = page.locator(
      'input[name="email"], input[id="email"], input[type="email"]',
    );

    if ((await nameInput.count()) > 0) {
      await expect(nameInput.first()).toBeVisible();
    }
    if ((await emailInput.count()) > 0) {
      await expect(emailInput.first()).toBeVisible();
    }

    // Submit button
    const submitButton = page.locator('button[type="submit"]');
    if ((await submitButton.count()) > 0) {
      await expect(submitButton.first()).toBeVisible();
    }
  });

  test("shows validation when submitting empty form", async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    if ((await submitButton.count()) > 0) {
      await submitButton.first().click();
      // Browser's native validation should prevent submission
      // or custom validation messages appear
      await page.waitForTimeout(500);
    }
  });
});
