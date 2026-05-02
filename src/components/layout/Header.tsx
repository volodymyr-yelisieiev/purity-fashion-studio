import { Link, useLocation } from '@tanstack/react-router'
import * as React from 'react'
import { BrandLogo } from '~/components/brand/BrandLogo'
import { buildLocalePath } from '~/lib/i18n'
import type { Locale, UiCopy } from '~/lib/types'
import { cn } from '~/lib/utils'
import { NavSheet } from './NavSheet'

export type ShellColumnItem =
  | {
      key: string
      to: string
      label: string
    }
  | {
      kind: 'internal'
      label: string
      to: string
      search?: unknown
    }
  | {
      kind: 'external'
      label: string
      to: string
    }

export type ShellColumn = {
  title: string
  items: ShellColumnItem[]
}

export function HeaderLink({
  itemKey,
  to,
  label,
  className,
  onNavigate,
}: {
  itemKey: string
  to: string
  label: string
  className?: string
  onNavigate?: () => void
}) {
  return (
    <Link
      to={to}
      className={className ?? 'nav-link'}
      activeProps={{ className: cn(className ?? 'nav-link', 'nav-link-active') }}
      activeOptions={{ exact: itemKey === 'home' }}
      onClick={onNavigate}
    >
      {label}
    </Link>
  )
}

export function LocaleSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)
  const currentPath = segments.length > 1 ? `/${segments.slice(1).join('/')}` : ''

  return (
    <div className="locale-switcher">
      {(['uk', 'en', 'ru'] as const).map((locale) => (
        <Link
          key={locale}
          to={`${buildLocalePath(locale, currentPath)}${location.searchStr}`}
          className={cn('locale-link', currentLocale === locale && 'locale-link-active')}
        >
          {locale}
        </Link>
      ))}
    </div>
  )
}

export function Header({
  locale,
  ui,
  open,
  isHydrated,
  setOpen,
  isHome,
  headerDocked,
  currentLocale,
  bookingPath,
  bookingSearch,
  shellColumns,
  menuToggleRef,
  headerBrandRef,
  headerBrandSlotRef,
  navSheetRef,
}: {
  locale: Locale
  ui: UiCopy
  open: boolean
  isHydrated: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  isHome: boolean
  headerDocked: boolean
  currentLocale: Locale
  bookingPath: string
  bookingSearch?: unknown
  shellColumns: ShellColumn[]
  menuToggleRef: React.RefObject<HTMLButtonElement | null>
  headerBrandRef: React.RefObject<HTMLAnchorElement | null>
  headerBrandSlotRef: React.RefObject<HTMLDivElement | null>
  navSheetRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <header
      className={cn(
        'chrome-shell',
        headerDocked && 'chrome-shell-docked',
        open && 'chrome-shell-menu-open',
        isHome && !headerDocked && 'chrome-shell-home-intro',
      )}
    >
      <div className="header-surface" aria-hidden="true" />
      <div className="header-rail site-container site-container-wide">
        <div className="header-side header-side-left">
          <button
            ref={menuToggleRef}
            type="button"
            className="menu-toggle menu-toggle-inline"
            aria-expanded={open}
            aria-controls="nav-sheet"
            disabled={!isHydrated}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? ui.navigation.close : ui.navigation.menu}
          </button>
        </div>

        <div ref={headerBrandSlotRef} className="brand-mark header-brand-slot">
          <Link
            ref={headerBrandRef}
            to={buildLocalePath(locale)}
            className={cn('header-brand', !headerDocked && 'header-brand-hidden')}
            aria-label={ui.brand}
            aria-hidden={!headerDocked}
            tabIndex={headerDocked ? undefined : -1}
          >
            <BrandLogo variant="extended" className="header-logo" alt={ui.brand} />
          </Link>
        </div>

        <div className="header-side header-side-right">
          <div className="header-actions">
            <LocaleSwitcher currentLocale={currentLocale} />
            <Link
              to={bookingPath}
              search={bookingSearch as never}
              className="button-secondary button-compact header-cta"
            >
              {ui.actions.bookNow}
            </Link>
          </div>
        </div>
      </div>

      <NavSheet
        open={open}
        setOpen={setOpen}
        currentLocale={currentLocale}
        ui={ui}
        bookingPath={bookingPath}
        bookingSearch={bookingSearch}
        shellColumns={shellColumns}
        navSheetRef={navSheetRef}
      />
    </header>
  )
}
