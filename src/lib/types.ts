export const locales = ['uk', 'en', 'ru'] as const

export type Locale = (typeof locales)[number]
export type ServiceArea = 'research' | 'realisation'
export type EntityKind =
  | 'page'
  | 'service'
  | 'course'
  | 'collection'
  | 'portfolio'
  | 'transformation'
  | 'settings'
  | 'media'

export type LocalizedText = Record<Locale, string>
export type LocalizedValue<T> = Record<Locale, T>

export type PublishState = 'draft' | 'review' | 'published' | 'archived'
export type ContentAccessRole = 'admin' | 'editor' | 'translator' | 'viewer' | 'system'

export interface ContentOwner {
  id: string
  name: string
  role: ContentAccessRole
}

export interface ContentRevision {
  id: string
  version: number
  note: string
  createdAt: string
  createdBy: ContentOwner
}

export interface ContentLifecycle {
  state: PublishState
  publishedAt?: string
  archivedAt?: string
  archivedBy?: ContentOwner
}

export interface ManagedContentMeta {
  id: string
  kind: EntityKind
  slug: string
  owner: ContentOwner
  lastEditedBy: ContentOwner
  createdAt: string
  updatedAt: string
  lifecycle: ContentLifecycle
  currentRevision: ContentRevision
  hasUnpublishedChanges: boolean
  previewKey: string
}

export interface LocalizedDocumentStatus {
  locale: Locale
  title: string
  summary?: string
  isComplete: boolean
}

export interface FocalPoint {
  x: number
  y: number
}

export interface MediaAsset {
  id: string
  kind: 'image' | 'video'
  title: string
  alt: string
  src: string
  mimeType: string
  width?: number
  height?: number
  durationSeconds?: number
  posterSrc?: string
  focalPoint?: FocalPoint
}

export interface MediaGalleryItem {
  id: string
  asset: MediaAsset
  caption: string
  purpose: 'cover' | 'gallery' | 'detail' | 'thumbnail'
}

export interface MediaEmbed {
  id: string
  provider: 'youtube' | 'vimeo' | 'custom'
  title: string
  url: string
  embedUrl?: string
  poster?: MediaAsset
}

export interface MediaGallery {
  cover?: MediaGalleryItem
  items: MediaGalleryItem[]
}

export interface ImageAsset {
  src: string
  alt: string
  caption?: string
}

export interface VideoEmbed {
  title: string
  url: string
  provider: 'youtube' | 'vimeo' | 'external'
}

export interface SeoMetadata {
  title: string
  description: string
  keywords?: string[]
  image: ImageAsset
  type?: 'website' | 'article'
}

export interface Price {
  eur: string
  uah: string
}

export interface OfferFormat {
  id: string
  label: string
  detail: string
}

export interface ServiceEntity {
  kind: 'service'
  slug: string
  id: string
  area: ServiceArea
  title: string
  eyebrow: string
  summary: string
  price: Price
  duration: string
  leadTime: string
  formats: OfferFormat[]
  deliverables: string[]
  process: string[]
  notes: string[]
  visualMood: string
  heroLabel: string
  media: ImageAsset
  seo: SeoMetadata
  meta: ManagedContentMeta
}

export interface CourseEntity {
  kind: 'course'
  slug: string
  id: string
  title: string
  summary: string
  price: Price
  sessions: string
  format: string
  details: string[]
  media: MediaGallery
  meta: ManagedContentMeta
}

export interface CollectionEntity {
  kind: 'collection'
  slug: string
  id: string
  title: string
  summary: string
  heroMedia: ImageAsset
  story: string
  editorialNotes: string[]
  priceNote: string
  palette: string[]
  materials: string[]
  silhouettes: string[]
  gallery: ImageAsset[]
  requestCta: string
  seo: SeoMetadata
  meta: ManagedContentMeta
}

export interface PortfolioCaseEntity {
  kind: 'portfolio'
  slug: string
  id: string
  title: string
  category: string
  summary: string
  heroMedia: ImageAsset
  client: string
  context: string
  challenge: string
  approach: string
  outcome: string
  deliverables: string[]
  metrics: Array<{ label: string; value: string }>
  accents: string[]
  gallery: ImageAsset[]
  video?: VideoEmbed
  requestCta: string
  seo: SeoMetadata
  meta: ManagedContentMeta
}

export interface TransformationOfferEntity {
  kind: 'transformation'
  slug: string
  id: string
  title: string
  summary: string
  format: string
  cta: string
  media: ImageAsset
  meta: ManagedContentMeta
}

export interface HomePageData {
  id: string
  kind: 'page'
  slug: 'home'
  heroKicker: string
  heroTitle: string
  heroDescription: string
  heroPrimaryCta: string
  heroSecondaryCta: string
  philosophy: string
  methodologyTitle: string
  methodologySteps: string[]
  privateClientsTitle: string
  privateClientsText: string
  corporateClientsTitle: string
  corporateClientsText: string
  transformationNote: string
  seo: SeoMetadata
  meta: ManagedContentMeta
}

