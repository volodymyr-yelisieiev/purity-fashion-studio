import "server-only"

import { unstable_cache } from "next/cache"
import { draftMode } from "next/headers"
import { cache } from "react"
import { getPayload } from "payload"

import config from "@payload-config"
import type {
  Course as PayloadCourse,
  Direction as PayloadDirection,
  FashionCollection as PayloadFashionCollection,
  Media,
  Offer,
  Page as PayloadPage,
  PortfolioCase as PayloadPortfolioCase,
  Service as PayloadService,
} from "@/payload-types"

import { serviceDetailCopy } from "./service-page-specs"
import {
  getCategory,
  getFirstMediaAsset,
  getMediaAsset,
  getVisibleService,
} from "./queries"
import type { MediaAsset, ServicePageSpec } from "./model"
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

export type ServiceOffer = Pick<
  Offer,
  | "id"
  | "sku"
  | "title"
  | "shortDescription"
  | "format"
  | "pricingMode"
  | "checkoutMode"
  | "commercialStatus"
  | "prices"
  | "durationMinutes"
  | "sessions"
  | "deposit"
  | "termsVersion"
>

export type ServicePageData = {
  id: string
  slug: string
  routeSegment: string
  eyebrow: string
  title: string
  summary: string
  intro: string
  audience: string
  formatsTitle: string
  formats: Array<{ title: string; text: string }>
  processTitle: string
  process: Array<{ title: string; text: string }>
  outcomeTitle: string
  outcomeSummary: string
  outcomes: string[]
  commercialTitle: string
  commercialStatus: string
  priceNote: string
  timingNote?: string
  qualification?: string
  nextStepTitle: string
  nextStepSummary: string
  contactLabel?: string
  courseLabel?: string
  collectionLabel?: string
  mediaAsset?: MediaAsset
  offers: ServiceOffer[]
  faq: Array<{ question: string; answer: string }>
  cta: {
    action: PayloadService["cta"]["action"] | "booking-request"
    label: string
  }
  seo: {
    title: string
    description: string
  }
}

export type CoursePageData = {
  id: string
  slug: string
  routeSegment: string
  title: string
  summary: string
  description: string
  audience: string
  prerequisites?: string
  sessions: number
  formats: PayloadCourse["formats"]
  program: Array<{ title: string; description: string }>
  instructor?: string
  credentials?: string
  intakeNote?: string
  availability: PayloadCourse["availability"] | "coming-soon"
  commercialStatus: string
  priceNote: string
  mediaAsset?: MediaAsset
  offers: ServiceOffer[]
  cta: PayloadCourse["cta"]
  seo: { title: string; description: string }
}

export type FashionCollectionPageData = {
  id: string
  slug: string
  routeSegment: string
  title: string
  summary: string
  narrative: string
  stylingNotes?: string
  collectionType: PayloadFashionCollection["collectionType"]
  collaborationCredits?: string
  materials: string[]
  pieces: Array<{ name: string; description?: string }>
  season?: string
  year?: number
  availability: PayloadFashionCollection["availability"] | "inquiry"
  commercialStatus: string
  priceNote: string
  mediaAssets: MediaAsset[]
  offers: ServiceOffer[]
  rightsAndCredits: string
  cta: PayloadFashionCollection["cta"]
  seo: { title: string; description: string }
}

export type PortfolioCasePageData = {
  id: string
  slug: string
  routeSegment: string
  title: string
  summary: string
  clientType: PayloadPortfolioCase["clientType"]
  brief: string
  constraints: string
  research: string
  process: string
  result: string
  hasBeforeAfter: boolean
  mediaAssets: MediaAsset[]
  seo: { title: string; description: string }
}

export type ServiceCardData = {
  id: string
  slug: string
  routeSegment: string
  title: string
  summary: string
  mediaAsset?: MediaAsset
}

export type DirectionPageData = {
  id: string
  slug: string
  routeSegment: string
  canonicalKey: PayloadDirection["canonicalKey"]
  title: string
  summary: string
  eyebrow?: string
  narrative: string
  process: Array<{ title: string; description: string }>
  outcomes: string[]
  services: ServiceCardData[]
  mediaAsset?: MediaAsset
  seo: { title: string; description: string }
}

export type PublicPageData = {
  id: string
  slug: string
  routeSegment: string
  pageType: PayloadPage["pageType"]
  title: string
  summary: string
  eyebrow?: string
  body: string
  sections: Array<{ heading: string; body: string; mediaAsset?: MediaAsset }>
  mediaAsset?: MediaAsset
  mediaIds?: string[]
  cta: PayloadPage["cta"]
  legalVersion?: string
  effectiveDate?: string
  seo: { title: string; description: string }
}

export type HeaderData = {
  navigation: Array<{
    label: string
    path: string
    visible: boolean
    external: boolean
    accessibleLabel?: string
  }>
  bookingLabel: string
}

export type FooterData = {
  email: string
  phone: string
  address: string
  hours: string
  responseTime: string
  socialLinks: Array<{
    platform: string
    url: string
    accessibleLabel: string
  }>
  legalNavigation: Array<{ label: string; path: string }>
  copyright: string
}

export type SiteSettingsData = {
  brandName: string
  canonicalOrigin: string
  contacts: { email: string; phone: string; address: string; hours: string }
  localeLabels: Record<Locale, string>
  maintenance: { enabled: boolean; message?: string }
}

export type HomeData = {
  heroEyebrow?: string
  heroTitle: string
  heroSummary: string
  heroMedia?: MediaAsset
  primaryCTA: { label: string; path: string }
  secondaryCTA: { label: string; path: string }
  method: Array<{ label: string; description: string }>
  studioIntro: string
  finalCTATitle: string
  finalCTASummary: string
  selectedServiceSlugs: string[]
  selectedCourseSlugs: string[]
  selectedCollectionSlugs: string[]
  selectedPortfolioSlugs: string[]
  seo: { title: string; description: string }
}

const getPayloadClient = cache(() => getPayload({ config }))

const genericCopy = {
  formatsTitle: {
    uk: "Формати роботи",
    ru: "Форматы работы",
    en: "Working formats",
  },
  processTitle: {
    uk: "Як проходить робота",
    ru: "Как проходит работа",
    en: "How the work proceeds",
  },
  outcomeTitle: {
    uk: "Результат",
    ru: "Результат",
    en: "Outcome",
  },
  commercialTitle: {
    uk: "Формат і вартість",
    ru: "Формат и стоимость",
    en: "Format and pricing",
  },
  nextStepTitle: {
    uk: "Наступний крок",
    ru: "Следующий шаг",
    en: "Next step",
  },
  nextStepSummary: {
    uk: "Опишіть задачу, бажаний формат і строки. Команда підтвердить обсяг, актуальні умови та доступність.",
    ru: "Опишите задачу, желаемый формат и сроки. Команда подтвердит объём, актуальные условия и доступность.",
    en: "Describe the brief, preferred format, and timing. The team will confirm scope, current terms, and availability.",
  },
  bookingLabel: {
    uk: "Надіслати запит",
    ru: "Отправить запрос",
    en: "Send a request",
  },
  availability: {
    uk: "Актуальна доступність визначається повʼязаними пропозиціями.",
    ru: "Актуальная доступность определяется связанными предложениями.",
    en: "Current availability is defined by the linked offers.",
  },
  pricing: {
    uk: "Вартість і режим оплати вказані у повʼязаних пропозиціях.",
    ru: "Стоимость и режим оплаты указаны в связанных предложениях.",
    en: "Pricing and checkout mode are defined by the linked offers.",
  },
} as const

