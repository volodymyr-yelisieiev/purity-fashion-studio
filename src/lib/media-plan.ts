import type { Locale } from './types'
import { photoKey } from './media-refs'

export type PlannedImage = {
  src: string
  alt: string
  caption?: string
}

export type MediaOverrideGroup = 'service' | 'course' | 'collection' | 'portfolio' | 'transformation'

export type LocalizedCopyOverride = {
  title?: string
  eyebrow?: string
}

export const entityMediaOverrides: Record<MediaOverrideGroup, Record<string, PlannedImage>> = {
  service: {
    'personal-lookbook': {
      src: '/images/stylist-lookbook.jpeg',
      alt: 'Stylist preparing a personal lookbook at PURITY',
      caption: 'Personal lookbook / stylist work',
    },
    'wardrobe-review': {
      src: '/images/wardrobe-review.jpeg',
      alt: 'Wardrobe review process with selected garments',
      caption: 'Wardrobe review / edit',
    },
    'shopping-service': {
      src: '/images/shopping-service.jpeg',
      alt: 'Shopping route and curated wardrobe selection',
      caption: 'Shopping service / route',
    },
    'atelier-service': {
      src: '/images/atelier-workshop.jpeg',
      alt: 'PURITY atelier workshop and tailoring process',
      caption: 'Atelier / workshop',
    },
  },
  course: {
    'dress-for-victory-course': {
      src: '/images/stylist-editorial.jpeg',
      alt: 'Editorial dress work for a PURITY course',
      caption: 'Dress course / editorial work',
    },
    'draping-moulage': {
      src: '/images/atelier-detail.jpeg',
      alt: 'Draping and atelier detail work',
      caption: 'Draping / form creation',
    },
    'wardrobe-management': {
      src: '/images/wardrobe-system.jpeg',
      alt: 'Wardrobe system and visual planning board',
      caption: 'Wardrobe management / system',
    },
  },
  collection: {
    'dress-for-victory': {
      src: '/images/portfolio-black-look.jpeg',
      alt: 'Editorial dress silhouette by PURITY',
      caption: 'Dress for Victory / editorial silhouette',
    },
    'retreat-wear': {
      src: '/images/purity_7.webp',
      alt: 'Soft retreat wear editorial portrait',
      caption: 'Retreat Wear / soft layer',
    },
    'travel-capsule': {
      src: '/images/shopping-fitting.jpeg',
      alt: 'Travel capsule fitting and styling detail',
      caption: 'Travel Capsule / fitting',
    },
    'silky-touches': {
      src: '/images/purity_2.webp',
      alt: 'Silky Touches cruise layer editorial portrait',
      caption: 'Silky Touches / cruise layer',
    },
  },
  portfolio: {
    'soft-power-capsule': {
      src: '/images/stylist-consultation.jpeg',
      alt: 'Stylist consultation and personal image work',
      caption: 'Soft Power Capsule / consultation',
    },
    'editorial-corporate-shoot': {
      src: '/images/concept-team.jpeg',
      alt: 'PURITY team and editorial image direction',
      caption: 'Corporate editorial / team image',
    },
    'bridal-reset': {
      src: '/images/purity_6.webp',
      alt: 'Atelier fitting detail for a special occasion piece',
      caption: 'Bridal Reset / atelier detail',
    },
  },
  transformation: {
    'dress-of-victory': {
      src: '/images/purity_5.webp',
      alt: 'Dress of Victory editorial transformation',
      caption: 'Dress of Victory / transformation',
    },
    'wholeness-photomeditation': {
      src: '/images/purity_1.webp',
      alt: 'Transformational image work and archetype direction',
      caption: 'Wholeness / image practice',
    },
    'fashion-retreat': {
      src: '/images/concept-atelier.jpeg',
      alt: 'PURITY concept space for retreat and transformation work',
      caption: 'Fashion retreat / concept space',
    },
  },
}

