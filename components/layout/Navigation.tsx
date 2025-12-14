'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

const navItems = [
  { href: '/services', key: 'services' },
  { href: '/portfolio', key: 'portfolio' },
  { href: '/collections', key: 'collections' },
  { href: '/school', key: 'school' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
] as const

export function Navigation() {
  const t = useTranslations('navigation')

  return (
    <ul className="flex gap-6">
      {navItems.map((item) => (
        <li key={item.key}>
          <Link
            href={item.href}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
            prefetch={false}
          >
            {t(item.key)}
          </Link>
        </li>
      ))}
    </ul>
  )
}
