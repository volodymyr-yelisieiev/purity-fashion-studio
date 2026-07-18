import { expect, test } from "@playwright/test"

import { getManifestRoutes } from "../../payload/seed/manifest"

const colorSchemes = ["light"] as const

const criticalRoutes = [
  "/uk",
  "/uk/studio",
  "/uk/services/atelier-service",
  "/uk/booking?service=atelier-service",
  "/uk/contacts",
  "/uk/payment/success?provider=stripe&order=purity-test",
]

const pageTicketRoutes = [
  "/uk",
  "/uk/stylist",
  "/uk/shopping",
  "/uk/atelier",
  "/uk/wardrobe",
  "/uk/corporate",
  "/uk/school",
  "/uk/collections",
  "/uk/studio",
  "/uk/privacy",
  "/uk/services/atelier-service",
  "/uk/courses/wardrobe-management-course",
  "/uk/collections/purity-capsule",
  "/uk/portfolio",
  "/uk/contacts",
  "/uk/booking?service=atelier-service",
  "/uk/payment/success?provider=stripe&order=purity-responsive",
  "/uk/payment/cancel",
  "/uk/payment/failure",
  "/uk/styleguide",
]

const utilityRoutes = new Set([
  "/uk/privacy",
  "/uk/terms",
  "/uk/payment/success?provider=stripe&order=purity-responsive",
  "/uk/payment/cancel",
  "/uk/payment/failure",
  "/uk/styleguide",
])

test("Payload admin renders the first-owner bootstrap", async ({ page }) => {
  const response = await page.goto("/admin/create-first-user", {
    waitUntil: "domcontentloaded",
  })

  expect(response?.ok()).toBe(true)
  await expect(page.getByRole("heading", { name: "Welcome" })).toBeVisible()
  await expect(
    page.getByText("To begin, create your first user.")
  ).toBeVisible()
  await expect(page.locator('input[name="email"]')).toBeVisible()
  await expect(page.locator('input[name="password"]')).toBeVisible()
})

test("single theme ignores OS and persisted dark preferences", async ({
  browser,
}) => {
  const context = await browser.newContext({ colorScheme: "dark" })
  const page = await context.newPage()
  const errors: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`)
    }
  })
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`))

  for (const locale of ["uk", "ru", "en"] as const) {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"))
    await page.goto(`/${locale}`, { waitUntil: "domcontentloaded" })
    await expect(page.locator("main h1").first()).toBeVisible()
    await expect(page.locator("script#purity-theme-init")).toHaveCount(0)
    await expect
      .poll(() =>
        page.locator("html").evaluate((html) => html.classList.contains("dark"))
      )
      .toBe(false)

    await page.locator(`a[href="/${locale}/studio"]`).first().click()
    await page.waitForURL(`**/${locale}/studio`)
    await expect
      .poll(() =>
        page.locator("html").evaluate((html) => html.classList.contains("dark"))
      )
      .toBe(false)
  }

  expect(errors).toEqual([])
  await context.close()
})

test("editorial shell keeps full-screen heroes and canonical control geometry", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1386, height: 870 })
  await page.goto("/uk", { waitUntil: "domcontentloaded" })

  const shellMetrics = await page.evaluate(() => {
    const hero = document.querySelector<HTMLElement>(
      '[data-testid="editorial-hero"]'
    )
    const header = document.querySelector<HTMLElement>("header")
    const logo = header?.querySelector<HTMLElement>("a")
    const navigation = header?.querySelector<HTMLElement>(
      '[data-testid="desktop-navigation"]'
    )
    const utilities = header?.querySelector<HTMLElement>(
      '[data-testid="header-utilities"]'
    )
    const h1 = hero?.querySelector<HTMLElement>("h1")
    const rect = (element?: HTMLElement | null) =>
      element?.getBoundingClientRect() ?? null

    return {
      hero: rect(hero),
      heroMinHeight: hero ? getComputedStyle(hero).minHeight : "",
      header: rect(header),
      logo: rect(logo),
      navigation: rect(navigation),
      utilities: rect(utilities),
      h1OverflowWrap: h1 ? getComputedStyle(h1).overflowWrap : "",
      h1WordBreak: h1 ? getComputedStyle(h1).wordBreak : "",
    }
  })

  expect(shellMetrics.hero?.height).toBe(870)
  expect(shellMetrics.heroMinHeight).toBe("870px")
  expect(shellMetrics.header?.width).toBe(1386)
  expect(shellMetrics.logo?.right).toBeLessThan(
    shellMetrics.navigation?.left ?? 0
  )
  expect(shellMetrics.navigation?.right).toBeLessThan(
    shellMetrics.utilities?.left ?? 0
  )
  expect(shellMetrics.h1OverflowWrap).toBe("normal")
  expect(shellMetrics.h1WordBreak).toBe("normal")

  await page.goto("/uk/collections", { waitUntil: "domcontentloaded" })
  const collectionCard = page.locator('main [data-slot="card"]').first()
  const cardCount = await page.locator('main [data-slot="card"]').count()
  expect(cardCount).toBeGreaterThan(0)
  const flushMetrics = await collectionCard.evaluate((card) => {
    const image = card.querySelector("img")
    const cardRect = card.getBoundingClientRect()
    const imageContainerRect = image?.parentElement?.getBoundingClientRect()

    return {
      top: imageContainerRect?.top ?? Number.NaN,
      left: imageContainerRect?.left ?? Number.NaN,
      right: imageContainerRect?.right ?? Number.NaN,
      cardTop: cardRect.top,
      cardLeft: cardRect.left,
      cardRight: cardRect.right,
    }
  })
  expect(flushMetrics.top).toBeCloseTo(flushMetrics.cardTop, 0)
  expect(flushMetrics.left).toBeCloseTo(flushMetrics.cardLeft, 0)
  expect(flushMetrics.right).toBeCloseTo(flushMetrics.cardRight, 0)

  await page.goto("/uk/booking", { waitUntil: "domcontentloaded" })
  const checkedLabel = page.locator(
    '[data-slot="field-label"]:has([data-slot="radio-group-item"][data-checked])'
  )
  expect(await checkedLabel.count()).toBeGreaterThan(0)
  const selectedBackgrounds = await checkedLabel
    .all()
    .then((labels) =>
      Promise.all(
        labels.map((label) =>
          label.evaluate((element) => getComputedStyle(element).backgroundColor)
        )
      )
    )
  expect(
    selectedBackgrounds.every((value) => value === "rgba(0, 0, 0, 0)")
  ).toBe(true)
})

test("typography stays distinct and contained across the locale viewport matrix", async ({
  page,
}) => {
  const widths = [320, 375, 768, 1024, 1440, 1920]
  const errors: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`)
    }
  })
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`))

  for (const locale of ["uk", "ru", "en"] as const) {
    for (const colorScheme of colorSchemes) {
      await page.emulateMedia({ colorScheme })

      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(`/${locale}`, { waitUntil: "domcontentloaded" })
        await page.locator("main h1").waitFor()

        const metrics = await page.evaluate(() => ({
          bodyFontFamily: window.getComputedStyle(document.body).fontFamily,
          headingFontFamily: window.getComputedStyle(
            document.querySelector("main h1") ?? document.body
          ).fontFamily,
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          fontsReady:
            document.fonts.check('16px "Noto Sans"') &&
            document.fonts.check('32px "Noto Serif"'),
        }))

        expect(metrics.bodyFontFamily).toContain("Noto Sans")
        expect(metrics.headingFontFamily).toContain("Noto Serif")
        expect(metrics.bodyFontFamily).not.toBe(metrics.headingFontFamily)
        expect(metrics.fontsReady).toBe(true)
        expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1)
      }
    }
  }

  expect(errors).toEqual([])
})

