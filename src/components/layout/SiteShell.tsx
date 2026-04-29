import * as React from 'react'
import { gsap } from 'gsap'
import { Outlet, useLocation } from '@tanstack/react-router'
import { buildLocalePath, segmentLocale } from '~/lib/i18n'
import { MOTION, usePrefersReducedMotion } from '~/lib/motion'
import { SITE_NAV_GROUPS, siteNavGroupTitle } from '~/lib/site-map'
import type { Locale, StudioSettings, UiCopy } from '~/lib/types'
import { Header, type ShellColumn } from './Header'
import { Footer } from './Footer'

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

type BookingIntentKind = 'service' | 'course' | 'collection' | 'portfolio' | 'transformation'

type BookingSearchParams =
  | {
      kind: BookingIntentKind
      slug: string
      area?: 'research' | 'realisation'
    }
  | {
      intent: string
    }

function bookingSearchFromPath(pathname: string): BookingSearchParams | undefined {
  const [, section, slug] = pathname.split('/').filter(Boolean)

  if (!section || !slug) {
    return undefined
  }

  if (section === 'research' || section === 'realisation') {
    return { kind: 'service', slug, area: section }
  }

  if (section === 'collections') {
    return { kind: 'collection', slug }
  }

  if (section === 'portfolio') {
    return { kind: 'portfolio', slug }
  }

  return undefined
}

function bookingSearchFromSearch(search: unknown): BookingSearchParams | undefined {
  if (!search || typeof search !== 'object') {
    return undefined
  }

  const params = search as Record<string, unknown>

  if (typeof params.intent === 'string') {
    return { intent: params.intent }
  }

  if (typeof params.kind !== 'string' || typeof params.slug !== 'string') {
    return undefined
  }

  if (!['service', 'course', 'collection', 'portfolio', 'transformation'].includes(params.kind)) {
    return undefined
  }

  return {
    kind: params.kind as BookingIntentKind,
    slug: params.slug,
    area: params.area === 'research' || params.area === 'realisation' ? params.area : undefined,
  }
}

