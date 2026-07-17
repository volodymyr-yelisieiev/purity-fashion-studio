import nextEnv from "@next/env"
import { existsSync } from "node:fs"
import path from "node:path"
import { getPayload, type CollectionSlug, type Where } from "payload"

import {
  categoryPageCopy,
  studioPageCopy,
} from "../../content/category-page-specs"
import {
  collections,
  courses,
  mediaAssets,
  navigation,
  publicPages,
  serviceCategories,
  services,
  siteSettings,
} from "../../content/data"
import { serviceDetailCopy } from "../../content/service-page-specs"
import { locales, type Locale } from "../../i18n/routing"

const { loadEnvConfig } = nextEnv
loadEnvConfig(process.cwd())

const force = process.argv.includes("--force")
const publish = !process.argv.includes("--draft")
const counts = new Map<string, number>()

if (process.env.PAYLOAD_ENABLED !== "true") {
  throw new Error(
    "Set PAYLOAD_ENABLED=true before running the Payload seed importer."
  )
}

if (process.env.ALLOW_CMS_SEED !== "true") {
  throw new Error("Set ALLOW_CMS_SEED=true to acknowledge CMS seed writes.")
}

if (process.env.NODE_ENV === "production" && !force) {
  throw new Error("Production seed requires the explicit --force flag.")
}

const { default: config } = await import("../../payload.config")
const payload = await getPayload({ config })

type ID = string
type LocaleData = Record<Locale, Record<string, unknown>>

function localizedObject(
  builder: (locale: Locale) => Record<string, unknown>
): LocaleData {
  return Object.fromEntries(
    locales.map((locale) => [locale, builder(locale)])
  ) as LocaleData
}

function definedIDs(values: Array<ID | undefined>): ID[] {
  return values.filter((value): value is ID => Boolean(value))
}

function isCategoryPageKey(
  value: string
): value is keyof typeof categoryPageCopy {
  return value in categoryPageCopy
}

function increment(label: string) {
  counts.set(label, (counts.get(label) ?? 0) + 1)
}

async function upsertLocalized({
  collection,
  key,
  value,
  common,
  localizedData,
  drafts = true,
  filePath,
}: {
  collection: CollectionSlug
  key: string
  value: string
  common: Record<string, unknown>
  localizedData: LocaleData
  drafts?: boolean
  filePath?: string
}): Promise<ID> {
  const where: Where = { [key]: { equals: value } }
  const existing = await payload.find({
    collection,
    depth: 0,
    fallbackLocale: false,
    limit: 1,
    locale: "uk",
    overrideAccess: true,
    where,
  })

  if (existing.docs[0] && process.env.NODE_ENV === "production" && !force) {
    increment(`${collection}:skipped`)
    return existing.docs[0].id
  }

  let id = existing.docs[0]?.id
  const initialData = { ...common, ...localizedData.uk }

  if (id) {
    await payload.update({
      collection,
      data: initialData,
      draft: drafts ? !publish : undefined,
      id,
      locale: "uk",
      overrideAccess: true,
    } as never)
    increment(`${collection}:updated`)
  } else {
    const created = await payload.create({
      collection,
      data: initialData,
      draft: drafts ? !publish : undefined,
      filePath,
      locale: "uk",
      overrideAccess: true,
      publishAllLocales: publish,
    } as never)
    id = created.id
    increment(`${collection}:created`)
  }

  for (const locale of locales.filter((candidate) => candidate !== "uk")) {
    await payload.update({
      collection,
      data: localizedData[locale],
      draft: drafts ? !publish : undefined,
      id,
      locale,
      overrideAccess: true,
    } as never)
  }

  return id
}

async function updateGlobalLocalized(
  slug: "home" | "header" | "footer" | "site-settings",
  common: Record<string, unknown>,
  localizedData: LocaleData,
  drafts: boolean
) {
  if (process.env.NODE_ENV === "production" && !force) {
    increment(`${slug}:skipped`)
    return
  }

  for (const locale of locales) {
    await payload.updateGlobal({
      slug,
      data: { ...common, ...localizedData[locale] },
      draft: drafts ? !publish : undefined,
      locale,
      overrideAccess: true,
    } as never)
  }
  increment(`${slug}:updated`)
}

