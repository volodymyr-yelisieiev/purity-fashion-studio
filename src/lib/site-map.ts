import type { UiCopy } from './types'

export type PublicNavKey =
  | 'home'
  | 'atelier'
  | 'research'
  | 'realisation'
  | 'transformation'
  | 'collections'
  | 'portfolio'
  | 'school'

export type PublicNavItem = {
  key: PublicNavKey
  path: string
}

export const SITE_NAV_GROUPS = [
  {
    id: 'studio',
    items: [
      { key: 'home', path: '' },
      { key: 'research', path: '/research' },
      { key: 'realisation', path: '/realisation' },
      { key: 'atelier', path: '/realisation/atelier' },
      { key: 'transformation', path: '/transformation' },
    ],
  },
  {
    id: 'works',
    items: [
      { key: 'collections', path: '/collections' },
      { key: 'portfolio', path: '/portfolio' },
      { key: 'school', path: '/school' },
    ],
  },
] as const satisfies Array<{ id: 'studio' | 'works'; items: readonly PublicNavItem[] }>

export function siteNavGroupTitle(id: (typeof SITE_NAV_GROUPS)[number]['id'], ui: UiCopy) {
  return id === 'studio' ? ui.navigation.studio : ui.navigation.works
}
