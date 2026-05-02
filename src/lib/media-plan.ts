import type { Locale } from './types'
import { photoKey } from './media-refs'

export type PlannedImage = {
  id?: string
  owner?: string
  src: string
  alt: string
  caption?: string
  aspect?: 'landscape' | 'portrait' | 'square' | 'wide'
  focalPoint?: { x: number; y: number }
  generated?: {
    model: string
    promptId: string
    reviewed: boolean
  }
}

export type MediaOverrideGroup = 'service' | 'course' | 'collection' | 'portfolio' | 'transformation'

export type LocalizedCopyOverride = {
  title?: string
  eyebrow?: string
}

type GeneratedImageArgs = Omit<PlannedImage, 'src' | 'generated'> & {
  id: string
  owner: string
  alt: string
  promptId?: 'atelier-atlas-v1' | 'hero-sequence-v1'
}

function generatedImage({
  id,
  owner,
  alt,
  caption,
  aspect = 'square',
  focalPoint,
  promptId = 'atelier-atlas-v1',
}: GeneratedImageArgs): PlannedImage {
  return {
    id,
    owner,
    src: `/images/generated/${id}.webp`,
    alt,
    caption,
    aspect,
    focalPoint,
    generated: {
      model: 'gpt-image-2',
      promptId,
      reviewed: true,
    },
  }
}

const atlasImage = (
  id: string,
  owner: string,
  alt: string,
  aspect: PlannedImage['aspect'] = 'square',
  focalPoint?: PlannedImage['focalPoint'],
  caption?: string,
) => generatedImage({ id, owner, alt, aspect, focalPoint, caption, promptId: 'atelier-atlas-v1' })

const heroStageImage = (
  id: string,
  owner: string,
  alt: string,
  aspect: PlannedImage['aspect'] = 'portrait',
  focalPoint?: PlannedImage['focalPoint'],
  caption?: string,
) => generatedImage({ id, owner, alt, aspect, focalPoint, caption, promptId: 'hero-sequence-v1' })

const slotImage = (
  id: string,
  owner: string,
  alt: string,
  aspect: PlannedImage['aspect'] = 'square',
  focalPoint?: PlannedImage['focalPoint'],
  caption?: string,
) => generatedImage({ id, owner, alt, aspect, focalPoint, caption, promptId: 'atelier-atlas-v1' })

const heroLayerImage = (
  id: string,
  owner: string,
  alt: string,
  caption?: string,
): PlannedImage => ({
  id,
  owner,
  src: `/images/generated/${id}.webp`,
  alt,
  caption,
  aspect: 'portrait',
  focalPoint: { x: 50, y: 42 },
  generated: {
    model: 'gpt-image-2',
    promptId: 'hero-sequence-v1',
    reviewed: true,
  },
})

