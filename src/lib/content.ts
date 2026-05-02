import type {
  AdminNavItem,
  CollectionEntity,
  ContactsPageData,
  CourseEntity,
  HomePageData,
  ImageAsset,
  ListingPageData,
  Locale,
  LocalizedDocumentStatus,
  ManagedContentMeta,
  ManagedContentRecord,
  ManagedContentSummary,
  MediaAsset,
  MediaEmbed,
  MediaGallery,
  MediaGalleryItem,
  PortfolioCaseEntity,
  PortfolioPageData,
  Price,
  SchoolPageData,
  ServiceEntity,
  SeoMetadata,
  ServiceArea,
  StudioSettings,
  TransformationOfferEntity,
  UiCopy,
} from './types'
import {
  getSeedCollections,
  getSeedCourses,
  getSeedPortfolio,
  getSeedServices,
  getSeedTransformations,
} from './public-content-seed'
import { optimizedImageSrc } from './media-refs'
import { pageMedia } from './media-plan'

type Localized<T> = Record<Locale, T>

type PageSeed = Omit<HomePageData, 'id' | 'kind' | 'slug' | 'meta'>
type ListingPageSeed = Omit<ListingPageData, 'id' | 'kind' | 'slug' | 'meta'>
type SchoolPageSeed = Omit<SchoolPageData, 'id' | 'kind' | 'slug' | 'meta'>
type PortfolioPageSeed = Omit<PortfolioPageData, 'id' | 'kind' | 'slug' | 'meta'>
type ContactsPageSeed = Omit<ContactsPageData, 'id' | 'kind' | 'slug' | 'meta'>
type CourseSeed = Omit<CourseEntity, 'id' | 'media' | 'meta'>
type CollectionSeed = Omit<CollectionEntity, 'id' | 'meta'>
type PortfolioSeed = Omit<PortfolioCaseEntity, 'id' | 'meta'>
type TransformationSeed = Omit<TransformationOfferEntity, 'id' | 'meta'>

type BaseService = {
  slug: string
  area: ServiceArea
  eyebrow: Localized<string>
  title: Localized<string>
  summary: Localized<string>
  duration: Localized<string>
  leadTime: Localized<string>
  visualMood: Localized<string>
  heroLabel: Localized<string>
  price: Price
  formats: Localized<Array<{ id: string; label: string; detail: string }>>
  deliverables: Localized<string[]>
  process: Localized<string[]>
  notes: Localized<string[]>
  media?: Localized<ImageAsset>
  seo?: Localized<SeoMetadata>
}

function image(src: string, alt: string, caption?: string): ImageAsset {
  return { src: optimizedImageSrc(src), alt, caption }
}

function seoEntry({
  title,
  description,
  image,
  keywords,
  type,
}: {
  title: string
  description: string
  image: ImageAsset
  keywords?: string[]
  type?: 'website' | 'article'
}): SeoMetadata {
  return {
    title,
    description,
    image,
    keywords,
    type,
  }
}

const systemOwner = {
  id: 'owner-system',
  name: 'PURITY Editorial System',
  role: 'system',
} as const

const editorialOwner = {
  id: 'owner-editorial',
  name: 'PURITY Content Team',
  role: 'editor',
} as const

const defaultTimeline = {
  createdAt: '2026-04-20T09:00:00.000Z',
  updatedAt: '2026-04-20T14:00:00.000Z',
  publishedAt: '2026-04-20T15:00:00.000Z',
} as const

const studioContactEmail = 'voronina@purity-fashion.com'
const studioPhone = '+38 067 656 19 12'
const studioLocation =
  '03150 Kyiv, Predslavynska Street 44, office 1, floor 2 (French Quarter 2). Daily 11:00-20:00'
const studioMapHref =
  'https://www.google.com/maps/search/?api=1&query=Kyiv%2003150%2C%20Predslavynska%20Street%2044%2C%20office%201%2C%20floor%202%2C%20French%20Quarter%202'

function createMeta(
  kind: ManagedContentMeta['kind'],
  slug: string,
  options?: Partial<Pick<ManagedContentMeta, 'owner' | 'lastEditedBy' | 'hasUnpublishedChanges'>>,
): ManagedContentMeta {
  const owner = options?.owner ?? editorialOwner
  const lastEditedBy = options?.lastEditedBy ?? owner

  return {
    id: `${kind}:${slug}`,
    kind,
    slug,
    owner,
    lastEditedBy,
    createdAt: defaultTimeline.createdAt,
    updatedAt: defaultTimeline.updatedAt,
    lifecycle: {
      state: 'published',
      publishedAt: defaultTimeline.publishedAt,
    },
    currentRevision: {
      id: `${kind}:${slug}:rev-4`,
      version: 4,
      note: 'Ready for repository-backed publishing and preview.',
      createdAt: defaultTimeline.updatedAt,
      createdBy: lastEditedBy,
    },
    hasUnpublishedChanges: options?.hasUnpublishedChanges ?? false,
    previewKey: `${kind}-${slug}-preview`,
  }
}

function createImageAsset(id: string, title: string, src: string, alt = title): MediaAsset {
  const optimizedSrc = optimizedImageSrc(src)

  return {
    id,
    kind: 'image',
    title,
    alt,
    src: optimizedSrc,
    mimeType: optimizedSrc.endsWith('.webp') ? 'image/webp' : 'image/jpeg',
    width: 1600,
    height: 2200,
    focalPoint: { x: 0.5, y: 0.4 },
  }
}

function createGalleryItem(
  id: string,
  title: string,
  src: string,
  caption: string,
  purpose: MediaGalleryItem['purpose'] = 'gallery',
): MediaGalleryItem {
  return {
    id,
    asset: createImageAsset(id, title, src, caption),
    caption,
    purpose,
  }
}

function createGallery(items: MediaGalleryItem[]): MediaGallery {
  return {
    cover: items[0],
    items,
  }
}

const collectionMedia: Record<string, MediaGallery> = {
  'dress-for-victory': createGallery([
    createGalleryItem('collection-dfv-cover', 'Dress for Victory cover', '/images/purity_3.jpg', 'Editorial fitting', 'cover'),
    createGalleryItem('collection-dfv-2', 'Dress for Victory event silhouette', '/images/purity_5.jpg', 'Event silhouette'),
    createGalleryItem('collection-dfv-3', 'Dress for Victory gesture', '/images/purity_6.jpg', 'Victory gesture'),
  ]),
  'retreat-wear': createGallery([
    createGalleryItem('collection-retreat-cover', 'Retreat wear cover', '/images/purity_1.jpg', 'Morning layer', 'cover'),
    createGalleryItem('collection-retreat-2', 'Retreat wear robe', '/images/purity_2.jpg', 'Soft robe'),
    createGalleryItem('collection-retreat-3', 'Retreat wear jersey set', '/images/purity_4.jpg', 'Stretch jersey set'),
  ]),
  'travel-capsule': createGallery([
    createGalleryItem('collection-travel-cover', 'Travel capsule cover', '/images/purity_4.jpg', 'Five-piece edit', 'cover'),
    createGalleryItem('collection-travel-2', 'Travel capsule drape', '/images/purity_6.jpg', 'Airport drape'),
    createGalleryItem('collection-travel-3', 'Travel capsule reset', '/images/purity_2.jpg', 'Evening reset'),
  ]),
  'silky-touches': createGallery([
    createGalleryItem('collection-silky-cover', 'Silky Touches cover', '/images/purity_5.jpg', 'Cruise layer', 'cover'),
    createGalleryItem('collection-silky-2', 'Silky Touches yoga', '/images/purity_3.jpg', 'Yoga everywhere'),
    createGalleryItem('collection-silky-3', 'Silky Touches chiffon', '/images/purity_1.jpg', 'Chiffon column'),
  ]),
}

const portfolioMedia: Record<string, MediaGallery> = {
  'corporate-reframing': createGallery([
    createGalleryItem('portfolio-corporate-cover', 'Corporate reframing cover', '/images/purity_1.jpg', 'Before / after editorial frame', 'cover'),
    createGalleryItem('portfolio-corporate-2', 'Corporate reframing detail', '/images/purity_4.jpg', 'Refined team silhouette'),
  ]),
  'wardrobe-reset': createGallery([
    createGalleryItem('portfolio-reset-cover', 'Wardrobe reset cover', '/images/purity_2.jpg', 'Wardrobe reset overview', 'cover'),
    createGalleryItem('portfolio-reset-2', 'Wardrobe reset detail', '/images/purity_6.jpg', 'Capsule outcomes'),
  ]),
  'event-capsule': createGallery([
    createGalleryItem('portfolio-event-cover', 'Event capsule cover', '/images/purity_3.jpg', 'Event capsule frame', 'cover'),
    createGalleryItem('portfolio-event-2', 'Event capsule detail', '/images/purity_5.jpg', 'Evening construction'),
  ]),
}

const portfolioVideo: Record<string, MediaEmbed> = {
  'event-capsule': {
    id: 'portfolio-event-video',
    provider: 'vimeo',
    title: 'Event capsule motion study',
    url: 'https://vimeo.com/76979871',
    embedUrl: 'https://player.vimeo.com/video/76979871',
    poster: createImageAsset('portfolio-event-video-poster', 'Event capsule motion poster', '/images/purity_5.jpg'),
  },
}

const serviceMedia: Record<string, MediaGallery> = {
  'personal-lookbook': createGallery([
    createGalleryItem('service-lookbook-cover', 'Personal Lookbook cover', '/images/purity_2.jpg', 'Personal lookbook spread', 'cover'),
  ]),
  'wardrobe-review': createGallery([
    createGalleryItem('service-review-cover', 'Wardrobe review cover', '/images/purity_1.jpg', 'Wardrobe review frame', 'cover'),
  ]),
  'shopping-service': createGallery([
    createGalleryItem('service-shopping-cover', 'Shopping service cover', '/images/purity_4.jpg', 'Shopping route', 'cover'),
  ]),
  'atelier-service': createGallery([
    createGalleryItem('service-atelier-cover', 'Atelier service cover', '/images/purity_6.jpg', 'Dossier fittings', 'cover'),
  ]),
}

const courseMedia: Record<string, MediaGallery> = {
  'dress-for-victory-course': createGallery([
    createGalleryItem('course-victory-cover', 'Dress for Victory course cover', '/images/purity_3.jpg', 'Course cover', 'cover'),
  ]),
  'draping-moulage': createGallery([
    createGalleryItem('course-draping-cover', 'Draping course cover', '/images/purity_4.jpg', 'Draping cover', 'cover'),
  ]),
  'wardrobe-management': createGallery([
    createGalleryItem('course-wardrobe-cover', 'Wardrobe management cover', '/images/purity_2.jpg', 'Wardrobe system cover', 'cover'),
  ]),
}

