import { getTranslations } from 'next-intl/server'
import type { Lookbook as CollectionType, Media } from '@/payload-types'
import { getPayload } from '@/lib/payload'
import { hasContent } from '@/lib/utils'
import { HeroSection } from '@/components/sections'
import { EmptyState, Section, Container, Lead, Grid, ContentCard } from '@/components/ui'
import { FadeInStagger, FadeInStaggerContainer } from '@/components/animations/FadeInStagger'

export default async function CollectionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const tPages = await getTranslations({ locale, namespace: 'pages' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  
  const payload = await getPayload()
  const collections = await payload.find({
    collection: 'lookbooks',
    locale: locale as 'en' | 'ru' | 'uk',
    fallbackLocale: false,
    limit: 50,
    sort: '-featured,-createdAt',
    where: {
      status: { equals: 'published' },
    },
  })

  // Filter out items without content in current locale
  const filteredDocs = collections.docs.filter(doc => hasContent(doc.name))

  if (filteredDocs.length === 0) {
    return (
      <>
        <HeroSection
          title={tPages('collections.title')}
          subtitle={tPages('collections.subtitle')}
          backgroundImage="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop&q=85"
        />
        <EmptyState
          title={tCommon('noContent')}
          description={tCommon('checkBackSoon')}
          action={{ label: tCommon('backToHome'), href: '/' }}
        />
      </>
    )
  }

  return (
    <>
      <HeroSection
        title={tPages('collections.title')}
        subtitle={tPages('collections.subtitle')}
        backgroundImage="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop&q=85"
      />

      {/* Intro Section */}
      <Section spacing="md">
        <Container size="sm" className="text-center">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <Lead className="text-muted-foreground">
                {tCommon('collectionsIntro') || 'Each collection represents a unique vision of elegance, crafted with attention to detail and timeless design.'}
              </Lead>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </Container>
      </Section>

      {/* Collections Grid */}
      <Section spacing="md" variant="muted">
        <Container>
          <Grid cols={2} gap="md">
            {filteredDocs.map((item) => {
              const collection = item as CollectionType
              const coverImage = typeof collection.coverImage === 'object' ? (collection.coverImage as Media | null) : null
              return (
                <ContentCard
                  key={collection.id}
                  title={collection.name}
                  description={collection.description}
                  category={collection.season}
                  image={coverImage?.url ? { url: coverImage.url, alt: coverImage.alt || collection.name } : undefined}
                  price={{
                    eur: collection.priceEUR || undefined,
                    uah: collection.priceUAH || undefined,
                  }}
                  link={{
                    href: `/collections/${collection.slug}`,
                    label: tCommon('viewCollection') || 'View Collection'
                  }}
                  variant="collection"
                />
              )
            })}
          </Grid>
        </Container>
      </Section>
    </>
  )
}
