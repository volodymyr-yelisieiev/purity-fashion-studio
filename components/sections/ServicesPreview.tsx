import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Section, Container, Grid, Button, ContentCard } from '@/components/ui'
import { FadeInStagger, FadeInStaggerContainer } from '@/components/animations/FadeInStagger'

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
  pricing?: {
    eur?: number | null
    uah?: number | null
    priceNote?: string | null
  }
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

  return (
    <Section spacing="md">
      <Container>
        <FadeInStaggerContainer>
          <Grid cols={3} gap="md">
            {services.map((service) => (
              <FadeInStagger key={service.id}>
                <ContentCard
                  title={service.title}
                  description={service.description}
                  category={service.categoryLabel || service.category}
                  image={service.image}
                  price={{
                    eur: service.pricing?.eur,
                    uah: service.pricing?.uah,
                    note: service.pricing?.priceNote
                  }}
                  metadata={[
                    ...(service.duration ? [{ label: t('duration') || 'Duration', value: service.duration }] : []),
                    ...(service.format ? [{ label: t('format') || 'Format', value: service.format }] : [])
                  ]}
                  link={{
                    href: `/services/${service.slug}`,
                    label: t('learnMore')
                  }}
                  variant="service"
                />
              </FadeInStagger>
            ))}
          </Grid>
          {viewAllLink && (
            <FadeInStagger>
              <div className="mt-16 text-center">
                <Button asChild variant="outline" size="lg">
                  <Link href={viewAllLink} prefetch={false}>
                    {viewAllText || t('viewAllServices')}
                  </Link>
                </Button>
              </div>
            </FadeInStagger>
          )}
        </FadeInStaggerContainer>
      </Container>
    </Section>
  )
}
