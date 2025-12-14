import { getTranslations } from 'next-intl/server'
import { HeroSection, MethodologySection } from '@/components/sections'
import { generateSeoMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about')

  return generateSeoMetadata({
    title: `${t('title')} | PURITY Fashion Studio`,
    description: t('description'),
    path: '/about',
  })
}

export default async function AboutPage() {
  const t = await getTranslations('about')

  const methodologySteps = [
    {
      number: '01',
      title: t('methodology.step1.title'),
      description: t('methodology.step1.description'),
    },
    {
      number: '02',
      title: t('methodology.step2.title'),
      description: t('methodology.step2.description'),
    },
    {
      number: '03',
      title: t('methodology.step3.title'),
      description: t('methodology.step3.description'),
    },
    {
      number: '04',
      title: t('methodology.step4.title'),
      description: t('methodology.step4.description'),
    },
  ]

  return (
    <main>
      <HeroSection
        title={t('title')}
        subtitle={t('description')}
      />

      <section className="bg-background px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 font-display text-heading-lg font-light tracking-tight text-foreground">
            {t('philosophy.title')}
          </h2>
          <div className="space-y-6 text-body-lg leading-relaxed text-muted-foreground">
            <p>{t('philosophy.paragraph1')}</p>
            <p>{t('philosophy.paragraph2')}</p>
          </div>
        </div>
      </section>

      <MethodologySection
        title={t('methodology.title')}
        subtitle={t('methodology.subtitle')}
        steps={methodologySteps}
      />

      <section className="bg-background px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 font-display text-heading-lg font-light tracking-tight text-foreground">
            {t('values.title')}
          </h2>
          <div className="grid gap-12 md:grid-cols-3">
            <div>
              <h3 className="mb-4 font-display text-heading-sm font-light text-foreground">
                {t('values.quality.title')}
              </h3>
              <p className="text-body-md text-muted-foreground">
                {t('values.quality.description')}
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-display text-heading-sm font-light text-foreground">
                {t('values.individuality.title')}
              </h3>
              <p className="text-body-md text-muted-foreground">
                {t('values.individuality.description')}
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-display text-heading-sm font-light text-foreground">
                {t('values.sustainability.title')}
              </h3>
              <p className="text-body-md text-muted-foreground">
                {t('values.sustainability.description')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
