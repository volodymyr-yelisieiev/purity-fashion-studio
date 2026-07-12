import type { Locale } from "../i18n/routing"

export type Localized<T> = Record<Locale, T>

export type PageTextBlock = {
  title: Localized<string>
  text: Localized<string>
}

export type CategoryPageSpec = {
  ctaService: string
  heroNote: Localized<string>
  processTitle: Localized<string>
  processSteps: PageTextBlock[]
  formatsTitle: Localized<string>
  formats: Localized<string>[]
  outcomesTitle: Localized<string>
  outcomes: Localized<string>[]
  ctaTitle: Localized<string>
  ctaSummary: Localized<string>
  diagnosticLabel?: Localized<string>
  faqTitle?: Localized<string>
  faq?: Array<{ question: Localized<string>; answer: Localized<string> }>
}

export type ServicePageSpec = {
  intro: Localized<string>
  formatsTitle: Localized<string>
  formats: PageTextBlock[]
  processTitle: Localized<string>
  process: PageTextBlock[]
  outcomeTitle: Localized<string>
  outcomeSummary: Localized<string>
  commercialTitle: Localized<string>
  nextStepTitle: Localized<string>
  nextStepSummary: Localized<string>
  contactLabel?: Localized<string>
  courseLabel?: Localized<string>
  collectionLabel?: Localized<string>
}

export type CollectionPageSpec = {
  eyebrow: Localized<string>
  narrative: Localized<string>
  stylingTitle: Localized<string>
  styling: PageTextBlock[]
  factsTitle: Localized<string>
  facts: PageTextBlock[]
  inquiryTitle: Localized<string>
  inquiry: PageTextBlock[]
  materialsTitle: Localized<string>
  availabilityTitle: Localized<string>
  ctaTitle: Localized<string>
  ctaSummary: Localized<string>
  serviceLabel: Localized<string>
}

export const serviceCategorySlugs = [
  "research",
  "realisation",
  "atelier",
  "transformation",
  "corporate",
  "school",
  "collections",
  "portfolio",
  "contacts",
] as const

export type ServiceCategorySlug = (typeof serviceCategorySlugs)[number]

export const publicPageSlugs = [
  "studio",
  "booking",
  "privacy",
  "terms",
] as const

export type PublicPageSlug = (typeof publicPageSlugs)[number]

export type SeoContent = {
  title: string
  description: string
}

export type SourceBacked = {
  sourceUrl?: string
  sourceLabel?: string
}

export type ServiceCategory = {
  slug: ServiceCategorySlug
  routeSegment: string
  title: Localized<string>
  summary: Localized<string>
} & SourceBacked

export type Service = {
  slug: string
  category: Exclude<ServiceCategorySlug, "portfolio" | "contacts">
  routeSegment: string
  visibleInMvp: boolean
  title: Localized<string>
  summary: Localized<string>
  commercialStatus: Localized<string>
  priceNote: Localized<string>
  outcomes: Localized<string[]>
  mediaIds: string[]
  seo: Localized<SeoContent>
} & SourceBacked

export type Course = {
  slug: string
  routeSegment: string
  visibleInMvp: boolean
  title: Localized<string>
  summary: Localized<string>
  commercialStatus: Localized<string>
  priceNote: Localized<string>
  audience: Localized<string>
  lessons: Localized<string[]>
  mediaIds: string[]
  seo: Localized<SeoContent>
} & SourceBacked

export type Collection = {
  slug: string
  routeSegment: string
  visibleInMvp: boolean
  title: Localized<string>
  summary: Localized<string>
  commercialStatus: Localized<string>
  priceNote: Localized<string>
  materials: Localized<string[]>
  mediaIds: string[]
  seo: Localized<SeoContent>
} & SourceBacked

export type PortfolioCase = {
  slug: string
  routeSegment: string
  visibleInMvp: boolean
  title: Localized<string>
  summary: Localized<string>
  mediaIds: string[]
  isRealClientProof: boolean
  seo: Localized<SeoContent>
}

export type NavigationItem = {
  id: ServiceCategorySlug | PublicPageSlug | "home"
  label: Localized<string>
  path: string
  visibleInMvp: boolean
}

export type PublicPage = {
  slug: PublicPageSlug
  routeSegment: string
  title: Localized<string>
  eyebrow: Localized<string>
  summary: Localized<string>
  body: Localized<string[]>
  mediaIds?: string[]
  cta?: {
    label: Localized<string>
    path: string
  }
  seo: Localized<SeoContent>
} & SourceBacked

export type MediaAsset = {
  id: string
  kind: "logo" | "image"
  source: "client" | "generated"
  generated: boolean
  fileName: string
  aspectRatio: string
  sourceFile?: string
  sourceMetadata?: {
    engine: string
    prompt?: string
    originalPath?: string
  }
  src?: string
  usage: string[]
  internalLabel: Localized<string>
  alt: Localized<string>
  replacementPriority:
    | "keep-client-source"
    | "replace-before-launch"
    | "replace-when-client-proof-arrives"
  isRealClientProof: boolean
}

export type SiteSettings = {
  brandName: string
  languageLabel: Localized<string>
  contrastLabel: Localized<string>
  closeLabel: Localized<string>
  externalLinkLabel: Localized<string>
  home: {
    eyebrow: Localized<string>
    title: Localized<string>
    summary: Localized<string>
    primaryCta: {
      label: Localized<string>
      path: string
    }
    secondaryCta: {
      label: Localized<string>
      path: string
    }
    studioEyebrow: Localized<string>
    studioTitle: Localized<string>
    studioSummary: Localized<string>
    serviceRailTitle: Localized<string>
    collectionRailTitle: Localized<string>
    portfolioNote: Localized<string>
  }
  defaultOgImageId: string
  primaryNavigation: NavigationItem["id"][]
  footerNavigation: NavigationItem["id"][]
  seo: Localized<SeoContent>
  contacts: {
    city: Localized<string>
    address: Localized<string>
    hours: Localized<string>
    responseTime: Localized<string>
    actionLabel: Localized<string>
    actionPath: string
    email: string | null
    phone: string | null
    phones: string[]
    viberUrl: string
    socials: Array<{
      label: string
      url: string
    }>
    sourceUrl: string
    sourceLabel: string
  }
}
