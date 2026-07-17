"use client"

import {
  ArrowSquareOutIcon as ExternalLinkIcon,
  ListIcon as MenuIcon,
  XIcon,
} from "@phosphor-icons/react"
import Link from "next/link"
import * as React from "react"

import { BrandLogo, LanguageSwitcher } from "@/components/purity"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { siteSettings } from "@/content/source"
import type {
  FooterData,
  HeaderData,
  SiteSettingsData,
} from "@/content/public-api"
import { getFooterNavigation, getNavigation } from "@/content/routes"
import { localizePath, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

const menuLabel = {
  uk: "Меню",
  ru: "Меню",
  en: "Menu",
} as const

const footerLabels = {
  directions: {
    uk: "Напрями",
    ru: "Направления",
    en: "Directions",
  },
  contacts: {
    uk: "Контакти",
    ru: "Контакты",
    en: "Contacts",
  },
} as const

function MenuToggleIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex size-6 items-center justify-center text-2xl">
      <MenuIcon
        aria-hidden="true"
        data-icon="inline-start"
        className={cn(
          "absolute transition duration-200",
          open
            ? "rotate-90 opacity-0 group-data-ending-style/menu:rotate-0 group-data-ending-style/menu:opacity-100 group-data-starting-style/menu:rotate-0 group-data-starting-style/menu:opacity-100"
            : "rotate-0 opacity-100"
        )}
      />
      <XIcon
        aria-hidden="true"
        data-icon="inline-start"
        className={cn(
          "absolute transition duration-200",
          open
            ? "rotate-0 opacity-100 group-data-ending-style/menu:rotate-90 group-data-ending-style/menu:opacity-0 group-data-starting-style/menu:rotate-90 group-data-starting-style/menu:opacity-0"
            : "-rotate-90 opacity-0"
        )}
      />
    </span>
  )
}

function ShellLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center transition-opacity hover:opacity-65 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className
      )}
    >
      {children}
    </Link>
  )
}