const ui: Localized<UiCopy> = {
  uk: {
    brand: 'PURITY Fashion Studio',
    accessibility: {
      skipToContent: 'Перейти до основного вмісту',
      siteMenu: 'Меню сайту',
    },
    navigation: {
      studio: 'Студія',
      works: 'Роботи',
      contact: 'Контакт',
      menu: 'Меню',
      close: 'Закрити',
    },
    nav: {
      home: 'Головна',
      research: 'Дослідження',
      realisation: 'Втілення',
      transformation: 'Трансформація',
      school: 'Школа',
      collections: 'Колекції',
      portfolio: 'Портфоліо',
      contacts: 'Контакти',
    },
    actions: {
      bookNow: 'Забронювати',
      buyService: 'Надіслати запит',
      viewCollection: 'Дивитися колекцію',
      viewPortfolio: 'Переглянути кейси',
      requestConsultation: 'Запит на консультацію',
      chooseFormat: 'Обрати формат',
      continue: 'Продовжити',
      submit: 'Підтвердити',
      processing: 'Опрацьовується...',
      sending: 'Надсилання...',
      retry: 'Спробувати ще раз',
      sendInquiry: 'Надіслати запит',
      backHome: 'На головну',
      viewCase: 'Переглянути кейс',
    },
    labels: {
      allRightsReserved: 'Усі права захищено',
      methodology: 'Методологія',
      quote: 'Цитата',
      pricing: 'Вартість',
      timing: 'Тривалість',
      serviceStructure: 'Структура сервісу',
      serviceStructureTitle: 'Формати, результати та шлях від брифу до фінального втілення.',
      formats: 'Формати',
      deliverables: 'Результати',
      process: 'Процес',
      notes: 'Нотатки',
      visualMood: 'Візуальний настрій',
      atelierMood: 'Atelier mood',
      collection: 'Колекція',
      collections: 'Колекції',
      collectionStory: 'Історія',
      palette: 'Палітра',
      materials: 'Матеріали',
      silhouettes: 'Силуети',
      portfolio: 'Портфоліо',
      selectedCases: 'Вибрані кейси',
      challenge: 'Завдання',
      approach: 'Підхід',
      result: 'Результат',
      caseContext: 'Контекст',
      client: 'Клієнт',
      filmNote: 'Відео / editorial note',
      studioInquiry: 'Запит до студії',
      selectedOffer: 'Обрана пропозиція',
      requestStructure: 'Структура запиту',
      requestStructureTitle: 'Підтвердіть формат, бажану дату та контактний handoff.',
      sessionSetup: 'Налаштування сесії',
      clientContact: 'Контакт клієнта',
      homeStatsServices: 'Сервіси',
      homeStatsStudio: 'Студія',
      homeStatsLanguages: 'Мови',
      atelierFocus: 'Фокус atelier',
      schoolSpotlight: 'Фокус школи',
      collectionSpotlight: 'Фокус колекції',
      editorialFieldNote: 'PURITY / editorial field note',
      kyivEditorialDirection: 'Київський editorial-напрям',
      schoolNote: 'Нотатка школи',
      philosophy: 'Філософія PURITY',
      conciergeFollowUp: 'Concierge follow-up',
      privateInquiries: 'Приватні запити',
      corporateBriefs: 'Корпоративні брифи',
      socialFollowUp: 'Instagram / YouTube / Facebook / приватний concierge follow-up',
      privacyNotice: 'Надсилаючи форму, ви погоджуєтесь з обробкою контактних даних для відповіді студії.',
      privacyLink: 'Privacy notice',
      sending: 'Надсилання...',
      processing: 'Обробка...',
    },
    booking: {
      title: 'Запит PURITY',
      intro: 'Оберіть формат, залиште контакт і підтвердьте запит на наступний крок зі студією.',
      consultationTitle: 'Консультація PURITY',
      consultationSummary: 'Фокусований booking-flow для сервісів, курсів, колекцій і трансформаційних пропозицій.',
      dateLabel: 'Бажана дата',
      nameLabel: "Ім'я",
      emailLabel: 'Email',
      phoneLabel: 'Телефон',
      notesLabel: 'Коментар',
      nextStepTitle: 'Наступний крок',
      nextStepHint: 'Команда PURITY підтвердить формат, дату та бажаний наступний крок індивідуально після заявки.',
      flowLabel: 'Потік',
      flowTitle: 'Спочатку оберіть формат, далі підтвердьте дату та контакт.',
      flowText: 'Сторінка booking навмисно спокійніша за головну, щоб обрана пропозиція, контактні поля та наступний крок зі студією залишалися в центрі уваги.',
      leadRequestTag: 'Lead request',
      localeAware: 'Locale-aware',
      studioOrOnline: 'Студія або онлайн',
      onlineLabel: 'Онлайн',
      onlineDetail: 'Віддалена розмова та підготовчий memo',
      studioLabel: 'Студія',
      studioDetail: 'Зустріч у київській студії з тактильними референсами',
      consultationLabel: 'Консультація',
      prototypeNotice:
        'Якщо автоматичне надсилання недоступне, напишіть напряму на email або в Instagram.',
      pending: 'Формуємо запит і перевіряємо наступний крок.',
      success: 'Запит зафіксовано. Команда PURITY підтвердить деталі та наступний крок окремо.',
      failure: 'Не вдалося зафіксувати запит. Перевірте з’єднання або повторіть спробу.',
      duplicate: 'Цей запит уже зафіксовано. Щоб надіслати новий, змініть деталі форми.',
    },
    contact: {
      nameLabel: "Ім'я",
      emailLabel: 'Email',
      phoneLabel: 'Телефон',
      interestLabel: 'Цікавить напрям',
      messageLabel: 'Повідомлення',
      prototypeNotice:
        'Якщо автоматичне надсилання недоступне, напишіть напряму на email або в Instagram.',
      pending: 'Надсилаємо запит до черги студії.',
      success: 'Запит зафіксовано. Команда PURITY зв’яжеться з вами окремо.',
      failure: 'Не вдалося зафіксувати запит. Перевірте з’єднання та повторіть спробу.',
      duplicate: 'Схоже, цей запит уже надіслано. Оновіть поля, якщо хочете відправити новий.',
    },
    footerTagline: 'Відчути форму. Відчути тканину. Відчути майбутню себе.',
  },
  en: {
    brand: 'PURITY Fashion Studio',
    accessibility: {
      skipToContent: 'Skip to main content',
      siteMenu: 'Site menu',
    },
    navigation: {
      studio: 'Studio',
      works: 'Works',
      contact: 'Contact',
      menu: 'Menu',
      close: 'Close',
    },
    nav: {
      home: 'Home',
      research: 'Research',
      realisation: 'Realisation',
      transformation: 'Transformation',
      school: 'School',
      collections: 'Collections',
      portfolio: 'Portfolio',
      contacts: 'Contacts',
    },
    actions: {
      bookNow: 'Book now',
      buyService: 'Request service',
      viewCollection: 'View collection',
      viewPortfolio: 'View portfolio',
      requestConsultation: 'Request consultation',
      chooseFormat: 'Choose format',
      continue: 'Continue',
      submit: 'Confirm',
      processing: 'Processing...',
      sending: 'Sending...',
      retry: 'Retry',
      sendInquiry: 'Send inquiry',
      backHome: 'Back home',
      viewCase: 'View case',
    },
    labels: {
      allRightsReserved: 'All rights reserved',
      methodology: 'Methodology',
      quote: 'Quote',
      pricing: 'Pricing',
      timing: 'Timing',
      serviceStructure: 'Service structure',
      serviceStructureTitle: 'Formats, outcomes, and the path from brief to final handoff.',
      formats: 'Formats',
      deliverables: 'Deliverables',
      process: 'Process',
      notes: 'Notes',
      visualMood: 'Visual mood',
      atelierMood: 'Atelier mood',
      collection: 'Collection',
      collections: 'Collections',
      collectionStory: 'Story',
      palette: 'Palette',
      materials: 'Materials',
      silhouettes: 'Silhouettes',
      portfolio: 'Portfolio',
      selectedCases: 'Selected cases',
      challenge: 'Challenge',
      approach: 'Approach',
      result: 'Result',
      caseContext: 'Context',
      client: 'Client',
      filmNote: 'Film / editorial note',
      studioInquiry: 'Studio inquiry',
      selectedOffer: 'Selected offer',
      requestStructure: 'Request structure',
      requestStructureTitle: 'Confirm format, preferred date, and studio handoff.',
      sessionSetup: 'Session setup',
      clientContact: 'Client contact',
      homeStatsServices: 'Services',
      homeStatsStudio: 'Studio',
      homeStatsLanguages: 'Languages',
      atelierFocus: 'Atelier focus',
      schoolSpotlight: 'School spotlight',
      collectionSpotlight: 'Collection spotlight',
      editorialFieldNote: 'PURITY / Editorial field note',
      kyivEditorialDirection: 'Kyiv editorial direction',
      schoolNote: 'School note',
      philosophy: 'PURITY philosophy',
      conciergeFollowUp: 'Concierge follow-up',
      privateInquiries: 'Private inquiries',
      corporateBriefs: 'Corporate briefs',
      socialFollowUp: 'Instagram / YouTube / Facebook / private concierge follow-up',
      privacyNotice: 'By submitting the form, you agree to contact-data processing for the studio response.',
      privacyLink: 'Privacy notice',
      sending: 'Sending...',
      processing: 'Processing...',
    },
    booking: {
      title: 'PURITY Request',
      intro: 'Choose a format, leave your contact details, and confirm the studio handoff for the next step.',
      consultationTitle: 'PURITY consultation',
      consultationSummary: 'Focused booking flow for services, courses, collections, and transformation offers.',
      dateLabel: 'Preferred date',
      nameLabel: 'Name',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      notesLabel: 'Notes',
      nextStepTitle: 'Next step',
      nextStepHint: 'The PURITY team will confirm format, date, and preferred next step individually after the request.',
      flowLabel: 'Flow',
      flowTitle: 'Choose the format first, then confirm date and contact details.',
      flowText: 'The booking page stays calmer than the homepage so the selected offer, contact fields, and studio handoff remain visually dominant.',
      leadRequestTag: 'Lead request',
      localeAware: 'Locale-aware',
      studioOrOnline: 'Studio or online',
      onlineLabel: 'Online',
      onlineDetail: 'Remote conversation and preparation memo',
      studioLabel: 'Studio',
      studioDetail: 'Kyiv studio meeting with tactile references',
      consultationLabel: 'Consultation',
      prototypeNotice:
        'If automatic submission is unavailable, write directly by email or Instagram.',
      pending: 'Preparing your request and checking the next step.',
      success: 'Request recorded. The PURITY team will confirm the details and next step separately.',
      failure: 'The request could not be recorded. Check your connection and try again.',
      duplicate: 'This request was already recorded. Change the form details if you want to send a new one.',
    },
    contact: {
      nameLabel: 'Name',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      interestLabel: 'Area of interest',
      messageLabel: 'Message',
      prototypeNotice:
        'If automatic submission is unavailable, write directly by email or Instagram.',
      pending: 'Sending your inquiry to the studio queue.',
      success: 'Inquiry recorded. The PURITY team will follow up separately.',
      failure: 'The inquiry could not be recorded. Check your connection and try again.',
      duplicate: 'This inquiry looks already sent. Update the form if you want to send a new one.',
    },
    footerTagline: 'Feel the form. Feel the fabric. Feel your future self.',
  },
  ru: {
    brand: 'PURITY Fashion Studio',
    accessibility: {
      skipToContent: 'Перейти к основному содержанию',
      siteMenu: 'Меню сайта',
    },
    navigation: {
      studio: 'Студия',
      works: 'Работы',
      contact: 'Контакт',
      menu: 'Меню',
      close: 'Закрыть',
    },
    nav: {
      home: 'Главная',
      research: 'Исследование',
      realisation: 'Воплощение',
      transformation: 'Трансформация',
      school: 'Школа',
      collections: 'Коллекции',
      portfolio: 'Портфолио',
      contacts: 'Контакты',
    },
    actions: {
      bookNow: 'Забронировать',
      buyService: 'Отправить запрос',
      viewCollection: 'Смотреть коллекцию',
      viewPortfolio: 'Смотреть кейсы',
      requestConsultation: 'Запросить консультацию',
      chooseFormat: 'Выбрать формат',
      continue: 'Продолжить',
      submit: 'Подтвердить',
      processing: 'Обработка...',
      sending: 'Отправка...',
      retry: 'Повторить',
      sendInquiry: 'Отправить запрос',
      backHome: 'На главную',
      viewCase: 'Смотреть кейс',
    },
    labels: {
      allRightsReserved: 'Все права защищены',
      methodology: 'Методология',
      quote: 'Цитата',
      pricing: 'Стоимость',
      timing: 'Сроки',
      serviceStructure: 'Структура сервиса',
      serviceStructureTitle: 'Форматы, результаты и путь от брифа до финальной реализации.',
      formats: 'Форматы',
      deliverables: 'Результаты',
      process: 'Процесс',
      notes: 'Заметки',
      visualMood: 'Визуальное настроение',
      atelierMood: 'Atelier mood',
      collection: 'Коллекция',
      collections: 'Коллекции',
      collectionStory: 'История',
      palette: 'Палитра',
      materials: 'Материалы',
      silhouettes: 'Силуэты',
      portfolio: 'Портфолио',
      selectedCases: 'Избранные кейсы',
      challenge: 'Задача',
      approach: 'Подход',
      result: 'Результат',
      caseContext: 'Контекст',
      client: 'Клиент',
      filmNote: 'Видео / editorial note',
      studioInquiry: 'Запрос в студию',
      selectedOffer: 'Выбранное предложение',
      requestStructure: 'Структура запроса',
      requestStructureTitle: 'Подтвердите формат, желаемую дату и контакт со студией.',
      sessionSetup: 'Параметры сессии',
      clientContact: 'Контакт клиента',
      homeStatsServices: 'Сервисы',
      homeStatsStudio: 'Студия',
      homeStatsLanguages: 'Языки',
      atelierFocus: 'Фокус atelier',
      schoolSpotlight: 'Фокус школы',
      collectionSpotlight: 'Фокус коллекции',
      editorialFieldNote: 'PURITY / editorial field note',
      kyivEditorialDirection: 'Киевское editorial-направление',
      schoolNote: 'Заметка школы',
      philosophy: 'Философия PURITY',
      conciergeFollowUp: 'Concierge follow-up',
      privateInquiries: 'Частные запросы',
      corporateBriefs: 'Корпоративные брифы',
      socialFollowUp: 'Instagram / YouTube / Facebook / private concierge follow-up',
      privacyNotice: 'Отправляя форму, вы соглашаетесь на обработку контактных данных для ответа студии.',
      privacyLink: 'Privacy notice',
      sending: 'Отправка...',
      processing: 'Обработка...',
    },
    booking: {
      title: 'Запрос PURITY',
      intro: 'Выберите формат, оставьте контакты и подтвердите запрос на следующий шаг со студией.',
      consultationTitle: 'Консультация PURITY',
      consultationSummary: 'Сфокусированный booking-flow для сервисов, курсов, коллекций и трансформационных предложений.',
      dateLabel: 'Желаемая дата',
      nameLabel: 'Имя',
      emailLabel: 'Email',
      phoneLabel: 'Телефон',
      notesLabel: 'Комментарий',
      nextStepTitle: 'Следующий шаг',
      nextStepHint: 'Команда PURITY отдельно подтвердит формат, дату и желаемый следующий шаг после заявки.',
      flowLabel: 'Поток',
      flowTitle: 'Сначала выберите формат, затем подтвердите дату и контакт.',
      flowText: 'Страница booking намеренно спокойнее главной, чтобы выбранное предложение, контактные поля и следующий шаг со студией оставались в фокусе.',
      leadRequestTag: 'Lead request',
      localeAware: 'Locale-aware',
      studioOrOnline: 'Студия или онлайн',
      onlineLabel: 'Онлайн',
      onlineDetail: 'Удалённый разговор и подготовительный memo',
      studioLabel: 'Студия',
      studioDetail: 'Встреча в киевской студии с тактильными референсами',
      consultationLabel: 'Консультация',
      prototypeNotice:
        'Если автоматическая отправка недоступна, напишите напрямую на email или в Instagram.',
      pending: 'Подготавливаем запрос и проверяем следующий шаг.',
      success: 'Запрос зафиксирован. Команда PURITY отдельно подтвердит детали и следующий шаг.',
      failure: 'Не удалось зафиксировать запрос. Проверьте соединение и попробуйте ещё раз.',
      duplicate: 'Этот запрос уже зафиксирован. Измените детали формы, если хотите отправить новый.',
    },
    contact: {
      nameLabel: 'Имя',
      emailLabel: 'Email',
      phoneLabel: 'Телефон',
      interestLabel: 'Интересующий раздел',
      messageLabel: 'Сообщение',
      prototypeNotice:
        'Если автоматическая отправка недоступна, напишите напрямую на email или в Instagram.',
      pending: 'Отправляем запрос в очередь студии.',
      success: 'Запрос зафиксирован. Команда PURITY свяжется с вами отдельно.',
      failure: 'Не удалось зафиксировать запрос. Проверьте соединение и попробуйте ещё раз.',
      duplicate: 'Похоже, этот запрос уже отправлен. Обновите поля, если хотите отправить новый.',
    },
    footerTagline: 'Почувствовать форму. Почувствовать ткань. Почувствовать своё будущее.',
  },
}

const homePages: Localized<PageSeed> = {
  uk: {
    heroKicker: '@ДОСЛІДЖУЙ @УЯВЛЯЙ @СТВОРЮЙ',
    heroTitle: 'Студія, що моделює майбутній гардероб через відчуття форми, тканини та руху.',
    heroDescription:
      'PURITY створює персональні lookbook-напрями, couture-рішення й трансформаційні fashion-досвіди для приватних та корпоративних клієнтів в Україні й міжнародно.',
    heroPrimaryCta: 'Надіслати запит',
    heroSecondaryCta: 'Дивитися колекції',
    philosophy: 'Відчуй форму. Відчуй тканину. Відчуй своє майбутнє.',
    methodologyTitle: 'Як народжується гардероб',
    methodologySteps: [
      'Дослідження читає силует, колір та гардероб як особисту архітектуру.',
      'Втілення переводить інсайти в shopping-супровід, dossier та atelier-виробництво.',
      'Трансформація відкриває курси, фотомедитації й ритуали перевтілення.',
    ],
    privateClientsTitle: 'Для приватних клієнтів',
    privateClientsText: 'Гардеробні стратегії, капсули, персональні lookbook-и та couture-рішення.',
    corporateClientsTitle: 'Для брендів та команд',
    corporateClientsText: 'Стилізація зйомок, подій, командних гардеробів та делікатних luxury-колаборацій.',
    transformationNote: 'Колекції для нової ролі.',
    seo: seoEntry({
      title: 'PURITY Fashion Studio | Дослідження, atelier і колекції',
      description:
        'Трилінгвальна fashion-студія з персональними lookbook-напрямами, atelier-сервісами, колекціями та портфоліо PURITY.',
      image: image(pageMedia.home.src, pageMedia.home.alt, 'Київський editorial-напрям'),
      keywords: ['PURITY Fashion Studio', 'персональний стиліст', 'atelier Київ', 'fashion studio Ukraine'],
    }),
  },
  en: {
    heroKicker: '@RESEARCH @IMAGINE @CREATE',
    heroTitle: 'A studio shaping the future wardrobe through form, fabric, and movement.',
    heroDescription:
      'PURITY designs personal lookbook directions, couture services, and transformational fashion experiences for private and corporate clients in Ukraine and beyond.',
    heroPrimaryCta: 'Request service',
    heroSecondaryCta: 'View collections',
    philosophy: 'Feel the form. Feel the fabric. Feel your future.',
    methodologyTitle: 'How a wardrobe takes shape',
    methodologySteps: [
      'Research reads silhouette, color, and wardrobe as a personal architecture.',
      'Realisation turns insight into shopping support, dossier sessions, and atelier production.',
      'Transformation opens courses, photo meditations, and ritual-like style experiences.',
    ],
    privateClientsTitle: 'For private clients',
    privateClientsText: 'Wardrobe strategy, capsules, personal lookbooks, and couture interventions.',
    corporateClientsTitle: 'For brands and teams',
    corporateClientsText: 'Editorial styling for campaigns, events, team wardrobes, and refined collaborations.',
    transformationNote: 'Collections for a new role.',
    seo: seoEntry({
      title: 'PURITY Fashion Studio | Research, atelier, collections, portfolio',
      description:
        'Premium multilingual fashion studio with personal styling, atelier services, collections, portfolio cases, and transformational editorial experiences.',
      image: image(pageMedia.home.src, pageMedia.home.alt, 'Kyiv editorial direction'),
      keywords: ['PURITY Fashion Studio', 'personal stylist', 'atelier Kyiv', 'fashion studio Ukraine'],
    }),
  },
  ru: {
    heroKicker: '@ИССЛЕДУЙ @ПРЕДСТАВЛЯЙ @СОЗДАВАЙ',
    heroTitle: 'Студия, которая формирует будущий гардероб через ощущение формы, ткани и движения.',
    heroDescription:
      'PURITY создаёт персональные lookbook-направления, couture-сервисы и трансформационные fashion-опыты для частных и корпоративных клиентов в Украине и за её пределами.',
    heroPrimaryCta: 'Отправить запрос',
    heroSecondaryCta: 'Смотреть коллекции',
    philosophy: 'Ощутить форму. Ощутить ткань. Ощутить своё будущее.',
    methodologyTitle: 'Как рождается гардероб',
    methodologySteps: [
      'Исследование считывает силуэт, цвет и гардероб как личную архитектуру.',
      'Воплощение переводит инсайт в shopping-сопровождение, dossier-сессию и atelier-пошив.',
      'Трансформация открывает курсы, фотомедитации и сценарии перевоплощения.',
    ],
    privateClientsTitle: 'Для частных клиентов',
    privateClientsText: 'Гардеробные стратегии, капсулы, персональные lookbook-и и couture-решения.',
    corporateClientsTitle: 'Для брендов и команд',
    corporateClientsText: 'Стилизация съёмок, мероприятий, командных гардеробов и деликатных luxury-коллабораций.',
    transformationNote: 'Коллекции для новой роли.',
    seo: seoEntry({
      title: 'PURITY Fashion Studio | Исследование, atelier и коллекции',
      description:
        'Трилингвальная fashion-студия с персональными lookbook-направлениями, atelier-сервисами, коллекциями и портфолио PURITY.',
      image: image(pageMedia.home.src, pageMedia.home.alt, 'Киевское editorial-направление'),
      keywords: ['PURITY Fashion Studio', 'персональный стилист', 'atelier Киев', 'fashion studio Ukraine'],
    }),
  },
}

