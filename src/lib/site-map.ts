import type { UiCopy } from './types'

export type PublicNavKey = 'research' | 'realisation' | 'transformation' | 'collections' | 'portfolio' | 'school'

export const SITE_NAV_GROUPS = [
  {
    id: 'studio',
    items: ['research', 'realisation', 'transformation'],
  },
  {
    id: 'works',
    items: ['collections', 'portfolio', 'school'],
  },
] as const satisfies Array<{ id: 'studio' | 'works'; items: readonly PublicNavKey[] }>

export function siteNavGroupTitle(id: (typeof SITE_NAV_GROUPS)[number]['id'], ui: UiCopy) {
  return id === 'studio' ? ui.navigation.studio : ui.navigation.works
}