const formatLabels: Record<
  PayloadService["formats"][number],
  Record<Locale, string>
> = {
  online: { uk: "Онлайн", ru: "Онлайн", en: "Online" },
  studio: { uk: "У студії", ru: "В студии", en: "Studio" },
  "remote-atelier": {
    uk: "Дистанційне ательє",
    ru: "Дистанционное ателье",
    en: "Remote atelier",
  },
  "in-person": { uk: "Особисто", ru: "Лично", en: "In person" },
  hybrid: { uk: "Гібридно", ru: "Гибридно", en: "Hybrid" },
}

const courseCheckoutLabel = {
  uk: "Перейти до checkout",
  ru: "Перейти к checkout",
  en: "Continue to checkout",
} as const

function localizeSpec(spec: ServicePageSpec, locale: Locale) {
  return {
    intro: spec.intro[locale],
    formatsTitle: spec.formatsTitle[locale],
    formats: spec.formats.map((item) => ({
      title: item.title[locale],
      text: item.text[locale],
    })),
    processTitle: spec.processTitle[locale],
    process: spec.process.map((item) => ({
      title: item.title[locale],
      text: item.text[locale],
    })),
    outcomeTitle: spec.outcomeTitle[locale],
    outcomeSummary: spec.outcomeSummary[locale],
    commercialTitle: spec.commercialTitle[locale],
    nextStepTitle: spec.nextStepTitle[locale],
    nextStepSummary: spec.nextStepSummary[locale],
    contactLabel: spec.contactLabel?.[locale],
    courseLabel: spec.courseLabel?.[locale],
    collectionLabel: spec.collectionLabel?.[locale],
  }
}

function seedServiceBySlug(
  locale: Locale,
  slug: string
): ServicePageData | null {
  const service = getVisibleService(slug)
  if (!service) return null

  const category = getCategory(service.category)
  const spec = serviceDetailCopy[service.slug]
  const copy = spec
    ? localizeSpec(spec, locale)
    : {
        intro: service.summary[locale],
        formatsTitle: genericCopy.formatsTitle[locale],
        formats: [],
        processTitle: genericCopy.processTitle[locale],
        process: [],
        outcomeTitle: genericCopy.outcomeTitle[locale],
        outcomeSummary: service.summary[locale],
        commercialTitle: genericCopy.commercialTitle[locale],
        nextStepTitle: genericCopy.nextStepTitle[locale],
        nextStepSummary: genericCopy.nextStepSummary[locale],
        contactLabel: undefined,
        courseLabel: undefined,
        collectionLabel: undefined,
      }

  return {
    id: service.slug,
    slug: service.slug,
    routeSegment: service.routeSegment,
    eyebrow: category?.title[locale] ?? service.title[locale],
    title: service.title[locale],
    summary: service.summary[locale],
    intro: copy.intro,
    audience: service.summary[locale],
    formatsTitle: copy.formatsTitle,
    formats: copy.formats,
    processTitle: copy.processTitle,
    process: copy.process,
    outcomeTitle: copy.outcomeTitle,
    outcomeSummary: copy.outcomeSummary,
    outcomes: service.outcomes[locale],
    commercialTitle: copy.commercialTitle,
    commercialStatus: service.commercialStatus[locale],
    priceNote: service.priceNote[locale],
    nextStepTitle: copy.nextStepTitle,
    nextStepSummary: copy.nextStepSummary,
    contactLabel: copy.contactLabel,
    courseLabel: copy.courseLabel,
    collectionLabel: copy.collectionLabel,
    mediaAsset: getFirstMediaAsset(service.mediaIds),
    offers: [],
    faq: [],
    cta: {
      action: "booking-request",
      label: siteSettings.home.primaryCta.label[locale],
    },
    seo: service.seo[locale],
  }
}

function payloadMediaToView(
  media: Media,
  locale: Locale
): MediaAsset | undefined {
  const src = media.sizes?.hero?.url ?? media.url ?? undefined
  if (!src) return undefined

  const alt = { uk: media.alt, ru: media.alt, en: media.alt }
  const internalLabel = {
    uk: media.internalLabel,
    ru: media.internalLabel,
    en: media.internalLabel,
  }
  const focalX = media.focalX ?? 50

  return {
    id: media.id,
    kind: "image",
    source: media.source,
    generated: media.source === "generated",
    fileName: media.filename ?? media.id,
    aspectRatio:
      media.width && media.height ? `${media.width}/${media.height}` : "4/3",
    src,
    heroFocalPoint: focalX < 34 ? "left" : focalX > 66 ? "right" : "center",
    usage: media.allowedUsageContexts ?? [],
    internalLabel,
    alt: { ...alt, [locale]: media.alt },
    replacementPriority:
      media.replacementPriority === "none"
        ? "keep-client-source"
        : media.replacementPriority === "replace-when-approved"
          ? "replace-when-client-proof-arrives"
          : media.replacementPriority,
    isRealClientProof: media.isRealClientProof,
  }
}

