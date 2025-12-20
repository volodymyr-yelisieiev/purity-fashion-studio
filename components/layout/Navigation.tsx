'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { navItems } from '@/config/navigation'

export function Navigation() {
  const t = useTranslations('navigation')

  return (
    <ul className="flex gap-6">
      {navItems.map((item) => (
        <li key={item.key}>
          <Link
            href={item.href}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            prefetch={false}
          >
            {t(item.key)}
          </Link>
        </li>
      ))}
    </ul>
  )
}
