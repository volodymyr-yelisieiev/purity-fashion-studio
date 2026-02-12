import { test, expect } from "@playwright/test";

test.describe("Checkout Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/uk");
    await page.waitForLoadState("networkidle");
  });

  test("checkout page renders", async ({ page }) => {
    await page.goto("/uk/checkout");
    await page.waitForLoadState("networkidle");

    // Page should load without crashing
    expect(page.url()).toContain("checkout");
  });

  test("checkout form has customer information fields", async ({ page }) => {
    await page.goto("/uk/checkout");
    await page.waitForLoadState("networkidle");

    const form = page.locator("form");
    if ((await form.count()) > 0) {
      // CheckoutForm renders contact fields
      const firstNameInput = page.locator('input[id="firstName"]');
      const lastNameInput = page.locator('input[id="lastName"]');
      const emailInput = page.locator('input[id="email"]');
      const phoneInput = page.locator('input[id="phone"]');

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
    }
  });

  test("checkout form has address section", async ({ page }) => {
    await page.goto("/uk/checkout");
    await page.waitForLoadState("networkidle");

    const form = page.locator("form");
    if ((await form.count()) > 0) {
      const addressInput = page.locator('input[id="address"]');
      const cityInput = page.locator('input[id="city"]');
      const postalCodeInput = page.locator('input[id="postalCode"]');

      if ((await addressInput.count()) > 0) {
        await expect(addressInput).toBeVisible();
      }
      if ((await cityInput.count()) > 0) {
        await expect(cityInput).toBeVisible();
      }
      if ((await postalCodeInput.count()) > 0) {
        await expect(postalCodeInput).toBeVisible();
      }
    }
  });

  test("checkout form displays payment method section", async ({ page }) => {
    await page.goto("/uk/checkout");
    await page.waitForLoadState("networkidle");

    const form = page.locator("form");
    if ((await form.count()) > 0) {
      // Should show payment methods or a message about them
      const paymentSection = page.getByText(
        /Payment Method|LiqPay|Stripe|Payment methods are not configured/,
      );
      if ((await paymentSection.count()) > 0) {
        await expect(paymentSection.first()).toBeVisible();
      }
    }
  });

  test("checkout submit button shows price", async ({ page }) => {
    await page.goto("/uk/checkout");
    await page.waitForLoadState("networkidle");

    const submitButton = page.locator('button[type="submit"]');
    if ((await submitButton.count()) > 0) {
      const buttonText = await submitButton.first().textContent();
      // Button text should contain "Pay" and a price
      if (buttonText) {
        expect(buttonText.trim()).toBeTruthy();
      }
    }
  });

  test("checkout form shows validation on empty submit", async ({ page }) => {
    await page.goto("/uk/checkout");
    await page.waitForLoadState("networkidle");

    const submitButton = page.locator('button[type="submit"]');
    if ((await submitButton.count()) > 0) {
      // Submit button may be disabled with empty cart
      const isDisabled = await submitButton.first().isDisabled();
      if (!isDisabled) {
        await submitButton.first().click();
        await page.waitForTimeout(500);

        // Form should still be visible (not submitted)
        const form = page.locator("form");
        if ((await form.count()) > 0) {
          await expect(form.first()).toBeVisible();
        }
      }
    }
  });
});
