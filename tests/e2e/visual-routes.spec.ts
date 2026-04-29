import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { expect, test, type Page } from '@playwright/test'

const locales = ['uk', 'en', 'ru'] as const

const routePaths = [
  '',
  '/research',
  '/realisation',
  '/transformation',
  '/collections',
  '/collections/dress-for-victory',
  '/portfolio',
  '/portfolio/soft-power-capsule',
  '/school',
  '/contacts',
  '/book',
] as const

const viewports = [
  { width: 320, height: 740 },
  { width: 360, height: 780 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 900 },
  { width: 1440, height: 946 },
] as const

const primaryImageSelector = [
  '.editorial-page-hero-media img',
  '.compact-intro-media img',
  '.lookbook-row figure img',
  '.case-row img',
  '.detail-hero-image',
  '.collection-gallery-grid img',
  '.booking-offer-media img',
].join(', ')

function localizedRoute(locale: (typeof locales)[number], routePath: string) {
  return `/${locale}${routePath}`
}

function routeSlug(routePath: string) {
  return routePath === ''
    ? 'home'
    : routePath.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')
}

function collectConsoleErrors(page: Page) {
  const errors: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text())
    }
  })

  page.on('pageerror', (error) => {
    errors.push(error.message)
  })

  return errors
}

async function assertNoHorizontalOverflow(page: Page) {
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  )

  expect(hasOverflow).toBe(false)
}

async function assertHeaderDoesNotCoverMain(page: Page, routePath: string) {
  if (routePath === '') {
    return
  }

  const isCovered = await page.evaluate(() => {
    const header = document.querySelector('header.chrome-shell')
    const target = document.querySelector('main h1, main h2')

    if (!header || !target) {
      return false
    }

    return target.getBoundingClientRect().top < header.getBoundingClientRect().bottom - 2
  })

  expect(isCovered).toBe(false)
}

async function assertPrimaryImagesLoaded(page: Page) {
  const brokenImages = await page.evaluate(async (selector) => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>(selector))

    await Promise.all(
      images.map(
        (image) =>
          image.complete ||
          new Promise((resolve) => {
            const done = () => resolve(undefined)
            image.addEventListener('load', done, { once: true })
            image.addEventListener('error', done, { once: true })
            window.setTimeout(done, 1_500)
          }),
      ),
    )

    return images
      .filter((image) => image.naturalWidth === 0 || image.naturalHeight === 0)
      .map((image) => image.currentSrc || image.getAttribute('src') || image.alt)
  }, primaryImageSelector)

  expect(brokenImages).toEqual([])
}

async function waitForRouteReady(page: Page) {
  await page.waitForLoadState('networkidle')

  const enhancedForms = page.locator('form[data-enhanced]')
  if (await enhancedForms.count()) {
    await expect(enhancedForms.first()).toHaveAttribute('data-enhanced', 'true')
  }

  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => resolve(undefined))))
}

async function loadLazyImagesForFullPage(page: Page) {
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight)
  const viewportHeight = page.viewportSize()?.height ?? 800

  for (let y = 0; y < pageHeight; y += Math.max(320, Math.floor(viewportHeight * 0.75))) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y)
    await page.waitForTimeout(50)
  }

  await page.evaluate(() => window.scrollTo(0, 0))
}

async function assertNoPrimaryPlaceholderImages(page: Page) {
  const placeholders = await page.evaluate((selector) =>
    Array.from(document.querySelectorAll<HTMLImageElement>(selector))
      .map((image) => image.currentSrc || image.getAttribute('src') || '')
      .filter((src) => /\/abstract-|gallery-.*\.svg$/i.test(src)),
    primaryImageSelector,
  )

  expect(placeholders).toEqual([])
}

async function assertFirstFoldAction(page: Page) {
  const action = page.locator([
    'main a.button-primary',
    'main button.button-primary',
    'main a.button-secondary',
    'main a[href*="/book"]',
    'main a[href*="/contacts"]',
    'main button[type="submit"]',
  ].join(', ')).first()

  await expect(action).toBeVisible()
}

test.describe('manual visual route matrix', () => {
  test.describe.configure({ timeout: 120_000 })

  for (const viewport of viewports) {
    test(`public routes render stable screenshots at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport)
      const errors = collectConsoleErrors(page)

      for (const locale of locales) {
        for (const routePath of routePaths) {
          await page.goto(localizedRoute(locale, routePath))
          await waitForRouteReady(page)
          await expect(page.locator('html')).toHaveAttribute('lang', locale)
          await expect(page.locator('main')).toBeVisible()
          await expect(page.locator('footer.site-footer')).toHaveCount(1)
          await assertNoHorizontalOverflow(page)
          await assertHeaderDoesNotCoverMain(page, routePath)
          await loadLazyImagesForFullPage(page)
          await assertPrimaryImagesLoaded(page)
          await assertNoPrimaryPlaceholderImages(page)
          await assertFirstFoldAction(page)

          const dir = join('test-results', 'manual-review', locale, routeSlug(routePath))
          await mkdir(dir, { recursive: true })
          await page.screenshot({
            path: join(dir, `${viewport.width}.png`),
            animations: 'disabled',
            fullPage: true,
          })
        }
      }

      expect(errors).toEqual([])
    })
  }
})
