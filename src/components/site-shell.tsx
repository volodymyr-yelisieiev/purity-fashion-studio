import * as React from 'react'
import { gsap } from 'gsap'
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { analytics } from '~/lib/analytics'
import { publicEnv } from '~/lib/env'
import { buildLocalePath, segmentLocale } from '~/lib/i18n'
import { courseCoverAsset } from '~/lib/media-refs'
import { MOTION, usePrefersReducedMotion } from '~/lib/motion'
import { isDuplicateSubmission } from '~/lib/mock-submission'
import { submitBookingLead, submitContactLead } from '~/lib/submissions'
import { cn } from '~/lib/utils'
import type {
  CollectionEntity,
  ContactsPageData,
  CourseEntity,
  HomePageData,
  Locale,
  PortfolioCaseEntity,
  Price,
  ServiceEntity,
  StudioSettings,
  TransformationOfferEntity,
  UiCopy,
} from '~/lib/types'

const NAV_GROUPS = [
  ['research', 'realisation', 'transformation'] as const,
  ['collections', 'portfolio', 'school'] as const,
] as const

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

function optimizedImageSrc(src: string) {
  return src.startsWith('/images/') && src.endsWith('.jpg') ? src.replace(/\.jpg$/, '.webp') : src
}

type BookingIntentKind = 'service' | 'course' | 'collection' | 'portfolio' | 'transformation'

type BookingSearchParams = {
  kind: BookingIntentKind
  slug: string
  area?: 'research' | 'realisation'
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

export function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn('site-container section-space', className)}>{children}</section>
}

function CardActionRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('card-action-row', className)}>{children}</div>
}

