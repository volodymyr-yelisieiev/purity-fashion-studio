import { expect, test, type Page } from '@playwright/test'

const viewports = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 946 },
] as const

const publicRoutes = [
  '/uk',
  '/uk/research',
  '/uk/realisation',
  '/uk/research/personal-lookbook',
  '/uk/collections',
  '/uk/collections/dress-for-victory',
  '/uk/portfolio',
  '/uk/portfolio/soft-power-capsule',
  '/uk/school',
  '/uk/transformation',
  '/uk/contacts',
  '/uk/book?kind=service&slug=personal-lookbook&area=research',
  '/uk/book?kind=portfolio&slug=soft-power-capsule',
] as const

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

async function assertNoHorizontalOverflow(page: Page) {
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  )

  expect(hasOverflow).toBe(false)
}

async function assertFirstFoldReadable(page: Page) {
  const heading = page.locator('h1, h2').first()
  await expect(heading).toBeVisible()

  const box = await heading.boundingBox()
  expect(box?.y ?? 9999).toBeLessThan(page.viewportSize()?.height ?? 720)
}

test.describe('lead-gen MVP viewport smoke', () => {
  for (const viewport of viewports) {
    test(`public routes render without console errors at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport)
      const errors = collectConsoleErrors(page)

      for (const route of publicRoutes) {
        await page.goto(route)
        await expect(page.locator('main')).toBeVisible()
        await assertNoHorizontalOverflow(page)
        await assertFirstFoldReadable(page)
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

      await page.goto('/uk/transformation')
      const tags = page.locator('.editorial-card-compact .card-action-row .micro-tag')
      await expect(tags).toHaveCount(3)

      for (let index = 0; index < 3; index += 1) {
        const tagBox = await tags.nth(index).boundingBox()
        const rowBox = await page.locator('.card-action-row').nth(index).boundingBox()

        expect(tagBox?.width ?? 9999).toBeLessThan(Math.min(96, (rowBox?.width ?? 0) * 0.45))
      }

      expect(errors).toEqual([])
    })
  }

  test('locale switch, lead forms, and admin edit flow work after hydration', async ({ page }) => {
    const errors = collectConsoleErrors(page)

    await page.goto('/uk')
    await page.getByRole('link', { name: 'EN' }).first().click()
    await expect(page).toHaveURL(/\/en\/?$/)

    await page.goto('/uk/contacts')
    await page.locator('input[name="name"]').fill('Smoke Test')
    await page.locator('input[name="email"]').fill('smoke@example.com')
    await page.locator('input[name="phone"]').fill('+380000000000')
    await page.locator('input[name="interest"]').fill('Research')
    await page.locator('textarea[name="message"]').fill('Smoke contact submission')
    await page.locator('form').filter({ has: page.locator('textarea[name="message"]') }).getByRole('button').click()
    await expect(page.locator('[aria-live="polite"]').last()).toContainText(/reference|зафіксовано|received|recorded/i)

    await page.goto('/uk/book?kind=service&slug=personal-lookbook&area=research')
    await page.locator('select[name="format"]').selectOption({ index: 1 })
    await page.locator('input[name="date"]').fill('2026-05-20')
    await page.locator('input[name="name"]').fill('Smoke Test')
    await page.locator('input[name="phone"]').fill('+380000000000')
    await page.locator('input[name="email"]').fill('smoke@example.com')
    await page.locator('textarea[name="notes"]').fill('Smoke booking submission')
    await page.locator('form').filter({ has: page.locator('select[name="format"]') }).getByRole('button').click()
    await expect(page.locator('[aria-live="polite"]').last()).toContainText(/reference|зафіксовано|received|recorded/i)

    await page.goto('/admin/content')
    await expect(page).toHaveURL(/\/admin\/login/)
    await page.locator('input[name="username"]').fill('admin')
    await page.locator('input[name="password"]').fill('purity-local-admin')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/admin\/content/)

    await page.goto('/admin/content/transformation/dress-of-victory')
    await page.locator('input[name="title"]').fill('Smoke editable transformation')
    await page.locator('input[name="mediaSrc"]').fill('/images/purity_3.webp')
    await page.getByRole('button', { name: /save change/i }).click()
    await expect(page.locator('[aria-live="polite"]').last()).toContainText(/saved|overlay|archived/i)

    await page.goto('/en/transformation')
    await expect(page.getByText('Smoke editable transformation')).toBeVisible()

    expect(errors).toEqual([])
  })
})
