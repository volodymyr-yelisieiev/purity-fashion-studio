import { locales } from "@/i18n/routing"

import {
  collections,
  courses,
  mediaAssets,
  navigation,
  portfolioCases,
  publicPages,
  serviceCategories,
  services,
  siteSettings,
} from "./data"

const migrationContent = {
  serviceCategories,
  services,
  courses,
  collections,
  portfolioCases,
  publicPages,
  navigation,
  mediaAssets,
  siteSettings,
}

export const cmsCollectionSlugs = [
  "service-categories",
  "services",
  "courses",
  "collections",
  "portfolio-cases",
  "testimonials",
  "media-assets",
  "pages",
  "settings",
  "leads",
  "booking-requests",
  "payment-orders",
] as const

export type CmsCollectionSlug = (typeof cmsCollectionSlugs)[number]

export type CmsFieldKind =
  | "text"
  | "textarea"
  | "richText"
  | "select"
  | "checkbox"
  | "array"
  | "relationship"
  | "upload"
  | "url"
  | "email"
  | "phone"
  | "date"
  | "json"

export type CmsFieldDefinition = {
  name: string
  kind: CmsFieldKind
  localized?: boolean
  required?: boolean
  relationTo?: CmsCollectionSlug
  options?: readonly string[]
}

export type CmsCollectionDefinition = {
  slug: CmsCollectionSlug
  adminLabel: string
  purpose: string
  fields: CmsFieldDefinition[]
  access: {
    read: "public" | "admin"
    create: "admin" | "system"
    update: "admin" | "system"
  }
}

export type CmsSeed = Record<CmsCollectionSlug, unknown[]>

const localeOptions = locales