export interface ListingPageData {
  id: string
  kind: 'page'
  slug:
    | 'research'
    | 'realisation'
    | 'transformation'
    | 'collections'
    | 'school'
    | 'portfolio'
  title: string
  intro: string
  pullQuote: string
  seo: SeoMetadata
  meta: ManagedContentMeta
}

export interface SchoolPageData extends ListingPageData {
  slug: 'school'
  note: string
}

export interface PortfolioPageData extends ListingPageData {
  slug: 'portfolio'
  highlight: string
}

export interface ContactsPageData {
  id: string
  kind: 'page'
  slug: 'contacts'
  title: string
  intro: string
  inquiryTitle: string
  corporateTitle: string
  corporateText: string
  scheduleNote: string
  mapLabel: string
  seo: SeoMetadata
  meta: ManagedContentMeta
}

export interface StudioSocialLink {
  label: string
  href: string
}

export interface StudioSettings {
  kind: 'settings'
  slug: 'studio-settings'
  id: string
  contactEmail: string
  corporateEmail?: string
  phone?: string
  locationLabel: string
  mapHref?: string
  mapLabel: string
  socialLinks: StudioSocialLink[]
  adminNote?: string
  meta: ManagedContentMeta
}

export interface UiCopy {
  brand: string
  accessibility: {
    skipToContent: string
    siteMenu: string
  }
  navigation: {
    studio: string
    works: string
    contact: string
    menu: string
    close: string
  }
  nav: Record<
    | 'home'
    | 'research'
    | 'realisation'
    | 'transformation'
    | 'school'
    | 'collections'
    | 'portfolio'
    | 'contacts',
    string
  >
  actions: Record<
    | 'bookNow'
    | 'buyService'
    | 'viewCollection'
    | 'viewPortfolio'
    | 'requestConsultation'
    | 'chooseFormat'
    | 'continue'
    | 'submit'
    | 'processing'
    | 'sending'
    | 'retry'
    | 'sendInquiry'
    | 'backHome'
    | 'viewCase',
    string
  >
  labels: {
    allRightsReserved: string
    methodology: string
    quote: string
    pricing: string
    timing: string
    serviceStructure: string
    serviceStructureTitle: string
    formats: string
    deliverables: string
    process: string
    notes: string
    visualMood: string
    atelierMood: string
    collection: string
    collections: string
    collectionStory: string
    palette: string
    materials: string
    silhouettes: string
    portfolio: string
    selectedCases: string
    challenge: string
    approach: string
    result: string
    caseContext: string
    client: string
    filmNote: string
    studioInquiry: string
    selectedOffer: string
    requestStructure: string
    requestStructureTitle: string
    sessionSetup: string
    clientContact: string
    homeStatsServices: string
    homeStatsStudio: string
    homeStatsLanguages: string
    atelierFocus: string
    schoolSpotlight: string
    collectionSpotlight: string
    editorialFieldNote: string
    kyivEditorialDirection: string
    schoolNote: string
    philosophy: string
    conciergeFollowUp: string
    privateInquiries: string
    corporateBriefs: string
    socialFollowUp: string
    sending: string
    processing: string
  }
  booking: {
    title: string
    intro: string
    consultationTitle: string
    consultationSummary: string
    dateLabel: string
    nameLabel: string
    emailLabel: string
    phoneLabel: string
    notesLabel: string
    nextStepTitle: string
    nextStepHint: string
    flowLabel: string
    flowTitle: string
    flowText: string
    leadRequestTag: string
    localeAware: string
    studioOrOnline: string
    onlineLabel: string
    onlineDetail: string
    studioLabel: string
    studioDetail: string
    consultationLabel: string
    prototypeNotice: string
    pending: string
    success: string
    failure: string
    duplicate: string
  }
  contact: {
    nameLabel: string
    emailLabel: string
    phoneLabel: string
    interestLabel: string
    messageLabel: string
    prototypeNotice: string
    pending: string
    success: string
    failure: string
    duplicate: string
  }
  footerTagline: string
}

export interface BookingRequest {
  kind: 'service' | 'course' | 'collection' | 'portfolio' | 'transformation'
  slug: string
  locale: Locale
  format?: string
  preferredDate?: string
  name: string
  email: string
  phone: string
  notes?: string
}

export interface ContactInquiry {
  locale: Locale
  name: string
  email: string
  phone: string
  interest?: string
  message: string
}

export interface SubmissionResult {
  status: 'success' | 'failure'
  reference: string
  message?: string
  source?: 'mock' | 'webhook'
}

export interface LeadSubmission {
  channel: 'booking' | 'contact'
  locale: Locale
  payload: BookingRequest | ContactInquiry
  submittedAt: string
}

