'use client'

import { Link } from '@/i18n/navigation'
import { Navigation } from './Navigation'
import { MobileMenu } from './MobileMenu'
import { LanguageSwitcher, Container } from '@/components/ui'
import { MiniCart } from '@/components/cart'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-foreground font-serif" prefetch={false}>
          PURITY
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <Navigation />
          <LanguageSwitcher />
          <MiniCart />
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <MiniCart />
          <MobileMenu />
        </div>
      </Container>
    </header>
  )
}