const listingPages: Record<
  'research' | 'realisation' | 'transformation' | 'collections',
  Localized<ListingPageSeed>
> = {
  research: {
    uk: {
      title: 'Дослідження',
      intro: 'Сервіси, що починаються з точного читання вашої форми, кольору та гардеробної системи.',
      pullQuote: 'Ми досліджуємо не тренд, а майбутню версію вас.',
      seo: seoEntry({
        title: 'PURITY | Дослідження',
        description: 'Персональний lookbook, color palette, cut strategy та wardrobe review від студії PURITY.',
        image: image(pageMedia.research.src, pageMedia.research.alt, 'Research / форма / силует'),
      }),
    },
    en: {
      title: 'Research',
      intro: 'Services that begin with an exact reading of your form, color, and wardrobe system.',
      pullQuote: 'We do not study trends first. We study your future version.',
      seo: seoEntry({
        title: 'PURITY | Research',
        description: 'Personal lookbook, color palette, cut strategy, and wardrobe review services by PURITY.',
        image: image(pageMedia.research.src, pageMedia.research.alt, 'Research / Form / Silhouette'),
      }),
    },
    ru: {
      title: 'Исследование',
      intro: 'Сервисы, которые начинаются с точного чтения вашей формы, цвета и гардеробной системы.',
      pullQuote: 'Мы исследуем не тренд, а будущую версию вас.',
      seo: seoEntry({
        title: 'PURITY | Исследование',
        description: 'Personal lookbook, color palette, cut strategy и wardrobe review от студии PURITY.',
        image: image(pageMedia.research.src, pageMedia.research.alt, 'Research / форма / силуэт'),
      }),
    },
  },
  realisation: {
    uk: {
      title: 'Втілення',
      intro: 'Shopping-плани, супровід та atelier-процеси, які переводять концепт у носибельну реальність.',
      pullQuote: 'Реалізація починається там, де образ стає рішенням.',
      seo: seoEntry({
        title: 'PURITY | Втілення',
        description: 'Shopping-супровід і atelier-сервіси PURITY для індивідуального гардероба та couture-пошиву.',
        image: image(pageMedia.realisation.src, pageMedia.realisation.alt, 'Atelier / fitting / couture'),
      }),
    },
    en: {
      title: 'Realisation',
      intro: 'Shopping plans, accompaniment, and atelier processes that turn concept into wearable reality.',
      pullQuote: 'Realisation begins where an image becomes a decision.',
      seo: seoEntry({
        title: 'PURITY | Realisation',
        description: 'Shopping accompaniment and atelier services by PURITY for wardrobe implementation and couture production.',
        image: image(pageMedia.realisation.src, pageMedia.realisation.alt, 'Atelier / fitting / couture'),
      }),
    },
    ru: {
      title: 'Воплощение',
      intro: 'Shopping-планы, сопровождение и atelier-процессы, которые переводят концепт в носимую реальность.',
      pullQuote: 'Воплощение начинается там, где образ становится решением.',
      seo: seoEntry({
        title: 'PURITY | Воплощение',
        description: 'Shopping-сопровождение и atelier-сервисы PURITY для гардеробной реализации и couture-пошива.',
        image: image(pageMedia.realisation.src, pageMedia.realisation.alt, 'Atelier / fitting / couture'),
      }),
    },
  },
  transformation: {
    uk: {
      title: 'Трансформація',
      intro: 'Трансформаційні досвіди, де одяг, архетипи й ритуал працюють разом.',
      pullQuote: 'Трансформація не змінює костюм. Вона змінює оптику, з якої ви дивитеся на себе.',
      seo: seoEntry({
        title: 'PURITY | Трансформація',
        description: 'Курси, fashion-retreat формати та фотомедитації як трансформаційний блок PURITY.',
        image: image(pageMedia.transformation.src, pageMedia.transformation.alt, 'Transformation / ritual / styling'),
      }),
    },
    en: {
      title: 'Transformation',
      intro: 'Transformational experiences where garments, archetypes, and ritual operate together.',
      pullQuote: 'Transformation changes the lens before it changes the look.',
      seo: seoEntry({
        title: 'PURITY | Transformation',
        description: 'Courses, fashion retreat formats, and photo meditations inside the transformational chapter of PURITY.',
        image: image(pageMedia.transformation.src, pageMedia.transformation.alt, 'Transformation / ritual / styling'),
      }),
    },
    ru: {
      title: 'Трансформация',
      intro: 'Трансформационные опыты, где одежда, архетипы и ритуал работают вместе.',
      pullQuote: 'Трансформация меняет не только костюм, но и оптику, через которую вы смотрите на себя.',
      seo: seoEntry({
        title: 'PURITY | Трансформация',
        description: 'Курсы, fashion-retreat форматы и фотомедитации как трансформационный блок PURITY.',
        image: image(pageMedia.transformation.src, pageMedia.transformation.alt, 'Transformation / ritual / styling'),
      }),
    },
  },
  collections: {
    uk: {
      title: 'Колекції',
      intro: 'Капсульні історії для зйомок, подій, ретритів, подорожей і м’якого щоденного ритуалу.',
      pullQuote: 'Кожна колекція працює як сценарій руху, а не просто як асортимент.',
      seo: seoEntry({
        title: 'PURITY | Колекції',
        description: 'Колекції PURITY для подій, ретритів, travel-capsule сценаріїв і м’якого glamour.',
        image: image(pageMedia.collections.src, pageMedia.collections.alt, 'Collections / editorial pieces'),
      }),
    },
    en: {
      title: 'Collections',
      intro: 'Capsule stories for shoots, events, retreats, travel, and soft everyday ritual.',
      pullQuote: 'Each collection is built as a movement script, not a product list.',
      seo: seoEntry({
        title: 'PURITY | Collections',
        description: 'PURITY collections for events, retreats, travel capsules, and soft glamour wardrobes.',
        image: image(pageMedia.collections.src, pageMedia.collections.alt, 'Collections / Editorial pieces'),
      }),
    },
    ru: {
      title: 'Коллекции',
      intro: 'Капсульные истории для съёмок, событий, ретритов, путешествий и мягкого повседневного ритуала.',
      pullQuote: 'Каждая коллекция работает как сценарий движения, а не просто как ассортимент.',
      seo: seoEntry({
        title: 'PURITY | Коллекции',
        description: 'Коллекции PURITY для событий, ретритов, travel-capsule сценариев и мягкого glamour.',
        image: image(pageMedia.collections.src, pageMedia.collections.alt, 'Collections / editorial pieces'),
      }),
    },
  },
}

const schoolPages: Localized<SchoolPageSeed> = {
  uk: {
    title: 'Школа PURITY',
    intro: 'Освітні формати для тих, хто хоче опанувати draping, wardrobe management та дизайнерське мислення.',
    pullQuote: 'Школа мислить одягом як пластикою, а не схемою.',
    note: 'Практика побудована навколо форми, тканини, макетування та роботи з гардеробом у реальному клієнтському контексті.',
    seo: seoEntry({
      title: 'PURITY | Школа',
      description: 'Освітні курси PURITY зі draping, wardrobe management і дизайнерського мислення.',
      image: image(pageMedia.school.src, pageMedia.school.alt, 'School / study / transformation'),
    }),
  },
  en: {
    title: 'PURITY School',
    intro: 'Educational formats for those who want to study draping, wardrobe management, and designer thinking.',
    pullQuote: 'The school treats garments as plastic movement, not flat pattern logic.',
    note: 'The practice is built around form, fabric, draping, and wardrobe work in a real client context.',
    seo: seoEntry({
      title: 'PURITY | School',
      description: 'Educational courses by PURITY covering draping, wardrobe management, and designer thinking.',
      image: image(pageMedia.school.src, pageMedia.school.alt, 'School / Study / Transformation'),
    }),
  },
  ru: {
    title: 'Школа PURITY',
    intro: 'Образовательные форматы для тех, кто хочет освоить draping, wardrobe management и дизайнерское мышление.',
    pullQuote: 'Школа рассматривает одежду как пластику движения, а не как плоскую схему.',
    note: 'Практика построена вокруг формы, ткани, макетирования и работы с гардеробом в реальном клиентском контексте.',
    seo: seoEntry({
      title: 'PURITY | Школа',
      description: 'Образовательные курсы PURITY по draping, wardrobe management и дизайнерскому мышлению.',
      image: image(pageMedia.school.src, pageMedia.school.alt, 'School / study / transformation'),
    }),
  },
}

const portfolioPages: Localized<PortfolioPageSeed> = {
  uk: {
    title: 'Портфоліо',
    intro: 'Lookbook-и, до/після, артдирекшн і стилістичні трансформації, зафіксовані як кейси.',
    pullQuote: 'Кейс повинен показувати не лише красивий кадр, а і точку зміни.',
    highlight: 'Портфоліо збирає стилістичні рішення, atelier-процес і фінальний образ в один доказовий кейс.',
    seo: seoEntry({
      title: 'PURITY | Портфоліо',
      description: 'Детальні fashion-кейси PURITY: before/after, corporate editorial, atelier і couture-проєкти.',
      image: image(pageMedia.portfolio.src, pageMedia.portfolio.alt, 'Portfolio / selected cases'),
    }),
  },
  en: {
    title: 'Portfolio',
    intro: 'Lookbooks, before/after edits, art direction, and stylistic transformations documented as cases.',
    pullQuote: 'A case should reveal not only the image, but the pivot point that made it inevitable.',
    highlight: 'The portfolio connects styling decisions, atelier process, and the final image into one case story.',
    seo: seoEntry({
      title: 'PURITY | Portfolio',
      description: 'Detailed PURITY fashion cases spanning before/after work, corporate editorials, atelier, and couture outcomes.',
      image: image(pageMedia.portfolio.src, pageMedia.portfolio.alt, 'Portfolio / Selected cases'),
    }),
  },
  ru: {
    title: 'Портфолио',
    intro: 'Lookbook-и, до/после, артдирекшн и стилистические трансформации, оформленные как кейсы.',
    pullQuote: 'Кейс должен показывать не только красивый кадр, но и точку изменения.',
    highlight: 'Портфолио соединяет стилистическое решение, atelier-процесс и финальный образ в один кейс.',
    seo: seoEntry({
      title: 'PURITY | Портфолио',
      description: 'Детальные fashion-кейсы PURITY: before/after, corporate editorial, atelier и couture-проекты.',
      image: image(pageMedia.portfolio.src, pageMedia.portfolio.alt, 'Portfolio / selected cases'),
    }),
  },
}

const contactsPages: Localized<ContactsPageSeed> = {
  uk: {
    title: 'Контакти',
    intro: 'Напишіть у київську студію PURITY щодо персонального гардероба, atelier-замовлення, корпоративного іміджу або міжнародного онлайн-формату.',
    inquiryTitle: 'Надіслати запит',
    corporateTitle: 'Корпоративні клієнти',
    corporateText: 'PURITY працює з командами, брендами, подіями та editorial-зйомками: від дрескоду до повного візуального сценарію.',
    scheduleNote: 'Студія працює щодня 11:00-20:00; live-сесії та виїзний сервіс погоджуються після запиту.',
    addressText: 'Київ 03150, вул. Предславинська 44, офіс 1, поверх 2 (ЖК Французький квартал 2). Щодня 11:00-20:00',
    mapLabel: 'Київська студія на Предславинській',
    seo: seoEntry({
      title: 'PURITY | Контакти',
      description:
        'Контакти PURITY Fashion Studio: Київ, Предславинська 44, телефон +38 067 656 19 12, email voronina@purity-fashion.com.',
      image: image(pageMedia.contactsIntro.src, pageMedia.contactsIntro.alt, 'Kyiv studio on Predslavynska Street'),
    }),
  },
  en: {
    title: 'Contacts',
    intro: 'Contact the Kyiv PURITY studio for personal wardrobes, atelier commissions, corporate image work, or international online service.',
    inquiryTitle: 'Send inquiry',
    corporateTitle: 'Corporate clients',
    corporateText: 'PURITY works with teams, brands, events, and editorial productions: from dress-code direction to a complete visual scenario.',
    scheduleNote: 'The studio is open daily 11:00-20:00; live sessions and on-site service are confirmed after inquiry.',
    addressText: '03150 Kyiv, Predslavynska Street 44, office 1, floor 2 (French Quarter 2). Daily 11:00-20:00',
    mapLabel: 'Kyiv studio on Predslavynska Street',
    seo: seoEntry({
      title: 'PURITY | Contacts',
      description:
        'Contact PURITY Fashion Studio: Kyiv, Predslavynska Street 44, phone +38 067 656 19 12, email voronina@purity-fashion.com.',
      image: image(pageMedia.contactsIntro.src, pageMedia.contactsIntro.alt, 'Kyiv studio on Predslavynska Street'),
    }),
  },
  ru: {
    title: 'Контакты',
    intro: 'Напишите в киевскую студию PURITY по поводу персонального гардероба, atelier-заказа, корпоративного имиджа или международного онлайн-формата.',
    inquiryTitle: 'Отправить запрос',
    corporateTitle: 'Корпоративные клиенты',
    corporateText: 'PURITY работает с командами, брендами, событиями и editorial-съёмками: от дресс-кода до полного визуального сценария.',
    scheduleNote: 'Студия работает каждый день 11:00-20:00; live-сессии и выездной сервис согласуются после запроса.',
    addressText: 'Киев 03150, ул. Предславинская 44, офис 1, этаж 2 (ЖК Французский квартал 2). Каждый день 11:00-20:00',
    mapLabel: 'Киевская студия на Предславинской',
    seo: seoEntry({
      title: 'PURITY | Контакты',
      description:
        'Контакты PURITY Fashion Studio: Киев, Предславинская 44, телефон +38 067 656 19 12, email voronina@purity-fashion.com.',
      image: image(pageMedia.contactsIntro.src, pageMedia.contactsIntro.alt, 'Kyiv studio on Predslavynska Street'),
    }),
  },
}