test("single-theme semantic tokens stay stable across locales and widths", async ({
  page,
}) => {
  test.setTimeout(180_000)

  const widths = [320, 375, 768, 1024, 1440, 1920]
  const routes = [
    "/",
    "/corporate",
    "/services/wardrobe-transformation",
    "/services/corporate-image",
    "/styleguide",
  ]
  const errors: string[] = []
  const themeSnapshots = new Map<string, Set<string>>()

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`)
    }
  })
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`))

  for (const locale of ["uk", "ru", "en"] as const) {
    for (const colorScheme of colorSchemes) {
      await page.emulateMedia({ colorScheme })

      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 })
        for (const route of routes) {
          await page.goto(`/${locale}${route}`, {
            waitUntil: "domcontentloaded",
          })
          await page.locator("main h1").waitFor()
          await expect
            .poll(() =>
              page.evaluate(
                () => getComputedStyle(document.documentElement).colorScheme
              )
            )
            .toBe(colorScheme)

          const metrics = await page.evaluate(() => {
            const cta = document.querySelector<HTMLElement>(
              'main a[class*="group/button"], main button[data-slot="button"]'
            )
            const bodyStyle = window.getComputedStyle(document.body)
            const ctaStyle = cta ? window.getComputedStyle(cta) : null

            return {
              bodyBackground: bodyStyle.backgroundColor,
              bodyColor: bodyStyle.color,
              ctaBackground: ctaStyle?.backgroundColor ?? "",
              ctaColor: ctaStyle?.color ?? "",
              ring: getComputedStyle(document.documentElement)
                .getPropertyValue("--ring")
                .trim(),
              dark: document.documentElement.classList.contains("dark"),
              colorScheme: getComputedStyle(document.documentElement)
                .colorScheme,
              clientWidth: document.documentElement.clientWidth,
              scrollWidth: document.documentElement.scrollWidth,
            }
          })

          expect(metrics.dark).toBe(false)
          expect(metrics.colorScheme).toBe(colorScheme)
          expect(metrics.bodyBackground).not.toBe(metrics.bodyColor)
          expect(metrics.ctaBackground).not.toBe(metrics.ctaColor)
          expect(metrics.ring).not.toBe("")
          expect(metrics.scrollWidth).toBeLessThanOrEqual(
            metrics.clientWidth + 1
          )

          const key = `${locale}:${colorScheme}`
          const values = themeSnapshots.get(key) ?? new Set<string>()
          values.add(`${metrics.bodyBackground}|${metrics.bodyColor}`)
          themeSnapshots.set(key, values)
        }
      }
    }
  }

  for (const values of themeSnapshots.values()) {
    expect(values.size).toBe(1)
  }

  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/uk", { waitUntil: "domcontentloaded" })
  const reducedMotion = await page
    .locator("main a")
    .first()
    .evaluate((element) => {
      const style = window.getComputedStyle(element)
      return {
        transitionDuration: style.transitionDuration,
        animationDuration: style.animationDuration,
      }
    })
  expect(Number.parseFloat(reducedMotion.transitionDuration)).toBeLessThan(
    0.001
  )
  expect(Number.parseFloat(reducedMotion.animationDuration)).toBeLessThan(0.001)
  expect(errors).toEqual([])
})

test("public pages keep global landmarks and semantic theme tokens", async ({
  page,
}) => {
  test.setTimeout(180_000)

  const routes = [
    "/",
    "/studio",
    "/services/wardrobe-transformation",
    "/booking?service=atelier-service",
    "/payment/success?provider=stripe&order=purity-test",
  ]
  const widths = [320, 375, 768, 1024, 1440, 1920]

  for (const locale of ["uk", "ru", "en"] as const) {
    for (const colorScheme of colorSchemes) {
      await page.emulateMedia({ colorScheme })

      for (const width of widths) {
        await page.setViewportSize({ width, height: 844 })

        for (const route of routes) {
          await page.goto(`/${locale}${route}`, {
            waitUntil: "domcontentloaded",
          })

          const metrics = await page.evaluate(() => {
            const rootStyle = getComputedStyle(document.documentElement)
            const semanticTokens = [
              "--background",
              "--foreground",
              "--muted",
              "--muted-foreground",
              "--primary",
              "--primary-foreground",
            ]

            return {
              mainCount: document.querySelectorAll("main").length,
              headerCount: document.querySelectorAll("header").length,
              footerCount: document.querySelectorAll("footer").length,
              headerInsideMain: Boolean(document.querySelector("main header")),
              footerInsideMain: Boolean(document.querySelector("main footer")),
              semanticTokensPresent: semanticTokens.every((token) =>
                rootStyle.getPropertyValue(token).trim()
              ),
            }
          })

          expect(
            metrics.mainCount,
            `${locale} ${colorScheme} ${width} ${route}`
          ).toBe(1)
          expect(
            metrics.headerCount,
            `${locale} ${colorScheme} ${width} ${route}`
          ).toBe(1)
          expect(
            metrics.footerCount,
            `${locale} ${colorScheme} ${width} ${route}`
          ).toBe(1)
          expect(
            metrics.headerInsideMain,
            `${locale} ${colorScheme} ${width} ${route}`
          ).toBe(false)
          expect(
            metrics.footerInsideMain,
            `${locale} ${colorScheme} ${width} ${route}`
          ).toBe(false)
          expect(
            metrics.semanticTokensPresent,
            `${locale} ${colorScheme} ${width} ${route}`
          ).toBe(true)
        }
      }
    }
  }
})

test("dialog and sheet close controls keep localized accessible names", async ({
  page,
}) => {
  const labels = {
    uk: { dialog: "Діалог", sheet: "Панель", close: "Закрити" },
    ru: { dialog: "Диалог", sheet: "Панель", close: "Закрыть" },
    en: { dialog: "Dialog", sheet: "Sheet", close: "Close" },
  } as const

  for (const locale of ["uk", "ru", "en"] as const) {
    await page.goto(`/${locale}/styleguide`, { waitUntil: "domcontentloaded" })
    await page.getByRole("button", { name: labels[locale].dialog }).click()
    await expect(
      page.getByRole("button", { name: labels[locale].close })
    ).toBeVisible()
    await page.getByRole("button", { name: labels[locale].close }).click()

    await page.getByRole("button", { name: labels[locale].sheet }).click()
    await expect(
      page.getByRole("button", { name: labels[locale].close })
    ).toBeVisible()
    await page.getByRole("button", { name: labels[locale].close }).click()
  }
})

test("styleguide exposes the primitive variant and state contract", async ({
  page,
}) => {
  const selectedLabels = {
    uk: "Студія",
    ru: "Студия",
    en: "Studio",
  } as const

  for (const locale of ["uk", "ru", "en"] as const) {
    await page.goto(`/${locale}/styleguide`, { waitUntil: "domcontentloaded" })
    await expect(
      page.locator(
        '[data-styleguide="primitive-components"] button[data-slot="button"]'
      )
    ).toHaveCount(17)
    await expect(
      page.locator('[data-styleguide="button-sizes"] button')
    ).toHaveCount(7)
    await expect(page.locator('[data-slot="alert"]')).toHaveCount(2)
    await expect(page.locator('input[aria-invalid="true"]')).toHaveCount(1)
    await expect(page.locator('[data-slot="input"]:disabled')).toHaveCount(1)
    await expect(page.locator("textarea:disabled")).toHaveCount(1)
    await expect(page.locator('[data-variant="line"]')).toHaveCount(1)
    await expect(page.locator('[data-slot="select-value"]').first()).toHaveText(
      selectedLabels[locale]
    )
    await expect(
      page.locator('[data-styleguide="select-small-disabled-invalid"]')
    ).toBeDisabled()
    await expect(page.locator('[data-styleguide="tabs-default"]')).toHaveCount(
      1
    )
    await expect(
      page.locator('[data-slot="card"][data-size="sm"]')
    ).toHaveCount(1)
  }
})

test("critical routes expose metadata and no broken first-party links", async ({
  page,
}) => {
  for (const route of criticalRoutes) {
    const response = await page.goto(route)

    expect(response?.ok(), route).toBe(true)
    expect(await page.title()).not.toBe("")
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/
    )
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /.+/
    )
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`${route.split("?")[0]}$`)
    )

    const brokenLinks = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLAnchorElement>("a[href]")]
        .map((link) => link.getAttribute("href") ?? "")
        .filter((href) => href.startsWith("/"))
        .filter((href) => !href.startsWith("/uk"))
        .filter((href) => !href.startsWith("/ru"))
        .filter((href) => !href.startsWith("/en"))
    )

    expect(brokenLinks).toEqual([])
  }
})