async function findPayloadService(
  locale: Locale,
  slug: string,
  draft: boolean
): Promise<ServicePageData | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "services",
    depth: 0,
    draft,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: draft,
    pagination: false,
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      primaryDirection: true,
      audience: true,
      intro: true,
      formats: true,
      processSteps: true,
      benefits: true,
      outcomes: true,
      timingNote: true,
      qualification: true,
      gallery: true,
      faq: true,
      cta: true,
      meta: true,
    },
    where: { slug: { equals: slug } },
  })
  const service = result.docs[0]
  if (!service) return null

  const [directionResult, mediaResult, offersResult] = await Promise.all([
    payload.findByID({
      collection: "directions",
      id:
        typeof service.primaryDirection === "string"
          ? service.primaryDirection
          : service.primaryDirection.id,
      depth: 0,
      draft,
      fallbackLocale: false,
      locale,
      overrideAccess: draft,
      select: { title: true },
    }),
    service.gallery?.length
      ? payload.find({
          collection: "media",
          depth: 0,
          fallbackLocale: false,
          limit: service.gallery.length,
          locale,
          overrideAccess: draft,
          pagination: false,
          select: {
            internalLabel: true,
            alt: true,
            source: true,
            allowedUsageContexts: true,
            isRealClientProof: true,
            replacementPriority: true,
            url: true,
            filename: true,
            width: true,
            height: true,
            focalX: true,
            sizes: true,
          },
          where: { id: { in: service.gallery } },
        })
      : Promise.resolve({ docs: [] }),
    payload.find({
      collection: "offers",
      depth: 0,
      draft,
      fallbackLocale: false,
      locale,
      overrideAccess: draft,
      pagination: false,
      sort: "sortOrder",
      select: {
        id: true,
        sku: true,
        title: true,
        shortDescription: true,
        format: true,
        pricingMode: true,
        checkoutMode: true,
        commercialStatus: true,
        prices: true,
        durationMinutes: true,
        sessions: true,
        deposit: true,
        termsVersion: true,
      },
      where: { service: { equals: service.id } },
    }),
  ])

  const media = mediaResult.docs[0]
  const formats = service.formats.map((format) => ({
    title: formatLabels[format][locale],
    text: service.audience,
  }))
  const outcomes = service.outcomes?.map((item) => item.text) ?? []
  const offers = offersResult.docs as ServiceOffer[]

  return {
    id: service.id,
    slug: service.slug,
    routeSegment: service.slug,
    eyebrow: directionResult.title,
    title: service.title,
    summary: service.summary,
    intro: service.intro,
    audience: service.audience,
    formatsTitle: genericCopy.formatsTitle[locale],
    formats,
    processTitle: genericCopy.processTitle[locale],
    process:
      service.processSteps?.map((step) => ({
        title: step.title,
        text: step.description,
      })) ?? [],
    outcomeTitle: genericCopy.outcomeTitle[locale],
    outcomeSummary:
      service.benefits?.map((benefit) => benefit.description).join(" ") ||
      service.summary,
    outcomes,
    commercialTitle: genericCopy.commercialTitle[locale],
    commercialStatus: genericCopy.availability[locale],
    priceNote: genericCopy.pricing[locale],
    timingNote: service.timingNote ?? undefined,
    qualification: service.qualification ?? undefined,
    nextStepTitle: genericCopy.nextStepTitle[locale],
    nextStepSummary: genericCopy.nextStepSummary[locale],
    mediaAsset: media ? payloadMediaToView(media as Media, locale) : undefined,
    offers,
    faq:
      service.faq?.map((item) => ({
        question: item.question,
        answer: item.answer,
      })) ?? [],
    cta: service.cta,
    seo: {
      title: service.meta?.title || `${service.title} | PURITY Fashion Studio`,
      description: service.meta?.description || service.summary,
    },
  }
}

function cachedPayloadService(locale: Locale, slug: string) {
  return unstable_cache(
    () => findPayloadService(locale, slug, false),
    ["cms", "service", locale, slug],
    {
      tags: ["cms:services", "cms:offers", "cms:media", `cms:services:${slug}`],
    }
  )()
}

export async function getServiceBySlug(
  locale: Locale,
  slug: string
): Promise<ServicePageData | null> {
  if (process.env.CONTENT_SOURCE !== "payload") {
    return seedServiceBySlug(locale, slug)
  }

  const { isEnabled } = await draftMode()
  return isEnabled
    ? findPayloadService(locale, slug, true)
    : cachedPayloadService(locale, slug)
}

export async function getPublishedServiceSlugs(): Promise<string[]> {
  if (process.env.CONTENT_SOURCE !== "payload") {
    return services
      .filter((service) => service.visibleInMvp)
      .map((service) => service.routeSegment)
  }

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "services",
    depth: 0,
    fallbackLocale: false,
    limit: 1000,
    locale: "uk",
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
    sort: "sortOrder",
  })

  return result.docs.map((service) => service.slug)
}

async function findPayloadOfferByID(
  locale: Locale,
  id: string,
  draft: boolean
): Promise<ServiceOffer | null> {
  const payload = await getPayloadClient()
  try {
    const offer = await payload.findByID({
      collection: "offers",
      id,
      depth: 0,
      draft,
      fallbackLocale: false,
      locale,
      overrideAccess: draft,
      select: {
        id: true,
        sku: true,
        title: true,
        shortDescription: true,
        format: true,
        pricingMode: true,
        checkoutMode: true,
        commercialStatus: true,
        prices: true,
        durationMinutes: true,
        sessions: true,
        deposit: true,
        termsVersion: true,
      },
    })
    return offer as ServiceOffer
  } catch {
    return null
  }
}

export async function getOfferById(locale: Locale, id: string) {
  if (process.env.CONTENT_SOURCE !== "payload") return null
  const { isEnabled } = await draftMode()
  if (isEnabled) return findPayloadOfferByID(locale, id, true)
  return unstable_cache(
    () => findPayloadOfferByID(locale, id, false),
    ["cms", "offer", locale, id],
    { tags: ["cms:offers", `cms:offers:${id}`] }
  )()
}

function seedCourseBySlug(locale: Locale, slug: string): CoursePageData | null {
  const course = courses.find(
    (candidate) => candidate.visibleInMvp && candidate.routeSegment === slug
  )
  if (!course) return null

  return {
    id: course.slug,
    slug: course.slug,
    routeSegment: course.routeSegment,
    title: course.title[locale],
    summary: course.summary[locale],
    description: course.summary[locale],
    audience: course.audience[locale],
    sessions: course.lessons[locale].length,
    formats: ["online", "studio"],
    program: course.lessons[locale].map((title) => ({
      title,
      description: title,
    })),
    availability: "coming-soon",
    commercialStatus: course.commercialStatus[locale],
    priceNote: course.priceNote[locale],
    mediaAsset: getFirstMediaAsset(course.mediaIds),
    offers: [],
    cta: {
      action: "booking-request",
      label: courseCheckoutLabel[locale],
    },
    seo: course.seo[locale],
  }
}

async function findPayloadCourse(
  locale: Locale,
  slug: string,
  draft: boolean
): Promise<CoursePageData | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "courses",
    depth: 0,
    draft,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: draft,
    pagination: false,
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      description: true,
      audience: true,
      prerequisites: true,
      sessions: true,
      formats: true,
      program: true,
      instructor: true,
      credentials: true,
      intakeNote: true,
      media: true,
      availability: true,
      cta: true,
      meta: true,
    },
    where: { slug: { equals: slug } },
  })
  const course = result.docs[0]
  if (!course) return null

  const [mediaResult, offersResult] = await Promise.all([
    course.media?.length
      ? payload.find({
          collection: "media",
          depth: 0,
          fallbackLocale: false,
          limit: course.media.length,
          locale,
          overrideAccess: draft,
          pagination: false,
          select: {
            internalLabel: true,
            alt: true,
            source: true,
            allowedUsageContexts: true,
            isRealClientProof: true,
            replacementPriority: true,
            url: true,
            filename: true,
            width: true,
            height: true,
            focalX: true,
            sizes: true,
          },
          where: { id: { in: course.media } },
        })
      : Promise.resolve({ docs: [] }),
    payload.find({
      collection: "offers",
      depth: 0,
      draft,
      fallbackLocale: false,
      locale,
      overrideAccess: draft,
      pagination: false,
      sort: "sortOrder",
      select: {
        id: true,
        sku: true,
        title: true,
        shortDescription: true,
        format: true,
        pricingMode: true,
        checkoutMode: true,
        commercialStatus: true,
        prices: true,
        durationMinutes: true,
        sessions: true,
        deposit: true,
        termsVersion: true,
      },
      where: { course: { equals: course.id } },
    }),
  ])
  const media = mediaResult.docs[0]

  return {
    id: course.id,
    slug: course.slug,
    routeSegment: course.slug,
    title: course.title,
    summary: course.summary,
    description: course.description,
    audience: course.audience,
    prerequisites: course.prerequisites ?? undefined,
    sessions: course.sessions,
    formats: course.formats,
    program:
      course.program?.map((lesson) => ({
        title: lesson.title,
        description: lesson.description,
      })) ?? [],
    instructor: course.instructor ?? undefined,
    credentials: course.credentials ?? undefined,
    intakeNote: course.intakeNote ?? undefined,
    availability: course.availability,
    commercialStatus:
      offersResult.docs.find((offer) => offer.commercialStatus === "active")
        ?.commercialStatus ?? course.availability,
    priceNote:
      offersResult.docs.length > 0
        ? offersResult.docs
            .map(
              (offer) =>
                `${offer.title}: ${offer.pricingMode === "fixed" ? offer.prices?.map((price) => `${price.amount} ${price.currency}`).join(" / ") : offer.pricingMode}`
            )
            .join(" · ")
        : course.availability,
    mediaAsset: media ? payloadMediaToView(media as Media, locale) : undefined,
    offers: offersResult.docs as ServiceOffer[],
    cta: course.cta,
    seo: {
      title: course.meta?.title || `${course.title} | PURITY Fashion Studio`,
      description: course.meta?.description || course.summary,
    },
  }
}