const services: BaseService[] = [
  {
    slug: 'personal-lookbook',
    area: 'research',
    eyebrow: {
      uk: 'Color Palette + Cut Strategy',
      en: 'Color Palette + Cut Strategy',
      ru: 'Color Palette + Cut Strategy',
    },
    title: {
      uk: 'Personal Lookbook',
      en: 'Personal Lookbook',
      ru: 'Personal Lookbook',
    },
    summary: {
      uk: 'Персональна карта силуету та кольору, яка збирає вас в одну чітку гардеробну систему.',
      en: 'A personal map of silhouette and color that assembles you into a single wardrobe system.',
      ru: 'Персональная карта силуэта и цвета, которая собирает вас в одну ясную гардеробную систему.',
    },
    duration: {
      uk: '2 сесії + PDF lookbook',
      en: '2 sessions + PDF lookbook',
      ru: '2 сессии + PDF lookbook',
    },
    leadTime: {
      uk: '7-10 днів',
      en: '7-10 days',
      ru: '7-10 дней',
    },
    visualMood: {
      uk: 'Тонкі модулі кольору, лінійний силует і сторінки lookbook у ритмі editorial-каталогу.',
      en: 'Thin color modules, linear silhouettes, and lookbook pages paced like an editorial catalogue.',
      ru: 'Тонкие цветовые модули, линейный силуэт и страницы lookbook в ритме editorial-каталога.',
    },
    heroLabel: {
      uk: 'Початок нової гардеробної архітектури',
      en: 'The start of a new wardrobe architecture',
      ru: 'Начало новой гардеробной архитектуры',
    },
    price: {
      eur: '€290',
      uah: '₴12 500',
    },
    formats: {
      uk: [
        { id: 'online', label: 'Онлайн', detail: 'Zoom + цифровий lookbook' },
        { id: 'studio', label: 'Студія', detail: 'Київська сесія з матеріальними референсами' },
      ],
      en: [
        { id: 'online', label: 'Online', detail: 'Zoom session + digital lookbook' },
        { id: 'studio', label: 'Studio', detail: 'Kyiv session with tactile references' },
      ],
      ru: [
        { id: 'online', label: 'Онлайн', detail: 'Zoom + цифровой lookbook' },
        { id: 'studio', label: 'Студия', detail: 'Киевская сессия с материальными референсами' },
      ],
    },
    deliverables: {
      uk: ['Індивідуальна палітра', 'Стратегія крою', 'Мінікапсула покупок'],
      en: ['Personal palette', 'Cut strategy', 'Mini purchase capsule'],
      ru: ['Индивидуальная палитра', 'Стратегия кроя', 'Мини-капсула покупок'],
    },
    process: {
      uk: ['Діагностика стилю та контексту життя', 'Колірний та силуетний аналіз', 'Підготовка PDF lookbook'],
      en: ['Style and lifestyle diagnostic', 'Color and silhouette analysis', 'PDF lookbook preparation'],
      ru: ['Диагностика стиля и контекста жизни', 'Цветовой и силуэтный анализ', 'Подготовка PDF lookbook'],
    },
    notes: {
      uk: ['Підходить як перший крок перед shopping-service або atelier', 'Формат студії доступний у Києві'],
      en: ['Ideal as the first step before shopping service or atelier work', 'Studio format is available in Kyiv'],
      ru: ['Идеально как первый шаг перед shopping-service или atelier', 'Студийный формат доступен в Киеве'],
    },
  },
  {
    slug: 'wardrobe-review',
    area: 'research',
    eyebrow: {
      uk: 'Capsule Revision',
      en: 'Capsule Revision',
      ru: 'Capsule Revision',
    },
    title: {
      uk: 'Wardrobe Review',
      en: 'Wardrobe Review',
      ru: 'Wardrobe Review',
    },
    summary: {
      uk: 'Ревізія гардероба з чітким рішенням: що лишити, що перешити, що докупити, а що відпустити.',
      en: 'A wardrobe revision with precise decisions on what to keep, tailor, buy, and release.',
      ru: 'Ревизия гардероба с точным решением: что оставить, что перешить, что докупить, а что отпустить.',
    },
    duration: {
      uk: '3-4 години',
      en: '3-4 hours',
      ru: '3-4 часа',
    },
    leadTime: {
      uk: '48 годин до звіту',
      en: '48 hours to report',
      ru: '48 часов до отчёта',
    },
    visualMood: {
      uk: 'Таксономія шафи, картки-стани й чиста капсульна карта після редагування.',
      en: 'Closet taxonomy, state cards, and a clean capsule map after editing.',
      ru: 'Таксономия шкафа, карточки-состояния и чистая капсульная карта после редактирования.',
    },
    heroLabel: {
      uk: 'Редактура існуючого гардероба',
      en: 'An edit of the wardrobe you already own',
      ru: 'Редактура существующего гардероба',
    },
    price: {
      eur: '€240',
      uah: '₴10 300',
    },
    formats: {
      uk: [
        { id: 'home', label: 'На місці', detail: 'Виїзд стиліста до клієнта' },
        { id: 'hybrid', label: 'Гібрид', detail: 'Фотоархів + follow-up call' },
      ],
      en: [
        { id: 'home', label: 'On-site', detail: 'Stylist visit to the client' },
        { id: 'hybrid', label: 'Hybrid', detail: 'Photo archive + follow-up call' },
      ],
      ru: [
        { id: 'home', label: 'На месте', detail: 'Выезд стилиста к клиенту' },
        { id: 'hybrid', label: 'Гибрид', detail: 'Фотоархив + follow-up call' },
      ],
    },
    deliverables: {
      uk: ['Список keep / alter / buy', 'Капсульні прогалини', 'Пріоритети наступної покупки'],
      en: ['Keep / alter / buy list', 'Capsule gaps', 'Priority purchase direction'],
      ru: ['Список keep / alter / buy', 'Капсульные пробелы', 'Приоритет следующей покупки'],
    },
    process: {
      uk: ['Сканування гардеробу', 'Сортування по ролях і силуетах', 'Післясесійний memo-звіт'],
      en: ['Wardrobe scan', 'Sorting by roles and silhouettes', 'Post-session memo report'],
      ru: ['Сканирование гардероба', 'Сортировка по ролям и силуэтам', 'Постсессионный memo-отчёт'],
    },
    notes: {
      uk: ['Добре поєднується з Personal Lookbook', 'Можна додати shopping-plan як другий етап'],
      en: ['Pairs well with the Personal Lookbook', 'A shopping plan can be added as the second stage'],
      ru: ['Хорошо сочетается с Personal Lookbook', 'Shopping-plan можно добавить вторым этапом'],
    },
  },
  {
    slug: 'shopping-service',
    area: 'realisation',
    eyebrow: {
      uk: 'Remote plan or live accompaniment',
      en: 'Remote plan or live accompaniment',
      ru: 'Remote plan or live accompaniment',
    },
    title: {
      uk: 'Shopping Service',
      en: 'Shopping Service',
      ru: 'Shopping Service',
    },
    summary: {
      uk: 'Точний shopping-маршрут: від онлайн-підбору до живого супроводу в магазинах.',
      en: 'A precise shopping route from remote edit boards to in-store accompaniment.',
      ru: 'Точный shopping-маршрут: от онлайн-подбора до живого сопровождения в магазинах.',
    },
    duration: {
      uk: '1 день або 1 онлайн-план',
      en: '1 day or 1 remote plan',
      ru: '1 день или 1 онлайн-план',
    },
    leadTime: {
      uk: '3-5 днів підготовки',
      en: '3-5 days of preparation',
      ru: '3-5 дней подготовки',
    },
    visualMood: {
      uk: 'Динамічні маршрути, шопінг-листи й тактильні матеріальні маркери.',
      en: 'Dynamic routes, shopping lists, and tactile material markers.',
      ru: 'Динамичные маршруты, shopping-листы и тактильные материальные маркеры.',
    },
    heroLabel: {
      uk: 'Втілення lookbook-а в реальні покупки',
      en: 'Turning the lookbook into real purchases',
      ru: 'Воплощение lookbook-а в реальные покупки',
    },
    price: {
      eur: '€320',
      uah: '₴13 800',
    },
    formats: {
      uk: [
        { id: 'remote', label: 'Онлайн-план', detail: 'Посилання, заміни, фінальний кошик' },
        { id: 'live', label: 'Live-супровід', detail: 'Супровід у магазинах протягом дня' },
      ],
      en: [
        { id: 'remote', label: 'Online plan', detail: 'Links, substitutions, and final selection' },
        { id: 'live', label: 'Live accompaniment', detail: 'In-store accompaniment during the day' },
      ],
      ru: [
        { id: 'remote', label: 'Онлайн-план', detail: 'Ссылки, замены и финальная подборка' },
        { id: 'live', label: 'Live-сопровождение', detail: 'Сопровождение в магазинах в течение дня' },
      ],
    },
    deliverables: {
      uk: ['Маршрут брендів', 'Шопінг-лист з пріоритетами', 'Фоллоуап після сесії'],
      en: ['Brand route', 'Priority shopping list', 'Post-session follow-up'],
      ru: ['Маршрут брендов', 'Шопинг-лист с приоритетами', 'Фоллоуап после сессии'],
    },
    process: {
      uk: ['Погодження бюджету', 'Підбір маршрутів і речей', 'Фіналізація покупки'],
      en: ['Budget alignment', 'Route and item curation', 'Purchase finalisation'],
      ru: ['Согласование бюджета', 'Подбор маршрутов и вещей', 'Финализация покупки'],
    },
    notes: {
      uk: ['Бюджет на речі не входить у сервіс', 'Може працювати як другий етап після Wardrobe Review'],
      en: ['Garment budget is separate from the service', 'Works well as the second phase after Wardrobe Review'],
      ru: ['Бюджет на вещи не входит в сервис', 'Хорошо работает как второй этап после Wardrobe Review'],
    },
  },
  {
    slug: 'atelier-service',
    area: 'realisation',
    eyebrow: {
      uk: 'Dossier / couture production',
      en: 'Dossier / couture production',
      ru: 'Dossier / couture production',
    },
    title: {
      uk: 'Atelier Service',
      en: 'Atelier Service',
      ru: 'Atelier Service',
    },
    summary: {
      uk: 'Dossier як особистий манекен, примірки та couture-пошив під ваш рух, тканину й сценарій життя.',
      en: 'Dossier as a personal mannequin, fittings, and couture production calibrated to your movement, fabric, and lifestyle scenario.',
      ru: 'Dossier как личный манекен, примерки и couture-пошив под ваше движение, ткань и сценарий жизни.',
    },
    duration: {
      uk: 'від 2 тижнів',
      en: 'from 2 weeks',
      ru: 'от 2 недель',
    },
    leadTime: {
      uk: '2-6 тижнів',
      en: '2-6 weeks',
      ru: '2-6 недель',
    },
    visualMood: {
      uk: 'Матеріальні зразки, couture-архів, спокійна розкіш і тонкий ритм примірок.',
      en: 'Material swatches, couture archives, quiet luxury, and a measured fitting rhythm.',
      ru: 'Материальные образцы, couture-архив, тихая роскошь и тонкий ритм примерок.',
    },
    heroLabel: {
      uk: 'Пошив, який починається з dossier',
      en: 'Tailoring that begins with dossier',
      ru: 'Пошив, который начинается с dossier',
    },
    price: {
      eur: 'від €500',
      uah: 'від ₴21 500',
    },
    formats: {
      uk: [
        { id: 'dossier', label: 'Dossier session', detail: 'Персональний манекен як база крою' },
        { id: 'couture', label: 'Couture production', detail: 'Сукні, жакети, special pieces' },
      ],
      en: [
        { id: 'dossier', label: 'Dossier session', detail: 'Personal mannequin as the cut foundation' },
        { id: 'couture', label: 'Couture production', detail: 'Dresses, jackets, special pieces' },
      ],
      ru: [
        { id: 'dossier', label: 'Dossier session', detail: 'Личный манекен как база кроя' },
        { id: 'couture', label: 'Couture production', detail: 'Платья, жакеты, special pieces' },
      ],
    },
    deliverables: {
      uk: ['Dossier', 'Карта матеріалів', 'План примірок і фінальна видача'],
      en: ['Dossier', 'Material map', 'Fitting plan and final handoff'],
      ru: ['Dossier', 'Карта материалов', 'План примерок и финальная выдача'],
    },
    process: {
      uk: ['Знайомство та бриф', 'Створення dossier', 'Примірки та фінальна корекція'],
      en: ['Introduction and brief', 'Dossier creation', 'Fittings and final correction'],
      ru: ['Знакомство и бриф', 'Создание dossier', 'Примерки и финальная коррекция'],
    },
    notes: {
      uk: ['Приклади вартості: сукня €500-700, жакет €600-800, atelier rate €25/год', 'Точний кошторис формується після dossier'],
      en: ['Indicative pricing: dress €500-700, jacket €600-800, atelier rate €25/hour', 'The final estimate is confirmed after dossier'],
      ru: ['Примеры стоимости: платье €500-700, жакет €600-800, atelier rate €25/час', 'Финальная смета формируется после dossier'],
    },
  },
]

const courses: Localized<CourseSeed[]> = {
  uk: [
    {
      kind: 'course',
      slug: 'dress-for-victory-course',
      title: 'Create Your Dress of Victory',
      summary: 'Курс зі створення власної сукні-перемоги разом із дизайнеркою.',
      price: { eur: '€480', uah: '₴20 700' },
      sessions: '6 сесій',
      format: 'Онлайн / студія',
      details: ['Концепт сукні', 'Матеріали та draping', 'Фінальний atelier-виріб'],
    },
    {
      kind: 'course',
      slug: 'draping-moulage',
      title: 'Драпірування / муляжний метод',
      summary: 'Практика об’ємного моделювання для дизайнерів і стилістів.',
      price: { eur: '€540', uah: '₴23 300' },
      sessions: '8 сесій',
      format: 'Студія',
      details: ['Манекен та об’єм', 'Побудова форми тканиною', 'Фінальна мінікапсула'],
    },
    {
      kind: 'course',
      slug: 'wardrobe-management',
      title: 'Wardrobe Management',
      summary: 'Система керування гардеробом для приватних клієнтів і персональних стилістів.',
      price: { eur: '€220', uah: '₴9 400' },
      sessions: '4 сесії',
      format: 'Онлайн',
      details: ['Структура гардероба', 'Капсульне мислення', 'Календар покупок'],
    },
  ],
  en: [
    {
      kind: 'course',
      slug: 'dress-for-victory-course',
      title: 'Create Your Dress of Victory',
      summary: 'A guided course to create your symbolic victory dress with the designer.',
      price: { eur: '€480', uah: '₴20 700' },
      sessions: '6 sessions',
      format: 'Online / studio',
      details: ['Dress concept', 'Materials and draping', 'Final atelier piece'],
    },
    {
      kind: 'course',
      slug: 'draping-moulage',
      title: 'Draping / Moulage',
      summary: 'Volumetric draping practice for designers and stylists.',
      price: { eur: '€540', uah: '₴23 300' },
      sessions: '8 sessions',
      format: 'Studio',
      details: ['Mannequin and volume', 'Building form through fabric', 'Final mini capsule'],
    },
    {
      kind: 'course',
      slug: 'wardrobe-management',
      title: 'Wardrobe Management',
      summary: 'A wardrobe operating system for private clients and personal stylists.',
      price: { eur: '€220', uah: '₴9 400' },
      sessions: '4 sessions',
      format: 'Online',
      details: ['Wardrobe structure', 'Capsule thinking', 'Purchase calendar'],
    },
  ],
  ru: [
    {
      kind: 'course',
      slug: 'dress-for-victory-course',
      title: 'Create Your Dress of Victory',
      summary: 'Курс по созданию собственного платья-победы вместе с дизайнером.',
      price: { eur: '€480', uah: '₴20 700' },
      sessions: '6 сессий',
      format: 'Онлайн / студия',
      details: ['Концепт платья', 'Материалы и draping', 'Финальное atelier-изделие'],
    },
    {
      kind: 'course',
      slug: 'draping-moulage',
      title: 'Драпировка / макетирование',
      summary: 'Практика объёмного моделирования для дизайнеров и стилистов.',
      price: { eur: '€540', uah: '₴23 300' },
      sessions: '8 сессий',
      format: 'Студия',
      details: ['Манекен и объём', 'Построение формы тканью', 'Финальная мини-капсула'],
    },
    {
      kind: 'course',
      slug: 'wardrobe-management',
      title: 'Wardrobe Management',
      summary: 'Система управления гардеробом для частных клиентов и персональных стилистов.',
      price: { eur: '€220', uah: '₴9 400' },
      sessions: '4 сессии',
      format: 'Онлайн',
      details: ['Структура гардероба', 'Капсульное мышление', 'Календарь покупок'],
    },
  ],
}