function SiteHeaderClient({
  locale,
  currentPath = "/",
  overlay = true,
  headerData,
  settingsData,
}: {
  locale: Locale
  currentPath?: string
  overlay?: boolean
  headerData?: HeaderData
  settingsData?: SiteSettingsData
}) {
  const navigation = headerData
    ? headerData.navigation
        .filter((item) => item.visible)
        .map((item) => ({
          id: item.path,
          label: item.label,
          href: item.external ? item.path : localizePath(locale, item.path),
        }))
    : getNavigation(locale)
  const bookingItem = navigation.find(
    (item) => item.id === "booking" || item.id === "/booking"
  )
  const primaryNavigation = navigation.filter(
    (item) => item.id !== "booking" && item.id !== "/booking"
  )
  const bookingHref = bookingItem?.href ?? localizePath(locale, "/booking")
  const bookingLabel =
    headerData?.bookingLabel ??
    bookingItem?.label ??
    siteSettings.home.primaryCta.label[locale]
  const brandName = settingsData?.brandName ?? siteSettings.brandName
  const languageLabel = siteSettings.languageLabel[locale]
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [menuClosing, setMenuClosing] = React.useState(false)
  const [isAtTop, setIsAtTop] = React.useState(true)
  const menuContentRef = React.useRef<HTMLDivElement>(null)
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const transparent = overlay && isAtTop
  const lightHeader = transparent && !menuOpen

  const clearCloseTimer = React.useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const requestMenuState = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        clearCloseTimer()
        setMenuClosing(false)
        setMenuOpen(true)
        return
      }

      if (!menuOpen || menuClosing) {
        return
      }

      setMenuClosing(true)
      closeTimerRef.current = setTimeout(() => {
        setMenuOpen(false)
        setMenuClosing(false)
        closeTimerRef.current = null
      }, 160)
    },
    [clearCloseTimer, menuClosing, menuOpen]
  )

  React.useEffect(() => {
    const updateHeader = () => setIsAtTop(window.scrollY < 12)

    updateHeader()
    window.addEventListener("scroll", updateHeader, { passive: true })

    return () => window.removeEventListener("scroll", updateHeader)
  }, [])

  React.useEffect(() => () => clearCloseTimer(), [clearCloseTimer])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 px-6 py-4 text-xs uppercase transition-colors md:px-10",
        lightHeader
          ? "text-primary-foreground"
          : transparent
            ? "text-foreground"
            : "bg-background text-muted-foreground"
      )}
    >
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-5">
        <Link
          href={localizePath(locale)}
          aria-label={brandName}
          className="flex min-h-11 w-32 shrink-0 items-center focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:w-36"
        >
          <BrandLogo
            locale={locale}
            variant={lightHeader ? "reversedWordmark" : "wordmark"}
            priority
          />
        </Link>
        <nav
          aria-label={brandName}
          data-testid="desktop-navigation"
          className="hidden min-w-0 flex-1 items-center justify-center gap-4 whitespace-nowrap xl:flex"
        >
          {primaryNavigation.map((item) => (
            <ShellLink key={item.id} href={item.href}>
              {item.label}
            </ShellLink>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-2">
          <div
            className="hidden shrink-0 items-center xl:flex"
            data-testid="header-utilities"
          >
            <LanguageSwitcher
              currentLocale={locale}
              currentPath={currentPath}
              ariaLabel={languageLabel}
              linkClassName={
                lightHeader
                  ? "text-primary-foreground/70 hover:text-primary-foreground"
                  : undefined
              }
            />
            <Link
              href={bookingHref}
              data-testid="header-booking-cta"
              className={cn(
                buttonVariants({
                  variant: lightHeader ? "secondary" : "default",
                  size: "sm",
                  className: "min-h-11",
                })
              )}
            >
              {bookingLabel}
            </Link>
          </div>
          <Sheet
            modal="trap-focus"
            open={menuOpen}
            onOpenChange={requestMenuState}
          >
            <Button
              type="button"
              aria-label={menuLabel[locale]}
              aria-hidden={menuOpen || undefined}
              aria-controls="mobile-site-menu"
              aria-expanded={menuOpen}
              data-testid="mobile-menu-trigger"
              variant="ghost"
              size="icon-lg"
              className={cn(
                "xl:hidden",
                menuOpen && "pointer-events-none opacity-0"
              )}
              tabIndex={menuOpen ? -1 : undefined}
              onClick={() => requestMenuState(!menuOpen)}
            >
              <MenuToggleIcon open={menuOpen} />
            </Button>
            <SheetContent
              id="mobile-site-menu"
              ref={menuContentRef}
              initialFocus={menuContentRef}
              data-closing={menuClosing || undefined}
              className="group/menu inset-0 size-full overscroll-contain border-0 shadow-none transition-[clip-path] duration-300 ease-out [clip-path:circle(150vmax_at_calc(100%_-_2.875rem)_2.375rem)] data-ending-style:[clip-path:circle(0_at_calc(100%_-_2.875rem)_2.375rem)] data-starting-style:[clip-path:circle(0_at_calc(100%_-_2.875rem)_2.375rem)] data-[side=right]:left-0 data-[side=right]:w-full data-[side=right]:max-w-none data-[side=right]:border-0 data-[side=right]:data-ending-style:translate-x-0 data-[side=right]:data-starting-style:translate-x-0 sm:size-full sm:max-w-none"
              showCloseButton={false}
              side="right"
            >
              <SheetHeader className="flex-row items-center justify-between px-6 py-4 md:px-10">
                <Link
                  href={localizePath(locale)}
                  aria-label={brandName}
                  className="flex min-h-11 w-32 items-center focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:w-36"
                >
                  <BrandLogo locale={locale} variant="wordmark" priority />
                </Link>
                <SheetClose
                  aria-label={siteSettings.closeLabel[locale]}
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-lg"
                      className="xl:hidden"
                    />
                  }
                >
                  <MenuToggleIcon open />
                </SheetClose>
                <SheetTitle className="sr-only">
                  {brandName}
                </SheetTitle>
                <SheetDescription className="sr-only">
                  {menuLabel[locale]}
                </SheetDescription>
              </SheetHeader>
              <div className="grid flex-1 content-start gap-10 overflow-y-auto px-6 pt-16 pb-8 opacity-100 transition-opacity delay-150 duration-150 group-data-ending-style/menu:opacity-0 group-data-ending-style/menu:delay-0 group-data-ending-style/menu:duration-100 group-data-starting-style/menu:opacity-0 group-data-[closing=true]/menu:opacity-0 group-data-[closing=true]/menu:delay-0 md:px-10">
                <nav
                  aria-label={siteSettings.brandName}
                  data-testid="mobile-navigation"
                  className="grid font-heading text-3xl leading-none uppercase"
                >
                  {primaryNavigation.map((item) => (
                    <ShellLink
                      key={item.id}
                      href={item.href}
                      className="min-h-14 py-2"
                    >
                      {item.label}
                    </ShellLink>
                  ))}
                </nav>
                <Link
                  href={bookingHref}
                  data-testid="mobile-booking-cta"
                  className={cn(
                    buttonVariants({
                      variant: "default",
                      size: "lg",
                      className: "min-h-14 w-full",
                    })
                  )}
                >
                  {bookingLabel}
                </Link>
                <LanguageSwitcher
                  currentLocale={locale}
                  currentPath={currentPath}
                  ariaLabel={languageLabel}
                  className="mt-auto"
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function SiteFooterClient({
  locale,
  currentPath = "/",
  footerData,
  headerData,
  settingsData,
}: {
  locale: Locale
  currentPath?: string
  footerData?: FooterData
  headerData?: HeaderData
  settingsData?: SiteSettingsData
}) {
  const navigation = headerData
    ? headerData.navigation
        .filter((item) => item.visible && item.path !== "/booking")
        .map((item) => ({
          id: item.path,
          label: item.label,
          href: item.external ? item.path : localizePath(locale, item.path),
        }))
    : getNavigation(locale)
  const footerNavigation = footerData
    ? footerData.legalNavigation.map((item) => ({
        id: item.path,
        label: item.label,
        href: localizePath(locale, item.path),
      }))
    : getFooterNavigation(locale)
  const languageLabel = siteSettings.languageLabel[locale]
  const brandName = settingsData?.brandName ?? siteSettings.brandName
  const city = footerData ? "" : siteSettings.contacts.city[locale]
  const address = footerData
    ? footerData.address
    : siteSettings.contacts.address[locale].replace(
        new RegExp(`^${city}\\s*`),
        ""
      )
  const phones = footerData
    ? [footerData.phone]
    : siteSettings.contacts.phones
  const email = footerData?.email ?? siteSettings.contacts.email
  const hours = footerData?.hours ?? siteSettings.contacts.hours[locale]
  const socials = footerData
    ? footerData.socialLinks.map((item) => ({
        label: item.platform,
        url: item.url,
      }))
    : siteSettings.contacts.socials

  return (
    <footer className="bg-foreground px-6 py-14 text-xs text-background/65 md:px-10 md:py-20">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-[minmax(18rem,1.6fr)_max-content_max-content_minmax(18rem,1fr)] lg:gap-x-16">
        <div className="grid min-w-0 content-start gap-3">
          <BrandLogo
            locale={locale}
            variant="reversedLockup"
            className="w-56 max-w-full"
          />
          <address className="mt-1 max-w-72 not-italic">
            {city && (
              <p className="leading-6 font-semibold text-background">{city}</p>
            )}
            <p className="leading-6">{address}</p>
          </address>
          <p className="leading-6 break-words">{hours}</p>
        </div>

        <nav
          aria-label={footerLabels.directions[locale]}
          className="grid min-w-0 content-start uppercase"
        >
          <p className="mb-6 font-semibold text-background">
            {footerLabels.directions[locale]}
          </p>
          {navigation.slice(0, 8).map((item) => (
            <ShellLink key={item.id} href={item.href}>
              {item.label}
            </ShellLink>
          ))}
        </nav>

        <nav
          aria-label={brandName}
          className="grid min-w-0 content-start uppercase"
        >
          <p className="mb-6 font-semibold text-background">
            {brandName}
          </p>
          {footerNavigation.map((item) => (
            <ShellLink key={item.id} href={item.href}>
              {item.label}
            </ShellLink>
          ))}
        </nav>

        <div className="grid min-w-0 content-start uppercase">
          <p className="mb-6 font-semibold text-background">
            {footerLabels.contacts[locale]}
          </p>
          {phones.map((phone) => (
            <a
              key={phone}
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="inline-flex min-h-11 items-center break-words transition-opacity hover:opacity-65 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {phone}
            </a>
          ))}
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex min-h-11 items-center transition-opacity hover:opacity-65 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {email}
            </a>
          )}
          <Link
            href={localizePath(locale, siteSettings.contacts.actionPath)}
            data-testid="footer-booking-cta"
            className={cn(
              buttonVariants({
                variant: "secondary",
                size: "sm",
                className: "mt-2 min-h-11 w-fit max-w-full",
              })
            )}
          >
            {headerData?.bookingLabel ??
              siteSettings.contacts.actionLabel[locale]}
          </Link>
          <div className="mt-2 flex flex-wrap gap-2">
            {!footerData && (
              <a
                href={siteSettings.contacts.viberUrl}
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "min-h-11",
                  })
                )}
              >
                Viber
                <ExternalLinkIcon aria-hidden="true" data-icon="inline-end" />
                <span className="sr-only">
                  {siteSettings.externalLinkLabel[locale]}
                </span>
              </a>
            )}
            {socials.map((social) => (
              <a
                key={social.url}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                data-testid="footer-social-link"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "min-h-11",
                  })
                )}
              >
                {social.label}
                <ExternalLinkIcon aria-hidden="true" data-icon="inline-end" />
                <span className="sr-only">
                  {siteSettings.externalLinkLabel[locale]}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 grid max-w-screen-2xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-6 border-t border-background/20 pt-6">
        <LanguageSwitcher
          currentLocale={locale}
          currentPath={currentPath}
          ariaLabel={languageLabel}
          linkClassName="text-background/65 hover:text-background"
        />
        <div aria-hidden="true" className="shrink-0">
          <BrandLogo
            locale={locale}
            variant="mark"
            decorative
            className="w-7 opacity-55"
          />
        </div>
        <span aria-hidden="true" />
      </div>
    </footer>
  )
}

export { SiteFooterClient, SiteHeaderClient }
