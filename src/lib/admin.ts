import type { EntityKind } from './types'

export const adminEntityKinds = [
  'page',
  'service',
  'course',
  'collection',
  'portfolio',
  'transformation',
  'media',
  'settings',
] as const satisfies readonly EntityKind[]

export function isAdminEntityKind(value: string): value is EntityKind {
  return adminEntityKinds.includes(value as EntityKind)
}

export function requireAdminEntityKind(value: string): EntityKind {
  return isAdminEntityKind(value) ? value : 'page'
}

export const adminDefaultLocale = 'en' as const