export const entityMediaOverrides: Record<MediaOverrideGroup, Record<string, PlannedImage>> = {
  service: {
    'personal-lookbook': slotImage(
      'purity-service-lookbook',
      'service:personal-lookbook',
      'Ivory and black palette study arranged for a personal lookbook',
      'square',
      { x: 50, y: 48 },
      'Personal lookbook / palette study',
    ),
    'wardrobe-review': slotImage(
      'purity-service-review',
      'service:wardrobe-review',
      'Folded pattern paper and muslin for a wardrobe review system',
      'square',
      { x: 52, y: 42 },
      'Wardrobe review / structure',
    ),
    'shopping-service': slotImage(
      'purity-service-shopping',
      'service:shopping-service',
      'Layered atelier route board for a shopping service',
      'square',
      { x: 48, y: 44 },
      'Shopping service / route planning',
    ),
    'atelier-service': slotImage(
      'purity-service-atelier',
      'service:atelier-service',
      'Pinned ivory muslin construction for atelier service work',
      'square',
      { x: 50, y: 34 },
      'Atelier / pinned construction',
    ),
  },
  course: {
    'dress-for-victory-course': slotImage(
      'purity-course-dress-victory',
      'course:dress-for-victory-course',
      'Sculptural ivory dress study for the Dress for Victory course',
      'portrait',
      { x: 50, y: 34 },
      'Dress course / abstract drape',
    ),
    'draping-moulage': slotImage(
      'purity-course-draping',
      'course:draping-moulage',
      'Raw ivory draping construction pinned for moulage study',
      'portrait',
      { x: 50, y: 36 },
      'Draping / moulage study',
    ),
    'wardrobe-management': slotImage(
      'purity-course-wardrobe',
      'course:wardrobe-management',
      'Wardrobe system materials arranged as an atelier study',
      'portrait',
      { x: 48, y: 44 },
      'Wardrobe management / visual system',
    ),
  },
  collection: {
    'dress-for-victory': slotImage(
      'purity-collection-dress-for-victory',
      'collection:dress-for-victory',
      'Final abstract ivory drape for the Dress for Victory collection',
      'portrait',
      { x: 50, y: 34 },
      'Dress for Victory / abstract drape',
    ),
    'retreat-wear': slotImage(
      'purity-collection-retreat-wear',
      'collection:retreat-wear',
      'Sheer monochrome retreat wear textile study on a pale form',
      'portrait',
      { x: 45, y: 48 },
      'Retreat Wear / sheer layer',
    ),
    'travel-capsule': slotImage(
      'purity-collection-travel-capsule',
      'collection:travel-capsule',
      'Raw ivory travel drape construction pinned on a mannequin',
      'portrait',
      { x: 50, y: 36 },
      'Travel Capsule / travel drape',
    ),
    'silky-touches': slotImage(
      'purity-collection-silky-touches',
      'collection:silky-touches',
      'Ivory silk-touch textile drape with subtle tailor marks',
      'portrait',
      { x: 54, y: 40 },
      'Silky Touches / fabric study',
    ),
  },
  portfolio: {
    'soft-power-capsule': slotImage(
      'purity-portfolio-soft-power',
      'portfolio:soft-power-capsule',
      'Soft power capsule silhouette study with black atelier markings',
      'portrait',
      { x: 48, y: 38 },
      'Soft Power Capsule / silhouette study',
    ),
    'editorial-corporate-shoot': slotImage(
      'purity-portfolio-corporate-shoot',
      'portfolio:editorial-corporate-shoot',
      'Editorial corporate shoot concept board in monochrome atelier materials',
      'portrait',
      { x: 52, y: 48 },
      'Corporate editorial / sketch system',
    ),
    'bridal-reset': slotImage(
      'purity-portfolio-bridal-reset',
      'portfolio:bridal-reset',
      'Bridal reset construction study in raw ivory muslin',
      'portrait',
      { x: 50, y: 42 },
      'Bridal Reset / construction detail',
    ),
  },
  transformation: {
    'dress-of-victory': slotImage(
      'purity-transformation-dress-victory',
      'transformation:dress-of-victory',
      'Sculptural ivory drape on an abstract tailor form',
      'portrait',
      { x: 50, y: 34 },
      'Dress of Victory / abstract transformation',
    ),
    'wholeness-photomeditation': slotImage(
      'purity-transformation-wholeness',
      'transformation:wholeness-photomeditation',
      'Soft atelier light and silhouette study for wholeness photomeditation',
      'portrait',
      { x: 58, y: 54 },
      'Wholeness / silhouette meditation',
    ),
    'fashion-retreat': slotImage(
      'purity-transformation-retreat',
      'transformation:fashion-retreat',
      'Fashion retreat textile ritual study in monochrome atelier materials',
      'portrait',
      { x: 50, y: 48 },
      'Fashion retreat / atelier texture',
    ),
  },
}