const transformations: Localized<TransformationSeed[]> = {
  uk: [
    {
      kind: 'transformation',
      slug: 'dress-of-victory',
      title: 'Create Your Dress of Victory',
      summary: 'Інтенсив, де символічна сукня стає особистим жестом сили.',
      format: 'Курс / studio lab',
      cta: 'Приєднатися',
      media: image('/images/purity_5.jpg', 'Create Your Dress of Victory'),
    },
    {
      kind: 'transformation',
      slug: 'wholeness-photomeditation',
      title: 'Wholeness Photomeditation',
      summary: 'Фотодосвід на базі п’яти архетипів старослов’янських богинь.',
      format: 'Авторська сесія',
      cta: 'Запросити деталі',
      media: image('/images/purity_4.jpg', 'Wholeness Photomeditation'),
    },
    {
      kind: 'transformation',
      slug: 'fashion-retreat',
      title: 'Fashion Retreat',
      summary: 'Ретритний формат для тіла, стилю, тиші й нового гардеробного стану.',
      format: 'Лист очікування / residency',
      cta: 'Приєднатися до листа',
      media: image('/images/purity_3.jpg', 'Fashion Retreat'),
    },
  ],
  en: [
    {
      kind: 'transformation',
      slug: 'dress-of-victory',
      title: 'Create Your Dress of Victory',
      summary: 'An intensive where a symbolic dress becomes a personal gesture of strength.',
      format: 'Course / studio lab',
      cta: 'Join',
      media: image('/images/purity_5.jpg', 'Create Your Dress of Victory'),
    },
    {
      kind: 'transformation',
      slug: 'wholeness-photomeditation',
      title: 'Wholeness Photomeditation',
      summary: 'A photo experience built around five Old Slavic goddess archetypes.',
      format: 'Signature session',
      cta: 'Request details',
      media: image('/images/purity_4.jpg', 'Wholeness Photomeditation'),
    },
    {
      kind: 'transformation',
      slug: 'fashion-retreat',
      title: 'Fashion Retreat',
      summary: 'A retreat format for body, style, stillness, and a new wardrobe state.',
      format: 'Waitlist / residency',
      cta: 'Join waitlist',
      media: image('/images/purity_3.jpg', 'Fashion Retreat'),
    },
  ],
  ru: [
    {
      kind: 'transformation',
      slug: 'dress-of-victory',
      title: 'Create Your Dress of Victory',
      summary: 'Интенсив, где символическое платье становится личным жестом силы.',
      format: 'Курс / studio lab',
      cta: 'Присоединиться',
      media: image('/images/purity_5.jpg', 'Create Your Dress of Victory'),
    },
    {
      kind: 'transformation',
      slug: 'wholeness-photomeditation',
      title: 'Wholeness Photomeditation',
      summary: 'Фотоопыт на базе пяти архетипов древнеславянских богинь.',
      format: 'Авторская сессия',
      cta: 'Запросить детали',
      media: image('/images/purity_4.jpg', 'Wholeness Photomeditation'),
    },
    {
      kind: 'transformation',
      slug: 'fashion-retreat',
      title: 'Fashion Retreat',
      summary: 'Ретритный формат для тела, стиля, тишины и нового гардеробного состояния.',
      format: 'Лист ожидания / residency',
      cta: 'Встать в лист ожидания',
      media: image('/images/purity_3.jpg', 'Fashion Retreat'),
    },
  ],
}

const collections: Localized<CollectionSeed[]> = {
  uk: [
    {
      kind: 'collection',
      slug: 'dress-for-victory',
      title: 'Dress for Victory',
      summary: 'Символічні сукні для зйомок, подій і приватних моментів сили.',
      heroMedia: image('/images/purity_5.jpg', 'Dress for Victory editorial portrait', 'Dress for Victory / editorial fitting'),
      story: 'Колекція працює з чистою лінією плеча, м’яким блиском та образом внутрішньої перемоги.',
      editorialNotes: [
        'Сукні розраховані на подієвий кадр і подальше приватне життя після нього.',
        'Кожен look збирається навколо жесту спини, плеча та довгого вертикального руху.',
      ],
      priceNote: 'Індивідуальний запит / couture',
      palette: ['Ivory', 'Molten pearl', 'Victory black'],
      materials: ['Шовк', 'Сатин', 'М’який блиск'],
      silhouettes: ['Подовжена колона', 'Чітке плече', 'Пластичний шлейф'],
      gallery: [
        image('/images/purity_5.jpg', 'Dress for Victory fitting look', 'Editorial fitting'),
        image('/images/purity_3.jpg', 'Dress for Victory event silhouette', 'Event silhouette'),
        image('/images/purity_1.jpg', 'Dress for Victory gesture portrait', 'Victory gesture'),
      ],
      requestCta: 'Запросити консультацію',
      seo: seoEntry({
        title: 'PURITY | Dress for Victory collection',
        description: 'Символічна couture-колекція PURITY для подій, editorial-зйомок і приватних моментів сили.',
        image: image('/images/purity_5.jpg', 'Dress for Victory editorial portrait', 'Dress for Victory / editorial fitting'),
        type: 'article',
      }),
    },
    {
      kind: 'collection',
      slug: 'retreat-wear',
      title: 'Retreat Wear',
      summary: 'Одяг для йоги, дому, відпочинку й тихого тілесного комфорту.',
      heroMedia: image('/images/purity_7.jpg', 'Retreat Wear editorial portrait', 'Retreat Wear / morning layer'),
      story: 'М’які пласкі об’єми, природна палітра й речі, які не конфліктують із тілом.',
      editorialNotes: [
        'Колекція мислиться як повільний гардероб для дому, retreat-резиденцій і ранкової практики.',
        'Образи можна збирати навколо одного шару без відчуття перевантаження.',
      ],
      priceNote: 'Капсули від €390 / ₴16 700',
      palette: ['Cloud', 'Sand', 'Olive milk'],
      materials: ['Трикотаж', 'Бавовна', 'Soft jersey'],
      silhouettes: ['М’який халат', 'Плаский шар', 'Тілесна капсула'],
      gallery: [
        image('/images/purity_7.jpg', 'Retreat Wear morning layer', 'Morning layer'),
        image('/images/purity_2.jpg', 'Retreat Wear soft robe', 'Soft robe'),
        image('/images/purity_4.jpg', 'Retreat Wear jersey set', 'Stretch jersey set'),
      ],
      requestCta: 'Почати консультацію',
      seo: seoEntry({
        title: 'PURITY | Retreat Wear collection',
        description: 'Retreat Wear від PURITY: капсула для йоги, дому, відпочинку та тихого тілесного комфорту.',
        image: image('/images/purity_7.jpg', 'Retreat Wear editorial portrait', 'Retreat Wear / morning layer'),
        type: 'article',
      }),
    },
    {
      kind: 'collection',
      slug: 'travel-capsule',
      title: 'Travel Capsule x Vika Veda',
      summary: 'П’ять шовкових одиниць для руху між містами, подіями та кліматами.',
      heroMedia: image('/images/purity_4.jpg', 'Travel Capsule editorial portrait', 'Travel Capsule / airport drape'),
      story: 'Колекція побудована навколо легкого пакування, повторних стилізацій і високого тактильного комфорту.',
      editorialNotes: [
        'П’ять одиниць працюють у діловому, курортному та вечірньому сценарії без окремого переупакування.',
        'Шовк ідеться першою тканиною для транзиту: легко, тихо, статусно.',
      ],
      priceNote: 'Капсула: €1 000 / ₴43 000',
      palette: ['Raw silk', 'Ink navy', 'Aegean dusk'],
      materials: ['Шовк', 'Креп', 'Легкий підклад'],
      silhouettes: ['П’ятиелементна капсула', 'Дорожній драп', 'Вечірній reset'],
      gallery: [
        image('/images/purity_4.jpg', 'Travel Capsule five-piece edit', 'Five-piece edit'),
        image('/images/purity_6.jpg', 'Travel Capsule airport drape', 'Airport drape'),
        image('/images/purity_3.jpg', 'Travel Capsule evening reset', 'Evening reset'),
      ],
      requestCta: 'Запитати про капсулу',
      seo: seoEntry({
        title: 'PURITY | Travel Capsule x Vika Veda',
        description: 'П’ятиелементна travel-capsule PURITY і Vika Veda з шовковою основою для подій та транзиту.',
        image: image('/images/purity_4.jpg', 'Travel Capsule editorial portrait', 'Travel Capsule / airport drape'),
        type: 'article',
      }),
    },
    {
      kind: 'collection',
      slug: 'silky-touches',
      title: 'Silky Touches',
      summary: 'Круїзні й шифонові образи для яхти, йоги, подорожей і м’якого гламура.',
      heroMedia: image('/images/purity_2.jpg', 'Silky Touches editorial portrait', 'Silky Touches / cruise layer'),
      story: 'Шовк і шифон працюють як рухома світлова поверхня, яка збирає тіло в один потік.',
      editorialNotes: [
        'Колекція балансує між cruise-гардеробом, resort-рухом і прозорою вечірньою пластикою.',
        'Речі мають працювати в кадрі на вітрі так само добре, як у close-up на тілі.',
      ],
      priceNote: 'Індивідуальний запит',
      palette: ['Sea pearl', 'Blue mist', 'Sunset quartz'],
      materials: ['Шифон', 'Шовк', 'Напівпрозорі шари'],
      silhouettes: ['Cruise layer', 'Йога в русі', 'Шифонова колона'],
      gallery: [
        image('/images/purity_2.jpg', 'Silky Touches cruise look', 'Cruise layer'),
        image('/images/purity_7.jpg', 'Silky Touches yoga everywhere look', 'Yoga everywhere'),
        image('/images/purity_5.jpg', 'Silky Touches chiffon column look', 'Chiffon column'),
      ],
      requestCta: 'Надіслати запит',
      seo: seoEntry({
        title: 'PURITY | Silky Touches collection',
        description: 'Шовкові та шифонові образи PURITY для яхти, подорожей, йоги та м’якого glamour.',
        image: image('/images/purity_2.jpg', 'Silky Touches editorial portrait', 'Silky Touches / cruise layer'),
        type: 'article',
      }),
    },
  ],
  en: [
    {
      kind: 'collection',
      slug: 'dress-for-victory',
      title: 'Dress for Victory',
      summary: 'Symbolic dresses for shoots, events, and intimate moments of strength.',
      heroMedia: image('/images/purity_5.jpg', 'Dress for Victory editorial portrait', 'Dress for Victory / Editorial fitting'),
      story: 'The collection works with clean shoulder lines, soft shine, and the image of inner victory.',
      editorialNotes: [
        'The pieces are designed for event imagery and for a private life after the event itself.',
        'Each look is built around the gesture of the back, shoulder, and one long vertical line.',
      ],
      priceNote: 'Custom request / couture',
      palette: ['Ivory', 'Molten pearl', 'Victory black'],
      materials: ['Silk', 'Satin', 'Soft shine'],
      silhouettes: ['Lengthened column', 'Structured shoulder', 'Fluid train'],
      gallery: [
        image('/images/purity_5.jpg', 'Dress for Victory fitting look', 'Editorial fitting'),
        image('/images/purity_3.jpg', 'Dress for Victory event silhouette', 'Event silhouette'),
        image('/images/purity_1.jpg', 'Dress for Victory gesture portrait', 'Victory gesture'),
      ],
      requestCta: 'Request consultation',
      seo: seoEntry({
        title: 'PURITY | Dress for Victory collection',
        description: 'A symbolic PURITY couture collection for events, editorial shoots, and intimate moments of strength.',
        image: image('/images/purity_5.jpg', 'Dress for Victory editorial portrait', 'Dress for Victory / Editorial fitting'),
        type: 'article',
      }),
    },
    {
      kind: 'collection',
      slug: 'retreat-wear',
      title: 'Retreat Wear',
      summary: 'Garments for yoga, home, rest, and quiet physical ease.',
      heroMedia: image('/images/purity_7.jpg', 'Retreat Wear editorial portrait', 'Retreat Wear / Morning layer'),
      story: 'Soft flat volumes, a natural palette, and pieces that never fight the body.',
      editorialNotes: [
        'The collection is conceived as a slow wardrobe for home, retreat residencies, and morning practice.',
        'Looks can be built around a single layer without visual overload.',
      ],
      priceNote: 'Capsules from €390 / ₴16 700',
      palette: ['Cloud', 'Sand', 'Olive milk'],
      materials: ['Jersey', 'Cotton', 'Soft stretch'],
      silhouettes: ['Soft robe', 'Flat layer', 'Body-ease set'],
      gallery: [
        image('/images/purity_7.jpg', 'Retreat Wear morning layer', 'Morning layer'),
        image('/images/purity_2.jpg', 'Retreat Wear soft robe', 'Soft robe'),
        image('/images/purity_4.jpg', 'Retreat Wear jersey set', 'Stretch jersey set'),
      ],
      requestCta: 'Start consultation',
      seo: seoEntry({
        title: 'PURITY | Retreat Wear collection',
        description: 'PURITY Retreat Wear: a capsule for yoga, home, rest, and quiet bodily ease.',
        image: image('/images/purity_7.jpg', 'Retreat Wear editorial portrait', 'Retreat Wear / Morning layer'),
        type: 'article',
      }),
    },
    {
      kind: 'collection',
      slug: 'travel-capsule',
      title: 'Travel Capsule x Vika Veda',
      summary: 'Five silk pieces designed for movement across cities, events, and climates.',
      heroMedia: image('/images/purity_4.jpg', 'Travel Capsule editorial portrait', 'Travel Capsule / Airport drape'),
      story: 'The collection is built around light packing, restyling, and high tactile comfort.',
      editorialNotes: [
        'Five pieces are expected to carry business, resort, and evening scenarios without repacking.',
        'Silk is treated as the first fabric of transit: light, quiet, and status-conscious.',
      ],
      priceNote: 'Capsule: €1,000 / ₴43,000',
      palette: ['Raw silk', 'Ink navy', 'Aegean dusk'],
      materials: ['Silk', 'Crepe', 'Light lining'],
      silhouettes: ['Five-piece edit', 'Airport drape', 'Evening reset'],
      gallery: [
        image('/images/purity_4.jpg', 'Travel Capsule five-piece edit', 'Five-piece edit'),
        image('/images/purity_6.jpg', 'Travel Capsule airport drape', 'Airport drape'),
        image('/images/purity_3.jpg', 'Travel Capsule evening reset', 'Evening reset'),
      ],
      requestCta: 'Ask about the capsule',
      seo: seoEntry({
        title: 'PURITY | Travel Capsule x Vika Veda',
        description: 'A five-piece PURITY and Vika Veda silk travel capsule for transit, events, and flexible styling.',
        image: image('/images/purity_4.jpg', 'Travel Capsule editorial portrait', 'Travel Capsule / Airport drape'),
        type: 'article',
      }),
    },
    {
      kind: 'collection',
      slug: 'silky-touches',
      title: 'Silky Touches',
      summary: 'Cruise and chiffon looks for yacht days, yoga, travel, and soft glamour.',
      heroMedia: image('/images/purity_2.jpg', 'Silky Touches editorial portrait', 'Silky Touches / Cruise layer'),
      story: 'Silk and chiffon operate like moving light surfaces that collect the body into one flow.',
      editorialNotes: [
        'The collection balances cruise dressing, resort movement, and transparent evening softness.',
        'Pieces are meant to work in wind-driven wide shots and in close body framing alike.',
      ],
      priceNote: 'Custom request',
      palette: ['Sea pearl', 'Blue mist', 'Sunset quartz'],
      materials: ['Chiffon', 'Silk', 'Sheer layers'],
      silhouettes: ['Cruise layer', 'Yoga movement', 'Chiffon column'],
      gallery: [
        image('/images/purity_2.jpg', 'Silky Touches cruise look', 'Cruise layer'),
        image('/images/purity_7.jpg', 'Silky Touches yoga look', 'Yoga everywhere'),
        image('/images/purity_5.jpg', 'Silky Touches chiffon column', 'Chiffon column'),
      ],
      requestCta: 'Send request',
      seo: seoEntry({
        title: 'PURITY | Silky Touches collection',
        description: 'Silk and chiffon PURITY looks for yacht days, travel, yoga, and soft glamour wardrobes.',
        image: image('/images/purity_2.jpg', 'Silky Touches editorial portrait', 'Silky Touches / Cruise layer'),
        type: 'article',
      }),
    },
  ],
  ru: [
    {
      kind: 'collection',
      slug: 'dress-for-victory',
      title: 'Dress for Victory',
      summary: 'Символические платья для съёмок, событий и личных моментов силы.',
      heroMedia: image('/images/purity_5.jpg', 'Dress for Victory editorial portrait', 'Dress for Victory / editorial fitting'),
      story: 'Коллекция работает с чистой линией плеча, мягким блеском и образом внутренней победы.',
      editorialNotes: [
        'Платья рассчитаны на событийный кадр и на частную жизнь после него.',
        'Каждый образ строится вокруг жеста спины, плеча и длинной вертикали.',
      ],
      priceNote: 'Индивидуальный запрос / couture',
      palette: ['Ivory', 'Molten pearl', 'Victory black'],
      materials: ['Шёлк', 'Сатин', 'Мягкий блеск'],
      silhouettes: ['Удлинённая колонна', 'Структурное плечо', 'Пластичный шлейф'],
      gallery: [
        image('/images/purity_5.jpg', 'Dress for Victory fitting look', 'Editorial fitting'),
        image('/images/purity_3.jpg', 'Dress for Victory event silhouette', 'Event silhouette'),
        image('/images/purity_1.jpg', 'Dress for Victory gesture portrait', 'Victory gesture'),
      ],
      requestCta: 'Запросить консультацию',
      seo: seoEntry({
        title: 'PURITY | Dress for Victory collection',
        description: 'Символическая couture-коллекция PURITY для событий, editorial-съёмок и личных моментов силы.',
        image: image('/images/purity_5.jpg', 'Dress for Victory editorial portrait', 'Dress for Victory / editorial fitting'),
        type: 'article',
      }),
    },
    {
      kind: 'collection',
      slug: 'retreat-wear',
      title: 'Retreat Wear',
      summary: 'Одежда для йоги, дома, отдыха и тихого телесного комфорта.',
      heroMedia: image('/images/purity_7.jpg', 'Retreat Wear editorial portrait', 'Retreat Wear / morning layer'),
      story: 'Мягкие плоские объёмы, природная палитра и вещи, которые не конфликтуют с телом.',
      editorialNotes: [
        'Коллекция мыслится как медленный гардероб для дома, retreat-резиденций и утренней практики.',
        'Образы можно строить вокруг одного слоя без ощущения перегруза.',
      ],
      priceNote: 'Капсулы от €390 / ₴16 700',
      palette: ['Cloud', 'Sand', 'Olive milk'],
      materials: ['Трикотаж', 'Хлопок', 'Soft jersey'],
      silhouettes: ['Мягкий халат', 'Плоский слой', 'Телесная капсула'],
      gallery: [
        image('/images/purity_7.jpg', 'Retreat Wear morning layer', 'Morning layer'),
        image('/images/purity_2.jpg', 'Retreat Wear soft robe', 'Soft robe'),
        image('/images/purity_4.jpg', 'Retreat Wear jersey set', 'Stretch jersey set'),
      ],
      requestCta: 'Начать консультацию',
      seo: seoEntry({
        title: 'PURITY | Retreat Wear collection',
        description: 'Retreat Wear от PURITY: капсула для йоги, дома, отдыха и тихого телесного комфорта.',
        image: image('/images/purity_7.jpg', 'Retreat Wear editorial portrait', 'Retreat Wear / morning layer'),
        type: 'article',
      }),
    },
    {
      kind: 'collection',
      slug: 'travel-capsule',
      title: 'Travel Capsule x Vika Veda',
      summary: 'Пять шёлковых единиц для движения между городами, событиями и климатами.',
      heroMedia: image('/images/purity_4.jpg', 'Travel Capsule editorial portrait', 'Travel Capsule / airport drape'),
      story: 'Коллекция построена вокруг лёгкой упаковки, повторных стилизаций и высокого тактильного комфорта.',
      editorialNotes: [
        'Пять единиц закрывают деловой, курортный и вечерний сценарий без отдельной переупаковки.',
        'Шёлк здесь работает как главная ткань транзита: легко, тихо и статусно.',
      ],
      priceNote: 'Капсула: €1 000 / ₴43 000',
      palette: ['Raw silk', 'Ink navy', 'Aegean dusk'],
      materials: ['Шёлк', 'Креп', 'Лёгкий подклад'],
      silhouettes: ['Пятиэлементная капсула', 'Airport drape', 'Evening reset'],
      gallery: [
        image('/images/purity_4.jpg', 'Travel Capsule five-piece edit', 'Five-piece edit'),
        image('/images/purity_6.jpg', 'Travel Capsule airport drape', 'Airport drape'),
        image('/images/purity_3.jpg', 'Travel Capsule evening reset', 'Evening reset'),
      ],
      requestCta: 'Спросить о капсуле',
      seo: seoEntry({
        title: 'PURITY | Travel Capsule x Vika Veda',
        description: 'Пятиэлементная travel-capsule PURITY и Vika Veda с шёлковой основой для событий и транзита.',
        image: image('/images/purity_4.jpg', 'Travel Capsule editorial portrait', 'Travel Capsule / airport drape'),
        type: 'article',
      }),
    },
    {
      kind: 'collection',
      slug: 'silky-touches',
      title: 'Silky Touches',
      summary: 'Круизные и шифоновые образы для яхты, йоги, путешествий и мягкого гламура.',
      heroMedia: image('/images/purity_2.jpg', 'Silky Touches editorial portrait', 'Silky Touches / cruise layer'),
      story: 'Шёлк и шифон работают как движущаяся световая поверхность, собирающая тело в единый поток.',
      editorialNotes: [
        'Коллекция балансирует между cruise-гардеробом, resort-движением и прозрачной вечерней пластикой.',
        'Вещи должны работать и в кадре на ветру, и в close-up на теле.',
      ],
      priceNote: 'Индивидуальный запрос',
      palette: ['Sea pearl', 'Blue mist', 'Sunset quartz'],
      materials: ['Шифон', 'Шёлк', 'Полупрозрачные слои'],
      silhouettes: ['Cruise layer', 'Yoga movement', 'Chiffon column'],
      gallery: [
        image('/images/purity_2.jpg', 'Silky Touches cruise look', 'Cruise layer'),
        image('/images/purity_7.jpg', 'Silky Touches yoga look', 'Yoga everywhere'),
        image('/images/purity_5.jpg', 'Silky Touches chiffon column', 'Chiffon column'),
      ],
      requestCta: 'Отправить запрос',
      seo: seoEntry({
        title: 'PURITY | Silky Touches collection',
        description: 'Шёлковые и шифоновые образы PURITY для яхты, путешествий, йоги и мягкого glamour.',
        image: image('/images/purity_2.jpg', 'Silky Touches editorial portrait', 'Silky Touches / cruise layer'),
        type: 'article',
      }),
    },
  ],
}

