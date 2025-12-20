import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { H2, H3, Paragraph, Label } from '@/components/ui/typography'
import { Section, Container, Grid } from '@/components/ui/layout-components'
import { Button } from '@/components/ui/button'
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

  return (
    <Section spacing="md">
      <Container size="lg">
        <H2 className="mb-16 text-center">{title || t('title')}</H2>
        <Grid cols={3} gap="md">
          {items.map((item) => (
            <Link
              key={`${item.type}-${item.id}`}
              href={item.href}
              className="group block overflow-hidden border border-border transition-colors hover:border-foreground"
              prefetch={false}
            >
              {item.image?.url && (
                <div className="relative aspect-4/3 overflow-hidden bg-muted">
                  <Image
                    src={item.image.url}
                    alt={item.image.alt || item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <span>{item.type}</span>
                  {item.category && <span className="text-foreground/70">• {item.category}</span>}
                </div>
                <H3 className="text-2xl font-light leading-tight group-hover:text-foreground">{item.title}</H3>
                {item.excerpt && (
                  <Paragraph className="text-muted-foreground line-clamp-2">{item.excerpt}</Paragraph>
                )}
                <div className="flex flex-wrap items-center gap-3 text-sm text-foreground">
                  {item.duration && <Label className="text-xs! tracking-[0.15em]!">{item.duration}</Label>}
                  {item.priceDisplay && (
                    <span className="rounded-full border px-3 py-1 text-xs uppercase tracking-[0.15em]">
                      {item.priceDisplay}
                    </span>
                  )}
                </div>
                <span className="inline-block text-sm font-medium uppercase tracking-widest text-foreground/80 transition-opacity group-hover:opacity-80">
                  {tCommon('learnMore')} →
                </span>
              </div>
            </Link>
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
  )}
