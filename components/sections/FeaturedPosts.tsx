import { useTranslations } from 'next-intl'
import { H2 } from '@/components/ui/typography'
import { Section, Container, Grid } from '@/components/ui/layout-components'
import { Button } from '@/components/ui/button'
import { ContentCard, type ContentCardItem } from '@/components/ui/content-card'
import { Link } from '@/i18n/navigation'
import type { FeaturedPostItem } from '@/lib/featured-posts'

interface FeaturedPostsProps {
  items: FeaturedPostItem[]
  title?: string
  viewAllText?: string
  viewAllLink?: string
}

export function FeaturedPosts({
  items,
  title,
  viewAllText,
  viewAllLink,
}: FeaturedPostsProps) {
  const t = useTranslations('home.featuredPosts')
  const tCommon = useTranslations('common')

  // Transform FeaturedPostItem to ContentCardItem
  const cardItems: ContentCardItem[] = items.map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    href: item.href,
    image: item.image,
    excerpt: item.excerpt,
    category: item.category,
    categoryLabel: item.category,
    priceDisplay: item.priceDisplay,
    duration: item.duration,
  }))

  return (
    <Section spacing="md">
      <Container size="lg">
        <H2 className="mb-16 text-center">{title || t('title')}</H2>
        <Grid cols={3} gap="md">
          {cardItems.map((item) => (
            <ContentCard
              key={`${item.type}-${item.id}`}
              item={item}
              learnMoreText={`${tCommon('learnMore')} →`}
              showType={true}
            />
          ))}
        </Grid>
        {viewAllLink && (
          <div className="mt-16 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href={viewAllLink} prefetch={false}>
                {viewAllText || t('viewAll') || tCommon('viewAll')}
              </Link>
            </Button>
          </div>
        )}
      </Container>
    </Section>
  )
}
