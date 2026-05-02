import { readFileSync } from 'node:fs'
import { expect, test, type Page, type TestInfo } from '@playwright/test'

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

const seed = JSON.parse(
  readFileSync(new URL('../../src/content/seed/public-posts.seed.json', import.meta.url), 'utf8'),
) as {
  locales: {
    uk: {
      services: Array<{ slug: string; area: 'research' | 'realisation' }>
      collections: Array<{ slug: string }>
      portfolio: Array<{ slug: string }>
    }
  }
}

const publicRoutePaths = [
  '',
  '/research',
  ...seed.locales.uk.services
    .filter((service) => service.area === 'research')
    .map((service) => `/research/${service.slug}`),
  '/realisation',
  ...seed.locales.uk.services
    .filter((service) => service.area === 'realisation')
    .map((service) => `/realisation/${service.slug}`),
  '/transformation',
  '/collections',
  ...seed.locales.uk.collections.map((collection) => `/collections/${collection.slug}`),
  '/portfolio',
  ...seed.locales.uk.portfolio.map((entry) => `/portfolio/${entry.slug}`),
  '/school',
  '/contacts',
  '/book',
  '/privacy',
]

const publicRoutes = [
  ...publicRoutePaths.map((path) => `/uk${path}`),
  '/uk/book?kind=service&slug=personal-lookbook&area=research',
  '/uk/book?kind=portfolio&slug=soft-power-capsule',
]

const screenshotRoutePaths = new Set(['/uk', '/uk/contacts', '/uk/book?kind=service&slug=personal-lookbook&area=research'])
const screenshotViewportWidths = new Set([390, 1440])

function collectConsoleErrors(page: Page) {
  const errors: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') {
      const text = message.text()
      if (/WebSocket connection.*localhost:3000.*failed|Error during WebSocket handshake/i.test(text)) {
        return
      }

      errors.push(text)
    }
  })

  page.on('pageerror', (error) => {
    errors.push(error.message)
  })

  return errors
}

function routeLocale(route: string) {
  const match = /^\/(uk|en|ru)(?:\/|$)/.exec(route)
  return match?.[1] ?? 'uk'
}

function screenshotSlug(route: string) {
  return route.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')
}

function futureDate(daysAhead = 21) {
  const date = new Date()
  date.setDate(date.getDate() + daysAhead)
  return date.toISOString().slice(0, 10)
}

async function assertNoHorizontalOverflow(page: Page) {
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  )

  expect(hasOverflow).toBe(false)
}

async function assertDocumentLanguage(page: Page, route: string) {
  await expect(page.locator('html')).toHaveAttribute('lang', routeLocale(route))
}

async function assertSiteChromePresent(page: Page) {
  await expect(page.locator('header.chrome-shell')).toBeVisible()
  await expect(page.locator('footer.site-footer')).toHaveCount(1)
}

async function assertNoPrototypeCopy(page: Page) {
  await expect(page.locator('body')).not.toContainText(
    /prototype|mock(?!-up)|Локальний режим|Локальный режим|Local mode|without an external CRM|external CRM|без зовнішньої CRM|без внешней CRM|без CRM|без email/i,
  )
}

async function assertImagesHaveProductionAlt(page: Page) {
  const missingAlt = await page.evaluate(() =>
    Array.from(document.images)
      .filter((image) => {
        const isDecorative =
          image.getAttribute('role') === 'presentation' ||
          image.closest('[aria-hidden="true"]') !== null

        return !isDecorative && !image.alt.trim()
      })
      .map((image) => image.currentSrc || image.getAttribute('src') || image.outerHTML),
  )

  expect(missingAlt).toEqual([])
}

async function assertVisibleFormLabels(page: Page) {
  const visibleForms = await page.locator('main form').count()
  if (!visibleForms) {
    return
  }

  const unlabeledFields = await page.evaluate(() =>
    Array.from(document.querySelectorAll('main form input, main form textarea, main form select'))
      .filter((field) => {
        const element = field as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        const type = 'type' in element ? element.type : ''
        if (type === 'hidden' || type === 'submit' || type === 'button') {
          return false
        }

        const id = element.id
        const hasLabelWrapper = element.closest('label') !== null
        const hasLabelFor = Boolean(id && document.querySelector(`label[for="${CSS.escape(id)}"]`))
        return !hasLabelWrapper && !hasLabelFor
      })
      .map((field) => field.getAttribute('name') || field.outerHTML),
  )

  expect(unlabeledFields).toEqual([])
}

