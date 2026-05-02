import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'

const locales = ['uk', 'en', 'ru'] as const

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

const routePaths = [
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

const forbiddenProductionCopy =
  /prototype|mock(?!-up)|local mode|локальний режим|локальный режим|без зовнішньої CRM|без внешней CRM|без CRM|без email|external CRM/i

const localeForbiddenCopy = {
  uk: /Ощути|Ощутить|Исследование|Воплощение|Локальный режим|Macetirovanie/i,
  en: /[\u0400-\u04FF]/,
  ru: /Відчуй|Дослідження|Втілення|Локальний режим|Macetirovanie/i,
} satisfies Record<(typeof locales)[number], RegExp>

function localizedRoute(locale: (typeof locales)[number], routePath: string) {
  return `/${locale}${routePath}`
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

test.describe('production route copy audit', () => {
  test.describe.configure({ timeout: 90_000 })

  for (const locale of locales) {
    test(`${locale} public routes have production-safe localized copy`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      const errors = collectConsoleErrors(page)

      for (const routePath of routePaths) {
        await page.goto(localizedRoute(locale, routePath))
        await expect(page.locator('html')).toHaveAttribute('lang', locale)
        await expect(page.locator('main')).toBeVisible()
        await assertNoHorizontalOverflow(page)
        await expect(page.locator('body')).not.toContainText(forbiddenProductionCopy)
        await expect(page.locator('body')).not.toContainText(localeForbiddenCopy[locale])
      }

      expect(errors).toEqual([])
    })
  }
})