function cachedPayloadCourse(locale: Locale, slug: string) {
  return unstable_cache(
    () => findPayloadCourse(locale, slug, false),
    ["cms", "course", locale, slug],
    {
      tags: ["cms:courses", "cms:offers", "cms:media", `cms:courses:${slug}`],
    }
  )()
}

export async function getCourseBySlug(locale: Locale, slug: string) {
  if (process.env.CONTENT_SOURCE !== "payload") {
    return seedCourseBySlug(locale, slug)
  }

  const { isEnabled } = await draftMode()
  return isEnabled
    ? findPayloadCourse(locale, slug, true)
    : cachedPayloadCourse(locale, slug)
}

export async function getPublishedCourseSlugs() {
  if (process.env.CONTENT_SOURCE !== "payload") {
    return courses
      .filter((course) => course.visibleInMvp)
      .map((course) => course.routeSegment)
  }

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "courses",
    depth: 0,
    fallbackLocale: false,
    limit: 1000,
    locale: "uk",
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
    sort: "sortOrder",
  })
  return result.docs.map((course) => course.slug)
}

function seedFashionCollectionBySlug(
  locale: Locale,
  slug: string
): FashionCollectionPageData | null {
  const collection = collections.find(
    (candidate) => candidate.visibleInMvp && candidate.routeSegment === slug
  )
  if (!collection) return null

  return {
    id: collection.slug,
    slug: collection.slug,
    routeSegment: collection.routeSegment,
    title: collection.title[locale],
    summary: collection.summary[locale],
    narrative: collection.summary[locale],
    collectionType: "editorial",
    materials: collection.materials[locale],
    pieces: [],
    availability: "inquiry",
    commercialStatus: collection.commercialStatus[locale],
    priceNote: collection.priceNote[locale],
    mediaAssets: collection.mediaIds.flatMap((id) => {
      const asset = getMediaAsset(id)
      return asset ? [asset as MediaAsset] : []
    }),
    offers: [],
    rightsAndCredits: "PURITY Fashion Studio",
    cta: {
      action: "inquiry",
      label: siteSettings.home.primaryCta.label[locale],
    },
    seo: collection.seo[locale],
  }
}

async function findPayloadFashionCollection(
  locale: Locale,
  slug: string,
  draft: boolean
): Promise<FashionCollectionPageData | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "fashion-collections",
    depth: 0,
    draft,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: draft,
    pagination: false,
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      narrative: true,
      stylingNotes: true,
      collectionType: true,
      collaborationCredits: true,
      materials: true,
      pieces: true,
      season: true,
      year: true,
      gallery: true,
      availability: true,
      rightsAndCredits: true,
      cta: true,
      meta: true,
    },
    where: { slug: { equals: slug } },
  })
  const collection = result.docs[0]
  if (!collection) return null

  const [mediaResult, offersResult] = await Promise.all([
    payload.find({
      collection: "media",
      depth: 0,
      fallbackLocale: false,
      limit: Math.max(collection.gallery.length, 1),
      locale,
      overrideAccess: draft,
      pagination: false,
      select: {
        internalLabel: true,
        alt: true,
        source: true,
        allowedUsageContexts: true,
        isRealClientProof: true,
        replacementPriority: true,
        url: true,
        filename: true,
        width: true,
        height: true,
        focalX: true,
        sizes: true,
      },
      where: { id: { in: collection.gallery } },
    }),
    payload.find({
      collection: "offers",
      depth: 0,
      draft,
      fallbackLocale: false,
      locale,
      overrideAccess: draft,
      pagination: false,
      sort: "sortOrder",
      select: {
        id: true,
        sku: true,
        title: true,
        shortDescription: true,
        format: true,
        pricingMode: true,
        checkoutMode: true,
        commercialStatus: true,
        prices: true,
        durationMinutes: true,
        sessions: true,
        deposit: true,
        termsVersion: true,
      },
      where: { fashionCollection: { equals: collection.id } },
    }),
  ])
  const mediaByID = new Map(
    mediaResult.docs.map((media) => [
      media.id,
      payloadMediaToView(media as Media, locale),
    ])
  )

  return {
    id: collection.id,
    slug: collection.slug,
    routeSegment: collection.slug,
    title: collection.title,
    summary: collection.summary,
    narrative: collection.narrative,
    stylingNotes: collection.stylingNotes ?? undefined,
    collectionType: collection.collectionType,
    collaborationCredits: collection.collaborationCredits ?? undefined,
    materials: collection.materials?.map((material) => material.material) ?? [],
    pieces:
      collection.pieces?.map((piece) => ({
        name: piece.name,
        description: piece.description ?? undefined,
      })) ?? [],
    season: collection.season ?? undefined,
    year: collection.year ?? undefined,
    availability: collection.availability,
    commercialStatus:
      offersResult.docs.find((offer) => offer.commercialStatus === "active")
        ?.commercialStatus ?? collection.availability,
    priceNote:
      offersResult.docs.length > 0
        ? offersResult.docs
            .map((offer) => `${offer.title}: ${offer.pricingMode}`)
            .join(" · ")
        : collection.availability,
    mediaAssets: collection.gallery
      .map((id) => mediaByID.get(typeof id === "string" ? id : id.id))
      .filter((asset): asset is MediaAsset => Boolean(asset)),
    offers: offersResult.docs as ServiceOffer[],
    rightsAndCredits: collection.rightsAndCredits,
    cta: collection.cta,
    seo: {
      title:
        collection.meta?.title || `${collection.title} | PURITY Fashion Studio`,
      description: collection.meta?.description || collection.summary,
    },
  }
}

function cachedPayloadFashionCollection(locale: Locale, slug: string) {
  return unstable_cache(
    () => findPayloadFashionCollection(locale, slug, false),
    ["cms", "fashion-collection", locale, slug],
    {
      tags: [
        "cms:fashion-collections",
        "cms:offers",
        "cms:media",
        `cms:fashion-collections:${slug}`,
      ],
    }
  )()
}