const portfolio: Localized<PortfolioSeed[]> = {
  uk: [
    {
      kind: 'portfolio',
      slug: 'soft-power-capsule',
      title: 'Soft Power Capsule',
      category: 'Before / After',
      summary: 'Трансформація клієнтки з хаотичного casual у спокійний виразний wardrobe-language.',
      heroMedia: image('/images/purity_1.jpg', 'Soft Power Capsule portrait', 'Soft Power Capsule / before-after'),
      client: 'Приватна клієнтка / executive wardrobe reset',
      context: 'Wardrobe review + color strategy + capsule build для щоденного керівного ритму.',
      challenge: 'Прибрати випадковість з гардероба без втрати м’якості та індивідуального тону.',
      approach: 'Ми зібрали нову кольорову логіку, 14 look-формул та чіткий перелік покупок і доробок.',
      outcome: '14 look-формул, нова кольорова стратегія, зменшення імпульсивних покупок.',
      deliverables: ['Wardrobe review', 'Color palette', 'Capsule formulas', 'Shopping map'],
      metrics: [
        { label: 'Looks', value: '14' },
        { label: 'Shopping edits', value: '9' },
        { label: 'Focus', value: 'Executive ease' },
      ],
      accents: ['Capsule', 'Color', 'Executive ease'],
      gallery: [
        image('/images/purity_1.jpg', 'Soft Power Capsule portrait', 'Reset portrait'),
        image('/images/purity_4.jpg', 'Soft Power Capsule movement', 'Capsule movement'),
        image('/images/purity_6.jpg', 'Soft Power Capsule after styling', 'After styling'),
      ],
      video: {
        title: 'Soft Power Capsule field note',
        url: 'https://vimeo.com/76979871',
        provider: 'vimeo',
      },
      requestCta: 'Запитати про подібний кейс',
      seo: seoEntry({
        title: 'PURITY | Soft Power Capsule case',
        description: 'Before/after кейс PURITY з wardrobe review, color strategy та executive capsule build.',
        image: image('/images/purity_1.jpg', 'Soft Power Capsule portrait', 'Soft Power Capsule / before-after'),
        type: 'article',
      }),
    },
    {
      kind: 'portfolio',
      slug: 'editorial-corporate-shoot',
      title: 'Editorial Corporate Shoot',
      category: 'Corporate',
      summary: 'Стилізація брендової зйомки з нейтральною luxury-оптикою та тканинним акцентом.',
      heroMedia: image('/images/purity_3.jpg', 'Editorial Corporate Shoot portrait', 'Editorial Corporate Shoot / campaign frame'),
      client: 'Корпоративний fashion / lifestyle клієнт',
      context: 'Кампанійна зйомка з потребою в цілісній luxury-мові для digital і event-комунікації.',
      challenge: 'Поєднати корпоративну ясність із fashion-настроєм без рекламної жорсткості.',
      approach: 'Фокус зміщено на тканину, рух і нейтральну палітру, яка тримає бренд без перевантаження.',
      outcome: 'Узгоджена візуальна мова для кампанії та подієвого контенту.',
      deliverables: ['Styling direction', 'Shot list rhythm', 'Wardrobe edit', 'Fabric accents'],
      metrics: [
        { label: 'Frames', value: '26' },
        { label: 'Looks', value: '8' },
        { label: 'Usage', value: 'Campaign + events' },
      ],
      accents: ['Corporate', 'Shoot', 'Brand styling'],
      gallery: [
        image('/images/purity_3.jpg', 'Editorial Corporate Shoot frame', 'Campaign frame'),
        image('/images/purity_5.jpg', 'Editorial Corporate Shoot fabric detail', 'Fabric detail'),
        image('/images/purity_2.jpg', 'Editorial Corporate Shoot event look', 'Event look'),
      ],
      requestCta: 'Обговорити корпоративну стилізацію',
      seo: seoEntry({
        title: 'PURITY | Editorial Corporate Shoot case',
        description: 'Корпоративний editorial-кейс PURITY з brand styling, luxury-палітрою та fabric-first артдирекшном.',
        image: image('/images/purity_3.jpg', 'Editorial Corporate Shoot portrait', 'Editorial Corporate Shoot / campaign frame'),
        type: 'article',
      }),
    },
    {
      kind: 'portfolio',
      slug: 'bridal-reset',
      title: 'Bridal Reset',
      category: 'Atelier',
      summary: 'Dossier + couture-плаття для приватної церемонії та післяподієвого wardrobe reuse.',
      heroMedia: image('/images/purity_6.jpg', 'Bridal Reset portrait', 'Bridal Reset / atelier fitting'),
      client: 'Приватна церемонія / atelier client',
      context: 'Клієнтка потребувала весільний look, який не завершувався б після події.',
      challenge: 'Зробити couture-плаття символічним і придатним до повторного носіння.',
      approach: 'Через dossier та atelier fittings ми побудували одну базову форму з трьома майбутніми сценаріями носіння.',
      outcome: 'Одна сукня, три сценарії носіння після події.',
      deliverables: ['Dossier session', 'Atelier fittings', 'Couture dress', 'Post-event styling map'],
      metrics: [
        { label: 'Fittings', value: '5' },
        { label: 'Rewear looks', value: '3' },
        { label: 'Format', value: 'Atelier' },
      ],
      accents: ['Couture', 'Dossier', 'Rewear'],
      gallery: [
        image('/images/purity_6.jpg', 'Bridal Reset atelier fitting', 'Atelier fitting'),
        image('/images/purity_1.jpg', 'Bridal Reset event silhouette', 'Event silhouette'),
        image('/images/purity_4.jpg', 'Bridal Reset after-event look', 'After-event look'),
      ],
      requestCta: 'Почати atelier-консультацію',
      seo: seoEntry({
        title: 'PURITY | Bridal Reset case',
        description: 'Atelier-кейс PURITY: dossier, couture-плаття та три post-event сценарії повторного носіння.',
        image: image('/images/purity_6.jpg', 'Bridal Reset portrait', 'Bridal Reset / atelier fitting'),
        type: 'article',
      }),
    },
  ],
  en: [
    {
      kind: 'portfolio',
      slug: 'soft-power-capsule',
      title: 'Soft Power Capsule',
      category: 'Before / After',
      summary: 'A client transformation from chaotic casual dressing into a calm, articulate wardrobe language.',
      heroMedia: image('/images/purity_1.jpg', 'Soft Power Capsule portrait', 'Soft Power Capsule / before-after'),
      client: 'Private client / executive wardrobe reset',
      context: 'Wardrobe review, color strategy, and capsule build for an everyday leadership rhythm.',
      challenge: 'Remove randomness from the wardrobe without losing softness or personal tone.',
      approach: 'We built a sharper color logic, 14 look formulas, and a strict list of purchases and alterations.',
      outcome: '14 look formulas, a new color strategy, and fewer impulsive purchases.',
      deliverables: ['Wardrobe review', 'Color palette', 'Capsule formulas', 'Shopping map'],
      metrics: [
        { label: 'Looks', value: '14' },
        { label: 'Shopping edits', value: '9' },
        { label: 'Focus', value: 'Executive ease' },
      ],
      accents: ['Capsule', 'Color', 'Executive ease'],
      gallery: [
        image('/images/purity_1.jpg', 'Soft Power Capsule portrait', 'Reset portrait'),
        image('/images/purity_4.jpg', 'Soft Power Capsule movement', 'Capsule movement'),
        image('/images/purity_6.jpg', 'Soft Power Capsule after styling', 'After styling'),
      ],
      video: {
        title: 'Soft Power Capsule field note',
        url: 'https://vimeo.com/76979871',
        provider: 'vimeo',
      },
      requestCta: 'Request a similar case study',
      seo: seoEntry({
        title: 'PURITY | Soft Power Capsule case',
        description: 'A PURITY before/after case featuring wardrobe review, color strategy, and an executive capsule build.',
        image: image('/images/purity_1.jpg', 'Soft Power Capsule portrait', 'Soft Power Capsule / before-after'),
        type: 'article',
      }),
    },
    {
      kind: 'portfolio',
      slug: 'editorial-corporate-shoot',
      title: 'Editorial Corporate Shoot',
      category: 'Corporate',
      summary: 'Brand shoot styling with a neutral luxury lens and a fabric-first accent.',
      heroMedia: image('/images/purity_3.jpg', 'Editorial Corporate Shoot portrait', 'Editorial Corporate Shoot / campaign frame'),
      client: 'Corporate fashion / lifestyle client',
      context: 'A campaign shoot needed one coherent luxury language for digital and event-facing communication.',
      challenge: 'Hold corporate clarity and fashion atmosphere together without commercial stiffness.',
      approach: 'The styling centered on fabric, movement, and a neutral palette capable of carrying the brand without excess.',
      outcome: 'A cohesive visual language for campaign and event-facing content.',
      deliverables: ['Styling direction', 'Shot-list rhythm', 'Wardrobe edit', 'Fabric accents'],
      metrics: [
        { label: 'Frames', value: '26' },
        { label: 'Looks', value: '8' },
        { label: 'Usage', value: 'Campaign + events' },
      ],
      accents: ['Corporate', 'Shoot', 'Brand styling'],
      gallery: [
        image('/images/purity_3.jpg', 'Editorial Corporate Shoot frame', 'Campaign frame'),
        image('/images/purity_5.jpg', 'Editorial Corporate Shoot fabric detail', 'Fabric detail'),
        image('/images/purity_2.jpg', 'Editorial Corporate Shoot event look', 'Event look'),
      ],
      requestCta: 'Discuss corporate styling',
      seo: seoEntry({
        title: 'PURITY | Editorial Corporate Shoot case',
        description: 'A PURITY corporate editorial case combining brand styling, a luxury palette, and fabric-first art direction.',
        image: image('/images/purity_3.jpg', 'Editorial Corporate Shoot portrait', 'Editorial Corporate Shoot / campaign frame'),
        type: 'article',
      }),
    },
    {
      kind: 'portfolio',
      slug: 'bridal-reset',
      title: 'Bridal Reset',
      category: 'Atelier',
      summary: 'Dossier and couture dress development for a private ceremony with after-event wardrobe reuse.',
      heroMedia: image('/images/purity_6.jpg', 'Bridal Reset portrait', 'Bridal Reset / atelier fitting'),
      client: 'Private ceremony / atelier client',
      context: 'The client needed a wedding look that would continue beyond the event itself.',
      challenge: 'Create a symbolic couture dress that could also live on in future wear.',
      approach: 'Through dossier work and atelier fittings, one base form was developed with three later styling scenarios.',
      outcome: 'One dress, three future wearing scenarios.',
      deliverables: ['Dossier session', 'Atelier fittings', 'Couture dress', 'Post-event styling map'],
      metrics: [
        { label: 'Fittings', value: '5' },
        { label: 'Rewear looks', value: '3' },
        { label: 'Format', value: 'Atelier' },
      ],
      accents: ['Couture', 'Dossier', 'Rewear'],
      gallery: [
        image('/images/purity_6.jpg', 'Bridal Reset atelier fitting', 'Atelier fitting'),
        image('/images/purity_1.jpg', 'Bridal Reset event silhouette', 'Event silhouette'),
        image('/images/purity_4.jpg', 'Bridal Reset after-event look', 'After-event look'),
      ],
      requestCta: 'Begin an atelier consultation',
      seo: seoEntry({
        title: 'PURITY | Bridal Reset case',
        description: 'A PURITY atelier case covering dossier work, a couture bridal dress, and three post-event rewear scenarios.',
        image: image('/images/purity_6.jpg', 'Bridal Reset portrait', 'Bridal Reset / atelier fitting'),
        type: 'article',
      }),
    },
  ],
  ru: [
    {
      kind: 'portfolio',
      slug: 'soft-power-capsule',
      title: 'Soft Power Capsule',
      category: 'Before / After',
      summary: 'Трансформация клиентки из хаотичного casual в спокойный и выразительный wardrobe-language.',
      heroMedia: image('/images/purity_1.jpg', 'Soft Power Capsule portrait', 'Soft Power Capsule / before-after'),
      client: 'Частная клиентка / executive wardrobe reset',
      context: 'Wardrobe review, color strategy и capsule build для повседневного руководящего ритма.',
      challenge: 'Убрать случайность из гардероба без потери мягкости и личного тона.',
      approach: 'Мы собрали новую цветовую логику, 14 look-формул и точный список покупок и доработок.',
      outcome: '14 look-формул, новая цветовая стратегия и меньше импульсивных покупок.',
      deliverables: ['Wardrobe review', 'Color palette', 'Capsule formulas', 'Shopping map'],
      metrics: [
        { label: 'Looks', value: '14' },
        { label: 'Shopping edits', value: '9' },
        { label: 'Focus', value: 'Executive ease' },
      ],
      accents: ['Capsule', 'Color', 'Executive ease'],
      gallery: [
        image('/images/purity_1.jpg', 'Soft Power Capsule portrait', 'Reset portrait'),
        image('/images/purity_4.jpg', 'Soft Power Capsule movement', 'Capsule movement'),
        image('/images/purity_6.jpg', 'Soft Power Capsule after styling', 'After styling'),
      ],
      video: {
        title: 'Soft Power Capsule field note',
        url: 'https://vimeo.com/76979871',
        provider: 'vimeo',
      },
      requestCta: 'Запросить похожий кейс',
      seo: seoEntry({
        title: 'PURITY | Soft Power Capsule case',
        description: 'Before/after кейс PURITY с wardrobe review, color strategy и executive capsule build.',
        image: image('/images/purity_1.jpg', 'Soft Power Capsule portrait', 'Soft Power Capsule / before-after'),
        type: 'article',
      }),
    },
    {
      kind: 'portfolio',
      slug: 'editorial-corporate-shoot',
      title: 'Editorial Corporate Shoot',
      category: 'Corporate',
      summary: 'Стилизация брендовой съёмки с нейтральной luxury-оптикой и акцентом на ткань.',
      heroMedia: image('/images/purity_3.jpg', 'Editorial Corporate Shoot portrait', 'Editorial Corporate Shoot / campaign frame'),
      client: 'Корпоративный fashion / lifestyle клиент',
      context: 'Кампанийная съёмка требовала единого luxury-языка для digital и event-коммуникации.',
      challenge: 'Соединить корпоративную ясность и fashion-настроение без рекламной жёсткости.',
      approach: 'Стилизация собрана вокруг ткани, движения и нейтральной палитры, которая удерживает бренд без перегруза.',
      outcome: 'Согласованный визуальный язык для кампании и событийного контента.',
      deliverables: ['Styling direction', 'Shot-list rhythm', 'Wardrobe edit', 'Fabric accents'],
      metrics: [
        { label: 'Frames', value: '26' },
        { label: 'Looks', value: '8' },
        { label: 'Usage', value: 'Campaign + events' },
      ],
      accents: ['Corporate', 'Shoot', 'Brand styling'],
      gallery: [
        image('/images/purity_3.jpg', 'Editorial Corporate Shoot frame', 'Campaign frame'),
        image('/images/purity_5.jpg', 'Editorial Corporate Shoot fabric detail', 'Fabric detail'),
        image('/images/purity_2.jpg', 'Editorial Corporate Shoot event look', 'Event look'),
      ],
      requestCta: 'Обсудить корпоративную стилизацию',
      seo: seoEntry({
        title: 'PURITY | Editorial Corporate Shoot case',
        description: 'Корпоративный editorial-кейс PURITY с brand styling, luxury-палитрой и fabric-first артдирекшном.',
        image: image('/images/purity_3.jpg', 'Editorial Corporate Shoot portrait', 'Editorial Corporate Shoot / campaign frame'),
        type: 'article',
      }),
    },
    {
      kind: 'portfolio',
      slug: 'bridal-reset',
      title: 'Bridal Reset',
      category: 'Atelier',
      summary: 'Dossier + couture-платье для частной церемонии и дальнейшего wardrobe reuse.',
      heroMedia: image('/images/purity_6.jpg', 'Bridal Reset portrait', 'Bridal Reset / atelier fitting'),
      client: 'Частная церемония / atelier client',
      context: 'Клиентке нужен был свадебный look, который продолжал бы жить после события.',
      challenge: 'Сделать couture-платье символичным и пригодным для повторной носки.',
      approach: 'Через dossier и atelier fittings была построена одна базовая форма с тремя будущими сценариями стилизации.',
      outcome: 'Одно платье, три сценария носки после события.',
      deliverables: ['Dossier session', 'Atelier fittings', 'Couture dress', 'Post-event styling map'],
      metrics: [
        { label: 'Fittings', value: '5' },
        { label: 'Rewear looks', value: '3' },
        { label: 'Format', value: 'Atelier' },
      ],
      accents: ['Couture', 'Dossier', 'Rewear'],
      gallery: [
        image('/images/purity_6.jpg', 'Bridal Reset atelier fitting', 'Atelier fitting'),
        image('/images/purity_1.jpg', 'Bridal Reset event silhouette', 'Event silhouette'),
        image('/images/purity_4.jpg', 'Bridal Reset after-event look', 'After-event look'),
      ],
      requestCta: 'Начать atelier-консультацию',
      seo: seoEntry({
        title: 'PURITY | Bridal Reset case',
        description: 'Atelier-кейс PURITY: dossier, couture-платье и три post-event сценария повторной носки.',
        image: image('/images/purity_6.jpg', 'Bridal Reset portrait', 'Bridal Reset / atelier fitting'),
        type: 'article',
      }),
    },
  ],
}