test("language switch keeps the booking path", async ({ page }) => {
  await page.goto("/uk/booking?service=atelier-service")

  await expect(
    page.locator('a[href="/ru/booking?service=atelier-service"]')
  ).not.toHaveCount(0)
  await expect(
    page.locator('a[href="/en/booking?service=atelier-service"]')
  ).not.toHaveCount(0)
})

test("header navigation keeps booking, locale, and mobile controls coherent", async ({
  page,
}) => {
  test.setTimeout(180_000)

  const widths = [320, 375, 768, 1024, 1440, 1920]
  const locales = ["uk", "ru", "en"] as const
  const closeLabels = { uk: "Закрити", ru: "Закрыть", en: "Close" } as const
  const errors: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`)
    }
  })
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`))

  for (const scheme of colorSchemes) {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto("/uk", { waitUntil: "domcontentloaded" })

    for (const locale of locales) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 844 })
        await page.goto(`/${locale}/booking?service=atelier-service`, {
          waitUntil: "domcontentloaded",
        })
        await expect
          .poll(() =>
            page
              .locator("html")
              .evaluate((html) => html.classList.contains("dark"))
          )
          .toBe(false)

        await expect(page.locator("header")).toBeVisible()
        await expect(
          page.locator('a[aria-current="page"]:visible').first()
        ).toHaveAttribute("href", `/${locale}/booking?service=atelier-service`)
        const pageWidth = await page.evaluate(() => ({
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
        }))
        expect(pageWidth.scrollWidth).toBeLessThanOrEqual(
          pageWidth.clientWidth + 1
        )
        const clippedElements = await page.evaluate(() => {
          const visible = (element: HTMLElement) => {
            const style = window.getComputedStyle(element)
            const rect = element.getBoundingClientRect()

            return (
              rect.width > 1 &&
              rect.height > 1 &&
              style.display !== "none" &&
              style.visibility !== "hidden"
            )
          }

          return [
            ...document.querySelectorAll<HTMLElement>("header, main, footer"),
          ]
            .flatMap((section) => [
              section,
              ...section.querySelectorAll<HTMLElement>("*"),
            ])
            .filter(visible)
            .filter((element) => {
              const rect = element.getBoundingClientRect()

              return rect.left < -1 || rect.right > window.innerWidth + 1
            })
            .slice(0, 5)
            .map((element) => element.textContent?.trim() || element.outerHTML)
        })
        expect(clippedElements).toEqual([])

        const menuTrigger = page.getByTestId("mobile-menu-trigger")
        const desktopCta = page.getByTestId("header-booking-cta")

        if (width < 1280) {
          await expect(menuTrigger).toBeVisible()
          await expect(menuTrigger).toHaveAttribute("data-interactive", "true")
          await expect(desktopCta).toBeHidden()
          const triggerBox = await menuTrigger.boundingBox()
          expect(triggerBox?.width).toBeGreaterThanOrEqual(44)
          expect(triggerBox?.height).toBeGreaterThanOrEqual(44)

          await menuTrigger.focus()
          await page.keyboard.press("Enter")
          const sheet = page.locator('[data-slot="sheet-content"]')
          await expect(sheet).toBeVisible()
          await expect(
            page.getByRole("button", { name: closeLabels[locale] })
          ).toBeVisible()
          await expect(
            page.getByTestId("mobile-navigation").locator("a")
          ).toHaveCount(8)
          await expect(page.getByTestId("mobile-booking-cta")).toHaveAttribute(
            "href",
            `/${locale}/booking`
          )
          const mobileCtaBox = await page
            .getByTestId("mobile-booking-cta")
            .boundingBox()
          expect(mobileCtaBox?.width).toBeGreaterThanOrEqual(44)
          expect(mobileCtaBox?.height).toBeGreaterThanOrEqual(44)

          await page.keyboard.press("Escape")
          await expect(sheet).toBeHidden()

          await menuTrigger.click()
          await expect(sheet).toBeVisible()
          await expect(menuTrigger).toHaveAttribute("aria-expanded", "true")
          await page.getByRole("button", { name: closeLabels[locale] }).click()
          await expect(sheet).toBeHidden()
        } else {
          await expect(menuTrigger).toBeHidden()
          await expect(desktopCta).toBeVisible()
          await expect(desktopCta).toHaveAttribute("href", `/${locale}/booking`)
          const ctaBox = await desktopCta.boundingBox()
          expect(ctaBox?.width).toBeGreaterThanOrEqual(44)
          expect(ctaBox?.height).toBeGreaterThanOrEqual(44)
        }
      }
    }
  }

  expect(errors).toEqual([])
})

test("footer actions keep source-backed contact facts and external affordances", async ({
  page,
}) => {
  test.setTimeout(180_000)

  const widths = [320, 375, 768, 1024, 1440, 1920]
  const locales = ["uk", "ru", "en"] as const
  const addressLabels = {
    uk: "Предславинська",
    ru: "Предславинская",
    en: "Predslavynska",
  } as const
  const externalLabels = {
    uk: "Відкривається в новій вкладці",
    ru: "Открывается в новой вкладке",
    en: "Opens in a new tab",
  } as const
  const errors: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`)
    }
  })
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`))

  for (const scheme of colorSchemes) {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto("/uk/contacts", { waitUntil: "domcontentloaded" })

    for (const locale of locales) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 844 })
        await page.goto(`/${locale}/contacts`, {
          waitUntil: "domcontentloaded",
        })
        await expect
          .poll(() =>
            page
              .locator("html")
              .evaluate((html) => html.classList.contains("dark"))
          )
          .toBe(false)

        const footer = page.locator("footer")
        await expect(footer).toContainText(addressLabels[locale])
        await expect(footer).toContainText("+38 067 656 19 12")
        await expect(footer).toContainText("voronina@purity-fashion.com")

        const footerBooking = page.getByTestId("footer-booking-cta")
        await expect(footerBooking).toHaveAttribute(
          "href",
          `/${locale}/booking`
        )
        await expect(footerBooking).toHaveClass(/bg-secondary/)

        const footerSocials = footer.getByTestId("footer-social-link")
        await expect(footerSocials).toHaveCount(4)
        for (let index = 0; index < 4; index += 1) {
          const social = footerSocials.nth(index)
          await expect(social).toHaveAttribute("target", "_blank")
          await expect(social).toHaveAttribute("rel", /noreferrer/)
          await expect(social).toHaveClass(/border-border/)
          await expect(social.locator("svg")).toHaveCount(1)
          await expect(social.locator(".sr-only")).toContainText(
            externalLabels[locale]
          )
        }

        const contactSocials = page.getByTestId("contact-social-link")
        await expect(contactSocials).toHaveCount(4)
        await expect(contactSocials.first().locator("svg")).toHaveCount(1)
        await expect(contactSocials.first().locator(".sr-only")).toContainText(
          externalLabels[locale]
        )
        const pageWidth = await page.evaluate(() => ({
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
        }))
        expect(pageWidth.scrollWidth).toBeLessThanOrEqual(
          pageWidth.clientWidth + 1
        )
      }
    }
  }

  expect(errors).toEqual([])
})

