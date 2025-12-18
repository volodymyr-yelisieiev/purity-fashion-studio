import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { H2, H3 } from '@/components/ui/typography'
import { Section, Container, Grid } from '@/components/ui/layout-components'
import { Button } from '@/components/ui/button'

interface PortfolioItem {
  id: string
  title: string
  slug: string
  featuredImage?: {
    url: string
    alt?: string
  }
}

interface PortfolioPreviewProps {
  items: PortfolioItem[]
  title?: string
  viewAllText?: string
  viewAllLink?: string
}

export function PortfolioPreview({
  items,
  title,
  viewAllText,
  viewAllLink = '/portfolio',
}: PortfolioPreviewProps) {
  const t = useTranslations('navigation')
  const tCommon = useTranslations('common')

  return (
    <Section spacing="md">
      <Container>
        <H2 className="mb-16 text-center">{title || t('portfolio')}</H2>
        <Grid cols={3} gap="sm">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/portfolio/${item.slug}`}
              className="group relative aspect-square overflow-hidden bg-muted"
              prefetch={false}
            >
              {item.featuredImage?.url && (
                <Image
                  src={item.featuredImage.url}
                  alt={item.featuredImage.alt || item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 flex items-end bg-black/0 p-6 transition-colors group-hover:bg-black/40">
                <H3 className="text-xl text-white opacity-0 transition-opacity group-hover:opacity-100 md:text-xl">
                  {item.title}
                </H3>
              </div>
            </Link>
          ))}
        </Grid>
        {viewAllLink && (
          <div className="mt-16 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href={viewAllLink} prefetch={false}>
                {viewAllText || tCommon('viewAll')}
              </Link>
            </Button>
          </div>
        )}
      </Container>
    </Section>
  )
}
