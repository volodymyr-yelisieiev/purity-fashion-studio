import { expect, test } from "@playwright/test"

test.describe("canonical visual baselines", () => {
  test("home light mobile baseline stays approved", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "light"))
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

  test("home dark desktop baseline stays approved", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"))
    await page.emulateMedia({ colorScheme: "dark" })
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto("/en", { waitUntil: "domcontentloaded" })
    await expect(page.locator("main h1").first()).toBeVisible()
    await expect(page.locator("html")).toHaveClass(/dark/)

    await expect(page).toHaveScreenshot("home-dark-desktop.png", {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.02,
    })
  })
})
