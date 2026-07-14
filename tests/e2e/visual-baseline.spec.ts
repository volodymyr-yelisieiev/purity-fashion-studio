import { expect, test } from "@playwright/test"

test.describe("canonical visual baselines", () => {
  test("home light mobile baseline stays approved", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" })
    await page.setViewportSize({ width: 320, height: 844 })
    await page.goto("/en", { waitUntil: "domcontentloaded" })
    await expect(page.locator("main h1").first()).toBeVisible()

    await expect(page).toHaveScreenshot("home-light-mobile.png", {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.04,
    })
  })

  test("home light desktop baseline stays approved", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" })
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto("/en", { waitUntil: "domcontentloaded" })
    await expect(page.locator("main h1").first()).toBeVisible()
    await expect(page.locator("html")).not.toHaveClass(/dark/)

    await expect(page).toHaveScreenshot("home-light-desktop.png", {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.02,
    })
  })
})
