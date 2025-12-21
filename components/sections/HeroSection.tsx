import { Link } from '@/i18n/navigation'
import { H1, Lead, Container, PageHeader, Button } from '@/components/ui'

interface HeroSectionProps {
  title: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
}

export function HeroSection({
  title,
  subtitle,
  ctaText,
  ctaLink,
}: HeroSectionProps) {
  return (
    <PageHeader fullHeight centered>
      <Container size="md">
        <H1>{title}</H1>
        {subtitle && (
          <Lead className="mt-6">{subtitle}</Lead>
        )}
        {ctaText && ctaLink && (
          <Button asChild variant="outline" size="lg" className="mt-10">
            <Link href={ctaLink}>{ctaText}</Link>
          </Button>
        )}
      </Container>
    </PageHeader>
  )
}