export interface ContentQueryOptions {
  locale?: Locale
  includeDrafts?: boolean
  includeArchived?: boolean
  previewRevisionId?: string
}

export interface AdminNavItem {
  kind: EntityKind
  label: string
  description: string
  count: number
  to: string
}

export interface ManagedContentSummary {
  id: string
  kind: EntityKind
  slug: string
  title: string
  state: PublishState
  updatedAt: string
  ownerName: string
  localeCoverage: Locale[]
  mediaCount: number
  to: string
}

export interface ManagedContentRecord {
  id: string
  kind: EntityKind
  slug: string
  meta: ManagedContentMeta
  localizations: LocalizedDocumentStatus[]
  previewPath?: string
  workflowNotes: string[]
  raw: unknown
}

export type ManagedContentMutationAction = 'create' | 'update' | 'archive'

export interface ManagedOfferDraftFields {
  priceEur?: string
  priceUah?: string
  mediaSrc?: string
  mediaAlt?: string
  eyebrow?: string
  duration?: string
  leadTime?: string
  format?: string
  cta?: string
  priceNote?: string
  category?: string
  requestCta?: string
}

export interface ManagedContentMutationInput {
  action: ManagedContentMutationAction
  kind: EntityKind
  slug?: string
  locale: Locale
  title: string
  summary?: string
  reason?: string
  state?: PublishState
  fields?: ManagedOfferDraftFields
}

export interface ManagedContentMutationResult {
  status: 'ready' | 'queued' | 'blocked'
  adapter: 'json-overlay' | 'headless-cms'
  message: string
  reference: string
  record?: ManagedContentRecord
}

export interface ContentProviderAdapter {
  listManagedContent(
    locale: Locale,
    kind?: EntityKind,
  ): Promise<ManagedContentSummary[]>
  getManagedContentRecord(
    locale: Locale,
    kind: EntityKind,
    slug: string,
  ): Promise<ManagedContentRecord | undefined>
  upsertManagedContent(
    input: ManagedContentMutationInput,
  ): Promise<ManagedContentMutationResult>
  archiveManagedContent(
    input: ManagedContentMutationInput,
  ): Promise<ManagedContentMutationResult>
}

export interface ContentRepository {
  getHomePage(locale: Locale, options?: ContentQueryOptions): Promise<HomePageData>
  getResearchPage(locale: Locale, options?: ContentQueryOptions): Promise<ListingPageData>
  getRealisationPage(locale: Locale, options?: ContentQueryOptions): Promise<ListingPageData>
  getTransformationPage(locale: Locale, options?: ContentQueryOptions): Promise<ListingPageData>
  getSchoolPage(locale: Locale, options?: ContentQueryOptions): Promise<SchoolPageData>
  getCollectionsPage(locale: Locale, options?: ContentQueryOptions): Promise<ListingPageData>
  getPortfolioPage(locale: Locale, options?: ContentQueryOptions): Promise<PortfolioPageData>
  getContactsPage(locale: Locale, options?: ContentQueryOptions): Promise<ContactsPageData>
  getServices(locale: Locale, area?: ServiceArea): Promise<ServiceEntity[]>
  getServiceBySlug(
    locale: Locale,
    area: ServiceArea,
    slug: string,
  ): Promise<ServiceEntity | undefined>
  getCourses(locale: Locale): Promise<CourseEntity[]>
  getCollections(locale: Locale): Promise<CollectionEntity[]>
  getCollectionBySlug(
    locale: Locale,
    slug: string,
  ): Promise<CollectionEntity | undefined>
  getPortfolio(locale: Locale): Promise<PortfolioCaseEntity[]>
  getPortfolioCaseBySlug(
    locale: Locale,
    slug: string,
  ): Promise<PortfolioCaseEntity | undefined>
  getTransformationOffers(
    locale: Locale,
  ): Promise<TransformationOfferEntity[]>
  getUiCopy(locale: Locale): Promise<UiCopy>
  getStudioSettings(locale: Locale, options?: ContentQueryOptions): Promise<StudioSettings>
  getAdminNavigation(locale: Locale): Promise<AdminNavItem[]>
  getManagedContentIndex(
    locale: Locale,
    kind?: EntityKind,
  ): Promise<ManagedContentSummary[]>
  getManagedContentRecord(
    locale: Locale,
    kind: EntityKind,
    slug: string,
  ): Promise<ManagedContentRecord | undefined>
  upsertManagedContent(
    input: ManagedContentMutationInput,
  ): Promise<ManagedContentMutationResult>
  archiveManagedContent(
    input: ManagedContentMutationInput,
  ): Promise<ManagedContentMutationResult>
}

export interface BookingSubmissionAdapter {
  submitBookingRequest(request: BookingRequest): Promise<SubmissionResult>
}

export interface InquirySubmissionAdapter {
  submitInquiry(inquiry: ContactInquiry): Promise<SubmissionResult>
}