export function SectionHead({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="section-head">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="section-title">{title}</h2>
      </div>
      {subtitle ? <p className="editorial-copy editorial-copy-measure">{subtitle}</p> : null}
    </div>
  )
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
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
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
  const currentYear = new Date().getFullYear()
  const dockThresholdRef = React.useRef(220)
  const headerDocked = !isHome || open || isHeaderDocked
  const safeSettings = settings ?? {
    contactEmail: 'hello@purity-fashion-studio.ua',
    corporateEmail: undefined,
    phone: undefined,
    socialLinks: [],
    mapHref: undefined,
    mapLabel: undefined,
  }
  const bookingPath = buildLocalePath(locale, '/book')
  const bookingSearch = React.useMemo(() => bookingSearchFromPath(pathname), [pathname])

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

    const focusFirstElement = () => {
      const focusable = sheet?.querySelectorAll<HTMLElement>(focusableSelector)
      focusable?.[0]?.focus()
    }

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

      const focusable = Array.from(sheet.querySelectorAll<HTMLElement>(focusableSelector))
        .filter((element) => !element.hasAttribute('disabled'))

      if (!focusable.length) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.requestAnimationFrame(focusFirstElement)
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

  const navEntries = NAV_GROUPS.map((group) => ({
    title: group[0] === 'research' ? ui.navigation.studio : ui.navigation.works,
    items: group.map((key) => ({
      key,
      to: buildLocalePath(locale, `/${key}`),
      label: ui.nav[key],
    })),
  }))

  const contactEntries = [
    { label: ui.nav.contacts, to: buildLocalePath(locale, '/contacts'), kind: 'internal' as const },
    { label: ui.actions.bookNow, to: bookingPath, search: bookingSearch, kind: 'internal' as const },
    { label: safeSettings.contactEmail, to: `mailto:${safeSettings.contactEmail}`, kind: 'external' as const },
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
  const shellColumns = [
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
              onClick={() => setOpen((value) => !value)}
            >
              {open ? ui.navigation.close : ui.navigation.menu}
            </button>
          </div>

          <div ref={headerBrandSlotRef} className="brand-mark header-brand-slot">
            <Link
              ref={headerBrandRef}
              to={buildLocalePath(locale)}
              className="header-brand"
              aria-label={ui.brand}
            >
              <BrandLogo variant="extended" className="header-logo" alt={ui.brand} />
            </Link>
          </div>

          <div className="header-side header-side-right">
            <div className="header-actions">
              <LocaleSwitcher currentLocale={currentLocale} />
              <Link to={bookingPath} search={bookingSearch} className="button-secondary button-compact header-cta">
                {ui.actions.bookNow}
              </Link>
            </div>
          </div>
        </div>

        <div
          id="nav-sheet"
          ref={navSheetRef}
          className="nav-sheet-shell"
          role="dialog"
          aria-modal="true"
          aria-label={ui.accessibility.siteMenu}
          aria-hidden={!open}
          inert={!open}
        >
          <div className="site-container site-container-wide nav-sheet-grid">
            {shellColumns.map((group) => (
              <div key={group.title} className="footer-column nav-sheet-animate">
                <p className="eyebrow">{group.title}</p>
                {group.items.map((item) =>
                  'kind' in item ? (
                    item.kind === 'internal' ? (
                      <Link
                        key={item.label}
                        to={item.to}
                        search={'search' in item ? item.search : undefined}
                        className="footer-link"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        key={item.label}
                        className="footer-link"
                        href={item.to}
                        target={item.to.startsWith('http') ? '_blank' : undefined}
                        rel={item.to.startsWith('http') ? 'noreferrer' : undefined}
                      >
                        {item.label}
                      </a>
                    )
                  ) : (
                    <HeaderLink
                      key={item.key}
                      itemKey={item.key}
                      to={item.to}
                      label={item.label}
                      className="footer-link"
                      onNavigate={() => setOpen(false)}
                    />
                  ),
                )}
                {group.title === ui.navigation.contact ? (
                  <div className="mobile-nav-toolbar">
                    <LocaleSwitcher currentLocale={currentLocale} />
                  </div>
                ) : null}
              </div>
            ))}

            <div className="nav-sheet-toolbar nav-sheet-animate">
              <LocaleSwitcher currentLocale={currentLocale} />
              <Link
                to={bookingPath}
                search={bookingSearch}
                className="button-primary"
                onClick={() => setOpen(false)}
              >
                {ui.actions.bookNow}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-logo-band">
          <img src="/main_black.svg" alt={ui.brand} className="footer-logo-band-image" />
        </div>
        <div className="site-container site-container-wide footer-legal">
          <p className="footer-legal-copy">© {currentYear} {ui.labels.allRightsReserved}</p>
        </div>
      </footer>
    </div>
  )
}

function HeaderLink({
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

function LocaleSwitcher({ currentLocale }: { currentLocale: Locale }) {
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

export function PageHero({
  eyebrow,
  title,
  text,
  children,
  emphasis = 'standard',
  imageSrc,
  imageAlt,
  logoLockup = false,
  caption,
}: {
  eyebrow: string
  title: string
  text: string
  children?: React.ReactNode
  emphasis?: 'grand' | 'standard'
  imageSrc?: string
  imageAlt?: string
  logoLockup?: boolean
  caption?: string
}) {
  return (
    <section className={cn('page-hero-shell', emphasis === 'grand' && 'page-hero-shell-grand')}>
      {imageSrc ? (
        <div className={cn('page-hero-media', emphasis === 'grand' && 'page-hero-media-grand')}>
          <img
            src={optimizedImageSrc(imageSrc)}
            alt={imageAlt ?? title}
            className="page-hero-image"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          {logoLockup ? (
            <div className="hero-lockup">
              <BrandLogo variant="extended" className="hero-lockup-image" alt="PURITY" />
            </div>
          ) : null}
          {caption ? <span className="page-hero-caption">{caption}</span> : null}
        </div>
      ) : null}

      <div className="site-container">
        <div className={cn('page-hero-copy-wrap', emphasis === 'grand' && 'page-hero-copy-wrap-grand')}>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className={cn('hero-title', emphasis === 'grand' && 'hero-title-grand')}>{title}</h1>
          <p className="hero-copy">{text}</p>
          {children}
        </div>
      </div>
    </section>
  )
}

const HOME_SLOGANS: Record<Locale, [string, string, string]> = {
  uk: ['Відчуй', 'Уяви', 'Створи'],
  en: ['Feel', 'Imagine', 'Create'],
  ru: ['Ощути', 'Представь', 'Создай'],
}

const HOME_VERTICAL_LABEL: Record<Locale, string> = {
  uk: 'Personal wardrobe designer',
  en: 'Personal wardrobe designer',
  ru: 'Personal wardrobe designer',
}

export function HomeEditorialHero({
  locale,
  ui,
  home,
}: {
  locale: Locale
  ui: UiCopy
  home: HomePageData
}) {
  const slogan = HOME_SLOGANS[locale]

  return (
    <section className="home-editorial-hero">
      <div className="home-editorial-grid">
        <aside className="home-editorial-rail">
          <span>{HOME_VERTICAL_LABEL[locale]}</span>
        </aside>

        <div className="home-editorial-art home-editorial-art-left">
          <img
            src="/images/purity_3.webp"
            alt=""
            className="home-editorial-image"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>

        <div className="home-editorial-center">
          <div className="home-editorial-brand-wrap">
            <div className="home-editorial-logo-target" aria-hidden="true" data-home-logo-target="true" />
            <BrandLogo variant="extended" className="home-editorial-logo" alt={ui.brand} />
          </div>
          <p className="home-editorial-kicker">{home.heroKicker.replaceAll('@', '')}</p>
          <h1 className="home-editorial-slogan">
            {slogan.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </h1>
          <p className="home-editorial-copy">{home.heroDescription}</p>
          <Link to={buildLocalePath(locale, '/book')} className="button-primary home-editorial-cta">
            {home.heroPrimaryCta}
          </Link>
          <span className="home-editorial-scroll">Scroll</span>
        </div>

        <div className="home-editorial-art home-editorial-art-right">
          <img
            src="/images/purity_5.webp"
            alt=""
            className="home-editorial-image"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>

        <aside className="home-editorial-black-bar" aria-hidden="true" />
      </div>
    </section>
  )
}

export function HomeDirectionTiles({
  items,
}: {
  items: Array<{
    eyebrow: string
    title: string
    text: string
    linkLabel: string
    imageSrc: string
    imageAlt: string
    to: string
  }>
}) {
  return (
    <section className="home-direction-strip">
      {items.map((item) => (
        <Link key={item.title} to={item.to} className="home-direction-tile">
          <img src={optimizedImageSrc(item.imageSrc)} alt={item.imageAlt} className="home-direction-image" loading="lazy" decoding="async" />
          <span className="home-direction-scrim" aria-hidden="true" />
          <span className="home-direction-copy">
            <span className="eyebrow">{item.eyebrow}</span>
            <span className="home-direction-title">{item.title}</span>
            <span className="home-direction-text">{item.text}</span>
            <span className="home-direction-link">{item.linkLabel}</span>
          </span>
        </Link>
      ))}
    </section>
  )
}

export function EditorialPreviewStrip({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string
  title: string
  items: Array<{
    title: string
    subtitle?: string
    imageSrc: string
    imageAlt: string
    to?: string
  }>
}) {
  return (
    <Section className="editorial-preview-section">
      <SectionHead title={eyebrow} subtitle={title} />
      <div className="editorial-preview-strip">
        {items.map((item) => {
          const content = (
            <>
              <img src={optimizedImageSrc(item.imageSrc)} alt={item.imageAlt} className="editorial-preview-image" loading="lazy" decoding="async" />
              <span className="editorial-preview-overlay" aria-hidden="true" />
              <span className="editorial-preview-copy">
                <span>{item.title}</span>
                {item.subtitle ? <small>{item.subtitle}</small> : null}
              </span>
            </>
          )

          return item.to ? (
            <Link key={item.title} to={item.to} className="editorial-preview-card">
              {content}
            </Link>
          ) : (
            <figure key={item.title} className="editorial-preview-card">
              {content}
            </figure>
          )
        })}
      </div>
    </Section>
  )
}

export function EditorialProcessBand({
  eyebrow,
  title,
  text,
  items,
  images,
}: {
  eyebrow: string
  title: string
  text: string
  items: string[]
  images: Array<{ src: string; alt: string }>
}) {
  return (
    <Section>
      <div className="editorial-process-grid">
        <div className="editorial-process-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="section-subtitle">{title}</h2>
          <p className="editorial-copy">{text}</p>
          <ol className="editorial-list editorial-list-tight">
            {items.map((item, index) => (
              <li key={item} className="editorial-list-item">
                <span className="list-index">{String(index + 1).padStart(2, '0')}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="editorial-process-media">
          {images.map((image, index) => (
            <figure key={image.src} className={cn('editorial-process-frame', index === 0 && 'editorial-process-frame-large')}>
              <img src={optimizedImageSrc(image.src)} alt={image.alt} className="editorial-process-image" loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>
      </div>
    </Section>
  )
}

export function CompactIntro({
  eyebrow,
  title,
  text,
  asideEyebrow,
  asideTitle,
  asideText,
  chips,
  imageSrc,
  imageAlt,
}: {
  eyebrow: string
  title: string
  text: string
  asideEyebrow: string
  asideTitle: string
  asideText: string
  chips?: string[]
  imageSrc?: string
  imageAlt?: string
}) {
  return (
    <section className="compact-intro-shell">
      {imageSrc ? (
        <div className="compact-intro-media">
          <img src={optimizedImageSrc(imageSrc)} alt={imageAlt ?? title} className="compact-intro-image" loading="eager" decoding="async" fetchPriority="high" />
        </div>
      ) : null}

      <div className="site-container compact-intro-grid">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="section-title">{title}</h1>
          <p className="editorial-copy max-w-[42rem]">{text}</p>
        </div>

        <aside className="compact-intro-aside">
          <p className="eyebrow">{asideEyebrow}</p>
          <h2 className="section-subtitle">{asideTitle}</h2>
          <p className="editorial-copy">{asideText}</p>
          {chips?.length ? (
            <div className="micro-tag-row">
              {chips.map((chip) => (
                <span key={chip} className="micro-tag">
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  )
}

export function ServiceCard({
  item,
  locale,
  cta,
  pricingLabel,
  imageSrc: imageOverride,
}: {
  item: ServiceEntity
  locale: Locale
  cta: string
  pricingLabel: string
  imageSrc?: string
}) {
  const detailTo = buildLocalePath(locale, `/${item.area}/${item.slug}`)
  const imageSrc = imageOverride ?? item.media.src

  return (
    <ProductPreviewCard
      to={detailTo}
      imageSrc={imageSrc}
      imageAlt={item.media.alt}
      eyebrow={item.eyebrow}
      title={item.title}
      summary={item.summary}
      tag={item.heroLabel}
      meta={[item.duration, item.leadTime]}
      footer={
        <>
          <div>
            <p className="eyebrow">{pricingLabel}</p>
            <p className="price-value">{item.price.eur}</p>
            <p className="price-secondary">{item.price.uah}</p>
          </div>
          <Link
            to={buildLocalePath(locale, '/book')}
            search={{ kind: 'service', slug: item.slug, area: item.area }}
            className="button-primary"
          >
            {cta}
          </Link>
        </>
      }
    />
  )
}

export function CollectionCard({
  item,
  locale,
  cta,
  label,
}: {
  item: CollectionEntity
  locale: Locale
  cta: string
  label: string
}) {
  return (
    <ProductPreviewCard
      to={buildLocalePath(locale, `/collections/${item.slug}`)}
      imageSrc={item.heroMedia.src}
      imageAlt={item.heroMedia.alt}
      eyebrow={label}
      title={item.title}
      summary={item.summary}
      chips={item.palette}
      footer={
        <>
          <p className="editorial-copy max-w-[24rem]">{item.priceNote}</p>
          <Link to={buildLocalePath(locale, `/collections/${item.slug}`)} className="button-secondary">
            {cta}
          </Link>
        </>
      }
    />
  )
}

function ProductPreviewCard({
  to,
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  summary,
  tag,
  meta,
  chips,
  footer,
}: {
  to: string
  imageSrc: string
  imageAlt: string
  eyebrow: string
  title: string
  summary: string
  tag?: string
  meta?: string[]
  chips?: string[]
  footer: React.ReactNode
}) {
  return (
    <article className="editorial-card product-preview-card">
      <Link to={to} className="editorial-card-media product-preview-media">
        <img src={optimizedImageSrc(imageSrc)} alt={imageAlt} className="editorial-card-image" loading="lazy" decoding="async" />
        {tag ? <span className="micro-tag editorial-card-tag">{tag}</span> : null}
      </Link>

      <div className="editorial-card-body product-preview-body">
        <div className="product-preview-kicker">
          <p className="eyebrow">{eyebrow}</p>
          {meta?.length ? (
            <div className="editorial-inline-meta">
              {meta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          ) : null}
        </div>

        <h3 className="card-title">
          <Link to={to}>{title}</Link>
        </h3>
        <p className="editorial-copy">{summary}</p>

        {chips?.length ? (
          <div className="micro-tag-row">
            {chips.map((chip) => (
              <span key={chip} className="micro-tag">
                {chip}
              </span>
            ))}
          </div>
        ) : null}

        <CardActionRow className="product-preview-actions">{footer}</CardActionRow>
      </div>
    </article>
  )
}

export function OfferGrid({
  title,
  subtitle,
  children,
  eyebrow,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  eyebrow?: string
}) {
  return (
    <Section>
      <SectionHead eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="offer-grid">{children}</div>
    </Section>
  )
}



export function StandardListingPage({
  hero,
  quoteTitle,
  quoteText,
  process,
  preview,
  children,
}: {
  hero: React.ComponentProps<typeof PageHero>
  quoteTitle: string
  quoteText?: string | null
  process?: React.ComponentProps<typeof EditorialProcessBand>
  preview?: React.ComponentProps<typeof EditorialPreviewStrip>
  children?: React.ReactNode
}) {
  return (
    <>
      <PageHero {...hero} />
      {quoteText && <QuoteBand title={quoteTitle} text={quoteText} />}
      {process ? <EditorialProcessBand {...process} /> : null}
      {preview ? <EditorialPreviewStrip {...preview} /> : null}
      {children}
    </>
  )
}

export function DetailHero({
  eyebrow,
  title,
  summary,
  price,
  duration,
  leadTime,
  locale,
  bookingLabel,
  area,
  slug,
  media,
  labels,
}: {
  eyebrow: string
  title: string
  summary: string
  price: Price
  duration: string
  leadTime: string
  locale: Locale
  bookingLabel: string
  area: string
  slug: string
  media: ServiceEntity['media']
  labels: Pick<UiCopy['labels'], 'timing' | 'pricing'>
}) {
  return (
    <ProductDetailHero
      eyebrow={eyebrow}
      title={title}
      summary={summary}
      media={media}
      chips={[duration, leadTime]}
      action={
        <Link
          to={buildLocalePath(locale, '/book')}
          search={{ kind: 'service', slug, area }}
          className="button-primary"
        >
          {bookingLabel}
        </Link>
      }
      meta={[
        { label: labels.timing, value: duration, detail: leadTime },
        { label: labels.pricing, value: price.eur, detail: price.uah, emphasis: true, large: true },
      ]}
    />
  )
}

function ProductDetailHero({
  eyebrow,
  title,
  summary,
  media,
  chips,
  action,
  meta,
}: {
  eyebrow: string
  title: string
  summary: string
  media: { src: string; alt: string; caption?: string }
  chips?: string[]
  action: React.ReactNode
  meta: Array<{ label: string; value: string; detail?: string; emphasis?: boolean; large?: boolean }>
}) {
  return (
    <section className="product-detail-hero">
      <div className="site-container product-detail-hero-grid">
        <figure className="product-detail-media">
          <img
            src={optimizedImageSrc(media.src)}
            alt={media.alt}
            className="detail-hero-image"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          {media.caption ? <figcaption className="product-detail-caption">{media.caption}</figcaption> : null}
        </figure>

        <div className="product-detail-copy">
          <div className="product-detail-kicker">
            <p className="eyebrow">{eyebrow}</p>
            {chips?.length ? (
              <div className="micro-tag-row">
                {chips.map((chip) => (
                  <span key={chip} className="micro-tag">
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <h1 className="hero-title">{title}</h1>
          <p className="hero-copy product-detail-summary">{summary}</p>

          <div className="product-detail-action">{action}</div>

          <div className="product-detail-meta-grid">
            {meta.map((item) => (
              <div key={`${item.label}-${item.value}`} className={cn('product-detail-meta', item.emphasis && 'product-detail-meta-emphasis')}>
                <p className="eyebrow">{item.label}</p>
                <p className={item.large ? 'price-value' : 'detail-line-title'}>{item.value}</p>
                {item.detail ? <p className="price-secondary">{item.detail}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function BookingMetaItem({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="booking-meta-item">
      <p className="eyebrow">{label}</p>
      <p className="booking-meta-value">{value}</p>
      {detail ? <p className="price-secondary">{detail}</p> : null}
    </div>
  )
}

export function DetailSections({
  formats,
  deliverables,
  process,
  notes,
  labels,
}: {
  formats: Array<{ id: string; label: string; detail: string }>
  deliverables: string[]
  process: string[]
  notes: string[]
  labels: Pick<
    UiCopy['labels'],
    'serviceStructure' | 'serviceStructureTitle' | 'formats' | 'deliverables' | 'process' | 'notes'
  >
}) {
  return (
    <Section className="product-detail-section">
      <SectionHead
        eyebrow={labels.serviceStructure}
        title={labels.serviceStructureTitle}
      />

      <div className="product-modules-grid">
        <article className="product-module">
          <p className="eyebrow">{labels.formats}</p>
          <div className="product-line-list">
            {formats.map((format) => (
              <div key={format.id} className="product-line-item">
                <p className="detail-line-title">{format.label}</p>
                <p className="editorial-copy">{format.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="product-module">
          <p className="eyebrow">{labels.deliverables}</p>
          <ul className="product-list">
            {deliverables.map((item) => (
              <li key={item}>
                <span className="list-index">+</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="product-module product-module-wide">
          <p className="eyebrow">{labels.process}</p>
          <ol className="product-list product-list-ordered">
            {process.map((item, index) => (
              <li key={item}>
                <span className="list-index">{String(index + 1).padStart(2, '0')}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </article>

        <article className="product-module">
          <p className="eyebrow">{labels.notes}</p>
          <ul className="product-line-list">
            {notes.map((note) => (
              <li key={note} className="product-line-item">
                <p className="editorial-copy">{note}</p>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </Section>
  )
}

export function QuoteBand({
  title,
  text,
  compact = false,
}: {
  title: string
  text: string
  compact?: boolean
}) {
  return (
    <Section>
      <div className={cn('quote-band', compact && 'quote-band-compact')}>
        <p className="eyebrow">{title}</p>
        <p className="quote-copy">{text}</p>
      </div>
    </Section>
  )
}

function BrandLogo({
  className,
  alt,
  variant = 'main',
}: {
  className?: string
  alt: string
  variant?: 'main' | 'extended'
}) {
  return <img src={variant === 'extended' ? '/extended_black.svg' : '/main_black.svg'} alt={alt} className={className} />
}

export function TransformationGrid({
  offers,
  locale,
}: {
  offers: TransformationOfferEntity[]
  locale: Locale
}) {
  return (
    <Section>
      <div className="offer-grid offer-grid-third">
        {offers.map((offer, index) => (
          <article key={offer.slug} className="editorial-card editorial-card-compact">
            <div className="editorial-card-media">
              <img src={optimizedImageSrc(offer.media.src)} alt={offer.media.alt} className="editorial-card-image" loading="lazy" decoding="async" />
            </div>
            <div className="editorial-card-body">
              <p className="eyebrow">{offer.format}</p>
              <h2 className="card-title">{offer.title}</h2>
              <p className="editorial-copy">{offer.summary}</p>
              <CardActionRow>
                <span className="micro-tag">{String(index + 1).padStart(2, '0')}</span>
                <Link
                  to={buildLocalePath(locale, '/book')}
                  search={{ kind: 'transformation', slug: offer.slug }}
                  className="button-secondary"
                >
                  {offer.cta}
                </Link>
              </CardActionRow>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}

export function CourseGrid({
  courses,
  locale,
  cta,
}: {
  courses: CourseEntity[]
  locale: Locale
  cta: string
}) {
  return (
    <Section>
      <div className="offer-grid offer-grid-third">
        {courses.map((course) => {
          const cover = courseCoverAsset(course)

          return (
            <article key={course.slug} className="editorial-card editorial-card-compact">
              <div className="editorial-card-media">
                {cover ? (
                  <img src={optimizedImageSrc(cover.src)} alt={cover.alt || course.title} className="editorial-card-image" loading="lazy" decoding="async" />
                ) : null}
              </div>
              <div className="editorial-card-body">
                <p className="eyebrow">{course.format}</p>
                <h2 className="card-title">{course.title}</h2>
                <p className="editorial-copy">{course.summary}</p>
                <div className="detail-stack">
                  <div className="detail-line-item">
                    <p className="detail-line-title">{course.sessions}</p>
                  </div>
                  {course.details.map((detail) => (
                    <div key={detail} className="detail-line-item detail-line-item-note">
                      <p className="editorial-copy">{detail}</p>
                    </div>
                  ))}
                </div>
                <div className="price-row">
                  <div>
                    <p className="price-value">{course.price.eur}</p>
                    <p className="price-secondary">{course.price.uah}</p>
                  </div>
                  <Link
                    to={buildLocalePath(locale, '/book')}
                    search={{ kind: 'course', slug: course.slug }}
                    className="button-primary"
                  >
                    {cta}
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </Section>
  )
}

export function CollectionGallery({
  collection,
  locale,
  ui,
}: {
  collection: CollectionEntity
  locale: Locale
  ui: UiCopy
}) {
  return (
    <>
      <ProductDetailHero
        eyebrow={`PURITY / ${ui.labels.collection}`}
        title={collection.title}
        summary={collection.summary}
        media={collection.heroMedia}
        chips={collection.palette}
        action={
          <Link
            to={buildLocalePath(locale, '/book')}
            search={{ kind: 'collection', slug: collection.slug }}
            className="button-primary"
          >
            {collection.requestCta}
          </Link>
        }
        meta={[
          { label: ui.labels.palette, value: collection.palette.slice(0, 2).join(' / '), detail: collection.palette.slice(2).join(' / ') },
          { label: ui.labels.pricing, value: collection.priceNote, emphasis: true },
        ]}
      />

      <Section className="product-detail-section">
        <div className="product-story-layout">
          <div>
            <p className="eyebrow">{ui.labels.collectionStory}</p>
            <h2 className="section-title">{collection.title}</h2>
            <p className="editorial-copy max-w-[44rem]">{collection.story}</p>
          </div>

          <div className="product-modules-grid product-modules-grid-compact">
            <article className="product-module">
              <p className="eyebrow">{ui.labels.materials}</p>
              <TagCluster items={collection.materials} />
            </article>
            <article className="product-module">
              <p className="eyebrow">{ui.labels.silhouettes}</p>
              <TagCluster items={collection.silhouettes} />
            </article>
            <article className="product-module product-module-wide">
              <p className="eyebrow">{ui.labels.notes}</p>
              <ul className="product-line-list">
                {collection.editorialNotes.map((note) => (
                  <li key={note} className="product-line-item">
                    <p className="editorial-copy">{note}</p>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>

        <div className="collection-gallery-grid product-gallery-grid">
          {collection.gallery.map((asset, index) => (
            <figure key={asset.src} className={cn('collection-frame', index === 0 && 'collection-frame-large')}>
              <img src={optimizedImageSrc(asset.src)} alt={asset.alt} className="collection-frame-image" loading="lazy" decoding="async" />
              <figcaption className="collection-frame-caption">{asset.caption}</figcaption>
            </figure>
          ))}
        </div>
      </Section>
    </>
  )
}

function TagCluster({ items }: { items: string[] }) {
  return (
    <div className="micro-tag-row">
      {items.map((item) => (
        <span key={item} className="micro-tag">
          {item}
        </span>
      ))}
    </div>
  )
}

export function PortfolioGrid({
  cases,
  locale,
  cta,
}: {
  cases: PortfolioCaseEntity[]
  locale: Locale
  cta: string
}) {
  return (
    <Section>
      <div className="offer-grid offer-grid-third">
        {cases.map((entry) => (
          <ProductPreviewCard
            key={entry.slug}
            to={buildLocalePath(locale, `/portfolio/${entry.slug}`)}
            imageSrc={entry.heroMedia.src}
            imageAlt={entry.heroMedia.alt}
            eyebrow={entry.category}
            title={entry.title}
            summary={entry.summary}
            chips={entry.video ? [...entry.accents, 'Video'] : entry.accents}
            footer={
              <>
                <p className="editorial-copy max-w-[24rem]">{entry.outcome}</p>
                <Link to={buildLocalePath(locale, `/portfolio/${entry.slug}`)} className="button-secondary">
                  {cta}
                </Link>
              </>
            }
          />
        ))}
      </div>
    </Section>
  )
}

export function PortfolioCaseStory({
  entry,
  locale,
  ui,
}: {
  entry: PortfolioCaseEntity
  locale: Locale
  ui: UiCopy
}) {
  return (
    <>
      <ProductDetailHero
        eyebrow={`PURITY / ${ui.labels.portfolio}`}
        title={entry.title}
        summary={entry.summary}
        media={entry.heroMedia}
        chips={entry.accents}
        action={
          <Link
            to={buildLocalePath(locale, '/book')}
            search={{ kind: 'portfolio', slug: entry.slug }}
            className="button-primary"
          >
            {entry.requestCta}
          </Link>
        }
        meta={[
          { label: ui.labels.client, value: entry.client, detail: entry.context },
          { label: ui.labels.result, value: entry.outcome, emphasis: true },
        ]}
      />

      <Section className="product-detail-section">
        <div className="product-modules-grid">
          <article className="product-module">
            <p className="eyebrow">{ui.labels.challenge}</p>
            <p className="editorial-copy">{entry.challenge}</p>
          </article>
          <article className="product-module">
            <p className="eyebrow">{ui.labels.approach}</p>
            <p className="editorial-copy">{entry.approach}</p>
          </article>
          <article className="product-module">
            <p className="eyebrow">{ui.labels.result}</p>
            <p className="editorial-copy">{entry.outcome}</p>
          </article>
          <article className="product-module">
            <p className="eyebrow">{ui.labels.deliverables}</p>
            <ul className="product-list">
              {entry.deliverables.map((item) => (
                <li key={item}>
                  <span className="list-index">+</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </Section>

      <Section className="product-detail-section">
        <div className="collection-gallery-grid product-gallery-grid">
          {entry.gallery.map((asset, index) => (
            <figure key={asset.src} className={cn('collection-frame', index === 0 && 'collection-frame-large')}>
              <img src={optimizedImageSrc(asset.src)} alt={asset.alt} className="collection-frame-image" loading="lazy" decoding="async" />
              <figcaption className="collection-frame-caption">{asset.caption}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section>
        <div className="stats-grid">
          {entry.metrics.map((metric) => (
            <article key={metric.label} className="stat-block">
              <p className="eyebrow">{metric.label}</p>
              <p className="stat-value">{metric.value}</p>
              <p className="editorial-copy">{entry.category}</p>
            </article>
          ))}
        </div>
      </Section>

      {entry.video ? (
        <Section>
          <div className="quote-band quote-band-compact">
            <p className="eyebrow">{ui.labels.filmNote}</p>
            <p className="quote-copy">{entry.video.title}</p>
            <a className="button-secondary w-fit" href={entry.video.url} target="_blank" rel="noreferrer">
              {entry.video.provider}
            </a>
          </div>
        </Section>
      ) : null}

      <Section className="product-detail-section product-detail-final-cta">
        <Link
          to={buildLocalePath(locale, '/book')}
          search={{ kind: 'portfolio', slug: entry.slug }}
          className="button-primary"
        >
          {entry.requestCta}
        </Link>
      </Section>
    </>
  )
}

export function ContactsLayout({
  page,
  settings,
  locale,
  ui,
}: {
  page: ContactsPageData
  settings: StudioSettings
  locale: Locale
  ui: UiCopy
}) {
  return (
    <Section>
      <div className="editorial-two-column">
        <article className="editorial-panel">
          <SectionHead
            eyebrow={ui.labels.studioInquiry}
            title={page.inquiryTitle}
            subtitle={page.scheduleNote}
          />
          <ContactForm locale={locale} ui={ui} />
        </article>

        <aside className="editorial-side-stack">
          <div className="editorial-photo-panel">
            <img src="/images/purity_1.webp" alt={page.title} className="editorial-photo-image" loading="lazy" decoding="async" />
          </div>

          <article className="editorial-panel editorial-panel-compact">
            <p className="eyebrow">{page.corporateTitle}</p>
            <h2 className="section-subtitle">{page.corporateText}</h2>
            <Link to={buildLocalePath(locale, '/book')} className="button-secondary">
              {ui.actions.requestConsultation}
            </Link>
          </article>

          <article className="editorial-panel editorial-panel-compact">
            <p className="eyebrow">{settings.mapLabel}</p>
            <p className="editorial-copy">
              <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
              {settings.corporateEmail ? (
                <>
                  <br />
                  <a href={`mailto:${settings.corporateEmail}`}>{settings.corporateEmail}</a>
                </>
              ) : null}
              {settings.phone ? (
                <>
                  <br />
                  <a href={`tel:${settings.phone.replace(/\s+/g, '')}`}>{settings.phone}</a>
                </>
              ) : null}
              <br />
              {settings.locationLabel}
            </p>
            <div className="micro-tag-row">
              {settings.socialLinks.map((link) => (
                <a key={link.href} href={link.href} className="micro-tag" target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
              {settings.mapHref ? (
                <a href={settings.mapHref} className="micro-tag" target="_blank" rel="noreferrer">
                  {settings.mapLabel}
                </a>
              ) : null}
            </div>
          </article>
        </aside>
      </div>
    </Section>
  )
}

function ContactForm({
  locale,
  ui,
}: {
  locale: Locale
  ui: UiCopy
}) {
  const submitContact = useServerFn(submitContactLead)
  const navigate = useNavigate()
  const formRef = React.useRef<HTMLFormElement | null>(null)
  const lastSuccessfulSubmissionRef = React.useRef<Record<string, string> | null>(null)
  const [isEnhanced, setIsEnhanced] = React.useState(false)
  const [submission, setSubmission] = React.useState<{
    state: 'idle' | 'pending' | 'success' | 'error'
    message?: string
    canRetry?: boolean
  }>({ state: 'idle' })
  const pending = submission.state === 'pending'
  const submitDisabled = pending || !isEnhanced

  React.useEffect(() => {
    setIsEnhanced(true)
  }, [])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget

    if (pending) {
      analytics.track('contact_duplicate_submit_blocked', { locale })
      return
    }

    const form = new FormData(formElement)
    const payload = {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? ''),
      interest: String(form.get('interest') ?? ''),
      message: String(form.get('message') ?? ''),
    }

    if (
      lastSuccessfulSubmissionRef.current &&
      isDuplicateSubmission(lastSuccessfulSubmissionRef.current, payload)
    ) {
      setSubmission({ state: 'error', message: ui.contact.duplicate })
      analytics.track('contact_duplicate_submit_blocked', { locale })
      return
    }

    setSubmission({ state: 'pending', message: ui.contact.pending })
    analytics.track('contact_submit_started', { locale, interest: payload.interest || 'none' })

    try {
      const result = await submitContact({ data: { locale, ...payload } })

      if (result.status === 'failure') {
        setSubmission({ state: 'error', message: ui.contact.failure, canRetry: true })
        analytics.track('contact_submit_failed', {
          locale,
          reason: result.message ?? 'adapter-failure',
          reference: result.reference,
        })
        return
      }

      lastSuccessfulSubmissionRef.current = payload
      setSubmission({ state: 'success', message: ui.contact.success })
      formElement.reset()
      analytics.track('contact_submit_succeeded', {
        locale,
        interest: payload.interest || 'none',
        reference: result.reference,
      })
      void navigate({
        to: buildLocalePath(locale, '/contacts'),
        hash: 'contact-form',
      })
    } catch (submissionError) {
      setSubmission({ state: 'error', message: ui.contact.failure, canRetry: true })
      analytics.track('contact_submit_failed', {
        locale,
        reason: submissionError instanceof Error ? submissionError.message : 'unexpected-error',
      })
    }
  }

  return (
    <form
      id="contact-form"
      ref={formRef}
      className="editorial-form"
      method="post"
      data-enhanced={isEnhanced ? 'true' : 'false'}
      onSubmit={onSubmit}
      aria-busy={pending}
    >
      <label className="field">
        <span>{ui.contact.nameLabel}</span>
        <input required name="name" type="text" autoComplete="name" />
      </label>
      <div className="form-grid">
        <label className="field">
          <span>{ui.contact.emailLabel}</span>
          <input required name="email" type="email" autoComplete="email" />
        </label>
        <label className="field">
          <span>{ui.contact.phoneLabel}</span>
          <input required name="phone" type="tel" autoComplete="tel" />
        </label>
      </div>
      <label className="field">
        <span>{ui.contact.interestLabel}</span>
        <input name="interest" type="text" />
      </label>
      <label className="field">
        <span>{ui.contact.messageLabel}</span>
        <textarea required name="message" rows={5} />
      </label>
      {publicEnv.enablePrototypeFlows ? <p className="form-status">{ui.contact.prototypeNotice}</p> : null}
      <button className="button-primary w-fit" type="submit" disabled={submitDisabled}>
        {pending ? ui.actions.sending : ui.actions.sendInquiry}
      </button>

      {submission.canRetry ? (
        <button
          className="button-secondary w-fit"
          type="button"
          onClick={() => {
            analytics.track('contact_retry_requested', { locale })
            formRef.current?.requestSubmit()
          }}
        >
          {ui.actions.retry}
        </button>
      ) : null}

      <div aria-live="polite">
        {submission.message ? <p className="form-status">{submission.message}</p> : null}
      </div>
    </form>
  )
}

export function BookingLayout({
  locale,
  ui,
  title,
  summary,
  price,
  priceNote,
  media,
  meta,
  formats,
  intentKind,
  intentSlug,
}: {
  locale: Locale
  ui: UiCopy
  title: string
  summary: string
  price?: Price
  priceNote?: string
  media: { src: string; alt: string; caption?: string }
  meta: string[]
  formats: Array<{ id: string; label: string; detail: string }>
  intentKind: BookingIntentKind
  intentSlug: string
}) {
  const submitBooking = useServerFn(submitBookingLead)
  const formRef = React.useRef<HTMLFormElement | null>(null)
  const lastSuccessfulSubmissionRef = React.useRef<Record<string, string> | null>(null)
  const [isEnhanced, setIsEnhanced] = React.useState(false)
  const [submission, setSubmission] = React.useState<{
    state: 'idle' | 'pending' | 'success' | 'error'
    message?: string
    canRetry?: boolean
  }>({ state: 'idle' })
  const pending = submission.state === 'pending'
  const submitDisabled = pending || !isEnhanced
  const minBookingDate = React.useMemo(() => new Date().toISOString().slice(0, 10), [])

  React.useEffect(() => {
    setIsEnhanced(true)
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget

    if (pending) {
      analytics.track('booking_duplicate_submit_blocked', {
        locale,
        kind: intentKind,
        slug: intentSlug,
      })
      return
    }

    const form = new FormData(formElement)
    const payload = {
      kind: intentKind,
      slug: intentSlug,
      format: String(form.get('format') ?? ''),
      preferredDate: String(form.get('date') ?? ''),
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? ''),
      notes: String(form.get('notes') ?? ''),
    }

    if (
      lastSuccessfulSubmissionRef.current &&
      isDuplicateSubmission(lastSuccessfulSubmissionRef.current, payload)
    ) {
      setSubmission({ state: 'error', message: ui.booking.duplicate })
      analytics.track('booking_duplicate_submit_blocked', {
        locale,
        kind: intentKind,
        slug: intentSlug,
      })
      return
    }

    setSubmission({ state: 'pending', message: ui.booking.pending })
    analytics.track('booking_submit_started', {
      locale,
      kind: intentKind,
      slug: intentSlug,
      format: payload.format || 'none',
    })

    try {
      const result = await submitBooking({ data: {
        kind: payload.kind,
        slug: payload.slug,
        locale,
        format: payload.format,
        preferredDate: payload.preferredDate,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        notes: payload.notes,
      } })

      if (result.status === 'failure') {
        setSubmission({ state: 'error', message: ui.booking.failure, canRetry: true })
        analytics.track('booking_submit_failed', {
          locale,
          kind: intentKind,
          slug: intentSlug,
          reason: result.message ?? 'adapter-failure',
          reference: result.reference,
        })
        return
      }

      lastSuccessfulSubmissionRef.current = payload
      setSubmission({ state: 'success', message: ui.booking.success })
      analytics.track('booking_submit_succeeded', {
        locale,
        kind: intentKind,
        slug: intentSlug,
        reference: result.reference,
      })
    } catch (submissionError) {
      setSubmission({ state: 'error', message: ui.booking.failure, canRetry: true })
      analytics.track('booking_submit_failed', {
        locale,
        kind: intentKind,
        slug: intentSlug,
        reason: submissionError instanceof Error ? submissionError.message : 'unexpected-error',
      })
    }
  }

  return (
    <Section className="booking-section">
      <div className="booking-workspace">
        <aside className="booking-offer-panel">
          <figure className="booking-offer-media">
            <img
              src={optimizedImageSrc(media.src)}
              alt={media.alt}
              className="detail-hero-image"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </figure>

          <div className="booking-offer-copy">
            <div className="booking-kicker-row">
              <p className="eyebrow">{ui.labels.selectedOffer}</p>
              <span className="micro-tag">{ui.booking.leadRequestTag}</span>
            </div>

            <h1 className="section-title booking-title">{title}</h1>
            <p className="editorial-copy booking-summary">{summary}</p>

            {meta.length ? (
              <div className="micro-tag-row">
                {meta.slice(0, 4).map((item) => (
                  <span key={item} className="micro-tag">
                    {item}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="booking-meta-strip">
              {price ? (
                <>
                  <BookingMetaItem label="EUR" value={price.eur} />
                  <BookingMetaItem label="UAH" value={price.uah} />
                </>
              ) : (
                <BookingMetaItem
                  label={ui.booking.nextStepTitle}
                  value={priceNote ?? ui.booking.nextStepHint}
                />
              )}
            </div>

            <div className="booking-format-list">
              {formats.map((format, index) => (
                <div key={format.id} className="booking-format-row">
                  <span className="list-index">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="detail-line-title">{format.label}</p>
                    <p className="editorial-copy">{format.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <article className="booking-request-panel">
          <div className="booking-request-head">
            <p className="eyebrow">{`PURITY / ${ui.labels.requestStructure}`}</p>
            <h2 className="section-subtitle">{ui.booking.title}</h2>
            <p className="editorial-copy">{ui.booking.intro}</p>
          </div>

          <form
            ref={formRef}
            className="booking-form"
            method="post"
            data-enhanced={isEnhanced ? 'true' : 'false'}
            onSubmit={handleSubmit}
            aria-busy={pending}
          >
            <div className="booking-form-group">
              <p className="eyebrow">{ui.labels.sessionSetup}</p>
              <div className="form-grid form-grid-setup">
                <label className="field">
                  <span>{ui.actions.chooseFormat}</span>
                  <select required name="format" defaultValue="">
                    <option value="" disabled>
                      {ui.actions.chooseFormat}
                    </option>
                    {formats.map((format) => (
                      <option key={format.id} value={format.id}>
                        {format.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>{ui.booking.dateLabel}</span>
                  <input
                    required
                    type="date"
                    name="date"
                    min={minBookingDate}
                    autoComplete="off"
                  />
                </label>
              </div>
            </div>

            <div className="booking-form-group">
              <p className="eyebrow">{ui.labels.clientContact}</p>
              <div className="form-grid">
                <label className="field">
                  <span>{ui.booking.nameLabel}</span>
                  <input required type="text" name="name" autoComplete="name" />
                </label>
                <label className="field">
                  <span>{ui.booking.phoneLabel}</span>
                  <input required type="tel" name="phone" autoComplete="tel" />
                </label>
              </div>

              <label className="field">
                <span>{ui.booking.emailLabel}</span>
                <input required type="email" name="email" autoComplete="email" />
              </label>
            </div>

            <div className="booking-form-group">
              <label className="field">
                <span>{ui.booking.notesLabel}</span>
                <textarea rows={4} name="notes" />
              </label>
              <p className="field-help">{ui.booking.nextStepHint}</p>
            </div>

            <div className="booking-submit-row">
              <button className="button-primary" type="submit" disabled={submitDisabled}>
                {pending ? ui.actions.processing : ui.actions.submit}
              </button>

              {submission.canRetry ? (
                <button
                  className="button-secondary"
                  type="button"
                  onClick={() => {
                    analytics.track('booking_retry_requested', {
                      locale,
                      kind: intentKind,
                      slug: intentSlug,
                    })
                    formRef.current?.requestSubmit()
                  }}
                >
                  {ui.actions.retry}
                </button>
              ) : null}
            </div>

            <div className={cn('booking-status-region', submission.state !== 'idle' && `booking-status-${submission.state}`)} aria-live="polite">
              {submission.message ? <p className="form-status">{submission.message}</p> : null}
            </div>
          </form>
        </article>
      </div>
    </Section>
  )
}