export const cmsCollections: CmsCollectionDefinition[] = [
  {
    slug: "service-categories",
    adminLabel: "Service categories",
    purpose: "Top-level PURITY directions used by navigation and services.",
    fields: [
      { name: "slug", kind: "text", required: true },
      { name: "routeSegment", kind: "text", required: true },
      { name: "sourceUrl", kind: "url" },
      { name: "sourceLabel", kind: "text" },
      { name: "title", kind: "text", localized: true, required: true },
      { name: "summary", kind: "textarea", localized: true, required: true },
    ],
    access: { read: "public", create: "admin", update: "admin" },
  },
  {
    slug: "services",
    adminLabel: "Services",
    purpose: "Bookable service detail pages and homepage service rails.",
    fields: [
      { name: "slug", kind: "text", required: true },
      {
        name: "category",
        kind: "relationship",
        relationTo: "service-categories",
        required: true,
      },
      { name: "routeSegment", kind: "text", required: true },
      { name: "sourceUrl", kind: "url" },
      { name: "sourceLabel", kind: "text" },
      { name: "visibleInMvp", kind: "checkbox", required: true },
      { name: "title", kind: "text", localized: true, required: true },
      { name: "summary", kind: "textarea", localized: true, required: true },
      {
        name: "commercialStatus",
        kind: "text",
        localized: true,
        required: true,
      },
      { name: "priceNote", kind: "textarea", localized: true, required: true },
      { name: "outcomes", kind: "array", localized: true, required: true },
      {
        name: "mediaIds",
        kind: "relationship",
        relationTo: "media-assets",
        required: true,
      },
      { name: "seo", kind: "json", localized: true, required: true },
    ],
    access: { read: "public", create: "admin", update: "admin" },
  },
  {
    slug: "courses",
    adminLabel: "Courses",
    purpose: "Education products and course detail pages.",
    fields: [
      { name: "slug", kind: "text", required: true },
      { name: "routeSegment", kind: "text", required: true },
      { name: "sourceUrl", kind: "url" },
      { name: "sourceLabel", kind: "text" },
      { name: "visibleInMvp", kind: "checkbox", required: true },
      { name: "title", kind: "text", localized: true, required: true },
      { name: "summary", kind: "textarea", localized: true, required: true },
      {
        name: "commercialStatus",
        kind: "text",
        localized: true,
        required: true,
      },
      { name: "priceNote", kind: "textarea", localized: true, required: true },
      { name: "audience", kind: "textarea", localized: true, required: true },
      { name: "lessons", kind: "array", localized: true, required: true },
      {
        name: "mediaIds",
        kind: "relationship",
        relationTo: "media-assets",
        required: true,
      },
      { name: "seo", kind: "json", localized: true, required: true },
    ],
    access: { read: "public", create: "admin", update: "admin" },
  },
  {
    slug: "collections",
    adminLabel: "Collections",
    purpose: "Capsule collection entries and purchasable/editorial lines.",
    fields: [
      { name: "slug", kind: "text", required: true },
      { name: "routeSegment", kind: "text", required: true },
      { name: "sourceUrl", kind: "url" },
      { name: "sourceLabel", kind: "text" },
      { name: "visibleInMvp", kind: "checkbox", required: true },
      { name: "title", kind: "text", localized: true, required: true },
      { name: "summary", kind: "textarea", localized: true, required: true },
      {
        name: "commercialStatus",
        kind: "text",
        localized: true,
        required: true,
      },
      { name: "priceNote", kind: "textarea", localized: true, required: true },
      { name: "materials", kind: "array", localized: true, required: true },
      {
        name: "mediaIds",
        kind: "relationship",
        relationTo: "media-assets",
        required: true,
      },
      { name: "seo", kind: "json", localized: true, required: true },
    ],
    access: { read: "public", create: "admin", update: "admin" },
  },
  {
    slug: "portfolio-cases",
    adminLabel: "Portfolio cases",
    purpose: "Client-proof portfolio cases gated by proof readiness.",
    fields: [
      { name: "slug", kind: "text", required: true },
      { name: "routeSegment", kind: "text", required: true },
      { name: "visibleInMvp", kind: "checkbox", required: true },
      { name: "title", kind: "text", localized: true, required: true },
      { name: "summary", kind: "textarea", localized: true, required: true },
      {
        name: "mediaIds",
        kind: "relationship",
        relationTo: "media-assets",
        required: true,
      },
      { name: "isRealClientProof", kind: "checkbox", required: true },
      { name: "seo", kind: "json", localized: true, required: true },
    ],
    access: { read: "public", create: "admin", update: "admin" },
  },
  {
    slug: "testimonials",
    adminLabel: "Testimonials",
    purpose:
      "Future client testimonials held out of MVP until approved proof exists.",
    fields: [
      { name: "slug", kind: "text", required: true },
      { name: "quote", kind: "richText", localized: true, required: true },
      { name: "attribution", kind: "text", localized: true, required: true },
      { name: "visibleInMvp", kind: "checkbox", required: true },
    ],
    access: { read: "public", create: "admin", update: "admin" },
  },
  {
    slug: "media-assets",
    adminLabel: "Media assets",
    purpose: "Logo, generated placeholders, and future uploaded proof imagery.",
    fields: [
      { name: "id", kind: "text", required: true },
      {
        name: "kind",
        kind: "select",
        options: ["logo", "image"],
        required: true,
      },
      {
        name: "source",
        kind: "select",
        options: ["client", "generated"],
        required: true,
      },
      { name: "generated", kind: "checkbox", required: true },
      { name: "fileName", kind: "text", required: true },
      { name: "aspectRatio", kind: "text", required: true },
      { name: "upload", kind: "upload" },
      { name: "sourceFile", kind: "text" },
      { name: "sourceMetadata", kind: "json" },
      { name: "src", kind: "text" },
      { name: "usage", kind: "array", required: true },
      { name: "internalLabel", kind: "text", localized: true, required: true },
      { name: "alt", kind: "text", localized: true, required: true },
      { name: "replacementPriority", kind: "select", required: true },
      { name: "isRealClientProof", kind: "checkbox", required: true },
    ],
    access: { read: "public", create: "admin", update: "admin" },
  },
  {
    slug: "pages",
    adminLabel: "Pages",
    purpose: "Static public pages such as studio, booking, privacy, and terms.",
    fields: [
      { name: "slug", kind: "text", required: true },
      { name: "routeSegment", kind: "text", required: true },
      { name: "sourceUrl", kind: "url" },
      { name: "sourceLabel", kind: "text" },
      { name: "title", kind: "text", localized: true, required: true },
      { name: "eyebrow", kind: "text", localized: true, required: true },
      { name: "summary", kind: "textarea", localized: true, required: true },
      { name: "body", kind: "array", localized: true, required: true },
      {
        name: "mediaIds",
        kind: "relationship",
        relationTo: "media-assets",
      },
      { name: "cta", kind: "json" },
      { name: "seo", kind: "json", localized: true, required: true },
    ],
    access: { read: "public", create: "admin", update: "admin" },
  },
  {
    slug: "settings",
    adminLabel: "Settings",
    purpose:
      "Singleton site settings, navigation, contacts, home copy, and SEO.",
    fields: [
      { name: "brandName", kind: "text", required: true },
      { name: "languageLabel", kind: "text", localized: true, required: true },
      { name: "home", kind: "json", required: true },
      { name: "primaryNavigation", kind: "array", required: true },
      { name: "footerNavigation", kind: "array", required: true },
      { name: "contacts", kind: "json", required: true },
      { name: "seo", kind: "json", localized: true, required: true },
    ],
    access: { read: "public", create: "admin", update: "admin" },
  },
  {
    slug: "leads",
    adminLabel: "Leads",
    purpose: "Inbound contact identity created by booking/contact forms.",
    fields: [
      { name: "id", kind: "text", required: true },
      {
        name: "locale",
        kind: "select",
        options: localeOptions,
        required: true,
      },
      { name: "name", kind: "text", required: true },
      { name: "email", kind: "email", required: true },
      { name: "phone", kind: "phone" },
      { name: "company", kind: "text" },
      {
        name: "source",
        kind: "select",
        options: ["booking", "contact"],
        required: true,
      },
      { name: "createdAt", kind: "date", required: true },
    ],
    access: { read: "admin", create: "system", update: "admin" },
  },
  {
    slug: "booking-requests",
    adminLabel: "Booking requests",
    purpose: "Validated service inquiry payloads created from the booking UI.",
    fields: [
      { name: "id", kind: "text", required: true },
      {
        name: "lead",
        kind: "relationship",
        relationTo: "leads",
        required: true,
      },
      {
        name: "service",
        kind: "relationship",
        relationTo: "services",
        required: true,
      },
      {
        name: "inquiryType",
        kind: "select",
        options: ["private", "corporate"],
        required: true,
      },
      {
        name: "format",
        kind: "select",
        options: ["studio", "online", "atelier"],
        required: true,
      },
      {
        name: "contactMethod",
        kind: "select",
        options: ["email", "phone"],
        required: true,
      },
      {
        name: "budgetCurrency",
        kind: "select",
        options: ["EUR", "UAH"],
        required: true,
      },
      { name: "message", kind: "textarea", required: true },
      {
        name: "status",
        kind: "select",
        options: ["new", "reviewed", "waiting", "closed"],
        required: true,
      },
      { name: "createdAt", kind: "date", required: true },
    ],
    access: { read: "admin", create: "system", update: "admin" },
  },
  {
    slug: "payment-orders",
    adminLabel: "Payment orders",
    purpose: "Server-created payment order records for Stripe/LiqPay adapters.",
    fields: [
      { name: "id", kind: "text", required: true },
      {
        name: "bookingRequest",
        kind: "relationship",
        relationTo: "booking-requests",
        required: true,
      },
      {
        name: "provider",
        kind: "select",
        options: ["stripe", "liqpay"],
        required: true,
      },
      {
        name: "currency",
        kind: "select",
        options: ["EUR", "UAH"],
        required: true,
      },
      {
        name: "mode",
        kind: "select",
        options: ["test", "live"],
        required: true,
      },
      { name: "checkoutUrl", kind: "text", required: true },
      {
        name: "status",
        kind: "select",
        options: ["created", "paid", "cancelled", "failed"],
        required: true,
      },
      { name: "createdAt", kind: "date", required: true },
    ],
    access: { read: "admin", create: "system", update: "system" },
  },
]