test("home hierarchy keeps editorial rhythm and a visible conversion path", async ({
  page,
}) => {
  test.setTimeout(180_000)

  const widths = [320, 375, 768, 1024, 1440, 1920]
  const locales = ["uk", "ru", "en"] as const
  const errors: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`)
    }
  })
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`))

  for (const scheme of colorSchemes) {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto("/uk", { waitUntil: "domcontentloaded" })

    for (const locale of locales) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 844 })
        await page.goto(`/${locale}`, { waitUntil: "domcontentloaded" })
        await expect(page.locator("main h1")).toHaveCount(1)
        await expect(page.locator("main [data-slot=accordion]")).toHaveCount(1)
        await expect(
          page.locator(`main a[href="/${locale}/booking"]`)
        ).not.toHaveCount(0)
        await expect(
          page.locator(`main a[href="/${locale}/stylist"]`)
        ).not.toHaveCount(0)
        expect(await page.locator("main h2").count()).toBeGreaterThanOrEqual(6)
        await expect(
          page.locator('[data-editorial-sequence="home-method"] article')
        ).toHaveCount(3)
        expect(
          await page.locator("main [data-slot=card]").count()
        ).toBeLessThanOrEqual(4)

        const metrics = await page.evaluate(() => {
          const visible = (element: HTMLElement) => {
            const style = window.getComputedStyle(element)
            const rect = element.getBoundingClientRect()

            return (
              rect.width > 1 &&
              rect.height > 1 &&
              style.display !== "none" &&
              style.visibility !== "hidden"
            )
          }
          const clipped = [
            ...document.querySelectorAll<HTMLElement>("main, main *"),
          ]
            .filter(visible)
            .filter((element) => {
              const rect = element.getBoundingClientRect()

              return rect.left < -1 || rect.right > innerWidth + 1
            })
            .slice(0, 5)
            .map((element) => element.textContent?.trim() || element.outerHTML)
          const firstViewportText = [
            ...document.querySelectorAll<HTMLElement>(
              "main h1, main h2, main p, main a, main button"
            ),
          ]
            .filter((element) => {
              if (!visible(element)) return false
              const rect = element.getBoundingClientRect()
              return rect.bottom > 0 && rect.top < innerHeight
            })
            .map((element) => element.innerText.trim())
            .join(" ")
            .replace(/\s+/g, " ")
            .trim()

          return {
            clipped,
            firstViewportTextLength: firstViewportText.length,
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            heroImages: document.querySelectorAll(
              '[data-testid="editorial-hero"] img'
            ).length,
          }
        })

        expect(metrics.clipped).toEqual([])
        expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1)
        expect(metrics.firstViewportTextLength).toBeGreaterThan(75)
        expect(metrics.heroImages).toBeGreaterThan(0)
      }
    }
  }

  expect(errors).toEqual([])
})

test("studio and legal pages keep route-specific hierarchy and scanning", async ({
  page,
}) => {
  test.setTimeout(180_000)

  const widths = [320, 375, 768, 1024, 1440, 1920]
  const locales = ["uk", "ru", "en"] as const
  const legalContents = {
    uk: "Зміст",
    ru: "Содержание",
    en: "Contents",
  } as const
  const errors: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`)
    }
  })
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`))

  for (const scheme of colorSchemes) {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto("/uk/studio", { waitUntil: "domcontentloaded" })

    for (const locale of locales) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 844 })

        for (const route of ["studio", "privacy", "terms"] as const) {
          await page.goto(`/${locale}/${route}`, {
            waitUntil: "domcontentloaded",
          })
          await expect(page.locator("main h1")).toHaveCount(1)
          await expect(page.locator("footer")).toBeVisible()

          if (route === "studio") {
            expect(
              await page.locator("main h2").count()
            ).toBeGreaterThanOrEqual(3)
            expect(
              await page.locator("main [data-slot=card]").count()
            ).toBeGreaterThan(8)
            await expect(
              page.locator(`main a[href="/${locale}/booking"]`)
            ).not.toHaveCount(0)
          } else {
            await expect(
              page.getByRole("heading", { name: legalContents[locale] })
            ).toBeVisible()
            await expect(page.locator('[id^="legal-section-"]')).toHaveCount(2)
            await expect(
              page.locator('a[href^="#legal-section-"]')
            ).toHaveCount(2)
            await expect(page.locator(".scroll-mt-24")).toHaveCount(2)
          }

          const metrics = await page.evaluate(() => {
            const visible = (element: HTMLElement) => {
              const style = window.getComputedStyle(element)
              const rect = element.getBoundingClientRect()

              return (
                rect.width > 1 &&
                rect.height > 1 &&
                style.display !== "none" &&
                style.visibility !== "hidden"
              )
            }
            const clipped = [
              ...document.querySelectorAll<HTMLElement>("main, main *"),
            ]
              .filter(visible)
              .filter((element) => {
                const rect = element.getBoundingClientRect()

                return rect.left < -1 || rect.right > innerWidth + 1
              })
              .slice(0, 5)
              .map(
                (element) => element.textContent?.trim() || element.outerHTML
              )

            return {
              clipped,
              scrollWidth: document.documentElement.scrollWidth,
              clientWidth: document.documentElement.clientWidth,
              textLength:
                document.querySelector("main")?.textContent?.length ?? 0,
            }
          })

          expect(metrics.clipped).toEqual([])
          expect(metrics.scrollWidth).toBeLessThanOrEqual(
            metrics.clientWidth + 1
          )
          expect(metrics.textLength).toBeGreaterThan(300)
        }
      }
    }
  }

  expect(errors).toEqual([])
})

test("category landings keep one content-specific layout contract", async ({
  page,
}) => {
  test.setTimeout(240_000)

  const widths = [320, 375, 768, 1024, 1440, 1920]
  const locales = ["uk", "ru", "en"] as const
  const routes = [
    "stylist",
    "shopping",
    "atelier",
    "wardrobe",
    "corporate",
    "school",
    "collections",
  ] as const
  const errors: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`)
    }
  })
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`))

  for (const scheme of colorSchemes) {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto("/uk/stylist", { waitUntil: "domcontentloaded" })

    for (const locale of locales) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 844 })

        for (const route of routes) {
          await page.goto(`/${locale}/${route}`, {
            waitUntil: "domcontentloaded",
          })
          await expect(page.locator("main h1")).toHaveCount(1)
          await expect(page.locator("footer")).toBeVisible()
          await expect(
            page.locator('main a[href*="/booking"]')
          ).not.toHaveCount(0)
          expect(await page.locator("main h2").count()).toBeGreaterThanOrEqual(
            2
          )
          expect(
            await page.locator("main [data-slot=card]").count()
          ).toBeGreaterThan(2)

          const metrics = await page.evaluate(() => {
            const visible = (element: HTMLElement) => {
              const style = window.getComputedStyle(element)
              const rect = element.getBoundingClientRect()

              return (
                rect.width > 1 &&
                rect.height > 1 &&
                style.display !== "none" &&
                style.visibility !== "hidden"
              )
            }
            const clipped = [
              ...document.querySelectorAll<HTMLElement>("main, main *"),
            ]
              .filter(visible)
              .filter((element) => {
                const rect = element.getBoundingClientRect()

                return rect.left < -1 || rect.right > innerWidth + 1
              })
              .slice(0, 5)
              .map(
                (element) => element.textContent?.trim() || element.outerHTML
              )

            return {
              clipped,
              scrollWidth: document.documentElement.scrollWidth,
              clientWidth: document.documentElement.clientWidth,
              textLength:
                document.querySelector("main")?.textContent?.length ?? 0,
            }
          })

          expect(metrics.clipped).toEqual([])
          expect(metrics.scrollWidth).toBeLessThanOrEqual(
            metrics.clientWidth + 1
          )
          expect(metrics.textLength).toBeGreaterThan(400)
        }
      }
    }
  }

  expect(errors).toEqual([])
})

test("detail routes keep canonical hero, status, process, and booking anatomy", async ({
  page,
}) => {
  test.setTimeout(300_000)

  const widths = [320, 375, 768, 1024, 1440, 1920]
  const locales = ["uk", "ru", "en"] as const
  const detailPaths = getManifestRoutes("uk")
    .filter((route) => ["service", "course", "collection"].includes(route.kind))
    .map((route) => route.path)
  const errors: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`)
    }
  })
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`))

  for (const scheme of colorSchemes) {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto("/uk/services/atelier-service", {
      waitUntil: "domcontentloaded",
    })

    for (const locale of locales) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 844 })

        for (const path of detailPaths) {
          await page.goto(`/${locale}${path}`, {
            waitUntil: "domcontentloaded",
          })
          await expect(page.locator("main h1")).toHaveCount(1)
          await expect(page.locator("footer")).toBeVisible()
          await expect(
            page.locator('main a[href*="/booking"]')
          ).not.toHaveCount(0)
          expect(
            await page.locator("main [data-slot=card]").count()
          ).toBeGreaterThan(0)

          if (path.startsWith("/courses/")) {
            await expect(
              page.locator('main [data-slot="accordion"]')
            ).toHaveCount(1)
          }
          if (path.startsWith("/collections/")) {
            expect(
              await page.locator("main figure img").count()
            ).toBeGreaterThan(0)
          }

          const metrics = await page.evaluate(() => {
            const visible = (element: HTMLElement) => {
              const style = window.getComputedStyle(element)
              const rect = element.getBoundingClientRect()

              return (
                rect.width > 1 &&
                rect.height > 1 &&
                style.display !== "none" &&
                style.visibility !== "hidden"
              )
            }
            const clipped = [
              ...document.querySelectorAll<HTMLElement>("main, main *"),
            ]
              .filter(visible)
              .filter((element) => {
                const rect = element.getBoundingClientRect()

                return rect.left < -1 || rect.right > innerWidth + 1
              })
              .slice(0, 5)
              .map(
                (element) => element.textContent?.trim() || element.outerHTML
              )

            return {
              clipped,
              scrollWidth: document.documentElement.scrollWidth,
              clientWidth: document.documentElement.clientWidth,
              textLength:
                document.querySelector("main")?.textContent?.length ?? 0,
            }
          })

          expect(metrics.clipped).toEqual([])
          expect(metrics.scrollWidth).toBeLessThanOrEqual(
            metrics.clientWidth + 1
          )
          expect(metrics.textLength).toBeGreaterThan(400)
        }
      }
    }
  }

  expect(errors).toEqual([])
})

