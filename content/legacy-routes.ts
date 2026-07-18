import {
  collections,
  courses,
  navigation,
  portfolioCases,
  publicPages,
  serviceCategories,
  services,
} from "./data"
import {
  collectionPath,
  coursePath,
  portfolioCasePath,
  sectionPath,
  servicePath,
  type ContentRoute,
} from "./routes"
import { localizePath, type Locale } from "../i18n/routing"

/** Migration-only route manifest. Public runtime must not import this module. */
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
      .filter((item) => !["portfolio", "contacts"].includes(item.slug))
      .map((item) => ({
        id: item.slug,
        kind: "section" as const,
        path: sectionPath(item.routeSegment),
        href: localizePath(locale, sectionPath(item.routeSegment)),
        label: item.title[locale],
      })),
    ...publicPages.map((item) => ({
      id: item.slug,
      kind: "section" as const,
      path: sectionPath(item.routeSegment),
      href: localizePath(locale, sectionPath(item.routeSegment)),
      label: item.title[locale],
    })),
    ...services.filter((item) => item.visibleInMvp).map((item) => ({
      id: item.slug,
      kind: "service" as const,
      path: servicePath(item.routeSegment),
      href: localizePath(locale, servicePath(item.routeSegment)),
      label: item.title[locale],
    })),
    ...courses.filter((item) => item.visibleInMvp).map((item) => ({
      id: item.slug,
      kind: "course" as const,
      path: coursePath(item.routeSegment),
      href: localizePath(locale, coursePath(item.routeSegment)),
      label: item.title[locale],
    })),
    ...collections.filter((item) => item.visibleInMvp).map((item) => ({
      id: item.slug,
      kind: "collection" as const,
      path: collectionPath(item.routeSegment),
      href: localizePath(locale, collectionPath(item.routeSegment)),
      label: item.title[locale],
    })),
    ...portfolioCases
      .filter((item) => item.visibleInMvp && item.isRealClientProof)
      .map((item) => ({
        id: item.slug,
        kind: "portfolio-case" as const,
        path: portfolioCasePath(item.routeSegment),
        href: localizePath(locale, portfolioCasePath(item.routeSegment)),
        label: item.title[locale],
      })),
  ]
}