function withCmsId<T extends { slug?: string; id?: string }>(entry: T) {
  return {
    id: entry.id ?? entry.slug,
    ...entry,
  }
}

export function buildCmsSeed(snapshot = migrationContent): CmsSeed {
  return {
    "service-categories": snapshot.serviceCategories.map(withCmsId),
    services: snapshot.services.map(withCmsId),
    courses: snapshot.courses.map(withCmsId),
    collections: snapshot.collections.map(withCmsId),
    "portfolio-cases": snapshot.portfolioCases.map(withCmsId),
    testimonials: [],
    "media-assets": snapshot.mediaAssets.map(withCmsId),
    pages: snapshot.publicPages.map(withCmsId),
    settings: [
      {
        id: "site-settings",
        ...snapshot.siteSettings,
      },
    ],
    leads: [],
    "booking-requests": [],
    "payment-orders": [],
  }
}

function hasAllLocales(value: unknown) {
  if (!value || typeof value !== "object") {
    return false
  }

  return locales.every((locale) =>
    Object.prototype.hasOwnProperty.call(value, locale)
  )
}

function assertUniqueIds(
  issues: string[],
  collection: CmsCollectionSlug,
  entries: unknown[]
) {
  const seen = new Set<string>()

  for (const entry of entries) {
    if (!entry || typeof entry !== "object" || !("id" in entry)) {
      issues.push(`${collection} entry is missing id`)
      continue
    }

    const id = String(entry.id)

    if (seen.has(id)) {
      issues.push(`${collection} has duplicate id: ${id}`)
    }

    seen.add(id)
  }
}