export const galleryMediaOverrides: Record<'collection' | 'portfolio', Record<string, PlannedImage[]>> = {
  collection: {
    'dress-for-victory': [
      { src: '/images/collection-dfv-gallery-01.svg', alt: 'Abstract Dress for Victory gallery study', caption: 'Editorial fitting' },
      { src: '/images/collection-dfv-gallery-02.svg', alt: 'Abstract Dress for Victory event silhouette', caption: 'Event silhouette' },
      { src: '/images/collection-dfv-gallery-03.svg', alt: 'Abstract Dress for Victory gesture study', caption: 'Victory gesture' },
    ],
    'retreat-wear': [
      { src: '/images/collection-retreat-gallery-01.svg', alt: 'Abstract Retreat Wear morning layer', caption: 'Morning layer' },
      { src: '/images/collection-retreat-gallery-02.svg', alt: 'Abstract Retreat Wear soft robe', caption: 'Soft robe' },
      { src: '/images/collection-retreat-gallery-03.svg', alt: 'Abstract Retreat Wear jersey set', caption: 'Stretch jersey set' },
    ],
    'travel-capsule': [
      { src: '/images/collection-travel-gallery-01.svg', alt: 'Abstract Travel Capsule five-piece edit', caption: 'Five-piece edit' },
      { src: '/images/collection-travel-gallery-02.svg', alt: 'Abstract Travel Capsule airport drape', caption: 'Airport drape' },
      { src: '/images/collection-travel-gallery-03.svg', alt: 'Abstract Travel Capsule evening reset', caption: 'Evening reset' },
    ],
    'silky-touches': [
      { src: '/images/collection-silky-gallery-01.svg', alt: 'Abstract Silky Touches cruise look', caption: 'Cruise layer' },
      { src: '/images/collection-silky-gallery-02.svg', alt: 'Abstract Silky Touches yoga look', caption: 'Yoga everywhere' },
      { src: '/images/collection-silky-gallery-03.svg', alt: 'Abstract Silky Touches chiffon column', caption: 'Chiffon column' },
    ],
  },
  portfolio: {
    'soft-power-capsule': [
      { src: '/images/portfolio-soft-gallery-01.svg', alt: 'Abstract Soft Power Capsule portrait', caption: 'Reset portrait' },
      { src: '/images/portfolio-soft-gallery-02.svg', alt: 'Abstract Soft Power Capsule movement', caption: 'Capsule movement' },
      { src: '/images/portfolio-soft-gallery-03.svg', alt: 'Abstract Soft Power Capsule after styling', caption: 'After styling' },
    ],
    'editorial-corporate-shoot': [
      { src: '/images/portfolio-corporate-gallery-01.svg', alt: 'Abstract corporate campaign frame', caption: 'Campaign frame' },
      { src: '/images/portfolio-corporate-gallery-02.svg', alt: 'Abstract corporate fabric detail', caption: 'Fabric detail' },
      { src: '/images/portfolio-corporate-gallery-03.svg', alt: 'Abstract corporate event look', caption: 'Event look' },
    ],
    'bridal-reset': [
      { src: '/images/portfolio-bridal-gallery-01.svg', alt: 'Abstract Bridal Reset atelier fitting', caption: 'Atelier fitting' },
      { src: '/images/portfolio-bridal-gallery-02.svg', alt: 'Abstract Bridal Reset event silhouette', caption: 'Event silhouette' },
      { src: '/images/portfolio-bridal-gallery-03.svg', alt: 'Abstract Bridal Reset after-event look', caption: 'After-event look' },
    ],
  },
}

export const localizedCopyOverrides: Partial<
  Record<Locale, { service: Record<string, LocalizedCopyOverride> }>
> = {
  uk: {
    service: {
      'personal-lookbook': {
        title: 'Персональний lookbook',
        eyebrow: 'Палітра + стратегія крою',
      },
      'wardrobe-review': {
        title: 'Ревізія гардероба',
        eyebrow: 'Капсульна ревізія',
      },
      'shopping-service': {
        title: 'Shopping-супровід',
        eyebrow: 'Онлайн-план або живий супровід',
      },
      'atelier-service': {
        title: 'Atelier-сервіс',
        eyebrow: 'Dossier / couture-пошив',
      },
    },
  },
  ru: {
    service: {
      'personal-lookbook': {
        title: 'Персональный lookbook',
        eyebrow: 'Палитра + стратегия кроя',
      },
      'wardrobe-review': {
        title: 'Ревизия гардероба',
        eyebrow: 'Капсульная ревизия',
      },
      'shopping-service': {
        title: 'Shopping-сопровождение',
        eyebrow: 'Онлайн-план или живое сопровождение',
      },
      'atelier-service': {
        title: 'Atelier-сервис',
        eyebrow: 'Dossier / couture-пошив',
      },
    },
  },
}