export async function getFashionCollectionBySlug(locale: Locale, slug: string) {
  if (process.env.CONTENT_SOURCE !== "payload") {
    return seedFashionCollectionBySlug(locale, slug)
  }
  const { isEnabled } = await draftMode()
  return isEnabled
    ? findPayloadFashionCollection(locale, slug, true)
    : cachedPayloadFashionCollection(locale, slug)
}

export async function getPublishedFashionCollectionSlugs() {
  if (process.env.CONTENT_SOURCE !== "payload") {
    return collections
      .filter((collection) => collection.visibleInMvp)
      .map((collection) => collection.routeSegment)
  }
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "fashion-collections",
    depth: 0,
    fallbackLocale: false,
    limit: 1000,
    locale: "uk",
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
    sort: "sortOrder",
  })
  return result.docs.map((collection) => collection.slug)
}

function seedPortfolioCaseBySlug(
  locale: Locale,
  slug: string
): PortfolioCasePageData | null {
  const portfolioCase = portfolioCases.find(
    (candidate) =>
      candidate.visibleInMvp &&
      candidate.isRealClientProof &&
      candidate.routeSegment === slug
  )
  if (!portfolioCase) return null

  return {
    id: portfolioCase.slug,
    slug: portfolioCase.slug,
    routeSegment: portfolioCase.routeSegment,
    title: portfolioCase.title[locale],
    summary: portfolioCase.summary[locale],
    clientType: "private",
    brief: portfolioCase.summary[locale],
    constraints: "",
    research: "",
    process: "",
    result: portfolioCase.summary[locale],
    hasBeforeAfter: false,
    mediaAssets: portfolioCase.mediaIds.flatMap((id) => {
      const asset = getMediaAsset(id)
      return asset ? [asset as MediaAsset] : []
    }),
    seo: portfolioCase.seo[locale],
  }
}

async function findPayloadPortfolioCase(
  locale: Locale,
  slug: string,
  draft: boolean
): Promise<PortfolioCasePageData | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "portfolio-cases",
    depth: 0,
    draft,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: draft,
    pagination: false,
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      clientType: true,
      brief: true,
      constraints: true,
      research: true,
      process: true,
      result: true,
      media: true,
      hasBeforeAfter: true,
      meta: true,
    },
    where: { slug: { equals: slug } },
  })
  const portfolioCase = result.docs[0]
  if (!portfolioCase) return null

  const mediaResult = await payload.find({
    collection: "media",
    depth: 0,
    fallbackLocale: false,
    limit: Math.max(portfolioCase.media.length, 1),
    locale,
    overrideAccess: draft,
    pagination: false,
    select: {
      internalLabel: true,
      alt: true,
      source: true,
      allowedUsageContexts: true,
      isRealClientProof: true,
      replacementPriority: true,
      url: true,
      filename: true,
      width: true,
      height: true,
      focalX: true,
      sizes: true,
    },
    where: { id: { in: portfolioCase.media } },
  })
  const mediaByID = new Map(
    mediaResult.docs.map((media) => [
      media.id,
      payloadMediaToView(media as Media, locale),
    ])
  )

  return {
    id: portfolioCase.id,
    slug: portfolioCase.slug,
    routeSegment: portfolioCase.slug,
    title: portfolioCase.title,
    summary: portfolioCase.summary,
    clientType: portfolioCase.clientType,
    brief: portfolioCase.brief,
    constraints: portfolioCase.constraints,
    research: portfolioCase.research,
    process: portfolioCase.process,
    result: portfolioCase.result,
    hasBeforeAfter: portfolioCase.hasBeforeAfter,
    mediaAssets: portfolioCase.media
      .map((id) => mediaByID.get(typeof id === "string" ? id : id.id))
      .filter((asset): asset is MediaAsset => Boolean(asset)),
    seo: {
      title:
        portfolioCase.meta?.title ||
        `${portfolioCase.title} | PURITY Fashion Studio`,
      description: portfolioCase.meta?.description || portfolioCase.summary,
    },
  }
}

function cachedPayloadPortfolioCase(locale: Locale, slug: string) {
  return unstable_cache(
    () => findPayloadPortfolioCase(locale, slug, false),
    ["cms", "portfolio-case", locale, slug],
    {
      tags: ["cms:portfolio-cases", "cms:media", `cms:portfolio-cases:${slug}`],
    }
  )()
}

export async function getPortfolioCaseBySlug(locale: Locale, slug: string) {
  if (process.env.CONTENT_SOURCE !== "payload") {
    return seedPortfolioCaseBySlug(locale, slug)
  }
  const { isEnabled } = await draftMode()
  return isEnabled
    ? findPayloadPortfolioCase(locale, slug, true)
    : cachedPayloadPortfolioCase(locale, slug)
}

async function findPublishedPayloadPortfolioCases(locale: Locale) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "portfolio-cases",
    depth: 0,
    fallbackLocale: false,
    limit: 100,
    locale,
    overrideAccess: false,
    pagination: false,
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      clientType: true,
      brief: true,
      constraints: true,
      research: true,
      process: true,
      result: true,
      media: true,
      hasBeforeAfter: true,
      meta: true,
    },
    sort: "sortOrder",
  })

  const cases = await Promise.all(
    result.docs.map((portfolioCase) =>
      findPayloadPortfolioCase(locale, portfolioCase.slug, false)
    )
  )
  return cases.filter((item): item is PortfolioCasePageData => Boolean(item))
}

export async function getPublishedPortfolioCases(locale: Locale) {
  if (process.env.CONTENT_SOURCE !== "payload") {
    return portfolioCases.flatMap((portfolioCase) => {
      const item = seedPortfolioCaseBySlug(locale, portfolioCase.routeSegment)
      return item ? [item] : []
    })
  }
  return unstable_cache(
    () => findPublishedPayloadPortfolioCases(locale),
    ["cms", "portfolio-cases", locale],
    { tags: ["cms:portfolio-cases", "cms:media"] }
  )()
}

export async function getPublishedPortfolioCaseSlugs() {
  if (process.env.CONTENT_SOURCE !== "payload") {
    return portfolioCases
      .filter(
        (portfolioCase) =>
          portfolioCase.visibleInMvp && portfolioCase.isRealClientProof
      )
      .map((portfolioCase) => portfolioCase.routeSegment)
  }
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "portfolio-cases",
    depth: 0,
    fallbackLocale: false,
    limit: 1000,
    locale: "uk",
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
    sort: "sortOrder",
  })
  return result.docs.map((portfolioCase) => portfolioCase.slug)
}

function seedServiceCard(locale: Locale, slug: string): ServiceCardData | null {
  const service = services.find(
    (candidate) => candidate.visibleInMvp && candidate.routeSegment === slug
  )
  if (!service) return null
  return {
    id: service.slug,
    slug: service.slug,
    routeSegment: service.routeSegment,
    title: service.title[locale],
    summary: service.summary[locale],
    mediaAsset: getFirstMediaAsset(service.mediaIds),
  }
}

