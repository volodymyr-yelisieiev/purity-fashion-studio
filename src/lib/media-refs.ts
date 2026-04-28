import type { CourseEntity } from './types'

export interface RenderableImageRef {
  src: string
  alt: string
}

export function optimizedImageSrc(src: string) {
  return src.startsWith('/images/') && src.endsWith('.jpg') ? src.replace(/\.jpg$/, '.webp') : src
}

export function photoKey(src: string) {
  return optimizedImageSrc(src)
    .replace(/\.(webp|jpe?g|png|svg)$/i, '')
    .replace(/^\//, '')
}

export function courseCoverAsset(course?: Pick<CourseEntity, 'media'>): RenderableImageRef | undefined {
  return course?.media.cover?.asset ?? course?.media.items[0]?.asset
}

export function processImageRefs(...images: Array<RenderableImageRef | undefined>) {
  const seen = new Set<string>()

  return images.filter((image): image is RenderableImageRef => {
    if (!image?.src || seen.has(image.src)) {
      return false
    }

    seen.add(image.src)
    return true
  })
}
