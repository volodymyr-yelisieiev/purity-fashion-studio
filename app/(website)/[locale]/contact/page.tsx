import { getTranslations } from 'next-intl/server'
import { HeroSection } from '@/components/sections'
import { generateSeoMetadata } from '@/lib/seo'
import { H3, Label, Section, Container, Grid, Button } from '@/components/ui'
import type { Metadata } from 'next'
import { ChevronDown } from 'lucide-react'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  return generateSeoMetadata({
    title: `${t('title')} | PURITY Fashion Studio`,
    description: t('description'),
    path: '/contact',
    locale,
  })
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  return (
    <main>
      <HeroSection
        title={t('title')}
        subtitle={t('description')}
      />

      <Section spacing="md">
        <Container size="md">
          <Grid cols={2} gap="lg">
            {/* Contact Info */}
            <div>
              <H3 className="mb-8">{t('info.title')}</H3>

              <div className="space-y-8">
                <div>
                  <Label className="mb-2 block">{t('info.address.label')}</Label>
                  <p className="text-base text-foreground">
                    {t('info.address.value')}
                  </p>
                </div>

                <div>
                  <Label className="mb-2 block">{t('info.phone.label')}</Label>
                  <a
                    href="tel:+380991234567"
                    className="text-base text-foreground transition-colors hover:text-muted-foreground"
                  >
                    +380 99 123 45 67
                  </a>
                </div>

                <div>
                  <Label className="mb-2 block">{t('info.email.label')}</Label>
                  <a
                    href="mailto:hello@purity.studio"
                    className="text-base text-foreground transition-colors hover:text-muted-foreground"
                  >
                    hello@purity.studio
                  </a>
                </div>

                <div>
                  <Label className="mb-2 block">{t('info.hours.label')}</Label>
                  <p className="text-base text-foreground">
                    {t('info.hours.value')}
                  </p>
                </div>

                <div>
                  <Label className="mb-4 block">{t('info.social.label')}</Label>
                  <div className="flex gap-4">
                    <a
                      href="https://instagram.com/purity.studio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground transition-colors hover:text-muted-foreground"
                    >
                      Instagram
                    </a>
                    <a
                      href="https://t.me/purity_studio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground transition-colors hover:text-muted-foreground"
                    >
                      Telegram
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <H3 className="mb-8">{t('form.title')}</H3>

              <form className="space-y-6">
                <div>
                  <Label className="mb-2 block">{t('form.name.label')}</Label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full border border-border bg-background px-4 py-3 text-base text-foreground transition-colors focus:border-foreground focus:outline-none"
                    placeholder={t('form.name.placeholder')}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">{t('form.email.label')}</Label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full border border-border bg-background px-4 py-3 text-base text-foreground transition-colors focus:border-foreground focus:outline-none"
                    placeholder={t('form.email.placeholder')}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">{t('form.phone.label')}</Label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full border border-border bg-background px-4 py-3 text-base text-foreground transition-colors focus:border-foreground focus:outline-none"
                    placeholder={t('form.phone.placeholder')}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">{t('form.service.label')}</Label>
                  <div className="relative">
                    <select
                      id="service"
                      name="service"
                      className="w-full appearance-none border border-border bg-background px-4 py-3 pr-10 text-base text-foreground transition-colors focus:border-foreground focus:outline-none"
                    >
                      <option value="">{t('form.service.placeholder')}</option>
                      <option value="personal-styling">Personal Styling</option>
                      <option value="wardrobe-audit">Wardrobe Audit</option>
                      <option value="shopping">Shopping Accompaniment</option>
                      <option value="atelier">Atelier Services</option>
                      <option value="event">Event Styling</option>
                      <option value="consultation">Image Consultation</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">{t('form.message.label')}</Label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full resize-none border border-border bg-background px-4 py-3 text-base text-foreground transition-colors focus:border-foreground focus:outline-none"
                    placeholder={t('form.message.placeholder')}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  {t('form.submit')}
                </Button>
              </form>
            </div>
          </Grid>
        </Container>
      </Section>
    </main>
  )
}