async function findPayloadServiceCards({
  draft,
  ids,
  locale,
  slugs,
}: {
  draft: boolean
  ids?: string[]
  locale: Locale
  slugs?: string[]
}): Promise<ServiceCardData[]> {
  const payload = await getPayloadClient()
  const and = []
  if (ids?.length) and.push({ id: { in: ids } })
  if (slugs?.length) and.push({ slug: { in: slugs } })
  const result = await payload.find({
    collection: "services",
    depth: 0,
    draft,
    fallbackLocale: false,
    limit: 100,
    locale,
    overrideAccess: draft,
    pagination: false,
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      gallery: true,
    },
    sort: "sortOrder",
    where: and.length ? { and } : undefined,
  })
  const mediaIDs = [
    ...new Set(
      result.docs.flatMap(
        (service) =>
          service.gallery?.map((media) =>
            typeof media === "string" ? media : media.id
          ) ?? []
      )
    ),
  ]
  const mediaResult = mediaIDs.length
    ? await payload.find({
        collection: "media",
        depth: 0,
        fallbackLocale: false,
        limit: mediaIDs.length,
        locale,
        overrideAccess: draft,
        pagination: false,
        select: {
          internalLabel: true,
          alt: true,
          source: true,
          allowedUsageContexts: true,
          isRealClientProof: true,
          replacementPriority: true,
          url: true,
          filename: true,
          width: true,
          height: true,
          focalX: true,
          sizes: true,
        },
        where: { id: { in: mediaIDs } },
      })
    : { docs: [] }
  const mediaByID = new Map(
    mediaResult.docs.map((media) => [
      media.id,
      payloadMediaToView(media as Media, locale),
    ])
  )

  return result.docs.map((service) => {
    const firstMedia = service.gallery?.[0]
    const mediaID = typeof firstMedia === "string" ? firstMedia : firstMedia?.id
    return {
      id: service.id,
      slug: service.slug,
      routeSegment: service.slug,
      title: service.title,
      summary: service.summary,
      mediaAsset: mediaID ? mediaByID.get(mediaID) : undefined,
    }
  })
}

export async function getPublishedServices(
  locale: Locale,
  filters: { ids?: string[]; slugs?: string[] } = {}
) {
  if (process.env.CONTENT_SOURCE !== "payload") {
    return services.flatMap((service) => {
      if (filters.ids?.length && !filters.ids.includes(service.slug)) return []
      if (
        filters.slugs?.length &&
        !filters.slugs.includes(service.routeSegment)
      )
        return []
      const item = seedServiceCard(locale, service.routeSegment)
      return item ? [item] : []
    })
  }
  const key = JSON.stringify(filters)
  return unstable_cache(
    () => findPayloadServiceCards({ draft: false, locale, ...filters }),
    ["cms", "services", locale, key],
    { tags: ["cms:services", "cms:media"] }
  )()
}

function seedDirectionBySlug(
  locale: Locale,
  slug: string
): DirectionPageData | null {
  const direction = serviceCategories.find(
    (candidate) => candidate.routeSegment === slug
  )
  if (
    !direction ||
    ![
      "research",
      "realisation",
      "transformation",
      "corporate",
      "school",
      "collections",
    ].includes(direction.slug)
  ) {
    return null
  }
  const related = services.flatMap((service) => {
    const matches =
      direction.slug === "realisation"
        ? ["realisation", "atelier"].includes(service.category)
        : service.category === direction.slug
    const item = matches ? seedServiceCard(locale, service.routeSegment) : null
    return item ? [item] : []
  })
  return {
    id: direction.slug,
    slug: direction.routeSegment,
    routeSegment: direction.routeSegment,
    canonicalKey: direction.slug as PayloadDirection["canonicalKey"],
    title: direction.title[locale],
    summary: direction.summary[locale],
    eyebrow: direction.title[locale],
    narrative: direction.summary[locale],
    process: [],
    outcomes: [],
    services: related,
    seo: {
      title: `${direction.title[locale]} | PURITY Fashion Studio`,
      description: direction.summary[locale],
    },
  }
}

async function findPayloadDirection(
  locale: Locale,
  slug: string,
  draft: boolean
): Promise<DirectionPageData | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "directions",
    depth: 0,
    draft,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: draft,
    pagination: false,
    select: {
      id: true,
      slug: true,
      canonicalKey: true,
      title: true,
      summary: true,
      eyebrow: true,
      narrative: true,
      heroMedia: true,
      processSteps: true,
      outcomes: true,
      relatedServices: true,
      meta: true,
    },
    where: { slug: { equals: slug } },
  })
  const direction = result.docs[0]
  if (!direction) return null
  const serviceIDs =
    direction.relatedServices?.map((service) =>
      typeof service === "string" ? service : service.id
    ) ?? []
  const services = await findPayloadServiceCards({
    draft,
    ids: serviceIDs,
    locale,
  })
  let mediaAsset: MediaAsset | undefined
  const heroMediaID =
    typeof direction.heroMedia === "string"
      ? direction.heroMedia
      : direction.heroMedia?.id
  if (heroMediaID) {
    const media = await payload.findByID({
      collection: "media",
      id: heroMediaID,
      depth: 0,
      fallbackLocale: false,
      locale,
      overrideAccess: draft,
      select: {
        internalLabel: true,
        alt: true,
        source: true,
        allowedUsageContexts: true,
        isRealClientProof: true,
        replacementPriority: true,
        url: true,
        filename: true,
        width: true,
        height: true,
        focalX: true,
        sizes: true,
      },
    })
    mediaAsset = payloadMediaToView(media as Media, locale)
  }

  return {
    id: direction.id,
    slug: direction.slug,
    routeSegment: direction.slug,
    canonicalKey: direction.canonicalKey,
    title: direction.title,
    summary: direction.summary,
    eyebrow: direction.eyebrow ?? undefined,
    narrative: direction.narrative,
    process:
      direction.processSteps?.map((step) => ({
        title: step.title,
        description: step.description,
      })) ?? [],
    outcomes: direction.outcomes?.map((item) => item.text) ?? [],
    services,
    mediaAsset,
    seo: {
      title:
        direction.meta?.title || `${direction.title} | PURITY Fashion Studio`,
      description: direction.meta?.description || direction.summary,
    },
  }
}

export async function getDirectionBySlug(locale: Locale, slug: string) {
  if (process.env.CONTENT_SOURCE !== "payload") {
    return seedDirectionBySlug(locale, slug)
  }
  const { isEnabled } = await draftMode()
  if (isEnabled) return findPayloadDirection(locale, slug, true)
  return unstable_cache(
    () => findPayloadDirection(locale, slug, false),
    ["cms", "direction", locale, slug],
    {
      tags: [
        "cms:directions",
        "cms:services",
        "cms:media",
        `cms:directions:${slug}`,
      ],
    }
  )()
}

export async function getPublishedDirectionSlugs() {
  if (process.env.CONTENT_SOURCE !== "payload") {
    return serviceCategories
      .filter((category) =>
        [
          "research",
          "realisation",
          "transformation",
          "corporate",
          "school",
          "collections",
        ].includes(category.slug)
      )
      .map((category) => category.routeSegment)
  }
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "directions",
    depth: 0,
    fallbackLocale: false,
    limit: 1000,
    locale: "uk",
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
    sort: "sortOrder",
  })
  return result.docs.map((direction) => direction.slug)
}

