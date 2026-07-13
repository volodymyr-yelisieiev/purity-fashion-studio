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
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { EnhancedContrastToggle } from "@/components/theme-provider"
import { siteSettings } from "@/content/source"
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
        "inline-flex min-h-11 min-w-11 items-center break-words hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className
      )}
    >
      {children}
    </Link>
  )
}

function SiteHeader({
  locale,
  currentPath = "/",
}: {
  locale: Locale
  currentPath?: string
}) {
  const navigation = getNavigation(locale)
  const bookingItem = navigation.find((item) => item.id === "booking")
  const primaryNavigation = navigation.filter((item) => item.id !== "booking")
  const bookingHref = bookingItem?.href ?? localizePath(locale, "/booking")
  const bookingLabel =
    bookingItem?.label ?? siteSettings.home.primaryCta.label[locale]
  const languageLabel = siteSettings.languageLabel[locale]
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <header className="border-b border-border bg-background/95 px-6 py-5 text-xs text-muted-foreground uppercase md:px-10">
      <div className="mx-auto grid max-w-6xl gap-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={localizePath(locale)}
            aria-label={siteSettings.brandName}
            className="flex min-h-11 w-40 items-center focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:w-48"
          >
            <BrandLogo locale={locale} priority />
          </Link>
          <div className="flex items-center justify-end gap-2">
            <div
              className="hidden items-center md:flex"
              data-testid="header-utilities"
            >
              <EnhancedContrastToggle
                label={siteSettings.contrastLabel[locale]}
                className="px-3"
              />
              <LanguageSwitcher
                currentLocale={locale}
                currentPath={currentPath}
                ariaLabel={languageLabel}
              />
              <Link
                href={bookingHref}
                data-testid="header-booking-cta"
                className={cn(
                  buttonVariants({
                    variant: "default",
                    size: "sm",
                    className: "min-h-11",
                  })
                )}
              >
                {bookingLabel}
              </Link>
            </div>
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <Button
                type="button"
                aria-label={menuLabel[locale]}
                aria-expanded={menuOpen}
                aria-haspopup="dialog"
                data-testid="mobile-menu-trigger"
                onClick={() => setMenuOpen(true)}
                variant="outline"
                size="icon"
                className="size-11 md:hidden"
              >
                <MenuIcon />
              </Button>
              <SheetContent
                className="w-full bg-background sm:w-3/4"
                showCloseButton={false}
                side="right"
              >
                <SheetClose
                  render={
                    <Button
                      className="absolute top-4 right-4"
                      size="icon-sm"
                      variant="ghost"
                    />
                  }
                >
                  <XIcon />
                  <span className="sr-only">
                    {siteSettings.closeLabel[locale]}
                  </span>
                </SheetClose>
                <SheetHeader className="pr-16">
                  <SheetTitle className="sr-only">
                    {siteSettings.brandName}
                  </SheetTitle>
                  <BrandLogo locale={locale} className="w-36" />
                  <SheetDescription className="sr-only">
                    {menuLabel[locale]}
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-6 px-8">
                  <nav
                    aria-label={siteSettings.brandName}
                    data-testid="mobile-navigation"
                    className="grid text-xs text-muted-foreground uppercase"
                  >
                    {primaryNavigation.map((item) => (
                      <ShellLink key={item.id} href={item.href}>
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
                        size: "sm",
                        className: "min-h-11 w-full",
                      })
                    )}
                  >
                    {bookingLabel}
                  </Link>
                </div>
                <Separator className="mx-8 my-6 w-auto" />
                <div className="grid gap-4 px-8">
                  <EnhancedContrastToggle
                    label={siteSettings.contrastLabel[locale]}
                    className="w-fit"
                  />
                  <LanguageSwitcher
                    currentLocale={locale}
                    currentPath={currentPath}
                    ariaLabel={languageLabel}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <nav
          aria-label={siteSettings.brandName}
          className="hidden flex-wrap gap-x-4 md:flex"
        >
          {primaryNavigation.map((item) => (
            <ShellLink key={item.id} href={item.href}>
              {item.label}
            </ShellLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

function SiteFooter({
  locale,
  currentPath = "/",
}: {
  locale: Locale
  currentPath?: string
}) {
  const navigation = getNavigation(locale)
  const footerNavigation = getFooterNavigation(locale)
  const languageLabel = siteSettings.languageLabel[locale]
  const city = siteSettings.contacts.city[locale]
  const address = siteSettings.contacts.address[locale].replace(
    new RegExp(`^${city}\\s*`),
    ""
  )

  return (
    <footer className="border-t border-border bg-background px-6 py-10 text-xs text-muted-foreground md:px-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-[minmax(14rem,1.5fr)_max-content_max-content_minmax(14rem,1fr)] lg:gap-x-16">
        <div className="grid min-w-0 content-start gap-2">
          <BrandLogo locale={locale} variant="lockup" className="w-40" />
          <address className="mt-1 max-w-72 not-italic">
            <p className="font-semibold leading-6 text-foreground">{city}</p>
            <p className="leading-6">{address}</p>
          </address>
          <p className="leading-6 break-words">
            {siteSettings.contacts.hours[locale]}
          </p>
        </div>

        <nav
          aria-label={footerLabels.directions[locale]}
          className="grid min-w-0 content-start uppercase"
        >
          <p className="font-semibold text-foreground">
            {footerLabels.directions[locale]}
          </p>
          {navigation.slice(0, 8).map((item) => (
            <ShellLink key={item.id} href={item.href}>
              {item.label}
            </ShellLink>
          ))}
        </nav>

        <nav
          aria-label={siteSettings.brandName}
          className="grid min-w-0 content-start uppercase"
        >
          <p className="font-semibold text-foreground">
            {siteSettings.brandName}
          </p>
          {footerNavigation.map((item) => (
            <ShellLink key={item.id} href={item.href}>
              {item.label}
            </ShellLink>
          ))}
        </nav>

        <div className="grid min-w-0 content-start uppercase">
          <p className="font-semibold text-foreground">
            {footerLabels.contacts[locale]}
          </p>
          {siteSettings.contacts.phones.map((phone) => (
            <a
              key={phone}
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="inline-flex min-h-11 items-center break-words hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {phone}
            </a>
          ))}
          {siteSettings.contacts.email && (
            <a
              href={`mailto:${siteSettings.contacts.email}`}
              className="inline-flex min-h-11 items-center [overflow-wrap:anywhere] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {siteSettings.contacts.email}
            </a>
          )}
          <Link
            href={localizePath(locale, siteSettings.contacts.actionPath)}
            data-testid="footer-booking-cta"
            className={cn(
              buttonVariants({
                variant: "default",
                size: "sm",
                className: "mt-2 min-h-11 w-fit max-w-full",
              })
            )}
          >
            {siteSettings.contacts.actionLabel[locale]}
          </Link>
          <div className="mt-2 flex flex-wrap gap-2">
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
              <ExternalLinkIcon aria-hidden="true" className="size-3.5" />
              <span className="sr-only">
                {siteSettings.externalLinkLabel[locale]}
              </span>
            </a>
            {siteSettings.contacts.socials.map((social) => (
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
                <ExternalLinkIcon aria-hidden="true" className="size-3.5" />
                <span className="sr-only">
                  {siteSettings.externalLinkLabel[locale]}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-6xl border-t border-border pt-4">
        <LanguageSwitcher
          currentLocale={locale}
          currentPath={currentPath}
          ariaLabel={languageLabel}
        />
      </div>
    </footer>
  )
}

export { SiteFooter, SiteHeader }