function assertLocalizedFields(
  issues: string[],
  collection: CmsCollectionDefinition,
  entries: unknown[]
) {
  const fields = collection.fields.filter((field) => field.localized)

  for (const entry of entries) {
    if (!entry || typeof entry !== "object") {
      continue
    }

    const id = "id" in entry ? String(entry.id) : "unknown"

    for (const field of fields) {
      const value = (entry as Record<string, unknown>)[field.name]

      if (!hasAllLocales(value)) {
        issues.push(
          `${collection.slug}/${id} missing localized field ${field.name}`
        )
      }
    }
  }
}

export function validateCmsSeed(seed: CmsSeed = buildCmsSeed()) {
  const issues: string[] = []

  for (const collection of cmsCollections) {
    const entries = seed[collection.slug]

    if (!Array.isArray(entries)) {
      issues.push(`Missing seed collection: ${collection.slug}`)
      continue
    }

    assertUniqueIds(issues, collection.slug, entries)
    assertLocalizedFields(issues, collection, entries)
  }

  const categories = new Set(
    seed["service-categories"].map((entry) => (entry as { slug: string }).slug)
  )
  const mediaIds = new Set(
    seed["media-assets"].map((entry) => (entry as { id: string }).id)
  )
  const serviceIds = new Set(
    seed.services.map((entry) => (entry as { slug: string }).slug)
  )

  for (const service of seed.services as Array<{
    slug: string
    category: string
    mediaIds: string[]
  }>) {
    if (!categories.has(service.category)) {
      issues.push(
        `services/${service.slug} references missing category ${service.category}`
      )
    }

    for (const mediaId of service.mediaIds) {
      if (!mediaIds.has(mediaId)) {
        issues.push(
          `services/${service.slug} references missing media ${mediaId}`
        )
      }
    }
  }

  for (const course of seed.courses as Array<{
    slug: string
    mediaIds: string[]
  }>) {
    for (const mediaId of course.mediaIds) {
      if (!mediaIds.has(mediaId)) {
        issues.push(
          `courses/${course.slug} references missing media ${mediaId}`
        )
      }
    }
  }

  for (const collection of seed.collections as Array<{
    slug: string
    mediaIds: string[]
  }>) {
    for (const mediaId of collection.mediaIds) {
      if (!mediaIds.has(mediaId)) {
        issues.push(
          `collections/${collection.slug} references missing media ${mediaId}`
        )
      }
    }
  }

  for (const portfolioCase of seed["portfolio-cases"] as Array<{
    slug: string
    mediaIds: string[]
  }>) {
    for (const mediaId of portfolioCase.mediaIds) {
      if (!mediaIds.has(mediaId)) {
        issues.push(
          `portfolio-cases/${portfolioCase.slug} references missing media ${mediaId}`
        )
      }
    }
  }

  for (const page of seed.pages as Array<{
    slug: string
    mediaIds?: string[]
  }>) {
    for (const mediaId of page.mediaIds ?? []) {
      if (!mediaIds.has(mediaId)) {
        issues.push(`pages/${page.slug} references missing media ${mediaId}`)
      }
    }
  }

  for (const request of seed["booking-requests"] as Array<{
    id: string
    service?: string
  }>) {
    if (request.service && !serviceIds.has(request.service)) {
      issues.push(
        `booking-requests/${request.id} references missing service ${request.service}`
      )
    }
  }

  return {
    ok: issues.length === 0,
    issues,
  }
}

export function cmsSeedCounts(seed: CmsSeed = buildCmsSeed()) {
  return Object.fromEntries(
    cmsCollectionSlugs.map((slug) => [slug, seed[slug].length])
  ) as Record<CmsCollectionSlug, number>
}