function seedPageBySlug(locale: Locale, slug: string): PublicPageData | null {
  const page = publicPages.find((candidate) => candidate.routeSegment === slug)
  if (page) {
    const pageTypes = {
      studio: "studio",
      privacy: "privacy",
      terms: "terms",
      booking: "service-state",
    } as const
    return {
      id: page.slug,
      slug: page.routeSegment,
      routeSegment: page.routeSegment,
      pageType: pageTypes[page.slug],
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
      mediaAsset: getFirstMediaAsset(page.mediaIds),
      mediaIds: page.mediaIds,
      cta: {
        action: "contact",
        label: page.cta?.label[locale] ?? genericCopy.bookingLabel[locale],
      },
      seo: page.seo[locale],
    }
  }

  if (slug === "contacts") {
    const category = serviceCategories.find((item) => item.slug === "contacts")
    if (!category) return null
    return {
      id: "contacts",
      slug: "contacts",
      routeSegment: "contacts",
      pageType: "contacts",
      title: category.title[locale],
      summary: category.summary[locale],
      eyebrow: "PURITY",
      body: [
        siteSettings.contacts.address[locale],
        siteSettings.contacts.hours[locale],
        siteSettings.contacts.responseTime[locale],
      ].join("\n\n"),
      sections: [],
      cta: {
        action: "booking-request",
        label: siteSettings.contacts.actionLabel[locale],
      },
      seo: {
        title: `${category.title[locale]} | PURITY Fashion Studio`,
        description: category.summary[locale],
      },
    }
  }
  return null
}

async function findPayloadPage(
  locale: Locale,
  slug: string,
  draft: boolean
): Promise<PublicPageData | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "pages",
    depth: 0,
    draft,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: draft,
    pagination: false,
    select: {
      id: true,
      slug: true,
      pageType: true,
      title: true,
      summary: true,
      eyebrow: true,
      body: true,
      sections: true,
      cta: true,
      legalVersion: true,
      effectiveDate: true,
      meta: true,
    },
    where: { slug: { equals: slug } },
  })
  const page = result.docs[0]
  if (!page) return null
  const mediaIDs =
    page.sections
      ?.map((section) => section.media)
      .filter((id): id is string => typeof id === "string") ?? []
  const media = mediaIDs.length
    ? await payload.find({
        collection: "media",
        depth: 0,
        fallbackLocale: false,
        limit: mediaIDs.length,
        locale,
        overrideAccess: draft,
        pagination: false,
        select: {
          internalLabel: true,
          alt: true,
          source: true,
          allowedUsageContexts: true,
          isRealClientProof: true,
          replacementPriority: true,
          url: true,
          filename: true,
          width: true,
          height: true,
          focalX: true,
          sizes: true,
        },
        where: { id: { in: mediaIDs } },
      })
    : { docs: [] }
  const mediaByID = new Map(
    media.docs.map((item) => [
      item.id,
      payloadMediaToView(item as Media, locale),
    ])
  )
  return {
    id: page.id,
    slug: page.slug,
    routeSegment: page.slug,
    pageType: page.pageType,
    title: page.title,
    summary: page.summary,
    eyebrow: page.eyebrow ?? undefined,
    body: page.body,
    sections:
      page.sections?.map((section) => ({
        heading: section.heading,
        body: section.body,
        mediaAsset:
          typeof section.media === "string"
            ? mediaByID.get(section.media)
            : undefined,
      })) ?? [],
    mediaAsset: media.docs[0]
      ? payloadMediaToView(media.docs[0] as Media, locale)
      : undefined,
    cta: page.cta,
    legalVersion: page.legalVersion ?? undefined,
    effectiveDate: page.effectiveDate ?? undefined,
    seo: {
      title: page.meta?.title || `${page.title} | PURITY Fashion Studio`,
      description: page.meta?.description || page.summary,
    },
  }
}

export async function getPageBySlug(locale: Locale, slug: string) {
  if (process.env.CONTENT_SOURCE !== "payload")
    return seedPageBySlug(locale, slug)
  const { isEnabled } = await draftMode()
  if (isEnabled) return findPayloadPage(locale, slug, true)
  return unstable_cache(
    () => findPayloadPage(locale, slug, false),
    ["cms", "page", locale, slug],
    { tags: ["cms:pages", "cms:media", `cms:pages:${slug}`] }
  )()
}

export async function getPublishedPageSlugs() {
  if (process.env.CONTENT_SOURCE !== "payload") {
    return [...publicPages.map((page) => page.routeSegment), "contacts"]
  }
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "pages",
    depth: 0,
    fallbackLocale: false,
    limit: 1000,
    locale: "uk",
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
    sort: "sortOrder",
  })
  return result.docs.map((page) => page.slug)
}

async function getDraftFlag() {
  if (process.env.CONTENT_SOURCE !== "payload") return false
  return (await draftMode()).isEnabled
}

async function findPayloadHeader(locale: Locale, draft: boolean) {
  const payload = await getPayloadClient()
  const header = await payload.findGlobal({
    slug: "header",
    depth: 0,
    draft,
    fallbackLocale: false,
    locale,
    overrideAccess: draft,
    select: { navigation: true, bookingLabel: true },
  })
  return {
    navigation:
      header.navigation?.map((item) => ({
        label: item.label,
        path: item.path,
        visible: item.visible,
        external: item.external,
        accessibleLabel: item.accessibleLabel ?? undefined,
      })) ?? [],
    bookingLabel: header.bookingLabel,
  } satisfies HeaderData
}

export async function getHeader(locale: Locale): Promise<HeaderData> {
  if (process.env.CONTENT_SOURCE !== "payload") {
    return {
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
    }
  }
  const draft = await getDraftFlag()
  if (draft) return findPayloadHeader(locale, true)
  return unstable_cache(
    () => findPayloadHeader(locale, false),
    ["cms", "header", locale],
    { tags: ["cms:header", "cms:navigation"] }
  )()
}

async function findPayloadFooter(locale: Locale, draft: boolean) {
  const payload = await getPayloadClient()
  const footer = await payload.findGlobal({
    slug: "footer",
    depth: 0,
    draft,
    fallbackLocale: false,
    locale,
    overrideAccess: draft,
    select: {
      email: true,
      phone: true,
      address: true,
      hours: true,
      responseTime: true,
      socialLinks: true,
      legalNavigation: true,
      copyright: true,
    },
  })
  return {
    email: footer.email,
    phone: footer.phone,
    address: footer.address,
    hours: footer.hours,
    responseTime: footer.responseTime,
    socialLinks:
      footer.socialLinks?.map((item) => ({
        platform: item.platform,
        url: item.url,
        accessibleLabel: item.accessibleLabel,
      })) ?? [],
    legalNavigation:
      footer.legalNavigation?.map((item) => ({
        label: item.label,
        path: item.path,
      })) ?? [],
    copyright: footer.copyright,
  } satisfies FooterData
}