export const pageMedia = {
  home: {
    src: '/images/abstract-atelier-grid.svg',
    alt: 'Abstract PURITY atelier grid',
    caption: 'Kyiv editorial direction',
  },
  research: {
    src: '/images/abstract-research-01.svg',
    alt: 'Abstract lookbook research composition',
    caption: 'Research / Form / Silhouette',
  },
  realisation: {
    src: '/images/abstract-realisation-01.svg',
    alt: 'Abstract atelier realisation composition',
    caption: 'Atelier / fitting / couture',
  },
  transformation: {
    src: '/images/abstract-transform-01.svg',
    alt: 'Abstract transformation ritual composition',
    caption: 'Transformation / ritual / styling',
  },
  collections: {
    src: '/images/abstract-collections-01.svg',
    alt: 'Abstract PURITY collection study',
    caption: 'Collections / editorial pieces',
  },
  school: {
    src: '/images/abstract-school-01.svg',
    alt: 'Abstract draping and school study',
    caption: 'School / study / transformation',
  },
  portfolio: {
    src: '/images/abstract-portfolio-01.svg',
    alt: 'Abstract selected portfolio frame',
    caption: 'Portfolio / selected cases',
  },
  contactsIntro: {
    src: '/images/abstract-contact-space.svg',
    alt: 'Abstract PURITY studio contact composition',
  },
  contactsAside: {
    src: '/images/abstract-studio-light.svg',
    alt: 'Abstract PURITY studio light composition',
  },
  bookingDefault: {
    src: '/images/abstract-booking-note.svg',
    alt: 'Abstract PURITY booking request',
  },
} satisfies Record<string, PlannedImage>

export const homeMedia = {
  heroLeft: {
    src: '/images/abstract-silk-fold.svg',
    alt: 'Abstract silk fold composition',
  },
  heroRight: {
    src: '/images/abstract-pattern-board.svg',
    alt: 'Abstract fashion pattern board composition',
  },
  direction: {
    atelier: {
      src: '/images/abstract-thread-line.svg',
      alt: 'Abstract atelier thread line',
    },
    collection: {
      src: '/images/abstract-capsule-map.svg',
      alt: 'Abstract capsule wardrobe map',
    },
    school: {
      src: '/images/abstract-school-moulage.svg',
      alt: 'Abstract moulage study',
    },
  },
  atelierFeature: {
    src: '/images/abstract-swatch-ivory.svg',
    alt: 'Abstract ivory atelier swatch',
  },
  servicePreview: {
    research: [
      { src: '/images/abstract-service-palette.svg', alt: 'Abstract personal palette and lookbook study' },
      { src: '/images/abstract-portfolio-frame.svg', alt: 'Abstract wardrobe review frame' },
    ],
    realisation: [
      { src: '/images/abstract-shopping-route.svg', alt: 'Abstract shopping route composition' },
      { src: '/images/abstract-service-tailoring.svg', alt: 'Abstract tailoring and atelier service study' },
    ],
  },
  collectionPreview: [
    { src: '/images/abstract-collection-study.svg', alt: 'Abstract collection study' },
    { src: '/images/abstract-swatch-pearl.svg', alt: 'Abstract pearl collection swatch' },
    { src: '/images/abstract-form-study.svg', alt: 'Abstract form study' },
  ],
  portfolioPreview: [
    { src: '/images/abstract-ritual-circle.svg', alt: 'Abstract portfolio ritual circle' },
    { src: '/images/abstract-lookbook-paper.svg', alt: 'Abstract lookbook paper composition' },
    { src: '/images/abstract-wardrobe-index.svg', alt: 'Abstract wardrobe index composition' },
  ],
} satisfies {
  heroLeft: PlannedImage
  heroRight: PlannedImage
  direction: Record<'atelier' | 'collection' | 'school', PlannedImage>
  atelierFeature: PlannedImage
  servicePreview: Record<'research' | 'realisation', PlannedImage[]>
  collectionPreview: PlannedImage[]
  portfolioPreview: PlannedImage[]
}

