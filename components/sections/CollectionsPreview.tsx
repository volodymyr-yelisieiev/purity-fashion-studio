import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { H2, H3, Paragraph } from '@/components/ui/typography'
import { Section, Container, Grid } from '@/components/ui/layout-components'

interface Collection {
  id: string
  title: string
  slug: string
  description?: string
  coverImage?: {
    url: string
    alt?: string
  }
}

interface CollectionsPreviewProps {
  collections: Collection[]
  title?: string
}

export function CollectionsPreview({
  collections,
  title,
}: CollectionsPreviewProps) {
  const t = useTranslations('navigation')

  return (
    <Section spacing="md" variant="muted">
      <Container>
        <H2 className="mb-16 text-center">{title || t('collections')}</H2>
        <Grid cols={2} gap="md">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="group relative aspect-4/5 overflow-hidden bg-muted"
              prefetch={false}
            >
              {collection.coverImage?.url && (
                <Image
                  src={collection.coverImage.url}
                  alt={collection.coverImage.alt || collection.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-end bg-linear-to-t from-black/60 to-transparent p-8 text-white">
                <H3 className="text-2xl text-white md:text-2xl">{collection.title}</H3>
                {collection.description && (
                  <Paragraph className="mt-2 text-center text-sm text-white/90">
                    {collection.description}
                  </Paragraph>
                )}
              </div>
            </Link>
          ))}
        </Grid>
      </Container>
    </Section>
  )
}
