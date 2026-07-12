import {
  collections as seedCollections,
  courses as seedCourses,
  mediaAssets as seedMediaAssets,
  navigation as seedNavigation,
  portfolioCases as seedPortfolioCases,
  publicPages as seedPublicPages,
  serviceCategories as seedServiceCategories,
  services as seedServices,
  siteSettings as seedSiteSettings,
} from "./data"

export type ContentSnapshot = {
  serviceCategories: typeof seedServiceCategories
  services: typeof seedServices
  courses: typeof seedCourses
  collections: typeof seedCollections
  portfolioCases: typeof seedPortfolioCases
  publicPages: typeof seedPublicPages
  navigation: typeof seedNavigation
  mediaAssets: typeof seedMediaAssets
  siteSettings: typeof seedSiteSettings
}

export const seedContentSnapshot: ContentSnapshot = {
  serviceCategories: seedServiceCategories,
  services: seedServices,
  courses: seedCourses,
  collections: seedCollections,
  portfolioCases: seedPortfolioCases,
  publicPages: seedPublicPages,
  navigation: seedNavigation,
  mediaAssets: seedMediaAssets,
  siteSettings: seedSiteSettings,
}

export function getContentSnapshot(): ContentSnapshot {
  return seedContentSnapshot
}

export const {
  serviceCategories,
  services,
  courses,
  collections,
  portfolioCases,
  publicPages,
  navigation,
  mediaAssets,
  siteSettings,
} = getContentSnapshot()
