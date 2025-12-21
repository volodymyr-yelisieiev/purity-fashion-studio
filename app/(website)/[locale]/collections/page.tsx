import { getTranslations } from 'next-intl/server'
import type { Media as MediaType, Lookbook as CollectionType } from '@/payload-types'
import { getPayload } from '@/lib/payload'
import { hasContent } from '@/lib/utils'
import { HeroSection } from '@/components/sections'
import { EmptyState, ContentCard, type ContentCardItem, Section, Container, Grid } from '@/components/ui'

export default async function CollectionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.collections' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  
  const payload = await getPayload()
  const collections = await payload.find({
    collection: 'lookbooks',
    locale: locale as 'en' | 'ru' | 'uk',
    fallbackLocale: false,
    limit: 50,
    sort: '-createdAt',
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
  const cardItems: ContentCardItem[] = filteredDocs.map((item) => {
    const collection = item as CollectionType
    const coverImg = collection.coverImage as MediaType | null
    const firstImage = collection.images?.[0]
    const fallbackImage = (typeof firstImage?.image === 'object' ? firstImage.image : null) as MediaType | null
    const displayImage = coverImg || fallbackImage
    
    return {
      id: String(collection.id),
      type: 'collection',
      title: collection.name,
      href: `/collections/${collection.slug}`,
      image: displayImage?.url ? { url: displayImage.url, alt: displayImage.alt || collection.name } : undefined,
      excerpt: collection.description || undefined,
      category: collection.season || null,
      categoryLabel: collection.season || null,
      date: collection.releaseDate
        ? new Date(collection.releaseDate).toLocaleDateString(locale, { year: 'numeric', month: 'long' })
        : null,
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
          <Grid cols={2} gap="lg">
            {cardItems.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                learnMoreText={`${tCommon('learnMore')} →`}
                showType={false}
                aspectRatio="3/2"
              />
            ))}
          </Grid>
        </Container>
      </Section>
    </>
  )
}
