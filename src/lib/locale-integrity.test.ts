import test from 'node:test'
import assert from 'node:assert/strict'

import { contentRepository } from './repository'
import type { Locale } from './types'

type StringRecord = {
  path: string
  value: string
}

const publicRoutePageKeys = [
  'home',
  'research',
  'realisation',
  'transformation',
  'school',
  'collections',
  'portfolio',
  'contacts',
] as const

const productionUnsafeCopy =
  /prototype|mock(?!-up)|local mode|локальний режим|локальный режим|без зовнішньої CRM|без внешней CRM|без CRM|без email|external CRM/i

const localeRules: Record<Locale, Array<{ name: string; pattern: RegExp }>> = {
  uk: [
    { name: 'Russian home/action wording', pattern: /Ощути|Ощутить|Исследование|Воплощение|Локальный режим|Macetirovanie/i },
  ],
  en: [
    { name: 'Cyrillic characters', pattern: /[\u0400-\u04FF]/ },
  ],
  ru: [
    { name: 'Ukrainian home/action wording', pattern: /Відчуй|Дослідження|Втілення|Локальний режим|Macetirovanie/i },
  ],
}

function collectStrings(value: unknown, path = 'content'): StringRecord[] {
  if (typeof value === 'string') {
    return [{ path, value }]
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectStrings(item, `${path}[${index}]`))
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => collectStrings(item, `${path}.${key}`))
  }

  return []
}

async function publicContent(locale: Locale) {
  const [
    ui,
    home,
    research,
    realisation,
    transformation,
    school,
    collectionsPage,
    portfolioPage,
    contacts,
    services,
    courses,
    collections,
    portfolio,
    transformations,
  ] = await Promise.all([
    contentRepository.getUiCopy(locale),
    contentRepository.getHomePage(locale),
    contentRepository.getResearchPage(locale),
    contentRepository.getRealisationPage(locale),
    contentRepository.getTransformationPage(locale),
    contentRepository.getSchoolPage(locale),
    contentRepository.getCollectionsPage(locale),
    contentRepository.getPortfolioPage(locale),
    contentRepository.getContactsPage(locale),
    contentRepository.getServices(locale),
    contentRepository.getCourses(locale),
    contentRepository.getCollections(locale),
    contentRepository.getPortfolio(locale),
    contentRepository.getTransformationOffers(locale),
  ])

  return {
    ui,
    pages: {
      home,
      research,
      realisation,
      transformation,
      school,
      collections: collectionsPage,
      portfolio: portfolioPage,
      contacts,
    },
    entities: {
      services,
      courses,
      collections,
      portfolio,
      transformations,
    },
  }
}

test('public route page keys stay in the locale QA matrix', () => {
  assert.deepEqual([...publicRoutePageKeys], [
    'home',
    'research',
    'realisation',
    'transformation',
    'school',
    'collections',
    'portfolio',
    'contacts',
  ])
})

test('public content does not contain production-unsafe user copy', async () => {
  for (const locale of ['uk', 'en', 'ru'] satisfies Locale[]) {
    for (const item of collectStrings(await publicContent(locale), locale)) {
      assert.doesNotMatch(item.value, productionUnsafeCopy, `${item.path}: ${item.value}`)
    }
  }
})

test('public content follows locale-specific copy rules', async () => {
  for (const locale of ['uk', 'en', 'ru'] satisfies Locale[]) {
    const rules = localeRules[locale]

    for (const item of collectStrings(await publicContent(locale), locale)) {
      for (const rule of rules) {
        assert.doesNotMatch(item.value, rule.pattern, `${rule.name} in ${item.path}: ${item.value}`)
      }
    }
  }
})