test("school, collections, and portfolio indices expose honest catalog states", async ({
  page,
}) => {
  test.setTimeout(180_000)

  const widths = [320, 375, 768, 1024, 1440, 1920]
  const locales = ["uk", "ru", "en"] as const
  const errors: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`)
    }
  })
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`))

  for (const scheme of colorSchemes) {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto("/uk/portfolio", { waitUntil: "domcontentloaded" })

    for (const locale of locales) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 844 })

        for (const route of ["school", "collections", "portfolio"] as const) {
          await page.goto(`/${locale}/${route}`, {
            waitUntil: "domcontentloaded",
          })
          await expect(page.locator("main h1")).toHaveCount(1)
          await expect(
            page.locator('main a[href*="/booking"]')
          ).not.toHaveCount(0)
          expect(
            await page.locator("main [data-slot=card]").count()
          ).toBeGreaterThan(2)

          if (route === "portfolio") {
            await expect(
              page.getByTestId("portfolio-empty-state")
            ).toBeVisible()
            await expect(
              page.locator('main a[href*="/portfolio/"]')
            ).toHaveCount(0)
            await expect(
              page.getByTestId("portfolio-editorial-label")
            ).toContainText(
              locale === "uk"
                ? "не клієнтський кейс"
                : locale === "ru"
                  ? "не клиентский кейс"
                  : "not a client case"
            )
          }

          const metrics = await page.evaluate(() => {
            const visible = (element: HTMLElement) => {
              const style = window.getComputedStyle(element)
              const rect = element.getBoundingClientRect()

              return (
                rect.width > 1 &&
                rect.height > 1 &&
                style.display !== "none" &&
                style.visibility !== "hidden"
              )
            }
            const clipped = [
              ...document.querySelectorAll<HTMLElement>("main, main *"),
            ]
              .filter(visible)
              .filter((element) => {
                const rect = element.getBoundingClientRect()

                return rect.left < -1 || rect.right > innerWidth + 1
              })
              .slice(0, 5)
              .map(
                (element) => element.textContent?.trim() || element.outerHTML
              )

            return {
              clipped,
              scrollWidth: document.documentElement.scrollWidth,
              clientWidth: document.documentElement.clientWidth,
            }
          })

          expect(metrics.clipped).toEqual([])
          expect(metrics.scrollWidth).toBeLessThanOrEqual(
            metrics.clientWidth + 1
          )
        }
      }
    }
  }

  expect(errors).toEqual([])
})