const studioSettings: StudioSettings = {
  kind: 'settings',
  slug: 'studio-settings',
  id: 'settings:studio-settings',
  contactEmail: studioContactEmail,
  phone: studioPhone,
  locationLabel: studioLocation,
  mapHref: studioMapHref,
  socialLinks: [
    { label: 'Instagram', href: 'https://www.instagram.com/purity_fashion_studio/' },
    { label: 'YouTube', href: 'https://www.youtube.com/channel/UCVTLImOTCrlad07TufNaJYw' },
    { label: 'Facebook', href: 'https://www.facebook.com/puritypersonalstylist/' },
  ],
  mapLabel: 'PURITY studio on map',
  adminNote: 'Keep public contacts and social links synchronized with backend-managed settings.',
  meta: createMeta('settings', 'studio-settings', {
    owner: systemOwner,
    lastEditedBy: editorialOwner,
    hasUnpublishedChanges: true,
  }),
}

function fallbackGallery(slug: string, captions: string[]): MediaGallery {
  return createGallery(
    captions.map((caption, index) =>
      createGalleryItem(
        `${slug}-${index + 1}`,
        `${slug} gallery ${index + 1}`,
        `/images/purity_${(index % 6) + 1}.jpg`,
        caption,
        index === 0 ? 'cover' : 'gallery',
      ),
    ),
  )
}

function toLocalizedStatuses(
  titleByLocale: Localized<string>,
  summaryByLocale?: Localized<string>,
): LocalizedDocumentStatus[] {
  return (['uk', 'en', 'ru'] as const).map((locale) => ({
    locale,
    title: titleByLocale[locale],
    summary: summaryByLocale?.[locale],
    isComplete: Boolean(titleByLocale[locale] && (summaryByLocale ? summaryByLocale[locale] : true)),
  }))
}

function mediaCountFromGallery(gallery?: MediaGallery) {
  return gallery?.items.length ?? 0
}

function getPageMeta(slug: string) {
  return createMeta('page', slug)
}

function buildPageRecord(
  slug: ManagedContentRecord['kind'] extends never ? never : string,
  titleByLocale: Localized<string>,
  summaryByLocale: Localized<string>,
  raw: unknown,
  previewPath: string,
): ManagedContentRecord {
  return {
    id: `page:${slug}`,
    kind: 'page',
    slug,
    meta: getPageMeta(slug),
    localizations: toLocalizedStatuses(titleByLocale, summaryByLocale),
    previewPath,
    workflowNotes: [
      'Page copy is still in static code and should move behind a document repository.',
      'Preview mode should resolve locale-specific page drafts before publishing.',
    ],
    raw,
  }
}

function buildServiceEntity(locale: Locale, service: BaseService): ServiceEntity {
  const fallbackImage = image(
    service.area === 'research' ? '/images/purity_3.jpg' : '/images/purity_6.jpg',
    service.title[locale],
  )
  const galleryCover = serviceMedia[service.slug]?.cover?.asset
  const serviceImage = service.media?.[locale] ?? (
    galleryCover ? image(galleryCover.src, galleryCover.alt, service.heroLabel[locale]) : fallbackImage
  )

  return {
    kind: 'service',
    id: `service:${service.slug}`,
    slug: service.slug,
    area: service.area,
    title: service.title[locale],
    eyebrow: service.eyebrow[locale],
    summary: service.summary[locale],
    price: service.price,
    duration: service.duration[locale],
    leadTime: service.leadTime[locale],
    formats: service.formats[locale],
    deliverables: service.deliverables[locale],
    process: service.process[locale],
    notes: service.notes[locale],
    visualMood: service.visualMood[locale],
    heroLabel: service.heroLabel[locale],
    media: serviceImage,
    seo:
      service.seo?.[locale] ??
      seoEntry({
        title: `PURITY | ${service.title[locale]}`,
        description: service.summary[locale],
        image: serviceImage,
        type: 'article',
      }),
    meta: createMeta('service', service.slug),
  }
}

function buildCourseEntity(locale: Locale, course: CourseSeed): CourseEntity {
  return {
    ...course,
    id: `course:${course.slug}`,
    media: courseMedia[course.slug] ?? createGallery([]),
    meta: createMeta('course', course.slug),
  }
}

function buildCollectionEntity(locale: Locale, collection: CollectionSeed): CollectionEntity {
  return {
    kind: 'collection',
    id: `collection:${collection.slug}`,
    slug: collection.slug,
    title: collection.title,
    summary: collection.summary,
    story: collection.story,
    priceNote: collection.priceNote,
    palette: collection.palette,
    heroMedia: collection.heroMedia,
    editorialNotes: collection.editorialNotes,
    materials: collection.materials,
    silhouettes: collection.silhouettes,
    gallery: collection.gallery,
    requestCta: collection.requestCta,
    seo: collection.seo,
    meta: createMeta('collection', collection.slug),
  }
}

function buildPortfolioEntity(locale: Locale, entry: PortfolioSeed): PortfolioCaseEntity {
  return {
    ...entry,
    id: `portfolio:${entry.slug}`,
    meta: createMeta('portfolio', entry.slug),
  }
}

function buildTransformationEntity(entry: TransformationSeed): TransformationOfferEntity {
  return {
    ...entry,
    id: `transformation:${entry.slug}`,
    meta: createMeta('transformation', entry.slug, {
      hasUnpublishedChanges: entry.slug === 'fashion-retreat',
    }),
  }
}

function getPageTitleMatrix() {
  return {
    home: { uk: homePages.uk.heroTitle, en: homePages.en.heroTitle, ru: homePages.ru.heroTitle },
    research: { uk: listingPages.research.uk.title, en: listingPages.research.en.title, ru: listingPages.research.ru.title },
    realisation: { uk: listingPages.realisation.uk.title, en: listingPages.realisation.en.title, ru: listingPages.realisation.ru.title },
    transformation: { uk: listingPages.transformation.uk.title, en: listingPages.transformation.en.title, ru: listingPages.transformation.ru.title },
    collections: { uk: listingPages.collections.uk.title, en: listingPages.collections.en.title, ru: listingPages.collections.ru.title },
    school: { uk: schoolPages.uk.title, en: schoolPages.en.title, ru: schoolPages.ru.title },
    portfolio: { uk: portfolioPages.uk.title, en: portfolioPages.en.title, ru: portfolioPages.ru.title },
    contacts: { uk: contactsPages.uk.title, en: contactsPages.en.title, ru: contactsPages.ru.title },
  }
}

