import {
  collections,
  courses,
  mediaAssets,
  portfolioCases,
  publicPages,
  serviceCategories,
  services,
} from "./source"
import type { ServiceCategorySlug } from "./model"

export function getCategory(slug: ServiceCategorySlug) {
  return serviceCategories.find((category) => category.slug === slug)
}

export function getCategoryByRoute(routeSegment: string) {
  return serviceCategories.find(
    (category) => category.routeSegment === routeSegment
  )
}

export function getMediaAsset(id: string) {
  return mediaAssets.find((asset) => asset.id === id)
}

export function getFirstMediaAsset(mediaIds: string[] = []) {
  return mediaIds.map(getMediaAsset).find((asset) => asset?.src)
}

export function getPublicPageByRoute(routeSegment: string) {
  return publicPages.find((page) => page.routeSegment === routeSegment)
}

export function getVisibleServicesByCategory(category: ServiceCategorySlug) {
  return services.filter(
    (service) => service.visibleInMvp && service.category === category
  )
}

export function getVisibleCourses() {
  return courses.filter((course) => course.visibleInMvp)
}

export function getVisibleCollections() {
  return collections.filter((collection) => collection.visibleInMvp)
}

export function getVisibleService(routeSegment: string) {
  return services.find(
    (service) => service.visibleInMvp && service.routeSegment === routeSegment
  )
}

export function getVisibleCourse(routeSegment: string) {
  return courses.find(
    (course) => course.visibleInMvp && course.routeSegment === routeSegment
  )
}

export function getVisibleCollection(routeSegment: string) {
  return collections.find(
    (collection) =>
      collection.visibleInMvp && collection.routeSegment === routeSegment
  )
}

export function getVisiblePortfolioCase(routeSegment: string) {
  return portfolioCases.find(
    (portfolioCase) =>
      portfolioCase.visibleInMvp &&
      portfolioCase.isRealClientProof &&
      portfolioCase.routeSegment === routeSegment
  )
}

export function getVisiblePortfolioCases() {
  return portfolioCases.filter(
    (portfolioCase) =>
      portfolioCase.visibleInMvp && portfolioCase.isRealClientProof
  )
}
