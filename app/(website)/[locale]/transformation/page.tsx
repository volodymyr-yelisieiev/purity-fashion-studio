import { getPayload } from '@/lib/payload'
import { HeroSection } from '@/components/sections/HeroSection'
import { EmptyState } from '@/components/ui/empty-state'
import { H3, Paragraph } from '@/components/ui/typography'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { Container } from '@/components/ui/layout-components'
import Image from 'next/image'
import type { Media } from '@/payload-types'

export default async function TransformationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'transformation' })
  
  const payload = await getPayload()
  const { docs: transformations } = await payload.find({
    collection: 'portfolio',
    locale: locale as 'en' | 'uk' | 'ru',
    where: { 
      category: { equals: 'transformation' },
      status: { equals: 'published' }
    },
    sort: '-createdAt',
    limit: 100,
  })
  
  return (
    <>
      <HeroSection
        title={t('hero.title')}
        subtitle={t('hero.description')}
      />
      
      <section className="bg-background">
        <Container>
          {transformations.length === 0 ? (
            <EmptyState
              title={t('empty.title')}
              description={t('empty.description')}
              action={{
                label: t('empty.backHome'),
                href: '/'
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {transformations.map((item) => {
                 // Use afterImage as the preview image for transformations
                 const previewImage = item.afterImage as Media | undefined

                 return (
                  <Link
                    key={item.id}
                    href={`/portfolio/${item.slug}`}
                    className="group cursor-pointer block"
                  >
                    <div className="space-y-4">
                      {previewImage?.url && (
                        <div className="relative aspect-4/3 overflow-hidden bg-muted">
                          <Image
                            src={previewImage.url}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      )}
                      <H3 className="group-hover:text-foreground/70 transition-colors">
                        {item.title}
                      </H3>
                      {item.description && (
                        <Paragraph className="line-clamp-2 text-muted-foreground">
                          {item.description}
                        </Paragraph>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
