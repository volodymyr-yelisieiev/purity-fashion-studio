import { getTranslations } from 'next-intl/server'
import { HeroSection, MethodologySection } from '@/components/sections'
import { generateSeoMetadata } from '@/lib/seo'
import { H2, H4, Paragraph, Lead, Section, Container, Grid } from '@/components/ui'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  return generateSeoMetadata({
    title: `${t('title')} | PURITY Fashion Studio`,
    description: t('description'),
    path: '/about',
    locale,
  })
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

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

      <Section spacing="md">
        <Container size="md">
          <H2 className="mb-8">{t('philosophy.title')}</H2>
          <div className="space-y-6">
            <Lead>{t('philosophy.paragraph1')}</Lead>
            <Lead>{t('philosophy.paragraph2')}</Lead>
          </div>
        </Container>
      </Section>

      <MethodologySection
        title={t('methodology.title')}
        subtitle={t('methodology.subtitle')}
        steps={methodologySteps}
      />

      <Section spacing="md">
        <Container size="md" className="text-center">
          <H2 className="mb-12">{t('values.title')}</H2>
          <Grid cols={3} gap="lg">
            <div>
              <H4 className="mb-4 text-xl md:text-2xl">{t('values.quality.title')}</H4>
              <Paragraph>{t('values.quality.description')}</Paragraph>
            </div>
            <div>
              <H4 className="mb-4 text-xl md:text-2xl">{t('values.individuality.title')}</H4>
              <Paragraph>{t('values.individuality.description')}</Paragraph>
            </div>
            <div>
              <H4 className="mb-4 text-xl md:text-2xl">{t('values.sustainability.title')}</H4>
              <Paragraph>{t('values.sustainability.description')}</Paragraph>
            </div>
          </Grid>
        </Container>
      </Section>
    </main>
  )
}
