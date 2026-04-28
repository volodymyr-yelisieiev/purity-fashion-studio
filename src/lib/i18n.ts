import type { Locale } from './types'
import { locales } from './types'

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function assertLocale(value: string): Locale {
  return isLocale(value) ? value : 'uk'
}

export function buildLocalePath(locale: Locale, path = '') {
  return `/${locale}${path}`
}

export function segmentLocale(pathname: string): Locale {
  const segment = pathname.split('/').filter(Boolean)[0]
  return segment && isLocale(segment) ? segment : 'uk'
}
