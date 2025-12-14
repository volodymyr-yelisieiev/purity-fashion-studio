'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

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
        <SheetClose asChild>
          <button 
            className="absolute right-4 top-4 cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </SheetClose>
        
        <nav className="flex flex-col gap-6 mt-8">
          <Link 
            href="/" 
            onClick={closeMenu}
            className="text-lg font-medium cursor-pointer hover:text-foreground/70 transition-colors"
          >
            {t('home')}
          </Link>
          <Link 
            href="/about" 
            onClick={closeMenu}
            className="text-lg font-medium cursor-pointer hover:text-foreground/70 transition-colors"
          >
            {t('about')}
          </Link>
          <Link 
            href="/services" 
            onClick={closeMenu}
            className="text-lg font-medium cursor-pointer hover:text-foreground/70 transition-colors"
          >
            {t('services')}
          </Link>
          <Link 
            href="/portfolio" 
            onClick={closeMenu}
            className="text-lg font-medium cursor-pointer hover:text-foreground/70 transition-colors"
          >
            {t('portfolio')}
          </Link>
          <Link 
            href="/collections" 
            onClick={closeMenu}
            className="text-lg font-medium cursor-pointer hover:text-foreground/70 transition-colors"
          >
            {t('collections')}
          </Link>
          <Link 
            href="/school" 
            onClick={closeMenu}
            className="text-lg font-medium cursor-pointer hover:text-foreground/70 transition-colors"
          >
            {t('school')}
          </Link>
          <Link 
            href="/contact" 
            onClick={closeMenu}
            className="text-lg font-medium cursor-pointer hover:text-foreground/70 transition-colors"
          >
            {t('contact')}
          </Link>
        </nav>
        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4">{t('language')}</p>
          <LanguageSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  )
}