function getPageSummaryMatrix() {
  return {
    home: { uk: homePages.uk.heroDescription, en: homePages.en.heroDescription, ru: homePages.ru.heroDescription },
    research: { uk: listingPages.research.uk.intro, en: listingPages.research.en.intro, ru: listingPages.research.ru.intro },
    realisation: { uk: listingPages.realisation.uk.intro, en: listingPages.realisation.en.intro, ru: listingPages.realisation.ru.intro },
    transformation: { uk: listingPages.transformation.uk.intro, en: listingPages.transformation.en.intro, ru: listingPages.transformation.ru.intro },
    collections: { uk: listingPages.collections.uk.intro, en: listingPages.collections.en.intro, ru: listingPages.collections.ru.intro },
    school: { uk: schoolPages.uk.intro, en: schoolPages.en.intro, ru: schoolPages.ru.intro },
    portfolio: { uk: portfolioPages.uk.intro, en: portfolioPages.en.intro, ru: portfolioPages.ru.intro },
    contacts: { uk: contactsPages.uk.intro, en: contactsPages.en.intro, ru: contactsPages.ru.intro },
  }
}

function localizedOfferField<T extends { slug: string; title: string; summary?: string }>(
  getter: (locale: Locale) => T[],
  slug: string,
  field: 'title' | 'summary',
) {
  return Object.fromEntries(
    (['uk', 'en', 'ru'] as const).map((locale) => [
      locale,
      getter(locale).find((entry) => entry.slug === slug)?.[field] ?? '',
    ]),
  ) as Localized<string>
}

function countSeedMediaRefs(value: unknown): number {
  if (!value || typeof value !== 'object') {
    return 0
  }

  return (JSON.stringify(value).match(/"kind":"image"|"kind":"video"|"src":/g) ?? []).length
}

function managedOfferSummary(
  entry: ServiceEntity | CourseEntity | CollectionEntity | PortfolioCaseEntity | TransformationOfferEntity,
): ManagedContentSummary {
  return {
    id: `${entry.kind}:${entry.slug}`,
    kind: entry.kind,
    slug: entry.slug,
    title: entry.title,
    state: entry.kind === 'transformation' && entry.slug === 'fashion-retreat' ? 'review' : 'published',
    updatedAt: defaultTimeline.updatedAt,
    ownerName: editorialOwner.name,
    localeCoverage: ['uk', 'en', 'ru'] as Locale[],
    mediaCount: countSeedMediaRefs(entry),
    to: `/admin/content/${entry.kind}/${entry.slug}`,
  }
}

function managedOfferRecord(
  kind: 'service' | 'course' | 'collection' | 'portfolio' | 'transformation',
  slug: string,
): ManagedContentRecord | undefined {
  type SeedOffer = ServiceEntity | CourseEntity | CollectionEntity | PortfolioCaseEntity | TransformationOfferEntity
  type SeedGetter = (locale: Locale) => SeedOffer[]

  const getter: SeedGetter =
    kind === 'service'
      ? (locale) => getSeedServices(locale)
      : kind === 'course'
        ? getSeedCourses
        : kind === 'collection'
          ? getSeedCollections
          : kind === 'portfolio'
            ? getSeedPortfolio
            : getSeedTransformations

  const entity = getter('en').find((entry) => entry.slug === slug)
  if (!entity) {
    return undefined
  }

  const previewPath =
    entity.kind === 'service'
      ? `/en/${entity.area}/${entity.slug}`
      : entity.kind === 'collection'
        ? `/en/collections/${entity.slug}`
        : entity.kind === 'portfolio'
          ? `/en/portfolio/${entity.slug}`
          : entity.kind === 'course'
            ? '/en/school'
            : '/en/transformation'

  const workflowNotes =
    entity.kind === 'service'
      ? [
          'Pricing, cover media, and editorial metadata are loaded from the public JSON seed.',
          'Admin edits persist as JSON overlay fields before falling back to the seed.',
        ]
      : entity.kind === 'course'
        ? ['Course card data is loaded from the public JSON seed and can be edited through the overlay.']
        : entity.kind === 'collection'
          ? ['Collection title, summary, price note, CTA, and cover media resolve from seed plus overlay.']
          : entity.kind === 'portfolio'
            ? ['Portfolio case title, summary, category, CTA, and cover media resolve from seed plus overlay.']
            : ['Transformation offer title, summary, format, CTA, and cover media resolve from seed plus overlay.']

  return {
    id: `${kind}:${slug}`,
    kind,
    slug,
    meta: createMeta(kind, slug, {
      hasUnpublishedChanges: kind === 'transformation' && slug === 'fashion-retreat',
    }),
    localizations: toLocalizedStatuses(
      localizedOfferField(getter, slug, 'title'),
      localizedOfferField(getter, slug, 'summary'),
    ),
    previewPath,
    workflowNotes,
    raw: {
      publicEntity: entity,
      seedSource: 'src/content/seed/public-posts.seed.json',
    },
  }
}

function buildManagedContentIndex(locale: Locale): ManagedContentSummary[] {
  const pages = Object.entries(getPageTitleMatrix()).map(([slug, titles]) => ({
    id: `page:${slug}`,
    kind: 'page' as const,
    slug,
    title: titles[locale],
    state: 'published' as const,
    updatedAt: defaultTimeline.updatedAt,
    ownerName: editorialOwner.name,
    localeCoverage: ['uk', 'en', 'ru'] as Locale[],
    mediaCount: slug === 'portfolio' ? 3 : 0,
    to: `/admin/content/page/${slug}`,
  }))

  const serviceSummaries = getSeedServices(locale).map((entry) => managedOfferSummary(entry))
  const courseSummaries = getSeedCourses(locale).map((entry) => managedOfferSummary(entry))
  const collectionSummaries = getSeedCollections(locale).map((entry) => managedOfferSummary(entry))
  const portfolioSummaries = getSeedPortfolio(locale).map((entry) => managedOfferSummary(entry))
  const transformationSummaries = getSeedTransformations(locale).map((entry) => managedOfferSummary(entry))

  const settingsSummary = {
    id: studioSettings.id,
    kind: 'settings' as const,
    slug: studioSettings.slug,
    title: locale === 'uk' ? 'Налаштування студії' : locale === 'ru' ? 'Настройки студии' : 'Studio settings',
    state: studioSettings.meta.lifecycle.state,
    updatedAt: studioSettings.meta.updatedAt,
    ownerName: studioSettings.meta.owner.name,
    localeCoverage: ['uk', 'en', 'ru'] as Locale[],
    mediaCount: 0,
    to: `/admin/content/settings/${studioSettings.slug}`,
  }

  const mediaAssets = [
    ...Object.values(collectionMedia).flatMap((gallery) => gallery.items.map((item) => item.asset)),
    ...Object.values(portfolioMedia).flatMap((gallery) => gallery.items.map((item) => item.asset)),
    ...Object.values(courseMedia).flatMap((gallery) => gallery.items.map((item) => item.asset)),
    ...Object.values(serviceMedia).flatMap((gallery) => gallery.items.map((item) => item.asset)),
  ]

  const mediaSummaries = mediaAssets.map((asset) => ({
    id: `media:${asset.id}`,
    kind: 'media' as const,
    slug: asset.id,
    title: asset.title,
    state: 'published' as const,
    updatedAt: defaultTimeline.updatedAt,
    ownerName: systemOwner.name,
    localeCoverage: ['uk', 'en', 'ru'] as Locale[],
    mediaCount: 1,
    to: `/admin/content/media/${asset.id}`,
  }))

  return [
    ...pages,
    ...serviceSummaries,
    ...courseSummaries,
    ...collectionSummaries,
    ...portfolioSummaries,
    ...transformationSummaries,
    settingsSummary,
    ...mediaSummaries,
  ]
}

function buildAdminNavigation(locale: Locale): AdminNavItem[] {
  const index = buildManagedContentIndex(locale)
  const label = (uk: string, en: string, ru: string) => (locale === 'uk' ? uk : locale === 'ru' ? ru : en)

  return [
    {
      kind: 'page',
      label: label('Сторінки', 'Pages', 'Страницы'),
      description: label('Головна та секційні сторінки', 'Home and section documents', 'Главная и секционные страницы'),
      count: index.filter((item) => item.kind === 'page').length,
      to: '/admin/content/page',
    },
    {
      kind: 'service',
      label: label('Послуги', 'Services', 'Услуги'),
      description: label('Research та Realisation офери', 'Research and Realisation offers', 'Research и Realisation офферы'),
      count: index.filter((item) => item.kind === 'service').length,
      to: '/admin/content/service',
    },
    {
      kind: 'course',
      label: label('Курси', 'Courses', 'Курсы'),
      description: label('Каталог школи PURITY', 'PURITY school catalog', 'Каталог школы PURITY'),
      count: index.filter((item) => item.kind === 'course').length,
      to: '/admin/content/course',
    },
    {
      kind: 'collection',
      label: label('Колекції', 'Collections', 'Коллекции'),
      description: label('Editorial колекції та галереї', 'Editorial collections and galleries', 'Editorial коллекции и галереи'),
      count: index.filter((item) => item.kind === 'collection').length,
      to: '/admin/content/collection',
    },
    {
      kind: 'portfolio',
      label: label('Портфоліо', 'Portfolio', 'Портфолио'),
      description: label('Кейси, galleries, video embeds', 'Cases, galleries, and video embeds', 'Кейсы, галереи и video embeds'),
      count: index.filter((item) => item.kind === 'portfolio').length,
      to: '/admin/content/portfolio',
    },
    {
      kind: 'transformation',
      label: label('Трансформація', 'Transformation', 'Трансформация'),
      description: label('Waitlist та special offers', 'Waitlist and special offers', 'Waitlist и special offers'),
      count: index.filter((item) => item.kind === 'transformation').length,
      to: '/admin/content/transformation',
    },
    {
      kind: 'media',
      label: label('Медіа', 'Media', 'Медиа'),
      description: label('Images, gallery covers, video posters', 'Images, gallery covers, video posters', 'Изображения, обложки галерей, video posters'),
      count: index.filter((item) => item.kind === 'media').length,
      to: '/admin/content/media',
    },
    {
      kind: 'settings',
      label: label('Налаштування', 'Settings', 'Настройки'),
      description: label('Студійні контакти та системні поля', 'Studio contacts and system fields', 'Студийные контакты и системные поля'),
      count: 1,
      to: '/admin/content/settings',
    },
  ]
}

function buildManagedContentRecord(kind: ManagedContentSummary['kind'], slug: string): ManagedContentRecord | undefined {
  if (kind === 'page') {
    const titles = getPageTitleMatrix()
    const summaries = getPageSummaryMatrix()
    if (!(slug in titles) || !(slug in summaries)) {
      return undefined
    }

    const pageMap: Record<string, unknown> = {
      home: homePages,
      research: listingPages.research,
      realisation: listingPages.realisation,
      transformation: listingPages.transformation,
      collections: listingPages.collections,
      school: schoolPages,
      portfolio: portfolioPages,
      contacts: contactsPages,
    }

    return buildPageRecord(
      slug,
      titles[slug as keyof typeof titles],
      summaries[slug as keyof typeof summaries],
      pageMap[slug],
      slug === 'home' ? '/en' : `/en/${slug}`,
    )
  }

  if (
    kind === 'service' ||
    kind === 'course' ||
    kind === 'collection' ||
    kind === 'portfolio' ||
    kind === 'transformation'
  ) {
    return managedOfferRecord(kind, slug)
  }

  if (kind === 'settings' && slug === studioSettings.slug) {
    return {
      id: studioSettings.id,
      kind,
      slug,
      meta: studioSettings.meta,
      localizations: [
        { locale: 'uk', title: 'Налаштування студії', summary: studioSettings.contactEmail, isComplete: true },
        { locale: 'en', title: 'Studio settings', summary: studioSettings.contactEmail, isComplete: true },
        { locale: 'ru', title: 'Настройки студии', summary: studioSettings.contactEmail, isComplete: true },
      ],
      previewPath: '/en/contacts',
      workflowNotes: ['Contacts, social links, and map metadata should move to a write-capable settings repository.'],
      raw: studioSettings,
    }
  }

  if (kind === 'media') {
    const asset = buildManagedContentIndex('en').find((entry) => entry.kind === 'media' && entry.slug === slug)
    if (!asset) {
      return undefined
    }

    return {
      id: asset.id,
      kind,
      slug,
      meta: createMeta(kind, slug, { owner: systemOwner }),
      localizations: [
        { locale: 'uk', title: asset.title, summary: 'Shared media asset', isComplete: true },
        { locale: 'en', title: asset.title, summary: 'Shared media asset', isComplete: true },
        { locale: 'ru', title: asset.title, summary: 'Shared media asset', isComplete: true },
      ],
      previewPath: undefined,
      workflowNotes: ['Media records are scaffold-only and still live in code-backed asset manifests.'],
      raw: asset,
    }
  }

  return undefined
}

export function getUiCopy(locale: Locale) {
  return ui[locale]
}

export function getHomeContent(locale: Locale): HomePageData {
  return {
    id: 'page:home',
    kind: 'page',
    slug: 'home',
    ...homePages[locale],
    meta: getPageMeta('home'),
  }
}

export function getListingPageContent(
  locale: Locale,
  kind: keyof typeof listingPages,
): ListingPageData {
  return {
    id: `page:${kind}`,
    kind: 'page',
    slug: kind,
    ...listingPages[kind][locale],
    meta: getPageMeta(kind),
  }
}

export function getSchoolContent(locale: Locale): SchoolPageData {
  return {
    id: 'page:school',
    kind: 'page',
    slug: 'school',
    ...schoolPages[locale],
    meta: getPageMeta('school'),
  }
}

export function getPortfolioContent(locale: Locale): PortfolioPageData {
  return {
    id: 'page:portfolio',
    kind: 'page',
    slug: 'portfolio',
    ...portfolioPages[locale],
    meta: getPageMeta('portfolio'),
  }
}

export function getContactsContent(locale: Locale): ContactsPageData {
  return {
    id: 'page:contacts',
    kind: 'page',
    slug: 'contacts',
    ...contactsPages[locale],
    meta: getPageMeta('contacts'),
  }
}

export function getCourses(locale: Locale): CourseEntity[] {
  return getSeedCourses(locale)
}

export function getTransformations(locale: Locale): TransformationOfferEntity[] {
  return getSeedTransformations(locale)
}

export function getCollections(locale: Locale): CollectionEntity[] {
  return getSeedCollections(locale)
}

export function getPortfolio(locale: Locale): PortfolioCaseEntity[] {
  return getSeedPortfolio(locale)
}

export function getPortfolioCaseBySlug(locale: Locale, slug: string) {
  return getSeedPortfolio(locale).find((entry) => entry.slug === slug)
}

export function getServices(locale: Locale): ServiceEntity[] {
  return getSeedServices(locale)
}

export function getStudioSettings() {
  return studioSettings
}

export function getAdminNavigation(locale: Locale) {
  return buildAdminNavigation(locale)
}

export function getManagedContentIndex(locale: Locale, kind?: ManagedContentSummary['kind']) {
  const index = buildManagedContentIndex(locale)
  return kind ? index.filter((entry) => entry.kind === kind) : index
}

export function getManagedContentRecord(
  _locale: Locale,
  kind: ManagedContentSummary['kind'],
  slug: string,
) {
  return buildManagedContentRecord(kind, slug)
}