test("page-ticket routes stay responsive across required widths", async ({
  page,
}) => {
  test.setTimeout(240_000)

  const viewports = [
    { name: "narrow", width: 320, height: 720 },
    { name: "mobile", width: 390, height: 844 },
    { name: "tablet-small", width: 768, height: 900 },
    { name: "tablet-review", width: 934, height: 979 },
    { name: "desktop-small", width: 1024, height: 900 },
    { name: "desktop", width: 1440, height: 1000 },
  ] as const

  for (const viewport of viewports) {
    await page.setViewportSize(viewport)

    for (const route of pageTicketRoutes) {
      const isUtilityRoute = utilityRoutes.has(route)
      const isPaymentRoute = route.includes("/payment/")
      const isEditorialHome = route === "/uk"
      const isStyleguide = route === "/uk/styleguide"
      const response = await page.goto(route, { waitUntil: "domcontentloaded" })

      expect(response?.ok(), `${viewport.name} ${route}`).toBe(true)
      await expect(page.locator("header img").first()).toBeVisible()
      await expect(page.locator("main h1").first()).toBeVisible()
      if (!isUtilityRoute) {
        const heroImage = page.getByTestId("editorial-hero").locator("img")
        await expect(heroImage).toBeVisible()
        await heroImage.scrollIntoViewIfNeeded()
        await expect
          .poll(
            () =>
              heroImage.evaluate((element) => {
                const image = element as HTMLImageElement

                return image.complete && image.naturalWidth > 0
              }),
            { timeout: 15_000 }
          )
          .toBe(true)
      }
      await expect(page.locator("footer")).toContainText("Предславинська 44")
      await expect(page.locator("footer")).toContainText("+38 067 656 19 12")
      await expect(page.locator("footer")).toContainText(
        "voronina@purity-fashion.com"
      )

      const metrics = await page.evaluate(() => {
        const visible = (element: Element) => {
          const rect = element.getBoundingClientRect()
          const style = window.getComputedStyle(element)

          return (
            rect.width > 1 &&
            rect.height > 1 &&
            style.visibility !== "hidden" &&
            style.display !== "none"
          )
        }
        const textLength = (element: Element | null | undefined) =>
          element?.textContent?.replace(/\s+/g, " ").trim().length ?? 0
        const isTransparentBorder = (color: string) =>
          color === "transparent" || /^rgba\(.+,\s*0\)$/.test(color)
        const header = document.querySelector("header")
        const hero = document.querySelector<HTMLElement>(
          '[data-testid="editorial-hero"]'
        )
        const headerLogo = header?.querySelector<HTMLImageElement>("img")
        const headerLogoBox = headerLogo?.getBoundingClientRect()
        const headerControls = header?.querySelector<HTMLElement>(
          '[data-testid="header-utilities"]'
        )
        const headerControlsBox = headerControls?.getBoundingClientRect()
        const editorialButtons = [
          ...document.querySelectorAll<HTMLElement>(
            "main a, main button, footer a, footer button"
          ),
        ].filter((element) => {
          const className = element.getAttribute("class") ?? ""

          return (
            visible(element) &&
            className.includes("group/button") &&
            (className.includes("border-border") ||
              className.includes("border-primary-foreground"))
          )
        })
        const editorialButtonBorderIssues = editorialButtons
          .filter((element) => {
            const style = window.getComputedStyle(element)

            return (
              Number.parseFloat(style.borderTopWidth) < 1 ||
              isTransparentBorder(style.borderTopColor)
            )
          })
          .map((element) => element.textContent?.trim() || element.outerHTML)
        const clippedElements = [
          ...document.querySelectorAll<HTMLElement>("main *"),
        ]
          .filter(visible)
          .filter((element) => {
            const rect = element.getBoundingClientRect()

            return rect.left < -1 || rect.right > innerWidth + 1
          })
          .slice(0, 10)
          .map((element) => element.textContent?.trim() || element.outerHTML)
        const primaryTargets = [
          ...document.querySelectorAll<HTMLElement>(
            'header a, header button, footer a, footer button, main a[class*="group/button"], main button[data-slot="button"]'
          ),
        ].filter(visible)
        const smallPrimaryTargets = primaryTargets
          .filter((element) => {
            const rect = element.getBoundingClientRect()

            return rect.width < 44 || rect.height < 44
          })
          .slice(0, 10)
          .map((element) => {
            const rect = element.getBoundingClientRect()

            return `${element.textContent?.trim() || element.getAttribute("aria-label") || element.tagName} ${rect.width.toFixed(1)}x${rect.height.toFixed(1)}`
          })
        const figureGaps = [
          ...document.querySelectorAll<HTMLElement>("main figure"),
        ]
          .filter(visible)
          .map((figure) => {
            const image = figure.querySelector<HTMLImageElement>("img")

            if (!image || !visible(image)) {
              return null
            }

            const figureRect = figure.getBoundingClientRect()
            const imageRect = image.getBoundingClientRect()

            return {
              alt: image.alt,
              widthGap: Math.abs(figureRect.width - imageRect.width),
              heightGap: Math.abs(figureRect.height - imageRect.height),
            }
          })
          .filter((gap): gap is NonNullable<typeof gap> =>
            Boolean(gap && (gap.widthGap > 2 || gap.heightGap > 2))
          )
        const cardGridIssues: string[] = []

        for (const [gridIndex, grid] of [
          ...document.querySelectorAll<HTMLElement>("main .grid"),
        ].entries()) {
          const columns = window
            .getComputedStyle(grid)
            .gridTemplateColumns.split(" ")
            .filter((track) => track && track !== "none")

          if (columns.length < 2) {
            continue
          }

          const cards = [
            ...grid.querySelectorAll<HTMLElement>("[data-slot='card']"),
          ].filter(visible)

          if (cards.length < 2) {
            continue
          }

          const rows: HTMLElement[][] = []

          for (const card of cards) {
            const cardTop = card.getBoundingClientRect().top
            let row = rows.find(
              (candidate) =>
                Math.abs(candidate[0].getBoundingClientRect().top - cardTop) <=
                2
            )

            if (!row) {
              row = []
              rows.push(row)
            }

            row.push(card)
          }

          for (const row of rows.filter((candidate) => candidate.length > 1)) {
            const heights = row.map(
              (card) => card.getBoundingClientRect().height
            )
            const heightDelta = Math.max(...heights) - Math.min(...heights)

            if (heightDelta > 3) {
              cardGridIssues.push(
                `grid ${gridIndex} row delta ${heightDelta.toFixed(1)}`
              )
            }
          }
        }

        return {
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          mainTextLength: textLength(document.querySelector("main")),
          bodyFontFamily: window.getComputedStyle(document.body).fontFamily,
          headingFontFamily: window.getComputedStyle(
            document.querySelector("main h1") ?? document.body
          ).fontFamily,
          headerLogoSrc: headerLogo?.getAttribute("src") ?? "",
          headerLogoTransform: headerLogo
            ? window.getComputedStyle(headerLogo).transform
            : "",
          headerLogoCenterY: headerLogoBox
            ? headerLogoBox.top + headerLogoBox.height / 2
            : null,
          headerControlsCenterY: headerControlsBox
            ? headerControlsBox.top + headerControlsBox.height / 2
            : null,
          contentCards: document.querySelectorAll("main [data-slot='card']")
            .length,
          cardGridIssues,
          clippedElements,
          smallPrimaryTargets,
          figureGaps,
          visibleH1: [...document.querySelectorAll("main h1")].filter(visible)
            .length,
          editorialButtonCount: editorialButtons.length,
          editorialButtonBorderIssues,
          footerLinks: document.querySelectorAll("footer a[href]").length,
          footerTextLength: textLength(document.querySelector("footer")),
          footerPhones: document.querySelectorAll("footer a[href^='tel:']")
            .length,
          footerEmail: document.querySelectorAll("footer a[href^='mailto:']")
            .length,
          footerViber: document.querySelectorAll("footer a[href^='viber:']")
            .length,
          footerSocials: document.querySelectorAll("footer a[target='_blank']")
            .length,
          heroMinHeight: hero ? getComputedStyle(hero).minHeight : "",
          loadedHeroImages: [
            ...document.querySelectorAll<HTMLImageElement>(
              '[data-testid="editorial-hero"] img'
            ),
          ].filter((image) => visible(image) && image.naturalWidth > 0).length,
        }
      })
      const screenshot = await page.screenshot()

      expect(
        metrics.scrollWidth,
        `${viewport.name} ${route}`
      ).toBeLessThanOrEqual(metrics.clientWidth + 1)
      expect(metrics.bodyFontFamily, `${viewport.name} ${route}`).toMatch(
        /Noto Sans/
      )
      expect(metrics.headingFontFamily, `${viewport.name} ${route}`).toMatch(
        /Noto Serif/
      )
      expect(metrics.headerLogoSrc, `${viewport.name} ${route}`).toContain(
        isStyleguide ? "wordmark-black.png" : "wordmark-white.png"
      )
      expect(metrics.headerLogoTransform, `${viewport.name} ${route}`).toBe(
        "none"
      )
      if (viewport.width >= 1280) {
        expect(
          Math.abs(
            (metrics.headerLogoCenterY ?? 0) -
              (metrics.headerControlsCenterY ?? 0)
          ),
          `${viewport.name} ${route}`
        ).toBeLessThanOrEqual(6)
      }
      expect(
        metrics.loadedHeroImages,
        `${viewport.name} ${route}`
      ).toBeGreaterThanOrEqual(isUtilityRoute ? 0 : 1)
      if (!isUtilityRoute) {
        expect(
          Number.parseFloat(metrics.heroMinHeight),
          `${viewport.name} ${route}`
        ).toBe(viewport.height)
      }
      expect(
        metrics.mainTextLength,
        `${viewport.name} ${route}`
      ).toBeGreaterThan(isPaymentRoute ? 120 : isUtilityRoute ? 450 : 600)
      if (!isPaymentRoute && !isEditorialHome && !isUtilityRoute) {
        expect(
          metrics.contentCards,
          `${viewport.name} ${route}`
        ).toBeGreaterThan(0)
      }
      if (isEditorialHome) {
        await expect(
          page.locator('[data-editorial-sequence="home-method"] article')
        ).toHaveCount(3)
      }
      expect(metrics.cardGridIssues, `${viewport.name} ${route}`).toEqual([])
      expect(metrics.clippedElements, `${viewport.name} ${route}`).toEqual([])
      expect(metrics.figureGaps, `${viewport.name} ${route}`).toEqual([])
      expect(metrics.visibleH1, `${viewport.name} ${route}`).toBe(1)
      if (!isStyleguide) {
        expect(
          metrics.smallPrimaryTargets,
          `${viewport.name} ${route}`
        ).toEqual([])
      }
      expect(
        metrics.editorialButtonCount,
        `${viewport.name} ${route}`
      ).toBeGreaterThan(0)
      expect(
        metrics.editorialButtonBorderIssues,
        `${viewport.name} ${route}`
      ).toEqual([])
      expect(metrics.footerLinks, `${viewport.name} ${route}`).toBeGreaterThan(
        12
      )
      expect(
        metrics.footerTextLength,
        `${viewport.name} ${route}`
      ).toBeGreaterThan(300)
      expect(metrics.footerPhones, `${viewport.name} ${route}`).toBe(2)
      expect(metrics.footerEmail, `${viewport.name} ${route}`).toBe(1)
      expect(metrics.footerViber, `${viewport.name} ${route}`).toBe(1)
      expect(metrics.footerSocials, `${viewport.name} ${route}`).toBe(4)
      expect(screenshot.length, `${viewport.name} ${route}`).toBeGreaterThan(
        15_000
      )
    }
  }
})

test("booking form validates and records inquiry-only requests", async ({
  page,
}) => {
  await page.goto("/uk/services/atelier-service")
  const bookingHref = "/uk/booking?service=atelier-service"
  const serviceBookingCta = page.locator(`main a[href="${bookingHref}"]`)
  await expect(serviceBookingCta).toHaveCount(1)
  await serviceBookingCta.click()
  await expect(page).toHaveURL(/\/uk\/booking\?service=atelier-service$/)
  await expect(page.getByTestId("booking-service-trigger")).toContainText(
    "Ательє-сервіс"
  )
  await expect(page.getByText("Заповніть поле.")).toHaveCount(0)

  await page.getByTestId("booking-submit").click()
  await expect(page.getByText("Перевірте поля")).toBeVisible()
  await expect(page.getByText("Вкажіть коректний email.")).toBeVisible()

  await page.getByTestId("booking-currency-trigger").click()
  await page.getByText("UAH — оплата в Україні", { exact: true }).click()
  await page.locator("#booking-name").fill("PURITY Test")
  await page.locator("#booking-email").fill("purity-test@example.com")
  await page
    .locator("#booking-message")
    .fill("Тестовий запит для перевірки booking payment flow.")
  await page.locator('[data-slot="checkbox"]').click()
  await page.getByTestId("booking-submit").click()

  await expect(page.getByText("Заявку прийнято")).toBeVisible()
  await expect(
    page.locator('a[href*="/uk/payment/success?provider=liqpay"]')
  ).toHaveCount(0)
  await expect(page.getByText("Заповніть поле.")).toHaveCount(0)
})

