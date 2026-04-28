import type { ServiceArea } from './types'

export type ListingPageKey = 'research' | 'realisation' | 'transformation' | 'collections' | 'school' | 'portfolio'

export const LISTING_PAGE_CONFIG = {
  research: {
    kind: 'service-listing',
    offerArea: 'research',
    processMediaKey: 'research',
  },
  realisation: {
    kind: 'service-listing',
    offerArea: 'realisation',
    processMediaKey: 'realisation',
  },
  transformation: {
    kind: 'transformation-listing',
    processMediaKey: 'transformation',
  },
  collections: {
    kind: 'collection-listing',
    processMediaKey: 'collections',
  },
  school: {
    kind: 'course-listing',
    processMediaKey: 'school',
  },
  portfolio: {
    kind: 'portfolio-listing',
    processMediaKey: 'portfolio',
  },
} as const satisfies Record<ListingPageKey, { kind: string; processMediaKey: string; offerArea?: ServiceArea }>
