'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { navItems } from '@/config/navigation'

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const t = useTranslations('navigation')
  
  const closeMenu = () => setOpen(false)
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button 
          className="p-2 cursor-pointer md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-70 sm:w-87.5">
        <SheetHeader className="sr-only">
          <SheetTitle>Mobile Menu</SheetTitle>
          <SheetDescription>Navigation links</SheetDescription>
        </SheetHeader>
        
        <nav className="flex flex-col gap-6 mt-8">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={closeMenu}
              className="text-lg font-medium cursor-pointer hover:text-foreground/70 transition-colors"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4">{t('language')}</p>
          <LanguageSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  )
}