export function SiteShell({
  locale,
  ui,
  settings,
}: {
  locale: Locale
  ui: UiCopy
  settings?: StudioSettings
}) {
  const location = useLocation()
  const pathname = location.pathname
  const currentLocale = segmentLocale(pathname)
  const homePath = buildLocalePath(locale)
  const isHome = pathname === homePath
  const prefersReducedMotion = usePrefersReducedMotion()
  const [open, setOpen] = React.useState(false)
  const [isHeaderDocked, setIsHeaderDocked] = React.useState(!isHome)
  const shellRef = React.useRef<HTMLDivElement | null>(null)
  const menuToggleRef = React.useRef<HTMLButtonElement | null>(null)
  const headerBrandRef = React.useRef<HTMLAnchorElement | null>(null)
  const headerBrandSlotRef = React.useRef<HTMLDivElement | null>(null)
  const navSheetRef = React.useRef<HTMLDivElement | null>(null)
  const dockThresholdRef = React.useRef(220)
  const headerDocked = !isHome || open || isHeaderDocked
  const safeSettings = settings ?? {
    contactEmail: 'voronina@purity-fashion.com',
    corporateEmail: undefined,
    phone: '+38 067 656 19 12',
    socialLinks: [],
    mapHref:
      'https://www.google.com/maps/search/?api=1&query=Kyiv%2003150%2C%20Predslavynska%20Street%2044%2C%20office%201%2C%20floor%202%2C%20French%20Quarter%202',
    mapLabel: 'PURITY studio on map',
  }
  const bookingPath = buildLocalePath(locale, '/book')
  const bookingSearch = React.useMemo(
    () => bookingSearchFromPath(pathname) ?? bookingSearchFromSearch(location.search),
    [location.search, pathname],
  )

  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  React.useEffect(() => {
    if (typeof window === 'undefined' || !open) {
      return
    }

    const sheet = navSheetRef.current
    const toggle = menuToggleRef.current
    const previousActiveElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    const scrollY = window.scrollY
    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ')

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'

    const inertTargets = [
      document.getElementById('main'),
      document.querySelector<HTMLElement>('.site-footer'),
      headerBrandSlotRef.current,
      document.querySelector<HTMLElement>('.header-side-right'),
    ].filter((target): target is HTMLElement => Boolean(target))

    inertTargets.forEach((target) => {
      target.setAttribute('inert', '')
      target.setAttribute('aria-hidden', 'true')
    })

    const getFocusableElements = () => [
      ...(toggle ? [toggle] : []),
      ...Array.from(sheet?.querySelectorAll<HTMLElement>(focusableSelector) ?? []),
    ].filter((element) => !element.hasAttribute('disabled'))

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (!target) {
        return
      }

      const clickedInsideSheet = sheet?.contains(target) ?? false
      const clickedToggle = toggle?.contains(target) ?? false
      if (!clickedInsideSheet && !clickedToggle) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        return
      }

      if (event.key !== 'Tab' || !sheet) {
        return
      }

      const focusable = getFocusableElements()

      if (!focusable.length) {
        event.preventDefault()
        return
      }

      const active = document.activeElement
      const activeIndex = active instanceof HTMLElement ? focusable.indexOf(active) : -1
      const nextIndex = activeIndex < 0
        ? 0
        : event.shiftKey
          ? (activeIndex - 1 + focusable.length) % focusable.length
          : (activeIndex + 1) % focusable.length

      event.preventDefault()
      focusable[nextIndex]?.focus()
    }

    window.requestAnimationFrame(() => toggle?.focus())
    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('keydown', handleKeyDown)
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.width = ''
      inertTargets.forEach((target) => {
        target.removeAttribute('inert')
        target.removeAttribute('aria-hidden')
      })
      window.scrollTo(0, scrollY)
      previousActiveElement?.focus()
    }
  }, [open])

  React.useLayoutEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const shell = shellRef.current
    const headerBrand = headerBrandRef.current
    const headerBrandSlot = headerBrandSlotRef.current
    if (!shell || !headerBrand || !headerBrandSlot) {
      return
    }

    let frame = 0
    let resizeObserver: ResizeObserver | null = null

    const setShellVar = (name: string, value: string) => {
      shell.style.setProperty(name, value)
    }

    const syncBrand = () => {
      dockThresholdRef.current = Math.min(window.innerHeight * MOTION.dockTravelViewport, 320)
      const dockThreshold = Math.max(dockThresholdRef.current, 1)
      const progress = !isHome || open || prefersReducedMotion
        ? 1
        : clamp01(window.scrollY / dockThreshold)
      const docked = !isHome || open || progress >= 0.999
      const headerSurfaceOpacity = open ? 0.98 : isHome ? 0.8 + progress * 0.18 : 0.96
      const brandOpacity = !isHome || open || prefersReducedMotion ? 1 : clamp01((progress - 0.38) / 0.42)

      setShellVar('--home-dock-progress', progress.toFixed(3))
      setShellVar('--header-surface-opacity', headerSurfaceOpacity.toFixed(3))
      setShellVar('--header-brand-opacity', brandOpacity.toFixed(3))
      setIsHeaderDocked((currentValue) => (currentValue === docked ? currentValue : docked))
      gsap.set(headerBrand, { x: 0, y: 0, scale: 1, transformOrigin: 'center center' })
    }

    const scheduleSync = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(syncBrand)
    }

    scheduleSync()
    window.addEventListener('scroll', scheduleSync, { passive: true })
    window.addEventListener('resize', scheduleSync)

    resizeObserver = new ResizeObserver(() => {
      scheduleSync()
    })
    resizeObserver.observe(headerBrandSlot)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleSync)
      window.removeEventListener('resize', scheduleSync)
      resizeObserver?.disconnect()
      gsap.set(headerBrand, { x: 0, y: 0, scale: 1, transformOrigin: 'center center' })
    }
  }, [isHome, open, pathname, prefersReducedMotion])

  React.useLayoutEffect(() => {
    const sheet = navSheetRef.current
    if (!sheet) {
      return
    }

    const items = sheet.querySelectorAll('.nav-sheet-animate')
    gsap.killTweensOf(sheet)
    gsap.killTweensOf(items)

    if (open) {
      gsap.set(sheet, { display: 'block', pointerEvents: 'auto' })
      const timeline = gsap.timeline()
      timeline.fromTo(
        sheet,
        { height: 0, autoAlpha: 0 },
        { height: 'auto', autoAlpha: 1, duration: MOTION.base, ease: MOTION.ease },
      )
      timeline.fromTo(
        items,
        { y: -18, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: MOTION.base,
          stagger: MOTION.stagger,
          ease: MOTION.ease,
        },
        '-=0.28',
      )

      return () => {
        timeline.kill()
      }
    }

    gsap.set(items, { y: -18, autoAlpha: 0 })
    gsap.set(sheet, { display: 'none', height: 0, autoAlpha: 0, pointerEvents: 'none' })
  }, [open])

  const navEntries = SITE_NAV_GROUPS.map((group) => ({
    title: siteNavGroupTitle(group.id, ui),
    items: group.items.map((key) => ({
      key,
      to: buildLocalePath(locale, `/${key}`),
      label: ui.nav[key],
    })),
  }))

  const contactEntries: ShellColumn['items'] = [
    { label: ui.nav.contacts, to: buildLocalePath(locale, '/contacts'), kind: 'internal' },
    { label: ui.actions.bookNow, to: bookingPath, search: bookingSearch, kind: 'internal' },
    { label: safeSettings.contactEmail, to: `mailto:${safeSettings.contactEmail}`, kind: 'external' },
    ...(safeSettings.corporateEmail
      ? [{ label: safeSettings.corporateEmail, to: `mailto:${safeSettings.corporateEmail}`, kind: 'external' as const }]
      : []),
    ...(safeSettings.phone
      ? [{ label: safeSettings.phone, to: `tel:${safeSettings.phone.replace(/\s+/g, '')}`, kind: 'external' as const }]
      : []),
    ...safeSettings.socialLinks.map((link) => ({
      label: link.label,
      to: link.href,
      kind: 'external' as const,
    })),
    ...(safeSettings.mapHref && safeSettings.mapLabel
      ? [{ label: safeSettings.mapLabel, to: safeSettings.mapHref, kind: 'external' as const }]
      : []),
  ]
  const shellColumns: ShellColumn[] = [
    ...navEntries,
    {
      title: ui.navigation.contact,
      items: contactEntries,
    },
  ]

  return (
    <div
      ref={shellRef}
      className="site-frame"
      style={
        {
          '--header-surface-opacity': isHome && !open ? '0.800' : '0.960',
          '--home-dock-progress': !isHome || open ? '1' : '0',
          '--header-brand-opacity': !isHome || open ? '1' : '0',
        } as React.CSSProperties
      }
    >
      <a className="skip-link" href="#main">
        {ui.accessibility.skipToContent}
      </a>

      <Header
        locale={locale}
        ui={ui}
        open={open}
        setOpen={setOpen}
        isHome={isHome}
        headerDocked={headerDocked}
        currentLocale={currentLocale}
        bookingPath={bookingPath}
        bookingSearch={bookingSearch}
        shellColumns={shellColumns}
        menuToggleRef={menuToggleRef}
        headerBrandRef={headerBrandRef}
        headerBrandSlotRef={headerBrandSlotRef}
        navSheetRef={navSheetRef}
      />

      <main id="main">
        <Outlet />
      </main>

      <Footer shellColumns={shellColumns} ui={ui} />
    </div>
  )
}
