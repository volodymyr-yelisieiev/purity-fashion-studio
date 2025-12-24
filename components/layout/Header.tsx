'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/navigation'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher, Button } from '@/components/ui'
import { MiniCart } from '@/components/cart'
import { navItems } from '@/config/navigation'
import { motion, AnimatePresence } from 'motion/react'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const t = useTranslations('navigation')
  const tCommon = useTranslations('common')

  // Close menu when pathname changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false)
  }, [pathname])

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-110 bg-white border-b border-neutral-200">
        <div className="container px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - Responsive text size */}
            <Link 
              href="/" 
              className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight font-serif"
              onClick={() => setIsOpen(false)}
            >
              PURITY
            </Link>
            
            <div className="flex items-center gap-4 md:gap-6">
              <MiniCart />
              
              {/* Menu Button - Responsive text */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-xs md:text-sm uppercase tracking-widest hover:opacity-70 transition-opacity font-medium"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
              >
                {isOpen ? t('close') || 'Close' : t('menu') || 'Menu'}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-90"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            
            {/* Menu Content - Responsive layout */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-16 md:top-20 left-0 right-0 bg-white border-b border-neutral-200 z-100 shadow-xl max-h-[calc(100vh-4rem)] md:max-h-[calc(100vh-5rem)] overflow-y-auto"
            >
              <div className="container px-4 md:px-6 lg:px-8 py-8 md:py-12">
                <nav 
                  className="flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-center gap-4 md:gap-4 lg:gap-6 xl:gap-8"
                  aria-label="Main navigation"
                >
                  {navItems.map((item) => (
                    <Link 
                      key={item.key}
                      href={item.href}
                      className="text-sm md:text-xs lg:text-sm uppercase tracking-widest hover:opacity-70 transition-opacity font-medium whitespace-nowrap"
                      onClick={() => setIsOpen(false)}
                    >
                      {t(item.key)}
                    </Link>
                  ))}
                </nav>

                {/* Booking button */}
                <div className="mt-8 md:mt-12 flex justify-center">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => setIsOpen(false)}
                    asChild
                  >
                    <Link href="/contact">
                      {tCommon('bookConsultation')}
                    </Link>
                  </Button>
                </div>
                
                <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-neutral-100 flex flex-col items-center gap-4">
                  <p className="text-[10px] md:text-xs uppercase tracking-widest text-neutral-400">{t('language')}</p>
                  <LanguageSwitcher />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