test("booking form exposes keyboard, invalid, review, and submitting contracts", async ({
  page,
}) => {
  test.setTimeout(180_000)

  const widths = [320, 375, 768, 1024, 1440, 1920]
  const errors: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`)
    }
  })
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`))

  for (const scheme of colorSchemes) {
    await page.emulateMedia({ colorScheme: scheme })

    for (const locale of ["uk", "ru", "en"] as const) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 844 })
        await page.goto(`/${locale}/booking?service=atelier-service`, {
          waitUntil: "domcontentloaded",
        })

        const form = page.getByTestId("booking-form")
        await expect(form).toHaveAttribute("data-state", "idle")
        await expect(form).toHaveAttribute("aria-busy", "false")
        await expect(page.getByTestId("booking-review")).toBeVisible()

        const name = page.locator("#booking-name")
        const email = page.locator("#booking-email")
        await name.focus()
        await expect(name).toBeFocused()
        await page.keyboard.press("Tab")
        await expect(email).toBeFocused()

        await page.getByTestId("booking-submit").click()
        await expect(
          page.getByText(/Перевірте поля|Проверьте поля|Check the fields/)
        ).toBeVisible()
        await expect(form.locator('[aria-invalid="true"]')).not.toHaveCount(0)
        const invalidCount = await form.locator('[aria-invalid="true"]').count()
        await expect(
          form.locator('[aria-invalid="true"][aria-describedby]')
        ).toHaveCount(invalidCount)
        await expect(form.locator('[id$="-error"]')).toHaveCount(invalidCount)
        await expect(form).toHaveAttribute("data-state", "idle")
        await expect(page.getByTestId("booking-submit")).toBeEnabled()
      }
    }
  }

  expect(errors).toEqual([])
})

test("service CTAs preselect the requested booking direction", async ({
  page,
}) => {
  const serviceDirections = [
    ["personal-lookbook", "Персональний лукбук"],
    ["realisation-support", "Супровід реалізації"],
    ["atelier-service", "Ательє-сервіс"],
    ["wardrobe-transformation", "Трансформація гардероба"],
    ["corporate-image", "Корпоративний імідж"],
    ["wardrobe-management", "Управління гардеробом"],
    ["capsule-collection", "Капсульна колекція"],
  ] as const

  for (const [serviceRoute, serviceTitle] of serviceDirections) {
    const bookingHref = `/uk/booking?service=${serviceRoute}`

    await page.goto(`/uk/services/${serviceRoute}`)
    await expect(page.locator(`a[href="${bookingHref}"]`)).toHaveCount(1)

    await page.locator(`a[href="${bookingHref}"]`).click()
    await expect(page).toHaveURL(
      new RegExp(`/uk/booking\\?service=${serviceRoute}$`)
    )
    await expect(page.getByTestId("booking-service-trigger")).toContainText(
      serviceTitle
    )
  }
})

test("course page retains its unconfirmed commercial status", async ({
  page,
}) => {
  await page.goto("/uk/courses/wardrobe-management-course")

  await expect(
    page.getByText("Фіксована пропозиція", { exact: true })
  ).toBeVisible()
  await expect(page.getByText(/coming-soon/)).toBeVisible()
  await expect(page.getByText(/Курс управління гардеробом: за запитом/)).toBeVisible()
  await expect(
    page.getByText(/пряма оплата зʼявиться лише для погодженої фіксованої пропозиції/)
  ).toBeVisible()
  await expect(
    page.locator('a[href="/uk/booking?service=wardrobe-management"]')
  ).toHaveCount(2)
})

test("collection details keep distinct stories, facts, and hero media", async ({
  page,
}) => {
  const collectionStories = [
    ["purity-capsule", "Як працює капсула", "Факти капсули"],
    [
      "new-year-party-collection",
      "Вечірній сценарій",
      "Факти вечірньої добірки",
    ],
    ["beaded-dress-signal", "Дизайн і посадка", "Факти сукні-сигналу"],
  ] as const
  const heroSources = new Set<string>()

  for (const [slug, storyTitle, factsTitle] of collectionStories) {
    await page.goto(`/uk/collections/${slug}`)
    await expect(
      page.getByRole("heading", { name: storyTitle }).first()
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: factsTitle }).first()
    ).toBeVisible()
    heroSources.add(
      (await page
        .getByTestId("editorial-hero")
        .locator("img")
        .getAttribute("src")) ?? ""
    )
  }

  expect(heroSources.size).toBe(collectionStories.length)
})

test("contacts keep direct channels separate and email intact", async ({
  page,
}) => {
  await page.goto("/uk/contacts")

  await expect(
    page.getByRole("heading", { name: "Зв’язатися напряму" })
  ).toBeVisible()
  const emailLink = page.locator(
    'section[aria-label="Соціальні канали"] a[href="mailto:voronina@purity-fashion.com"]'
  )
  await expect(emailLink).toHaveAttribute(
    "aria-label",
    "Email: voronina@purity-fashion.com"
  )
  const emailMetrics = await emailLink.evaluate((element) => {
    const rect = element.getBoundingClientRect()
    const style = window.getComputedStyle(element)

    return {
      width: rect.width,
      height: rect.height,
      overflowWrap: style.overflowWrap,
      wordBreak: style.wordBreak,
    }
  })

  expect(emailMetrics.width).toBeGreaterThanOrEqual(44)
  expect(emailMetrics.height).toBeGreaterThanOrEqual(44)
  expect(emailMetrics.overflowWrap).not.toBe("anywhere")
  expect(emailMetrics.wordBreak).not.toBe("break-all")
})

test("booking review keeps the service query preselected across locales", async ({
  page,
}) => {
  const localizedServiceTitles = {
    uk: "Ательє-сервіс",
    ru: "Ателье-сервис",
    en: "Atelier Service",
  } as const

  for (const [locale, serviceTitle] of Object.entries(localizedServiceTitles)) {
    await page.goto(`/${locale}/booking?service=atelier-service`)
    await expect(page.getByTestId("booking-contact-fields")).toBeVisible()
    await expect(page.getByTestId("booking-payment-fields")).toBeVisible()
    await expect(page.getByTestId("booking-routing-note")).toBeVisible()
    await expect(page.getByTestId("booking-review")).toContainText(serviceTitle)
    await expect(page.getByTestId("booking-service-trigger")).toContainText(
      serviceTitle
    )
  }
})

test("payment and legal utility pages expose trustworthy utility surfaces", async ({
  page,
}) => {
  const utilityRoutes = [
    "/uk/payment/success?provider=stripe&order=purity-test",
    "/uk/payment/failure?provider=liqpay&order=purity-test",
    "/uk/payment/cancel?provider=stripe&order=purity-test",
    "/uk/privacy",
    "/uk/terms",
  ]

  for (const route of utilityRoutes) {
    const response = await page.goto(route)
    expect(response?.ok(), route).toBe(true)
    await expect(page.locator("main h1")).toHaveCount(1)
    await expect(page.locator("main a").first()).toBeVisible()
    const bodyText = await page.locator("main").innerText()

    expect(bodyText).not.toMatch(/\b(test|mock|adapter)\b/i)
    if (route.includes("privacy") || route.includes("terms")) {
      await expect(page.getByRole("heading", { name: "Зміст" })).toBeVisible()
      await expect(
        page.getByText("Чинна редакція: 10 липня 2026")
      ).toBeVisible()
    }
  }
})

