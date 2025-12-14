import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { H3, Paragraph, Label } from '@/components/ui/typography'
import { Section, Container, Grid } from '@/components/ui/layout-components'
import { Button } from '@/components/ui/button'

interface Service {
  id: string
  title: string
  slug: string
  description?: string
  category: string
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
        <Grid cols={3} gap="md">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group block border border-border p-8 transition-colors hover:border-foreground"
              prefetch={false}
            >
              <Label className="mb-4 block">{service.category}</Label>
              <H3 className="text-2xl md:text-2xl">{service.title}</H3>
              {service.description && (
                <Paragraph className="mt-4 line-clamp-3">{service.description}</Paragraph>
              )}
              <span className="mt-6 inline-block text-sm font-medium uppercase tracking-widest text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                {t('learnMore')} →
              </span>
            </Link>
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
