import { getTranslations } from 'next-intl/server'
import type { Media as MediaType, Portfolio as PortfolioType } from '@/payload-types'
import { getPayload } from '@/lib/payload'
import { HeroSection } from '@/components/sections'
import { EmptyState } from '@/components/ui/empty-state'
import { ContentCard, type ContentCardItem } from '@/components/ui/content-card'
import { Section, Container, Grid } from '@/components/ui/layout-components'

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.portfolio' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  
  const payload = await getPayload()
  const portfolioItems = await payload.find({
    collection: 'portfolio',
    locale: locale as 'en' | 'ru' | 'uk',
    limit: 50,
    sort: '-createdAt',
    where: {
      status: { equals: 'published' },
    },
  })

  if (portfolioItems.docs.length === 0) {
    return (
      <>
        <HeroSection
          title={t('title')}
          subtitle={t('subtitle')}
        />
        <EmptyState
          title={tCommon('noContent')}
          description={tCommon('checkBackSoon')}
          action={{ label: tCommon('backToHome'), href: '/' }}
        />
      </>
    )
  }

  // Transform to ContentCardItem
  const cardItems: ContentCardItem[] = portfolioItems.docs.map((item) => {
    const portfolio = item as PortfolioType
    const coverImage = (typeof portfolio.afterImage === 'object' ? portfolio.afterImage : null) as MediaType | null
    
    return {
      id: String(portfolio.id),
      type: 'portfolio',
      title: portfolio.title,
      href: `/portfolio/${portfolio.slug}`,
      image: coverImage?.url ? { url: coverImage.url, alt: coverImage.alt || portfolio.title } : undefined,
      excerpt: portfolio.description || undefined,
      category: portfolio.category || null,
      categoryLabel: portfolio.category || null,
    }
  })

  return (
    <>
      <HeroSection
        title={t('title')}
        subtitle={t('subtitle')}
      />
      
      <Section spacing="md">
        <Container>
          <Grid cols={3} gap="md">
            {cardItems.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                learnMoreText={`${tCommon('learnMore')} →`}
                showType={false}
                aspectRatio="4/5"
              />
            ))}
          </Grid>
        </Container>
      </Section>
    </>
  )
}
