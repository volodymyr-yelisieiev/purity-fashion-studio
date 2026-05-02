import {
  getAdminNavigation,
  getContactsContent,
  getHomeContent,
  getListingPageContent,
  getManagedContentIndex as getSeedManagedContentIndex,
  getManagedContentRecord as getSeedManagedContentRecord,
  getPortfolioContent,
  getSchoolContent,
  getStudioSettings,
  getUiCopy,
} from './content'
import { createContentProviderAdapter } from './content-provider'
import {
  readContentOverlayRecords,
  writeContentOverlayRecords,
} from './content-overlay-store'
import {
  getSeedCollectionBySlug,
  getSeedCollections,
  getSeedCourses,
  getSeedPortfolio,
  getSeedPortfolioCaseBySlug,
  getSeedServiceBySlug,
  getSeedServices,
  getSeedTransformations,
} from './public-content-seed'
import type { ContentRepository, Locale, ManagedContentRecord, ServiceArea } from './types'

const wait = (ms = 40) => new Promise((resolve) => setTimeout(resolve, ms))

function getSeedManagedContentRecords(): ManagedContentRecord[] {
  return getSeedManagedContentIndex('en')
    .map((entry) => getSeedManagedContentRecord('en', entry.kind, entry.slug))
    .filter((entry): entry is ManagedContentRecord => Boolean(entry))
}

const managedContentProvider = createContentProviderAdapter({
  seedRecords: getSeedManagedContentRecords(),
})

async function publicOverlayRecords() {
  return readContentOverlayRecords()
}

export const contentRepository: ContentRepository = {
  async getHomePage(locale) {
    await wait()
    return getHomeContent(locale)
  },
  async getResearchPage(locale) {
    await wait()
    return getListingPageContent(locale, 'research')
  },
  async getRealisationPage(locale) {
    await wait()
    return getListingPageContent(locale, 'realisation')
  },
  async getTransformationPage(locale) {
    await wait()
    return getListingPageContent(locale, 'transformation')
  },
  async getSchoolPage(locale) {
    await wait()
    return getSchoolContent(locale)
  },
  async getCollectionsPage(locale) {
    await wait()
    return getListingPageContent(locale, 'collections')
  },
  async getPortfolioPage(locale) {
    await wait()
    return getPortfolioContent(locale)
  },
  async getContactsPage(locale) {
    await wait()
    return getContactsContent(locale)
  },
  async getServices(locale, area) {
    await wait()
    return getSeedServices(locale, area, await publicOverlayRecords())
  },
  async getServiceBySlug(locale, area, slug) {
    await wait()
    return getSeedServiceBySlug(locale, area, slug, await publicOverlayRecords())
  },
  async getCourses(locale) {
    await wait()
    return getSeedCourses(locale, await publicOverlayRecords())
  },
  async getCollections(locale) {
    await wait()
    return getSeedCollections(locale, await publicOverlayRecords())
  },
  async getCollectionBySlug(locale, slug) {
    await wait()
    return getSeedCollectionBySlug(locale, slug, await publicOverlayRecords())
  },
  async getPortfolio(locale) {
    await wait()
    return getSeedPortfolio(locale, await publicOverlayRecords())
  },
  async getPortfolioCaseBySlug(locale, slug) {
    await wait()
    return getSeedPortfolioCaseBySlug(locale, slug, await publicOverlayRecords())
  },
  async getTransformationOffers(locale) {
    await wait()
    return getSeedTransformations(locale, await publicOverlayRecords())
  },
  async getUiCopy(locale) {
    await wait()
    return getUiCopy(locale)
  },
  async getStudioSettings(locale) {
    await wait()
    return getStudioSettings(locale)
  },
  async getAdminNavigation(locale) {
    await wait()
    return getAdminNavigation(locale)
  },
  async getManagedContentIndex(locale, kind) {
    await wait()
    return managedContentProvider.listManagedContent(locale, kind)
  },
  async getManagedContentRecord(locale, kind, slug) {
    await wait()
    return managedContentProvider.getManagedContentRecord(locale, kind, slug)
  },
  async upsertManagedContent(input) {
    await wait()
    const result = await managedContentProvider.upsertManagedContent(input)
    if (result.status !== 'blocked') {
      await writeContentOverlayRecords(managedContentProvider.exportOverlayRecords())
    }
    return result
  },
  async archiveManagedContent(input) {
    await wait()
    const result = await managedContentProvider.archiveManagedContent(input)
    if (result.status !== 'blocked') {
      await writeContentOverlayRecords(managedContentProvider.exportOverlayRecords())
    }
    return result
  },
}

export function requireServiceArea(value: string): ServiceArea {
  return value === 'realisation' ? 'realisation' : 'research'
}

export function requireLocale(locale: Locale) {
  return locale
}
