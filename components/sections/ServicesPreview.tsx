import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Section, Container, Grid } from '@/components/ui/layout-components'
import { Button } from '@/components/ui/button'
import { ContentCard, type ContentCardItem } from '@/components/ui/content-card'

interface Service {
  id: string
  title: string
  slug: string
  description?: string
  category: string
  categoryLabel?: string
  priceDisplay?: string | null
  duration?: string | null
  format?: string | null
  image?: { url: string; alt?: string }
}

interface ServicesPreviewProps {
  services: Service[]
  viewAllText?: string
  viewAllLink?: string
}

export function ServicesPreview({
  services,
  viewAllText,
  viewAllLink = '/services',
}: ServicesPreviewProps) {
  const t = useTranslations('common')

  // Transform services to ContentCardItem
  const cardItems: ContentCardItem[] = services.map((service) => ({
    id: service.id,
    type: 'service',
    title: service.title,
    href: `/services/${service.slug}`,
    image: service.image,
    excerpt: service.description,
    category: service.category,
    categoryLabel: service.categoryLabel || service.category,
    priceDisplay: service.priceDisplay,
    duration: service.duration,
    format: service.format,
  }))

  return (
    <Section spacing="md">
      <Container>
        <Grid cols={3} gap="md">
          {cardItems.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              learnMoreText={`${t('learnMore')} →`}
              showType={false}
            />
          ))}
        </Grid>
        {viewAllLink && (
          <div className="mt-16 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href={viewAllLink} prefetch={false}>
                {viewAllText || t('viewAllServices')}
              </Link>
            </Button>
          </div>
        )}
      </Container>
    </Section>
  )
}
