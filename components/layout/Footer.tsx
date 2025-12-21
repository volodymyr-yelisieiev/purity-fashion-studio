import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/ui'
import { navItems } from '@/config/navigation'

export function Footer() {
  const t = useTranslations('footer')
  
  return (
    <footer className="border-t border-border bg-muted py-12">
      <Container>
        <div className="flex flex-col md:flex-row gap-12 md:gap-16">
          
          {/* Column 1: PURITY */}
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-6">PURITY</h4>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t('description')}
            </p>
          </div>
          
          {/* Column 2: Navigation */}
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-6">{t('navigation')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors cursor-pointer"
                  >
                    {t(`links.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3: Contact */}
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-6">{t('contact')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a 
                  href="mailto:info@purity-fashion-studio.ua" 
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  info@purity-fashion-studio.ua
                </a>
              </li>
              <li>
                <a 
                  href="tel:+380123456789" 
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  +380 12 345 67 89
                </a>
              </li>
              <li className="pt-4">
                <a 
                  href="https://instagram.com/purity.fashion.studio" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href="https://facebook.com/purity.fashion.studio" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
          
        </div>
        
        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {t('rights')}
          </p>
        </div>
      </Container>
    </footer>
  )
}