export const galleryMediaOverrides: Record<'collection' | 'portfolio', Record<string, PlannedImage[]>> = {
  collection: {
    'dress-for-victory': [
      heroStageImage('home-hero-pattern-thread', 'collection:dress-for-victory:gallery:0', 'Tailor mannequin with black pattern lines and pins', 'portrait', { x: 50, y: 36 }, 'Pattern / thread'),
      heroStageImage('home-hero-fabric-construction', 'collection:dress-for-victory:gallery:1', 'Raw ivory fabric construction on a mannequin', 'portrait', { x: 50, y: 36 }, 'Muslin construction'),
      heroStageImage('home-hero-abstract-drape', 'collection:dress-for-victory:gallery:2', 'Final abstract ivory drape on a mannequin', 'portrait', { x: 50, y: 34 }, 'Abstract drape'),
    ],
    'retreat-wear': [
      atlasImage('sheer-drape-study', 'collection:retreat-wear:gallery:0', 'Sheer fabric study on a pale mannequin form', 'square', { x: 45, y: 48 }, 'Sheer study'),
      atlasImage('swatch-stack', 'collection:retreat-wear:gallery:1', 'Ivory and black fabric swatch stack', 'square', { x: 50, y: 48 }, 'Swatch stack'),
      atlasImage('studio-shadow-form', 'collection:retreat-wear:gallery:2', 'Soft atelier shadow and mannequin silhouette', 'square', { x: 58, y: 54 }, 'Studio light'),
    ],
    'travel-capsule': [
      atlasImage('pattern-paper-folds', 'collection:travel-capsule:gallery:0', 'Folded pattern paper with black drafting lines', 'square', { x: 48, y: 44 }, 'Pattern map'),
      atlasImage('thread-spool', 'collection:travel-capsule:gallery:1', 'Ivory thread spool and loose thread on a studio table', 'square', { x: 44, y: 52 }, 'Thread route'),
      atlasImage('folded-pattern-scroll', 'collection:travel-capsule:gallery:2', 'Folded pattern paper and raw muslin scroll', 'square', { x: 52, y: 42 }, 'Folded system'),
    ],
    'silky-touches': [
      atlasImage('fabric-shoulder-drape', 'collection:silky-touches:gallery:0', 'Ivory shoulder drape with subtle atelier markings', 'square', { x: 54, y: 40 }, 'Shoulder drape'),
      atlasImage('couture-seam-curve', 'collection:silky-touches:gallery:1', 'Curved couture seam line on ivory textile', 'square', { x: 50, y: 48 }, 'Seam curve'),
      atlasImage('pin-bowl-detail', 'collection:silky-touches:gallery:2', 'Black pin bowl and loose tailoring pins on a pale table', 'square', { x: 50, y: 44 }, 'Pin detail'),
    ],
  },
  portfolio: {
    'soft-power-capsule': [
      atlasImage('atelier-mannequin-study', 'portfolio:soft-power-capsule:gallery:0', 'Mannequin torso with black atelier markings', 'square', { x: 48, y: 38 }, 'Silhouette mark'),
      atlasImage('swatch-stack', 'portfolio:soft-power-capsule:gallery:1', 'Ivory and black fabric swatch stack', 'square', { x: 50, y: 48 }, 'Palette study'),
      atlasImage('figure-sketches', 'portfolio:soft-power-capsule:gallery:2', 'Abstract charcoal mannequin sketch studies', 'square', { x: 52, y: 48 }, 'Sketch system'),
    ],
    'editorial-corporate-shoot': [
      atlasImage('figure-sketches', 'portfolio:editorial-corporate-shoot:gallery:0', 'Charcoal abstract mannequin sketch system', 'square', { x: 52, y: 48 }, 'Figure system'),
      atlasImage('charcoal-texture-study', 'portfolio:editorial-corporate-shoot:gallery:1', 'Charcoal tailoring marks on ivory fabric texture', 'square', { x: 50, y: 48 }, 'Texture mark'),
      atlasImage('pattern-paper-folds', 'portfolio:editorial-corporate-shoot:gallery:2', 'Folded pattern paper with black drafting marks', 'square', { x: 48, y: 44 }, 'Pattern board'),
    ],
    'bridal-reset': [
      atlasImage('seam-pin-close', 'portfolio:bridal-reset:gallery:0', 'Pins placed along raw ivory muslin seam construction', 'square', { x: 50, y: 42 }, 'Pinned seam'),
      atlasImage('pinned-bodice-study', 'portfolio:bridal-reset:gallery:1', 'Pinned muslin bodice study on a mannequin', 'square', { x: 50, y: 34 }, 'Bodice construction'),
      atlasImage('fabric-shoulder-drape', 'portfolio:bridal-reset:gallery:2', 'Ivory fabric shoulder drape and soft textile marks', 'square', { x: 54, y: 40 }, 'Fabric reset'),
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
  home: heroStageImage('home-hero-abstract-drape', 'page:home', 'Abstract ivory mannequin drape in a white atelier', 'wide', { x: 50, y: 34 }, 'Kyiv editorial direction'),
  research: slotImage('purity-page-research', 'page:research', 'Research materials with fabric swatches and silhouette notes', 'portrait', { x: 50, y: 48 }, 'Research / Form / Silhouette'),
  realisation: slotImage('purity-page-realisation', 'page:realisation', 'Pinned muslin bodice study for atelier realisation', 'portrait', { x: 50, y: 34 }, 'Atelier / fitting / couture'),
  transformation: slotImage('purity-page-transformation', 'page:transformation', 'Soft atelier silhouette study for transformation work', 'portrait', { x: 58, y: 54 }, 'Transformation / ritual / styling'),
  collections: slotImage('purity-page-collections', 'page:collections', 'Collection planning materials in ivory muslin and pattern paper', 'portrait', { x: 52, y: 42 }, 'Collections / editorial pieces'),
  school: slotImage('purity-page-school', 'page:school', 'Atelier school drafting study with pattern paper and fabric', 'portrait', { x: 48, y: 44 }, 'School / study / transformation'),
  portfolio: slotImage('purity-page-portfolio', 'page:portfolio', 'Portfolio case materials arranged as an atelier concept board', 'portrait', { x: 52, y: 48 }, 'Portfolio / selected cases'),
  contactsIntro: atlasImage('studio-shadow-form', 'page:contactsIntro', 'Soft atelier window light with abstract mannequin shadow', 'wide', { x: 58, y: 54 }),
  contactsAside: atlasImage('thread-spool', 'page:contactsAside', 'Ivory thread spool and loose thread in a quiet atelier detail', 'square', { x: 44, y: 52 }),
  bookingDefault: heroStageImage('home-hero-pattern-thread', 'page:bookingDefault', 'Tailor mannequin with pattern lines and pins for a booking consultation', 'portrait', { x: 50, y: 36 }),
} satisfies Record<string, PlannedImage>

export const homeMedia = {
  heroLeft: heroStageImage('home-hero-pattern-thread', 'home:heroLeft', 'Tailor mannequin with pattern lines and pins', 'portrait', { x: 50, y: 36 }),
  heroRight: heroStageImage('home-hero-abstract-drape', 'home:heroRight', 'Abstract ivory drape on a mannequin form', 'portrait', { x: 50, y: 34 }),
  direction: {
    atelier: atlasImage('pinned-bodice-study', 'home:direction:atelier', 'Pinned muslin bodice study for atelier direction', 'square', { x: 50, y: 34 }),
    collection: atlasImage('folded-pattern-scroll', 'home:direction:collection', 'Folded pattern scroll for collection direction', 'square', { x: 52, y: 42 }),
    school: atlasImage('pattern-paper-folds', 'home:direction:school', 'Pattern paper folds for school direction', 'square', { x: 48, y: 44 }),
  },
  atelierFeature: atlasImage('pinned-bodice-study', 'home:atelierFeature', 'Pinned muslin bodice and tailoring marks on a mannequin', 'portrait', { x: 50, y: 34 }),
  servicePreview: {
    research: [
      atlasImage('swatch-stack', 'home:servicePreview:research:0', 'Fabric swatches for personal palette research', 'square', { x: 50, y: 48 }),
      atlasImage('folded-pattern-scroll', 'home:servicePreview:research:1', 'Folded pattern paper for wardrobe review structure', 'square', { x: 52, y: 42 }),
    ],
    realisation: [
      atlasImage('pattern-paper-folds', 'home:servicePreview:realisation:0', 'Pattern paper folds for shopping route planning', 'square', { x: 48, y: 44 }),
      atlasImage('pinned-bodice-study', 'home:servicePreview:realisation:1', 'Pinned muslin bodice for atelier service work', 'square', { x: 50, y: 34 }),
    ],
  },
  collectionPreview: [
    atlasImage('folded-pattern-scroll', 'home:collectionPreview:0', 'Folded pattern scroll for collection preview', 'square', { x: 52, y: 42 }),
    atlasImage('fabric-shoulder-drape', 'home:collectionPreview:1', 'Ivory shoulder drape for collection preview', 'square', { x: 54, y: 40 }),
    atlasImage('swatch-stack', 'home:collectionPreview:2', 'Fabric swatch stack for collection preview', 'square', { x: 50, y: 48 }),
  ],
  portfolioPreview: [
    atlasImage('figure-sketches', 'home:portfolioPreview:0', 'Charcoal mannequin sketches for portfolio preview', 'square', { x: 52, y: 48 }),
    atlasImage('studio-shadow-form', 'home:portfolioPreview:1', 'Soft atelier mannequin shadow for portfolio preview', 'square', { x: 58, y: 54 }),
    atlasImage('charcoal-texture-study', 'home:portfolioPreview:2', 'Charcoal texture mark for portfolio preview', 'square', { x: 50, y: 48 }),
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

export const homeLayerMedia = {
  bgStudio: heroStageImage('home-hero-blank-form', 'home:layered-hero:bg', 'Blank ivory dress form in a white atelier', 'portrait', { x: 50, y: 34 }),
  patternPaper: heroStageImage('home-hero-pattern-thread', 'home:layered-hero:pattern-paper', 'Tailor mannequin with pattern lines, thread, and pins', 'portrait', { x: 50, y: 36 }),
  silkFold: heroStageImage('home-hero-fabric-construction', 'home:layered-hero:silk-fold', 'Raw ivory fabric construction pinned to a mannequin', 'portrait', { x: 50, y: 36 }),
  mannequinDrape: heroStageImage('home-hero-abstract-drape', 'home:layered-hero:mannequin-drape', 'Final abstract ivory drape on a mannequin', 'portrait', { x: 50, y: 34 }),
  mannequinBase: heroLayerImage('home-hero-frame-01-research', 'home:layered-hero:mannequin-base', 'Baked transparent research mannequin frame', 'Research / mannequin frame'),
  constructionOverlay: heroLayerImage('home-hero-frame-02-realisation', 'home:layered-hero:construction-overlay', 'Baked transparent realisation construction frame', 'Realisation / construction frame'),
  drapeOverlay: heroLayerImage('home-hero-frame-03-transformation', 'home:layered-hero:drape-overlay', 'Baked transparent transformation drape frame', 'Transformation / drape frame'),
  threadDetail: atlasImage('seam-pin-close', 'home:layered-hero:thread-detail', 'Close view of pins and raw ivory seam construction', 'landscape', { x: 50, y: 42 }),
} satisfies Record<string, PlannedImage>

export const listingProcessMedia = {
  research: [
    slotImage('purity-process-research-context', 'process:research:0', 'Context board with ivory swatches for research step one', 'square', { x: 50, y: 48 }),
    slotImage('purity-process-research-form', 'process:research:1', 'Abstract form study with thread and muslin for research step two', 'square', { x: 44, y: 52 }),
    slotImage('purity-process-research-system', 'process:research:2', 'Couture seam system study for research step three', 'square', { x: 50, y: 48 }),
  ],
  realisation: [
    slotImage('purity-process-realisation-route', 'process:realisation:0', 'Atelier route board for realisation step one', 'square', { x: 50, y: 34 }),
    slotImage('purity-process-realisation-dossier', 'process:realisation:1', 'Dossier materials and pinned muslin for realisation step two', 'square', { x: 50, y: 36 }),
    slotImage('purity-process-realisation-object', 'process:realisation:2', 'Finished atelier object study for realisation step three', 'square', { x: 52, y: 42 }),
  ],
  school: [
    slotImage('purity-process-school-construction', 'process:school:0', 'Pattern construction study for school step one', 'square', { x: 48, y: 44 }),
    slotImage('purity-process-school-fabric', 'process:school:1', 'Fabric behavior study for school step two', 'square', { x: 48, y: 38 }),
    slotImage('purity-process-school-practice', 'process:school:2', 'Practice board with muslin and swatches for school step three', 'square', { x: 50, y: 48 }),
  ],
  transformation: [
    slotImage('purity-process-transformation-state', 'process:transformation:0', 'Quiet atelier state study for transformation step one', 'square', { x: 58, y: 54 }),
    slotImage('purity-process-transformation-image', 'process:transformation:1', 'Image transformation texture study for step two', 'square', { x: 50, y: 48 }),
    slotImage('purity-process-transformation-experience', 'process:transformation:2', 'Experience board with charcoal silhouette marks for step three', 'square', { x: 52, y: 48 }),
  ],
} satisfies Record<string, PlannedImage[]>

export const listingPreviewMedia = {
  collections: [
    slotImage('purity-process-collections-scenario', 'preview:collections:0', 'Collection scenario board with folded ivory pattern paper', 'square', { x: 52, y: 42 }),
    slotImage('purity-process-collections-material', 'preview:collections:1', 'Collection material study with ivory drape and tailoring marks', 'square', { x: 54, y: 40 }),
    slotImage('purity-process-collections-silhouette', 'preview:collections:2', 'Collection silhouette study with fabric swatches and muslin', 'square', { x: 50, y: 48 }),
  ],
  portfolio: [
    slotImage('purity-process-portfolio-task', 'preview:portfolio:0', 'Portfolio task board with charcoal silhouette studies', 'square', { x: 52, y: 48 }),
    slotImage('purity-process-portfolio-method', 'preview:portfolio:1', 'Portfolio method study with marked mannequin and muslin', 'square', { x: 48, y: 38 }),
    slotImage('purity-process-portfolio-result', 'preview:portfolio:2', 'Portfolio result texture board with refined atelier marks', 'square', { x: 50, y: 48 }),
  ],
} satisfies Record<string, PlannedImage[]>

export function plannedImageAt(
  images: Array<{ src: string; alt: string }>,
  index: number,
  fallback: { src: string; alt: string },
) {
  return images[index] ?? fallback
}

export function plannedMediaRefs() {
  return [
    ...Object.entries(pageMedia).map(([owner, image]) => ({ owner: `page:${owner}`, image })),
    { owner: 'home:heroLeft', image: homeMedia.heroLeft },
    { owner: 'home:heroRight', image: homeMedia.heroRight },
    { owner: 'home:atelierFeature', image: homeMedia.atelierFeature },
    ...Object.entries(homeLayerMedia).map(([owner, image]) => ({ owner: `home:layer:${owner}`, image })),
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
  if (/^\/images\/generated\/.+\.(webp|png|jpe?g)$/i.test(src)) {
    return false
  }

  const reservedOwner = plannedMediaOwners().get(photoKey(src))

  return Boolean(reservedOwner && reservedOwner !== owner)
}