async function assertFirstFoldImagesLoaded(page: Page) {
  const brokenImages = await page.evaluate(async () => {
    const visibleImages = Array.from(document.images).filter((image) => {
      const box = image.getBoundingClientRect()
      return box.bottom > 0 && box.top < window.innerHeight && box.width > 0 && box.height > 0
    })

    await Promise.all(
      visibleImages.map(
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

    return visibleImages
      .filter((image) => image.naturalWidth === 0 || image.naturalHeight === 0)
      .map((image) => image.currentSrc || image.getAttribute('src') || image.alt)
  })

  expect(brokenImages).toEqual([])
}

async function assertFirstFoldReadable(page: Page) {
  const heading = page.locator('h1, h2').first()
  await expect(heading).toBeVisible()

  const box = await heading.boundingBox()
  expect(box?.y ?? 9999).toBeLessThan(page.viewportSize()?.height ?? 720)
}

async function assertHeaderDoesNotCoverFirstContent(page: Page, route: string) {
  if (route === '/uk') {
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

async function assertPrimaryActionVisible(page: Page) {
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

async function attachSmokeScreenshot(page: Page, testInfo: TestInfo, route: string, width: number) {
  if (!screenshotRoutePaths.has(route) || !screenshotViewportWidths.has(width)) {
    return
  }

  await testInfo.attach(`smoke-${width}-${screenshotSlug(route)}.png`, {
    body: await page.screenshot({ animations: 'disabled', fullPage: false }),
    contentType: 'image/png',
  })
}

async function assertFocusInsideOpenMenu(page: Page) {
  const focusEscaped = await page.evaluate(() => {
    const active = document.activeElement
    const sheet = document.querySelector('#nav-sheet')
    const toggle = document.querySelector('.menu-toggle')
    return Boolean(active && !sheet?.contains(active) && !toggle?.contains(active))
  })

  expect(focusEscaped).toBe(false)
}

test.describe('lead-gen MVP viewport smoke', () => {
  test.describe.configure({ timeout: 120_000 })

  for (const viewport of viewports) {
    test(`public routes render without console errors at ${viewport.width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport)
      const errors = collectConsoleErrors(page)

      for (const route of publicRoutes) {
        await page.goto(route)
        await assertDocumentLanguage(page, route)
        await assertSiteChromePresent(page)
        await expect(page.locator('main')).toBeVisible()
        await assertNoHorizontalOverflow(page)
        await assertNoPrototypeCopy(page)
        await assertImagesHaveProductionAlt(page)
        await assertVisibleFormLabels(page)
        await assertFirstFoldImagesLoaded(page)
        await assertFirstFoldReadable(page)
        await assertHeaderDoesNotCoverFirstContent(page, route)
        await assertPrimaryActionVisible(page)
        await attachSmokeScreenshot(page, testInfo, route, viewport.width)
      }

      expect(errors).toEqual([])
    })

    test(`menu and transformation cards stay usable at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport)
      const errors = collectConsoleErrors(page)

      await page.goto('/uk')
      await expect(page.locator('#nav-sheet')).toHaveAttribute('aria-hidden', 'true')
      await expect(page.locator('#nav-sheet')).toHaveAttribute('inert', '')

      await page.locator('.menu-toggle').click()
      await expect(page.locator('#nav-sheet')).toHaveAttribute('aria-hidden', 'false')
      await expect(page.locator('#nav-sheet')).not.toHaveAttribute('inert', '')
      await page.keyboard.press('Tab')
      await assertFocusInsideOpenMenu(page)
      await page.keyboard.press('Shift+Tab')
      await assertFocusInsideOpenMenu(page)
      await page.keyboard.press('Escape')
      await expect(page.locator('#nav-sheet')).toHaveAttribute('aria-hidden', 'true')

      await page.goto('/uk/transformation')
      await expect(page.locator('.editorial-offer-row')).toHaveCount(3)
      await expect(page.locator('.editorial-offer-row .button-secondary')).toHaveCount(3)
      await assertNoHorizontalOverflow(page)

      expect(errors).toEqual([])
    })
  }

  test('reduced motion keeps the home journey readable', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 390, height: 844 })
    const errors = collectConsoleErrors(page)

    await page.goto('/uk')
    await expect(page.locator('.layered-home-hero')).toBeVisible()
    await expect(page.locator('h1').first()).toBeVisible()
    await assertNoHorizontalOverflow(page)

    expect(errors).toEqual([])
  })

  test('manual review screenshots cover key editorial frames', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 946 })

    await page.goto('/uk')
    await testInfo.attach('home-top.png', {
      body: await page.screenshot({ animations: 'disabled', fullPage: false }),
      contentType: 'image/png',
    })
    await page.evaluate(() => window.scrollTo(0, Math.round(window.innerHeight * 0.8)))
    await testInfo.attach('home-hero-midpoint.png', {
      body: await page.screenshot({ animations: 'disabled', fullPage: false }),
      contentType: 'image/png',
    })
    await page.locator('.atelier-black-band').scrollIntoViewIfNeeded()
    await testInfo.attach('home-atelier-band.png', {
      body: await page.screenshot({ animations: 'disabled', fullPage: false }),
      contentType: 'image/png',
    })

    await page.goto('/uk/research')
    await testInfo.attach('research-top.png', {
      body: await page.screenshot({ animations: 'disabled', fullPage: false }),
      contentType: 'image/png',
    })

    await page.goto('/uk/collections/dress-for-victory')
    await testInfo.attach('collections-detail-top.png', {
      body: await page.screenshot({ animations: 'disabled', fullPage: false }),
      contentType: 'image/png',
    })

    await page.goto('/uk/contacts')
    await page.locator('#contact-form').scrollIntoViewIfNeeded()
    await testInfo.attach('contact-form.png', {
      body: await page.screenshot({ animations: 'disabled', fullPage: false }),
      contentType: 'image/png',
    })

    await page.goto('/uk/book')
    await page.locator('.booking-request-panel').scrollIntoViewIfNeeded()
    await testInfo.attach('booking-form.png', {
      body: await page.screenshot({ animations: 'disabled', fullPage: false }),
      contentType: 'image/png',
    })
  })

  test('locale switch, lead forms, and admin edit flow work after hydration', async ({ page }, testInfo) => {
    test.skip(Boolean(process.env.CONTACT_WEBHOOK_URL), 'Lead form smoke uses the local mock adapter, not a configured webhook')

    const errors = collectConsoleErrors(page)
    const smokeSeed = Date.now()
    const smokeTitle = `Smoke editable transformation ${smokeSeed}`
    const smokeEmail = `smoke-${smokeSeed}@example.com`
    const smokePhone = `+380${String(smokeSeed).slice(-9).padStart(9, '0')}`

    await page.goto('/uk')
    await page.getByRole('link', { name: 'EN' }).first().click()
    await expect(page).toHaveURL(/\/en\/?$/)

    await page.goto('/uk/contacts')
    await expect(page.locator('label:has(input[name="name"])')).toBeVisible()
    await expect(page.locator('label:has(textarea[name="message"])')).toBeVisible()
    await page.locator('input[name="name"]').fill('Smoke Test')
    await page.locator('input[name="email"]').fill(smokeEmail)
    await page.locator('input[name="phone"]').fill(smokePhone)
    await page.locator('input[name="interest"]').fill('Research')
    await page.locator('textarea[name="message"]').fill(`Smoke contact submission ${smokeSeed}`)
    await page.locator('form').filter({ has: page.locator('textarea[name="message"]') }).getByRole('button').click()
    await expect(page.locator('[aria-live="polite"]').last()).toContainText(/reference|зафіксовано|received|recorded/i)
    await testInfo.attach('contact-success.png', {
      body: await page.screenshot({ animations: 'disabled', fullPage: false }),
      contentType: 'image/png',
    })

    await page.goto('/uk/book?kind=service&slug=personal-lookbook&area=research')
    await expect(page.locator('label:has(select[name="format"])')).toBeVisible()
    await expect(page.locator('label:has(input[name="date"])')).toBeVisible()
    await page.locator('select[name="format"]').selectOption({ index: 1 })
    await page.locator('input[name="date"]').fill(futureDate())
    await page.locator('input[name="name"]').fill('Smoke Test')
    await page.locator('input[name="phone"]').fill(smokePhone)
    await page.locator('input[name="email"]').fill(smokeEmail)
    await page.locator('textarea[name="notes"]').fill(`Smoke booking submission ${smokeSeed}`)
    await page.locator('form').filter({ has: page.locator('select[name="format"]') }).getByRole('button').click()
    await expect(page.locator('[aria-live="polite"]').last()).toContainText(/reference|зафіксовано|received|recorded/i)
    await testInfo.attach('booking-success.png', {
      body: await page.screenshot({ animations: 'disabled', fullPage: false }),
      contentType: 'image/png',
    })

    await page.goto('/admin/content')
    await expect(page).toHaveURL(/\/admin\/login/)
    await page.locator('input[name="username"]').fill('admin')
    await page.locator('input[name="password"]').fill('purity-local-admin')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/admin\/content/)

    await page.goto('/admin/content/transformation/dress-of-victory')
    await page.locator('input[name="title"]').fill(smokeTitle)
    await page.locator('input[name="mediaSrc"]').fill('/images/generated/home-hero-abstract-drape.webp')
    await page.getByRole('button', { name: /save change/i }).click()
    await page.waitForTimeout(500)

    await page.goto('/en/transformation')
    await expect(page.getByText(smokeTitle)).toBeVisible()

    expect(errors).toEqual([])
  })
})
