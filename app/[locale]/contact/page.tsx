import { getTranslations } from 'next-intl/server'
import { HeroSection } from '@/components/sections'
import { generateSeoMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('contact')

  return generateSeoMetadata({
    title: `${t('title')} | PURITY Fashion Studio`,
    description: t('description'),
    path: '/contact',
  })
}

export default async function ContactPage() {
  const t = await getTranslations('contact')

  return (
    <main>
      <HeroSection
        title={t('title')}
        subtitle={t('description')}
      />

      <section className="bg-background px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Contact Info */}
            <div>
              <h2 className="mb-8 font-display text-heading-md font-light text-foreground">
                {t('info.title')}
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="mb-2 text-body-xs uppercase tracking-widest text-muted-foreground">
                    {t('info.address.label')}
                  </h3>
                  <p className="text-body-md text-foreground">
                    {t('info.address.value')}
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-body-xs uppercase tracking-widest text-muted-foreground">
                    {t('info.phone.label')}
                  </h3>
                  <a
                    href="tel:+380991234567"
                    className="text-body-md text-foreground transition-colors hover:text-muted-foreground"
                  >
                    +380 99 123 45 67
                  </a>
                </div>

                <div>
                  <h3 className="mb-2 text-body-xs uppercase tracking-widest text-muted-foreground">
                    {t('info.email.label')}
                  </h3>
                  <a
                    href="mailto:hello@purity.studio"
                    className="text-body-md text-foreground transition-colors hover:text-muted-foreground"
                  >
                    hello@purity.studio
                  </a>
                </div>

                <div>
                  <h3 className="mb-2 text-body-xs uppercase tracking-widest text-muted-foreground">
                    {t('info.hours.label')}
                  </h3>
                  <p className="text-body-md text-foreground">
                    {t('info.hours.value')}
                  </p>
                </div>

                <div>
                  <h3 className="mb-4 text-body-xs uppercase tracking-widest text-muted-foreground">
                    {t('info.social.label')}
                  </h3>
                  <div className="flex gap-4">
                    <a
                      href="https://instagram.com/purity.studio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body-sm text-foreground transition-colors hover:text-muted-foreground"
                    >
                      Instagram
                    </a>
                    <a
                      href="https://t.me/purity_studio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body-sm text-foreground transition-colors hover:text-muted-foreground"
                    >
                      Telegram
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="mb-8 font-display text-heading-md font-light text-foreground">
                {t('form.title')}
              </h2>

              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-body-xs uppercase tracking-widest text-muted-foreground"
                  >
                    {t('form.name.label')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full border border-border bg-background px-4 py-3 text-body-md text-foreground transition-colors focus:border-foreground focus:outline-none"
                    placeholder={t('form.name.placeholder')}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-body-xs uppercase tracking-widest text-muted-foreground"
                  >
                    {t('form.email.label')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full border border-border bg-background px-4 py-3 text-body-md text-foreground transition-colors focus:border-foreground focus:outline-none"
                    placeholder={t('form.email.placeholder')}
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-body-xs uppercase tracking-widest text-muted-foreground"
                  >
                    {t('form.phone.label')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full border border-border bg-background px-4 py-3 text-body-md text-foreground transition-colors focus:border-foreground focus:outline-none"
                    placeholder={t('form.phone.placeholder')}
                  />
                </div>

                <div>
                  <label
                    htmlFor="service"
                    className="mb-2 block text-body-xs uppercase tracking-widest text-muted-foreground"
                  >
                    {t('form.service.label')}
                  </label>
                  <select
                    id="service"
                    name="service"
                    className="w-full border border-border bg-background px-4 py-3 text-body-md text-foreground transition-colors focus:border-foreground focus:outline-none"
                  >
                    <option value="">{t('form.service.placeholder')}</option>
                    <option value="personal-styling">Personal Styling</option>
                    <option value="wardrobe-audit">Wardrobe Audit</option>
                    <option value="shopping">Shopping Accompaniment</option>
                    <option value="atelier">Atelier Services</option>
                    <option value="event">Event Styling</option>
                    <option value="consultation">Image Consultation</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-body-xs uppercase tracking-widest text-muted-foreground"
                  >
                    {t('form.message.label')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full resize-none border border-border bg-background px-4 py-3 text-body-md text-foreground transition-colors focus:border-foreground focus:outline-none"
                    placeholder={t('form.message.placeholder')}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full border border-foreground bg-foreground px-8 py-4 text-body-sm font-medium uppercase tracking-widest text-background transition-colors hover:bg-background hover:text-foreground"
                >
                  {t('form.submit')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
