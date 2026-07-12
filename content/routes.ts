import {
  collections,
  courses,
  navigation,
  portfolioCases,
  publicPages,
  serviceCategories,
  services,
  siteSettings,
} from "./source"
import type { Locale } from "../i18n/routing"
import { localizePath } from "../i18n/routing"

export type ContentRouteKind =
  | "navigation"
  | "section"
  | "service"
  | "course"
  | "collection"
  | "portfolio-case"

export type ContentRoute = {
  id: string
  kind: ContentRouteKind
  path: string
  href: string
  label: string
}

export function servicePath(routeSegment: string) {
  return `/services/${routeSegment}`
}

export function sectionPath(routeSegment: string) {
  return `/${routeSegment}`
}

export function coursePath(routeSegment: string) {
  return `/courses/${routeSegment}`
}

export function collectionPath(routeSegment: string) {
  return `/collections/${routeSegment}`
}

export function portfolioCasePath(routeSegment: string) {
  return `/portfolio/${routeSegment}`
}

export function getNavigation(locale: Locale) {
  return siteSettings.primaryNavigation
    .map((id) => navigation.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .filter((item) => item.visibleInMvp)
    .map((item) => ({
      id: item.id,
      label: item.label[locale],
      path: item.path,
      href: localizePath(locale, item.path),
    }))
}

export function getFooterNavigation(locale: Locale) {
  return siteSettings.footerNavigation
    .map((id) => navigation.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) => ({
      id: item.id,
      label: item.label[locale],
      path: item.path,
      href: localizePath(locale, item.path),
    }))
}

export function getContentRoutes(locale: Locale): ContentRoute[] {
  return [
    ...navigation.map((item) => ({
      id: item.id,
      kind: "navigation" as const,
      path: item.path,
      href: localizePath(locale, item.path),
      label: item.label[locale],
    })),
    ...serviceCategories
      .filter(
        (category) =>
          category.slug !== "portfolio" && category.slug !== "contacts"
      )
      .map((category) => {
        const path = sectionPath(category.routeSegment)

        return {
          id: category.slug,
          kind: "section" as const,
          path,
          href: localizePath(locale, path),
          label: category.title[locale],
        }
      }),
    ...publicPages.map((page) => {
      const path = sectionPath(page.routeSegment)

      return {
        id: page.slug,
        kind: "section" as const,
        path,
        href: localizePath(locale, path),
        label: page.title[locale],
      }
    }),
    ...services
      .filter((service) => service.visibleInMvp)
      .map((service) => {
        const path = servicePath(service.routeSegment)

        return {
          id: service.slug,
          kind: "service" as const,
          path,
          href: localizePath(locale, path),
          label: service.title[locale],
        }
      }),
    ...courses
      .filter((course) => course.visibleInMvp)
      .map((course) => {
        const path = coursePath(course.routeSegment)

        return {
          id: course.slug,
          kind: "course" as const,
          path,
          href: localizePath(locale, path),
          label: course.title[locale],
        }
      }),
    ...collections
      .filter((collection) => collection.visibleInMvp)
      .map((collection) => {
        const path = collectionPath(collection.routeSegment)

        return {
          id: collection.slug,
          kind: "collection" as const,
          path,
          href: localizePath(locale, path),
          label: collection.title[locale],
        }
      }),
    ...portfolioCases
      .filter(
        (portfolioCase) =>
          portfolioCase.visibleInMvp && portfolioCase.isRealClientProof
      )
      .map((portfolioCase) => {
        const path = portfolioCasePath(portfolioCase.routeSegment)

        return {
          id: portfolioCase.slug,
          kind: "portfolio-case" as const,
          path,
          href: localizePath(locale, path),
          label: portfolioCase.title[locale],
        }
      }),
  ]
}
