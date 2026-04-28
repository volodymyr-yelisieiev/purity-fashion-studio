import { queryOptions } from '@tanstack/react-query'
import {
  getManagedContentRecord,
  listManagedContent,
} from './admin-content'
import { contentRepository } from './repository'
import type {
  EntityKind,
  Locale,
  ManagedContentRecord,
  ManagedContentSummary,
  ServiceArea,
} from './types'

export const contentQueries = {
  ui: (locale: Locale) =>
    queryOptions({
      queryKey: ['ui', locale],
      queryFn: () => contentRepository.getUiCopy(locale),
    }),
  home: (locale: Locale) =>
    queryOptions({
      queryKey: ['home', locale],
      queryFn: () => contentRepository.getHomePage(locale),
    }),
  researchPage: (locale: Locale) =>
    queryOptions({
      queryKey: ['page', locale, 'research'],
      queryFn: () => contentRepository.getResearchPage(locale),
    }),
  realisationPage: (locale: Locale) =>
    queryOptions({
      queryKey: ['page', locale, 'realisation'],
      queryFn: () => contentRepository.getRealisationPage(locale),
    }),
  transformationPage: (locale: Locale) =>
    queryOptions({
      queryKey: ['page', locale, 'transformation'],
      queryFn: () => contentRepository.getTransformationPage(locale),
    }),
  schoolPage: (locale: Locale) =>
    queryOptions({
      queryKey: ['page', locale, 'school'],
      queryFn: () => contentRepository.getSchoolPage(locale),
    }),
  collectionsPage: (locale: Locale) =>
    queryOptions({
      queryKey: ['page', locale, 'collections'],
      queryFn: () => contentRepository.getCollectionsPage(locale),
    }),
  portfolioPage: (locale: Locale) =>
    queryOptions({
      queryKey: ['page', locale, 'portfolio'],
      queryFn: () => contentRepository.getPortfolioPage(locale),
    }),
  contactsPage: (locale: Locale) =>
    queryOptions({
      queryKey: ['page', locale, 'contacts'],
      queryFn: () => contentRepository.getContactsPage(locale),
    }),
  services: (locale: Locale, area?: ServiceArea) =>
    queryOptions({
      queryKey: ['services', locale, area ?? 'all'],
      queryFn: () => contentRepository.getServices(locale, area),
    }),
  service: (locale: Locale, area: ServiceArea, slug: string) =>
    queryOptions({
      queryKey: ['service', locale, area, slug],
      queryFn: () => contentRepository.getServiceBySlug(locale, area, slug),
    }),
  courses: (locale: Locale) =>
    queryOptions({
      queryKey: ['courses', locale],
      queryFn: () => contentRepository.getCourses(locale),
    }),
  collections: (locale: Locale) =>
    queryOptions({
      queryKey: ['collections', locale],
      queryFn: () => contentRepository.getCollections(locale),
    }),
  collection: (locale: Locale, slug: string) =>
    queryOptions({
      queryKey: ['collection', locale, slug],
      queryFn: () => contentRepository.getCollectionBySlug(locale, slug),
    }),
  portfolio: (locale: Locale) =>
    queryOptions({
      queryKey: ['portfolio', locale],
      queryFn: () => contentRepository.getPortfolio(locale),
    }),
  portfolioCase: (locale: Locale, slug: string) =>
    queryOptions({
      queryKey: ['portfolio', locale, slug],
      queryFn: () => contentRepository.getPortfolioCaseBySlug(locale, slug),
    }),
  transformations: (locale: Locale) =>
    queryOptions({
      queryKey: ['transformations', locale],
      queryFn: () => contentRepository.getTransformationOffers(locale),
    }),
  studioSettings: (locale: Locale) =>
    queryOptions({
      queryKey: ['settings', locale],
      queryFn: () => contentRepository.getStudioSettings(locale),
    }),
  adminNavigation: (locale: Locale) =>
    queryOptions({
      queryKey: ['admin', locale, 'navigation'],
      queryFn: () => contentRepository.getAdminNavigation(locale),
    }),
  managedContentIndex: (locale: Locale, kind?: EntityKind) =>
    queryOptions({
      queryKey: ['admin', locale, 'content-index', kind ?? 'all'],
      queryFn: async () =>
        (await listManagedContent({ data: { locale, kind } })) as ManagedContentSummary[],
    }),
  managedContentRecord: (locale: Locale, kind: EntityKind, slug: string) =>
    queryOptions({
      queryKey: ['admin', locale, 'content-record', kind, slug],
      queryFn: async () =>
        (await getManagedContentRecord({ data: { locale, kind, slug } })) as
          | ManagedContentRecord
          | undefined,
    }),
}
