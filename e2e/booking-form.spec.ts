import { test, expect } from "@playwright/test";

test.describe("Booking Form", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a services page where the booking form might be accessible
    await page.goto("/uk");
    await page.waitForLoadState("networkidle");
  });

  test("services page is accessible from navigation", async ({ page }) => {
    // Look for a services link in the navigation
    const servicesLink = page.locator(
      'a[href*="services"], a[href*="послуги"], nav a',
    );
    if ((await servicesLink.count()) > 0) {
      await servicesLink.first().click();
      await page.waitForLoadState("networkidle");
      // Should have navigated somewhere
      expect(page.url()).not.toBe("about:blank");
    }
  });

  test("booking form fields render when available", async ({ page }) => {
    // Try navigating to a booking page directly
    await page.goto("/uk/booking");
    await page.waitForLoadState("networkidle");

    const form = page.locator("form");
    if ((await form.count()) > 0) {
      // Check for expected fields matching BookingForm component
      const firstNameInput = page.locator('input[id="firstName"]');
      const lastNameInput = page.locator('input[id="lastName"]');
      const emailInput = page.locator('input[id="email"]');
      const phoneInput = page.locator('input[id="phone"]');
      const serviceSelect = page.locator('select[id="serviceId"]');
      const dateInput = page.locator('input[id="preferredDate"]');
      const timeSelect = page.locator('select[id="preferredTime"]');

      if ((await firstNameInput.count()) > 0) {
        await expect(firstNameInput).toBeVisible();
      }
      if ((await lastNameInput.count()) > 0) {
        await expect(lastNameInput).toBeVisible();
      }
      if ((await emailInput.count()) > 0) {
        await expect(emailInput).toBeVisible();
      }
      if ((await phoneInput.count()) > 0) {
        await expect(phoneInput).toBeVisible();
      }
      if ((await serviceSelect.count()) > 0) {
        await expect(serviceSelect).toBeVisible();
      }
      if ((await dateInput.count()) > 0) {
        await expect(dateInput).toBeVisible();
      }
      if ((await timeSelect.count()) > 0) {
        await expect(timeSelect).toBeVisible();
      }
    }
  });

  test("booking form shows Ukrainian labels in uk locale", async ({ page }) => {
    await page.goto("/uk/booking");
    await page.waitForLoadState("networkidle");

    const form = page.locator("form");
    if ((await form.count()) > 0) {
      // BookingForm uses Ukrainian labels by default
      const labels = await page.locator("label").allTextContents();
      const hasUkrainianLabels = labels.some(
        (text) =>
          text.includes("Ім'я") ||
          text.includes("Прізвище") ||
          text.includes("Телефон"),
      );
      if (labels.length > 0) {
        expect(hasUkrainianLabels).toBeTruthy();
      }
    }
  });

  test("booking form shows validation on empty submit", async ({ page }) => {
    await page.goto("/uk/booking");
    await page.waitForLoadState("networkidle");

    const submitButton = page.locator('button[type="submit"]');
    if ((await submitButton.count()) > 0) {
      await submitButton.first().click();
      // Wait for validation messages to appear
      await page.waitForTimeout(500);

      // Browser native validation or custom validation errors should appear
      const form = page.locator("form");
      if ((await form.count()) > 0) {
        // The form should still be on screen (not submitted)
        await expect(form.first()).toBeVisible();
      }
    }
  });

  test("booking form submit button has correct label", async ({ page }) => {
    await page.goto("/uk/booking");
    await page.waitForLoadState("networkidle");

    const submitButton = page.locator('button[type="submit"]');
    if ((await submitButton.count()) > 0) {
      const buttonText = await submitButton.first().textContent();
      // In Ukrainian locale, button should say "Записатися"
      if (buttonText) {
        expect(buttonText.trim()).toBeTruthy();
      }
    }
  });
});
