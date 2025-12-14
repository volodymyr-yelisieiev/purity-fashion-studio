'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { routing } from '@/i18n/routing'

const localeNames: Record<string, string> = {
  uk: 'UA',
  ru: 'RU',
  en: 'EN',
}

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (newLocale: string) => {
    // Remove current locale prefix if exists
    let newPath = pathname

    for (const loc of routing.locales) {
      if (pathname.startsWith(`/${loc}/`)) {
        newPath = pathname.slice(loc.length + 1)
        break
      } else if (pathname === `/${loc}`) {
        newPath = '/'
        break
      }
    }

    // Add new locale prefix (except for default locale with 'as-needed')
    if (newLocale === routing.defaultLocale) {
      router.push(newPath)
    } else {
      router.push(`/${newLocale}${newPath}`)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLocaleChange(loc)}
          className={`text-body-xs uppercase tracking-widest transition-colors ${
            locale === loc
              ? 'text-foreground font-medium'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          aria-current={locale === loc ? 'true' : undefined}
        >
          {localeNames[loc]}
        </button>
      ))}
    </div>
  )
}
