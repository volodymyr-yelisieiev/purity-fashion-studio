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

const ogLocales = {
  uk: 'uk_UA',
  en: 'en_GB',
  ru: 'ru_RU',
} satisfies Record<(typeof locales)[number], string>

const localizedUtilityCopy = {
  uk: {
    privacyTitle: 'Політика приватності',
    privacyLink: 'Політика приватності',
    mapLabel: 'Київська студія на Предславинській',
  },
  en: {
    privacyTitle: 'Privacy notice',
    privacyLink: 'Privacy notice',
    mapLabel: 'Kyiv studio on Predslavynska Street',
  },
  ru: {
    privacyTitle: 'Политика приватности',
    privacyLink: 'Политика приватности',
    mapLabel: 'Киевская студия на Предславинской',
  },
} satisfies Record<(typeof locales)[number], Record<string, string>>

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
  await expect.poll(async () => {
    try {
      return await page.evaluate(() => {
        const maxScrollWidth = Math.max(
          document.documentElement.scrollWidth,
          document.body.scrollWidth,
        )

        return maxScrollWidth <= window.innerWidth + 1
      })
    } catch {
      return false
    }
  }).toBe(true)
}

async function waitForRouteReady(page: Page) {
  await page.waitForLoadState('domcontentloaded')
  await expect(page.locator('main')).toBeVisible()

  const enhancedForms = page.locator('form[data-enhanced]')
  if (await enhancedForms.count()) {
    await expect(enhancedForms.first()).toHaveAttribute('data-enhanced', 'true')
  }

  await page.evaluate(() => new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  }))
}

async function assertLocalizedHead(page: Page, locale: (typeof locales)[number], routePath: string) {
  const expectedCanonical = new URL(localizedRoute(locale, routePath), 'https://purity-fashion.com').toString()
  const head = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content ?? '',
    canonical: document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? '',
    ogUrl: document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.content ?? '',
    ogLocale: document.querySelector<HTMLMetaElement>('meta[property="og:locale"]')?.content ?? '',
    alternates: Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"]')).map((link) => ({
      hrefLang: link.hreflang,
      href: link.href,
    })),
  }))

  expect(head.title).toContain('PURITY')
  expect(head.description).not.toBe('')
  expect(head.canonical).toBe(expectedCanonical)
  expect(head.ogUrl).toBe(expectedCanonical)
  expect(head.ogLocale).toBe(ogLocales[locale])
  expect(head.alternates).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ hrefLang: 'x-default' }),
      expect.objectContaining({ hrefLang: 'uk' }),
      expect.objectContaining({ hrefLang: 'en' }),
      expect.objectContaining({ hrefLang: 'ru' }),
    ]),
  )
}

test.describe('production route copy audit', () => {
  test.describe.configure({ timeout: 90_000 })

  for (const locale of locales) {
    test(`${locale} public routes have production-safe localized copy`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      const errors = collectConsoleErrors(page)

      for (const routePath of routePaths) {
        await page.goto(localizedRoute(locale, routePath))
        await waitForRouteReady(page)
        await expect(page.locator('html')).toHaveAttribute('lang', locale)
        await expect(page.locator('main')).toBeVisible()
        await assertNoHorizontalOverflow(page)
        await assertLocalizedHead(page, locale, routePath)
        await expect(page.locator('body')).not.toContainText(forbiddenProductionCopy)
        await expect(page.locator('body')).not.toContainText(localeForbiddenCopy[locale])

        if (routePath === '/privacy') {
          await expect(page.locator('h1')).toContainText(localizedUtilityCopy[locale].privacyTitle)
        }

        if (routePath === '/contacts') {
          await expect(page.locator('body')).toContainText(localizedUtilityCopy[locale].mapLabel)
        }

        await expect(page.locator('footer.site-footer')).toContainText(localizedUtilityCopy[locale].privacyLink)
      }

      expect(errors).toEqual([])
    })
  }
})