export async function getFooter(locale: Locale): Promise<FooterData> {
  if (process.env.CONTENT_SOURCE !== "payload") {
    return {
      email: siteSettings.contacts.email ?? "",
      phone: siteSettings.contacts.phone ?? siteSettings.contacts.phones[0],
      address: siteSettings.contacts.address[locale],
      hours: siteSettings.contacts.hours[locale],
      responseTime: siteSettings.contacts.responseTime[locale],
      socialLinks: siteSettings.contacts.socials.map((item) => ({
        platform: item.label,
        url: item.url,
        accessibleLabel: item.label,
      })),
      legalNavigation: navigation
        .filter((item) => ["privacy", "terms"].includes(item.id))
        .map((item) => ({ label: item.label[locale], path: item.path })),
      copyright: `© ${new Date().getFullYear()} PURITY Fashion Studio`,
    }
  }
  const draft = await getDraftFlag()
  if (draft) return findPayloadFooter(locale, true)
  return unstable_cache(
    () => findPayloadFooter(locale, false),
    ["cms", "footer", locale],
    { tags: ["cms:footer", "cms:navigation"] }
  )()
}

async function findPayloadSiteSettings(locale: Locale) {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({
    slug: "site-settings",
    depth: 0,
    fallbackLocale: false,
    locale,
    overrideAccess: false,
    select: {
      brandName: true,
      canonicalOrigin: true,
      contacts: true,
      localeLabels: true,
      maintenance: true,
    },
  })
  return {
    brandName: settings.brandName,
    canonicalOrigin: settings.canonicalOrigin,
    contacts: settings.contacts,
    localeLabels: settings.localeLabels,
    maintenance: {
      enabled: settings.maintenance.enabled,
      message: settings.maintenance.message ?? undefined,
    },
  } satisfies SiteSettingsData
}

export async function getSiteSettings(
  locale: Locale
): Promise<SiteSettingsData> {
  if (process.env.CONTENT_SOURCE !== "payload") {
    return {
      brandName: siteSettings.brandName,
      canonicalOrigin:
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      contacts: {
        email: siteSettings.contacts.email ?? "",
        phone: siteSettings.contacts.phone ?? siteSettings.contacts.phones[0],
        address: siteSettings.contacts.address[locale],
        hours: siteSettings.contacts.hours[locale],
      },
      localeLabels: {
        uk: siteSettings.languageLabel.uk,
        ru: siteSettings.languageLabel.ru,
        en: siteSettings.languageLabel.en,
      },
      maintenance: { enabled: false },
    }
  }
  return unstable_cache(
    () => findPayloadSiteSettings(locale),
    ["cms", "site-settings", locale],
    { tags: ["cms:site-settings", "cms:metadata"] }
  )()
}

async function findPayloadHome(locale: Locale, draft: boolean) {
  const payload = await getPayloadClient()
  const home = await payload.findGlobal({
    slug: "home",
    depth: 1,
    draft,
    fallbackLocale: false,
    locale,
    overrideAccess: draft,
    select: {
      heroEyebrow: true,
      heroTitle: true,
      heroSummary: true,
      heroMedia: true,
      primaryCTA: true,
      secondaryCTA: true,
      method: true,
      studioIntro: true,
      finalCTATitle: true,
      finalCTASummary: true,
      selectedServices: true,
      selectedCourses: true,
      selectedCollections: true,
      selectedPortfolio: true,
      meta: true,
    },
  })
  let heroMedia: MediaAsset | undefined
  const mediaID =
    typeof home.heroMedia === "string" ? home.heroMedia : home.heroMedia?.id
  if (mediaID) {
    const media = await payload.findByID({
      collection: "media",
      id: mediaID,
      depth: 0,
      fallbackLocale: false,
      locale,
      overrideAccess: draft,
      select: {
        internalLabel: true,
        alt: true,
        source: true,
        allowedUsageContexts: true,
        isRealClientProof: true,
        replacementPriority: true,
        url: true,
        filename: true,
        width: true,
        height: true,
        focalX: true,
        sizes: true,
      },
    })
    heroMedia = payloadMediaToView(media as Media, locale)
  }
  return {
    heroEyebrow: home.heroEyebrow ?? undefined,
    heroTitle: home.heroTitle,
    heroSummary: home.heroSummary,
    heroMedia,
    primaryCTA: home.primaryCTA,
    secondaryCTA: home.secondaryCTA,
    method:
      home.method?.map((item) => ({
        label: item.label,
        description: item.description,
      })) ?? [],
    studioIntro: home.studioIntro,
    finalCTATitle: home.finalCTATitle,
    finalCTASummary: home.finalCTASummary,
    selectedServiceSlugs:
      home.selectedServices?.flatMap((item) =>
        typeof item === "string" ? [] : [item.slug]
      ) ?? [],
    selectedCourseSlugs:
      home.selectedCourses?.flatMap((item) =>
        typeof item === "string" ? [] : [item.slug]
      ) ?? [],
    selectedCollectionSlugs:
      home.selectedCollections?.flatMap((item) =>
        typeof item === "string" ? [] : [item.slug]
      ) ?? [],
    selectedPortfolioSlugs:
      home.selectedPortfolio?.flatMap((item) =>
        typeof item === "string" ? [] : [item.slug]
      ) ?? [],
    seo: {
      title: home.meta?.title || home.heroTitle,
      description: home.meta?.description || home.heroSummary,
    },
  } satisfies HomeData
}

export async function getHome(locale: Locale): Promise<HomeData> {
  if (process.env.CONTENT_SOURCE !== "payload") {
    return {
      heroEyebrow: siteSettings.home.eyebrow[locale],
      heroTitle: siteSettings.home.title[locale],
      heroSummary: siteSettings.home.summary[locale],
      heroMedia: getMediaAsset("generated-editorial-hero-flow"),
      primaryCTA: {
        label: siteSettings.home.primaryCta.label[locale],
        path: siteSettings.home.primaryCta.path,
      },
      secondaryCTA: {
        label: siteSettings.home.secondaryCta.label[locale],
        path: siteSettings.home.secondaryCta.path,
      },
      method: [],
      studioIntro: siteSettings.home.studioSummary[locale],
      finalCTATitle: siteSettings.home.studioTitle[locale],
      finalCTASummary: siteSettings.home.studioSummary[locale],
      selectedServiceSlugs: services
        .filter((service) => service.visibleInMvp)
        .map((service) => service.routeSegment),
      selectedCourseSlugs: courses
        .filter((course) => course.visibleInMvp)
        .map((course) => course.routeSegment),
      selectedCollectionSlugs: collections
        .filter((collection) => collection.visibleInMvp)
        .map((collection) => collection.routeSegment),
      selectedPortfolioSlugs: portfolioCases
        .filter((item) => item.visibleInMvp)
        .map((item) => item.routeSegment),
      seo: siteSettings.seo[locale],
    }
  }
  const draft = await getDraftFlag()
  if (draft) return findPayloadHome(locale, true)
  return unstable_cache(
    () => findPayloadHome(locale, false),
    ["cms", "home", locale],
    { tags: ["cms:home", "cms:media"] }
  )()
}
