import type { CourseEntity } from './types'

export interface RenderableImageRef {
  src: string
  alt: string
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