function mediaPath(asset: (typeof mediaAssets)[number]): string {
  const candidates = [
    asset.src
      ? path.resolve(process.cwd(), "public", asset.src.replace(/^\//, ""))
      : "",
    asset.sourceFile ? path.resolve(process.cwd(), asset.sourceFile) : "",
  ].filter(Boolean)
  const filePath = candidates.find((candidate) => existsSync(candidate))

  if (!filePath) {
    throw new Error(
      `Missing media file for ${asset.id}: ${candidates.join(", ")}`
    )
  }

  return filePath
}

async function importMedia(): Promise<Map<string, ID>> {
  const ids = new Map<string, ID>()

  for (const asset of mediaAssets) {
    const generated = asset.source === "generated"
    const replacementPriority =
      asset.replacementPriority === "replace-before-launch"
        ? "replace-before-launch"
        : asset.replacementPriority === "replace-when-client-proof-arrives"
          ? "replace-when-approved"
          : "none"
    const localizedData = localizedObject((locale) => ({
      alt: asset.alt[locale],
    }))
    const id = await upsertLocalized({
      collection: "media",
      key: "internalLabel",
      value: asset.id,
      drafts: false,
      filePath: mediaPath(asset),
      common: {
        internalLabel: asset.id,
        source: asset.source,
        usageRightsStatus: generated ? "approved" : "pending",
        modelReleaseStatus: "not-applicable",
        publicVisibility: generated,
        isRealClientProof: false,
        replacementPriority,
        allowedUsageContexts: asset.usage
          .map((usage) => usage.split(" ")[0])
          .filter((usage) =>
            [
              "home",
              "service",
              "course",
              "collection",
              "portfolio",
              "studio",
            ].includes(usage)
          ),
        sourceMetadata: JSON.stringify(asset.sourceMetadata ?? {}),
      },
      localizedData,
    })
    ids.set(asset.id, id)
  }

  return ids
}

async function importDirections(): Promise<Map<string, ID>> {
  const ids = new Map<string, ID>()
  const canonical = new Set([
    "research",
    "realisation",
    "transformation",
    "corporate",
    "school",
    "collections",
  ])

  for (const direction of serviceCategories.filter((item) =>
    canonical.has(item.slug)
  )) {
    const spec = isCategoryPageKey(direction.slug)
      ? categoryPageCopy[direction.slug]
      : undefined
    const localizedData = localizedObject((locale) => ({
      title: direction.title[locale],
      summary: direction.summary[locale],
      eyebrow: direction.title[locale],
      narrative: spec?.heroNote[locale] ?? direction.summary[locale],
      processSteps:
        spec?.processSteps.map((step) => ({
          title: step.title[locale],
          description: step.text[locale],
        })) ?? [],
      outcomes:
        spec?.outcomes.map((outcome) => ({ text: outcome[locale] })) ?? [],
      meta: {
        title: `${direction.title[locale]} | PURITY`,
        description: direction.summary[locale],
      },
    }))
    const id = await upsertLocalized({
      collection: "directions",
      key: "legacyKey",
      value: `direction:${direction.slug}`,
      common: {
        legacyKey: `direction:${direction.slug}`,
        slug: direction.routeSegment,
        canonicalKey: direction.slug,
        enabled: true,
        featured: true,
        sortOrder: serviceCategories.indexOf(direction) * 10,
        navigationVisible: true,
      },
      localizedData,
    })
    ids.set(direction.slug, id)
  }

  return ids
}

function serviceFormats(slug: string): string[] {
  if (slug.includes("atelier")) return ["studio", "remote-atelier"]
  if (slug.includes("corporate")) return ["in-person", "hybrid"]
  return ["online", "studio"]
}

async function importServices(
  directionIDs: Map<string, ID>,
  mediaIDs: Map<string, ID>
): Promise<Map<string, ID>> {
  const ids = new Map<string, ID>()

  for (const service of services) {
    const directionKey =
      service.category === "atelier" ? "realisation" : service.category
    const directionID = directionIDs.get(directionKey)
    if (!directionID)
      throw new Error(`Missing direction ${directionKey} for ${service.slug}`)

    const spec = serviceDetailCopy[service.slug]
    const localizedData = localizedObject((locale) => ({
      title: service.title[locale],
      summary: service.summary[locale],
      audience: service.summary[locale],
      intro: spec?.intro[locale] ?? service.summary[locale],
      processSteps:
        spec?.process.map((step) => ({
          title: step.title[locale],
          description: step.text[locale],
        })) ?? [],
      benefits:
        spec?.formats.map((item) => ({
          title: item.title[locale],
          description: item.text[locale],
        })) ?? [],
      outcomes: service.outcomes[locale].map((text) => ({ text })),
      timingNote: service.commercialStatus[locale],
      qualification: service.priceNote[locale],
      faq: [],
      cta: {
        label:
          locale === "uk"
            ? "Надіслати запит"
            : locale === "ru"
              ? "Отправить запрос"
              : "Send inquiry",
        action: "inquiry",
      },
      meta: service.seo[locale],
    }))
    const id = await upsertLocalized({
      collection: "services",
      key: "legacyKey",
      value: `service:${service.slug}`,
      common: {
        legacyKey: `service:${service.slug}`,
        slug: service.routeSegment,
        primaryDirection: directionID,
        formats: serviceFormats(service.slug),
        gallery: definedIDs(
          service.mediaIds.map((mediaID) => mediaIDs.get(mediaID))
        ),
        enabled: service.visibleInMvp,
        featured: service.visibleInMvp,
        sortOrder: services.indexOf(service) * 10,
      },
      localizedData,
    })
    ids.set(service.slug, id)
  }

  return ids
}

async function importServiceOffers(
  serviceIDs: Map<string, ID>
): Promise<Map<string, ID>> {
  const ids = new Map<string, ID>()

  for (const service of services) {
    const serviceID = serviceIDs.get(service.slug)
    if (!serviceID) continue
    const localizedData = localizedObject((locale) => ({
      title: service.title[locale],
      shortDescription: service.priceNote[locale],
    }))
    const id = await upsertLocalized({
      collection: "offers",
      key: "legacyKey",
      value: `offer:${service.slug}:inquiry`,
      common: {
        legacyKey: `offer:${service.slug}:inquiry`,
        service: serviceID,
        sku: `PURITY-${service.slug.toUpperCase()}-INQUIRY`,
        format: serviceFormats(service.slug)[0],
        pricingMode: "custom",
        checkoutMode: "inquiry",
        commercialStatus: "active",
        prices: [{ currency: "EUR" }, { currency: "UAH" }],
        termsVersion: "seed-v1",
        enabled: service.visibleInMvp,
        sortOrder: 100,
      },
      localizedData,
    })
    ids.set(service.slug, id)
    await payload.update({
      collection: "services",
      id: serviceID,
      data: { relatedOffers: [id] },
      locale: "uk",
      overrideAccess: true,
    })
  }

  return ids
}

async function importCourses(
  directionIDs: Map<string, ID>,
  mediaIDs: Map<string, ID>
): Promise<Map<string, ID>> {
  const ids = new Map<string, ID>()
  const schoolID = directionIDs.get("school")
  if (!schoolID) throw new Error("Missing School direction")

  for (const course of courses) {
    const localizedData = localizedObject((locale) => ({
      title: course.title[locale],
      summary: course.summary[locale],
      description: course.summary[locale],
      audience: course.audience[locale],
      prerequisites: course.commercialStatus[locale],
      program: course.lessons[locale].map((lesson) => ({
        title: lesson,
        description: course.summary[locale],
      })),
      intakeNote: course.commercialStatus[locale],
      faq: [],
      cta: {
        label:
          locale === "uk"
            ? "Дізнатися про набір"
            : locale === "ru"
              ? "Узнать о наборе"
              : "Ask about intake",
        action: "inquiry",
      },
      meta: course.seo[locale],
    }))
    const id = await upsertLocalized({
      collection: "courses",
      key: "legacyKey",
      value: `course:${course.slug}`,
      common: {
        legacyKey: `course:${course.slug}`,
        slug: course.routeSegment,
        direction: schoolID,
        sessions: Math.max(course.lessons.uk.length, 1),
        formats: ["online", "studio"],
        media: definedIDs(
          course.mediaIds.map((mediaID) => mediaIDs.get(mediaID))
        ),
        availability: "coming-soon",
        enabled: course.visibleInMvp,
        featured: course.visibleInMvp,
        sortOrder: courses.indexOf(course) * 10,
      },
      localizedData,
    })
    ids.set(course.slug, id)

    const offerID = await upsertLocalized({
      collection: "offers",
      key: "legacyKey",
      value: `offer:${course.slug}:inquiry`,
      common: {
        legacyKey: `offer:${course.slug}:inquiry`,
        course: id,
        sku: `PURITY-${course.slug.toUpperCase()}-INQUIRY`,
        format: "online",
        pricingMode: "custom",
        checkoutMode: "inquiry",
        commercialStatus: "coming-soon",
        prices: [{ currency: "EUR" }, { currency: "UAH" }],
        sessions: Math.max(course.lessons.uk.length, 1),
        termsVersion: "seed-v1",
        enabled: course.visibleInMvp,
        sortOrder: 100,
      },
      localizedData: localizedObject((locale) => ({
        title: course.title[locale],
        shortDescription: course.priceNote[locale],
      })),
    })
    await payload.update({
      collection: "courses",
      id,
      data: { relatedOffers: [offerID] },
      locale: "uk",
      overrideAccess: true,
    })
  }

  return ids
}

async function importFashionCollections(
  mediaIDs: Map<string, ID>
): Promise<Map<string, ID>> {
  const ids = new Map<string, ID>()

  for (const item of collections) {
    const localizedData = localizedObject((locale) => ({
      title: item.title[locale],
      summary: item.summary[locale],
      narrative: item.summary[locale],
      stylingNotes: item.commercialStatus[locale],
      collaborationCredits: item.sourceLabel ?? "PURITY",
      materials: item.materials[locale].map((material) => ({ material })),
      availability: "inquiry",
      rightsAndCredits: item.sourceLabel ?? "PURITY source archive",
      cta: {
        label:
          locale === "uk"
            ? "Запитати про колекцію"
            : locale === "ru"
              ? "Спросить о коллекции"
              : "Ask about the collection",
        action: "inquiry",
      },
      meta: item.seo[locale],
    }))
    const id = await upsertLocalized({
      collection: "fashion-collections",
      key: "legacyKey",
      value: `collection:${item.slug}`,
      common: {
        legacyKey: `collection:${item.slug}`,
        slug: item.routeSegment,
        collectionType: "capsule",
        gallery: definedIDs(
          item.mediaIds.map((mediaID) => mediaIDs.get(mediaID))
        ),
        enabled: item.visibleInMvp,
        featured: item.visibleInMvp,
        sortOrder: collections.indexOf(item) * 10,
      },
      localizedData,
    })
    ids.set(item.slug, id)

    const offerID = await upsertLocalized({
      collection: "offers",
      key: "legacyKey",
      value: `offer:${item.slug}:inquiry`,
      common: {
        legacyKey: `offer:${item.slug}:inquiry`,
        fashionCollection: id,
        sku: `PURITY-${item.slug.toUpperCase()}-INQUIRY`,
        format: "studio",
        pricingMode: "custom",
        checkoutMode: "inquiry",
        commercialStatus: "active",
        prices: [{ currency: "EUR" }, { currency: "UAH" }],
        termsVersion: "seed-v1",
        enabled: item.visibleInMvp,
        sortOrder: 100,
      },
      localizedData: localizedObject((locale) => ({
        title: item.title[locale],
        shortDescription: item.priceNote[locale],
      })),
    })
    await payload.update({
      collection: "fashion-collections",
      id,
      data: { relatedOffers: [offerID] },
      locale: "uk",
      overrideAccess: true,
    })
  }

  return ids
}

async function importPages(): Promise<Map<string, ID>> {
  const ids = new Map<string, ID>()
  const pageTypes = {
    studio: "studio",
    booking: "service-state",
    privacy: "privacy",
    terms: "terms",
  } as const

  for (const page of publicPages.filter(
    (
      candidate
    ): candidate is (typeof publicPages)[number] & {
      slug: keyof typeof pageTypes
    } => candidate.slug in pageTypes
  )) {
    const localizedData = localizedObject((locale) => ({
      title: page.title[locale],
      summary: page.summary[locale],
      eyebrow: page.eyebrow[locale],
      body: page.body[locale].join("\n\n"),
      sections: page.body[locale].map((body, index) => ({
        heading:
          index === 0
            ? page.title[locale]
            : `${page.title[locale]} ${index + 1}`,
        body,
      })),
      cta: page.cta
        ? { label: page.cta.label[locale], action: "contact" }
        : undefined,
      meta: page.seo[locale],
    }))
    const id = await upsertLocalized({
      collection: "pages",
      key: "legacyKey",
      value: `page:${page.slug}`,
      common: {
        legacyKey: `page:${page.slug}`,
        slug: page.routeSegment,
        pageType: pageTypes[page.slug],
        legalVersion:
          page.slug === "privacy" || page.slug === "terms"
            ? "seed-v1"
            : undefined,
        effectiveDate:
          page.slug === "privacy" || page.slug === "terms"
            ? new Date().toISOString()
            : undefined,
        enabled: true,
        featured: page.slug === "studio",
        sortOrder: publicPages.indexOf(page) * 10,
      },
      localizedData,
    })
    ids.set(page.slug, id)
  }

  const contacts = serviceCategories.find(
    (category) => category.slug === "contacts"
  )
  if (contacts) {
    const id = await upsertLocalized({
      collection: "pages",
      key: "legacyKey",
      value: "page:contacts",
      common: {
        legacyKey: "page:contacts",
        slug: "contacts",
        pageType: "contacts",
        contactConfiguration: { showMap: false, corporateContext: true },
        enabled: true,
        featured: false,
        sortOrder: 90,
      },
      localizedData: localizedObject((locale) => ({
        title: contacts.title[locale],
        summary: contacts.summary[locale],
        eyebrow: "PURITY",
        body: `${siteSettings.contacts.address[locale]}\n\n${siteSettings.contacts.hours[locale]}\n\n${siteSettings.contacts.responseTime[locale]}`,
        cta: {
          label: siteSettings.contacts.actionLabel[locale],
          action: "booking-request",
        },
        meta: {
          title: `${contacts.title[locale]} | PURITY`,
          description: contacts.summary[locale],
        },
      })),
    })
    ids.set("contacts", id)
  }

  return ids
}

async function importGlobals({
  directionIDs,
  serviceIDs,
  courseIDs,
  collectionIDs,
  mediaIDs,
}: {
  directionIDs: Map<string, ID>
  serviceIDs: Map<string, ID>
  courseIDs: Map<string, ID>
  collectionIDs: Map<string, ID>
  mediaIDs: Map<string, ID>
}) {
  await updateGlobalLocalized(
    "home",
    {
      heroMedia: mediaIDs.get(siteSettings.defaultOgImageId),
      primaryCTA: { path: siteSettings.home.primaryCta.path },
      secondaryCTA: { path: siteSettings.home.secondaryCta.path },
      selectedDirections: [...directionIDs.values()],
      selectedServices: definedIDs(
        services
          .filter((service) => service.visibleInMvp)
          .map((service) => serviceIDs.get(service.slug))
      ),
      selectedCourses: [...courseIDs.values()],
      selectedCollections: [...collectionIDs.values()],
    },
    localizedObject((locale) => ({
      heroEyebrow: siteSettings.home.eyebrow[locale],
      heroTitle: siteSettings.home.title[locale],
      heroSummary: siteSettings.home.summary[locale],
      primaryCTA: {
        label: siteSettings.home.primaryCta.label[locale],
        path: siteSettings.home.primaryCta.path,
      },
      secondaryCTA: {
        label: siteSettings.home.secondaryCta.label[locale],
        path: siteSettings.home.secondaryCta.path,
      },
      method: studioPageCopy.methodSteps.map((step) => ({
        label: step.title[locale],
        description: step.text[locale],
      })),
      studioIntro: siteSettings.home.studioSummary[locale],
      finalCTATitle: studioPageCopy.ctaTitle[locale],
      finalCTASummary: studioPageCopy.ctaSummary[locale],
      meta: siteSettings.seo[locale],
    })),
    true
  )

  await updateGlobalLocalized(
    "header",
    {},
    localizedObject((locale) => ({
      navigation: navigation
        .filter((item) => item.visibleInMvp)
        .map((item) => ({
          label: item.label[locale],
          path: item.path,
          visible: true,
          external: false,
          accessibleLabel: item.label[locale],
        })),
      bookingLabel:
        locale === "uk"
          ? "Записатися"
          : locale === "ru"
            ? "Записаться"
            : "Book now",
    })),
    true
  )

  await updateGlobalLocalized(
    "footer",
    {
      email: siteSettings.contacts.email ?? "voronina@purity-fashion.com",
      phone: siteSettings.contacts.phone ?? siteSettings.contacts.phones[0],
      socialLinks: siteSettings.contacts.socials.map((social) => ({
        platform: social.label,
        url: social.url,
      })),
      legalNavigation: navigation
        .filter((item) => ["privacy", "terms"].includes(item.id))
        .map((item) => ({ path: item.path })),
    },
    localizedObject((locale) => ({
      address: siteSettings.contacts.address[locale],
      hours: siteSettings.contacts.hours[locale],
      responseTime: siteSettings.contacts.responseTime[locale],
      socialLinks: siteSettings.contacts.socials.map((social) => ({
        platform: social.label,
        url: social.url,
        accessibleLabel: social.label,
      })),
      legalNavigation: navigation
        .filter((item) => ["privacy", "terms"].includes(item.id))
        .map((item) => ({ label: item.label[locale], path: item.path })),
      copyright: `© ${new Date().getFullYear()} PURITY Fashion Studio`,
    })),
    true
  )

  await updateGlobalLocalized(
    "site-settings",
    {
      brandName: siteSettings.brandName,
      canonicalOrigin:
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      defaultSocialImage: mediaIDs.get(siteSettings.defaultOgImageId),
      contacts: {
        email: siteSettings.contacts.email ?? "voronina@purity-fashion.com",
        phone: siteSettings.contacts.phone ?? siteSettings.contacts.phones[0],
      },
      localeLabels: { uk: "Українська", ru: "Русский", en: "English" },
      map: { provider: "none" },
      maintenance: { enabled: false },
    },
    localizedObject((locale) => ({
      contacts: {
        email: siteSettings.contacts.email ?? "voronina@purity-fashion.com",
        phone: siteSettings.contacts.phone ?? siteSettings.contacts.phones[0],
        address: siteSettings.contacts.address[locale],
        hours: siteSettings.contacts.hours[locale],
      },
      maintenance: { enabled: false, message: "" },
    })),
    false
  )
}

async function linkDirections(
  directionIDs: Map<string, ID>,
  serviceIDs: Map<string, ID>,
  courseIDs: Map<string, ID>,
  collectionIDs: Map<string, ID>
) {
  for (const [directionKey, directionID] of directionIDs) {
    const relatedServices = definedIDs(
      services
        .filter((service) =>
          directionKey === "realisation"
            ? ["realisation", "atelier"].includes(service.category)
            : service.category === directionKey
        )
        .map((service) => serviceIDs.get(service.slug))
    )

    await payload.update({
      collection: "directions",
      id: directionID,
      data: {
        relatedServices,
        relatedCourses:
          directionKey === "school" ? [...courseIDs.values()] : [],
        relatedCollections:
          directionKey === "collections" ? [...collectionIDs.values()] : [],
      },
      locale: "uk",
      overrideAccess: true,
    })
  }
}

async function run() {
  const mediaIDs = await importMedia()
  const directionIDs = await importDirections()
  const serviceIDs = await importServices(directionIDs, mediaIDs)
  await importServiceOffers(serviceIDs)
  const courseIDs = await importCourses(directionIDs, mediaIDs)
  const collectionIDs = await importFashionCollections(mediaIDs)
  await importPages()
  await linkDirections(directionIDs, serviceIDs, courseIDs, collectionIDs)
  await importGlobals({
    directionIDs,
    serviceIDs,
    courseIDs,
    collectionIDs,
    mediaIDs,
  })

  for (const [label, count] of [...counts.entries()].sort(([left], [right]) =>
    left.localeCompare(right)
  )) {
    console.log(`${label}: ${count}`)
  }
}

try {
  await run()
  await payload.destroy()
} catch (error) {
  await payload.destroy()
  throw error
}