test("payment status pages keep provider fallbacks and localized action states", async ({
  page,
}) => {
  test.setTimeout(240_000)

  const widths = [320, 375, 768, 1024, 1440, 1920]
  const locales = ["uk", "ru", "en"] as const
  const routes = [
    ["success", "?provider=stripe&order=purity-order", "pending"],
    ["success", "", "success"],
    ["failure", "?provider=liqpay&order=purity-order", "pending"],
    ["failure", "?provider=unknown", "failure"],
    ["cancel", "?provider=stripe&order=purity-order", "pending"],
    ["cancel", "", "cancel"],
  ] as const
  const errors: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`)
    }
  })
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`))

  for (const scheme of colorSchemes) {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto("/uk/payment/success", { waitUntil: "domcontentloaded" })

    for (const locale of locales) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 844 })

        for (const [status, query, expectedStatus] of routes) {
          await page.goto(`/${locale}/payment/${status}${query}`, {
            waitUntil: "domcontentloaded",
          })
          await expect(page.locator("main h1")).toHaveCount(1)
          await expect(
            page.getByTestId("payment-status-alert")
          ).toHaveAttribute("data-status", expectedStatus)
          await expect(
            page.locator('main > section a[href*="/booking"]')
          ).toHaveCount(1)

          const action = page.locator('main > section a[href*="/booking"]')
          await action.focus()
          await expect(action).toBeFocused()

          const metrics = await page.evaluate(() => {
            const visible = (element: HTMLElement) => {
              const style = window.getComputedStyle(element)
              const rect = element.getBoundingClientRect()

              return (
                rect.width > 1 &&
                rect.height > 1 &&
                style.display !== "none" &&
                style.visibility !== "hidden"
              )
            }
            const clipped = [
              ...document.querySelectorAll<HTMLElement>("main, main *"),
            ]
              .filter(visible)
              .filter((element) => {
                const rect = element.getBoundingClientRect()

                return rect.left < -1 || rect.right > innerWidth + 1
              })
              .slice(0, 5)
              .map(
                (element) => element.textContent?.trim() || element.outerHTML
              )

            return {
              clipped,
              scrollWidth: document.documentElement.scrollWidth,
              clientWidth: document.documentElement.clientWidth,
            }
          })

          expect(metrics.clipped).toEqual([])
          expect(metrics.scrollWidth).toBeLessThanOrEqual(
            metrics.clientWidth + 1
          )
        }
      }
    }
  }

  expect(errors).toEqual([])
})

test("contact form validates and records inquiry-only requests", async ({ page }) => {
  await page.goto("/uk/contacts")
  await expect(
    page
      .locator('a[href="tel:+380660044066"]')
      .filter({ hasText: "Телефон: +38 066 00 44 066" })
  ).toHaveCount(1)
  await expect(
    page
      .locator('a[href="tel:+380676561912"]')
      .filter({ hasText: "Телефон: +38 067 656 19 12" })
  ).toHaveCount(1)
  await expect(
    page
      .locator('a[href="mailto:voronina@purity-fashion.com"]')
      .filter({ hasText: "Email: voronina@purity-fashion.com" })
  ).toHaveCount(1)
  await expect(
    page.locator('a[href="viber://chat?number=%2B380676561912"]')
  ).not.toHaveCount(0)
  await expect(
    page
      .locator('a[href="https://www.instagram.com/purity_fashion_studio/"]')
      .first()
  ).toContainText("Instagram")
  await expect(
    page
      .locator(
        'a[href="https://www.facebook.com/PURITY-Fashion-Studio-370149113069285/?fref=ts"]'
      )
      .first()
  ).toContainText("Facebook")
  await expect(page.getByTestId("booking-form")).toHaveCount(1)
  await expect(page.getByText("Заповніть поле.")).toHaveCount(0)

  await page.getByTestId("booking-submit").click()
  await expect(page.getByText("Перевірте поля")).toBeVisible()

  await page.locator("#booking-name").fill("PURITY Contact")
  await page.locator("#booking-email").fill("purity-contact@example.com")
  await page
    .locator("#booking-message")
    .fill("Контактний запит для перевірки форми перед запуском.")
  await page.locator('[data-slot="checkbox"]').click()
  await page.getByTestId("booking-submit").click()

  await expect(page.getByText("Заявку прийнято")).toBeVisible({
    timeout: 15_000,
  })
  await expect(
    page.locator('a[href*="/uk/payment/success?provider=stripe"]')
  ).toHaveCount(0)
  await expect(page.getByText("Заповніть поле.")).toHaveCount(0)
})

test("operations, indexing, and payment endpoints fail closed", async ({
  page,
  request,
}) => {
  const health = await request.get("/api/health")
  expect(health.status()).toBe(200)
  expect(await health.json()).toEqual({ status: "ok", content: "payload" })

  const stripe = await request.post("/api/payments/webhooks/stripe", {
    data: "{}",
    headers: { "stripe-signature": "invalid" },
  })
  expect(stripe.status()).toBe(400)

  const liqpay = await request.post("/api/payments/webhooks/liqpay", {
    form: { data: "invalid", signature: "invalid" },
  })
  expect(liqpay.status()).toBe(400)

  const reconciliation = await request.post("/api/jobs/reconcile-payments")
  expect(reconciliation.status()).toBe(401)

  const robots = await request.get("/robots.txt")
  expect(await robots.text()).toContain("Disallow: /")

  await page.goto("/uk")
  const structuredData = await page
    .locator('script[type="application/ld+json"]')
    .textContent()
  expect(structuredData).toContain("PURITY Fashion Studio")
  await page.goto("/uk/booking")
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/
  )
})

test("Viber contact preference requires a localized phone number", async ({
  page,
}) => {
  const localizedPhoneErrors = {
    uk: "Для телефону або Viber вкажіть номер.",
    ru: "Для телефона или Viber укажите номер.",
    en: "Enter a phone number for phone or Viber.",
  } as const

  for (const [locale, phoneError] of Object.entries(localizedPhoneErrors)) {
    await page.goto(`/${locale}/booking?service=atelier-service`)
    await page.locator("#booking-name").fill("PURITY Viber")
    await page.locator("#booking-email").fill("purity-viber@example.com")
    await page
      .locator("#booking-message")
      .fill("Booking validation request for the Viber contact preference.")
    await page
      .getByTestId("booking-form")
      .getByText("Viber", { exact: true })
      .click()
    await page.locator('[data-slot="checkbox"]').click()
    await page.getByTestId("booking-submit").click()

    await expect(page.getByText(phoneError)).toBeVisible()
  }
})

test("interactive controls have accessible names and fit mobile width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 })

  for (const route of ["/uk/booking?service=atelier-service", "/uk/contacts"]) {
    await page.goto(route)

    const metrics = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      unnamedControls: [
        ...document.querySelectorAll(
          'input:not([type="hidden"]), textarea, [role="combobox"], [role="radio"], [role="checkbox"]'
        ),
      ]
        .filter((element) => {
          if (element.id.includes("hidden-input")) {
            return false
          }

          const id = element.getAttribute("id")
          const hasLabel =
            Boolean(element.getAttribute("aria-label")) ||
            Boolean(element.closest("label")) ||
            Boolean(id && document.querySelector(`label[for="${id}"]`))

          return !hasLabel
        })
        .map((element) => element.outerHTML.slice(0, 120)),
      unnamedLinks: [...document.querySelectorAll<HTMLAnchorElement>("a[href]")]
        .filter((link) => !link.textContent?.trim())
        .filter((link) => !link.getAttribute("aria-label"))
        .map((link) => link.outerHTML.slice(0, 120)),
      unnamedButtons: [
        ...document.querySelectorAll<HTMLButtonElement>("button"),
      ]
        .filter((button) => !button.textContent?.trim())
        .filter((button) => !button.getAttribute("aria-label"))
        .map((button) => button.outerHTML.slice(0, 120)),
      unnamedNavs: [...document.querySelectorAll("nav")]
        .filter((nav) => !nav.getAttribute("aria-label"))
        .filter((nav) => !nav.getAttribute("aria-labelledby"))
        .map((nav) => nav.outerHTML.slice(0, 120)),
    }))

    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1)
    expect(metrics.unnamedControls).toEqual([])
    expect(metrics.unnamedLinks).toEqual([])
    expect(metrics.unnamedButtons).toEqual([])
    expect(metrics.unnamedNavs).toEqual([])
  }
})