export const listingProcessMedia = {
  research: [
    { src: '/images/abstract-research-02.svg', alt: 'Abstract research fabric fold' },
    { src: '/images/abstract-research-03.svg', alt: 'Abstract research thread line' },
    { src: '/images/abstract-couture-seam.svg', alt: 'Abstract couture seam detail' },
  ],
  realisation: [
    { src: '/images/abstract-realisation-02.svg', alt: 'Abstract realisation board' },
    { src: '/images/abstract-realisation-03.svg', alt: 'Abstract realisation swatch' },
    { src: '/images/abstract-drape-shadow.svg', alt: 'Abstract drape shadow' },
  ],
  school: [
    { src: '/images/abstract-school-02.svg', alt: 'Abstract school fabric fold' },
    { src: '/images/abstract-school-03.svg', alt: 'Abstract school grid' },
    { src: '/images/abstract-school-04.svg', alt: 'Abstract school study line' },
  ],
  transformation: [
    { src: '/images/abstract-transform-02.svg', alt: 'Abstract transformation line' },
    { src: '/images/abstract-transform-03.svg', alt: 'Abstract transformation drape' },
    { src: '/images/abstract-transform-04.svg', alt: 'Abstract transformation light' },
  ],
} satisfies Record<string, PlannedImage[]>

export const listingPreviewMedia = {
  collections: [
    { src: '/images/abstract-collections-02.svg', alt: 'Abstract collection board' },
    { src: '/images/abstract-collections-03.svg', alt: 'Abstract collection fabric fold' },
    { src: '/images/abstract-collections-04.svg', alt: 'Abstract collection swatch' },
  ],
  portfolio: [
    { src: '/images/abstract-portfolio-02.svg', alt: 'Abstract portfolio line' },
    { src: '/images/abstract-portfolio-03.svg', alt: 'Abstract portfolio drape' },
    { src: '/images/abstract-portfolio-04.svg', alt: 'Abstract portfolio pattern board' },
  ],
} satisfies Record<string, PlannedImage[]>

export function plannedImageAt(images: PlannedImage[], index: number, fallback: PlannedImage) {
  return images[index] ?? fallback
}

export function plannedMediaRefs() {
  return [
    ...Object.entries(pageMedia).map(([owner, image]) => ({ owner: `page:${owner}`, image })),
    { owner: 'home:heroLeft', image: homeMedia.heroLeft },
    { owner: 'home:heroRight', image: homeMedia.heroRight },
    { owner: 'home:atelierFeature', image: homeMedia.atelierFeature },
    ...Object.entries(homeMedia.direction).map(([owner, image]) => ({ owner: `home:direction:${owner}`, image })),
    ...Object.entries(homeMedia.servicePreview).flatMap(([owner, images]) =>
      images.map((image, index) => ({ owner: `home:servicePreview:${owner}:${index}`, image })),
    ),
    ...homeMedia.collectionPreview.map((image, index) => ({ owner: `home:collectionPreview:${index}`, image })),
    ...homeMedia.portfolioPreview.map((image, index) => ({ owner: `home:portfolioPreview:${index}`, image })),
    ...Object.entries(listingProcessMedia).flatMap(([owner, images]) =>
      images.map((image, index) => ({ owner: `process:${owner}:${index}`, image })),
    ),
    ...Object.entries(listingPreviewMedia).flatMap(([owner, images]) =>
      images.map((image, index) => ({ owner: `preview:${owner}:${index}`, image })),
    ),
    ...Object.entries(entityMediaOverrides).flatMap(([kind, entries]) =>
      Object.entries(entries).map(([slug, image]) => ({ owner: `${kind}:${slug}`, image })),
    ),
    ...Object.entries(galleryMediaOverrides).flatMap(([kind, entries]) =>
      Object.entries(entries).flatMap(([slug, images]) =>
        images.map((image, index) => ({ owner: `${kind}:${slug}:gallery:${index}`, image })),
      ),
    ),
  ]
}

export function plannedMediaOwners() {
  return new Map(plannedMediaRefs().map(({ owner, image }) => [photoKey(image.src), owner]))
}

export function isReservedMediaForDifferentOwner(src: string, owner: string) {
  const reservedOwner = plannedMediaOwners().get(photoKey(src))

  return Boolean(reservedOwner && reservedOwner !== owner)
}
