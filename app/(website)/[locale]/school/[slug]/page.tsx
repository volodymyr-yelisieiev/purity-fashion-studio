import { getAvailableLocales, getPayload, getCourseBySlug, type Locale } from '@/lib/payload'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { notFound } from 'next/navigation'
import type { Media as MediaType } from '@/payload-types'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { generateSeoMetadata } from '@/lib/seo'
import { LanguageFallback, Button } from '@/components/ui'
import { draftMode } from 'next/headers'
import { HeroSection } from '@/components/sections'
import { FadeInStagger, FadeInStaggerContainer } from '@/components/animations/FadeInStagger'

interface CourseDetailPageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload()
  
  let courses
  try {
    courses = await payload.find({
      collection: 'courses',
      limit: 100,
      where: {
        status: { equals: 'published' },
      },
    })
  } catch (err) {
    console.error('generateStaticParams: failed to fetch courses —', err)
    return []
  }
  
  const locales = ['en', 'uk', 'ru']
  
  return courses.docs
    .filter((item) => item.slug)
    .flatMap((item) =>
      locales.map((locale) => ({
        locale,
        slug: item.slug,
      }))
    )
}

export async function generateMetadata({ params }: CourseDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const { isEnabled: isDraft } = await draftMode()
  const t = await getTranslations({ locale, namespace: 'school' })
  const course = await getCourseBySlug(slug, locale as Locale, isDraft)

  if (!course) {
    const availableLocales = await getAvailableLocales('courses', slug, isDraft)
    const title = availableLocales.length > 0 ? t('notAvailable') : t('notFound')
    return generateSeoMetadata({
      title: `${title} | PURITY Fashion Studio`,
      description: t('notFoundDescription'),
      locale,
    })
  }

  return generateSeoMetadata({
    title: course.meta?.title || `${course.title} — Персональний Стайлінг | PURITY Fashion Studio`,
    description: course.meta?.description || course.excerpt || '',
    path: `/school/${slug}`,
    image: typeof course.meta?.image === 'object' ? course.meta?.image?.url || undefined : undefined,
    locale,
  })
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug, locale } = await params
  const { isEnabled: isDraft } = await draftMode()
  const t = await getTranslations({ locale, namespace: 'school' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const course = await getCourseBySlug(slug, locale as Locale, isDraft)

  if (!course) {
    const availableLocales = await getAvailableLocales('courses', slug, isDraft)
    if (availableLocales.length > 0) {
      return (
        <LanguageFallback
          title={t('notAvailable')}
          description={tCommon('viewInAvailableLanguages')}
          availableLocales={availableLocales}
          currentSlug={slug}
          basePath="/school"
          backLink={{ href: '/school', label: t('back') }}
        />
      )
    }
    notFound()
  }

  const hasContent = (value?: unknown) => {
    if (!value) return false
    if (typeof value === 'string') return value.trim().length > 0
    return Boolean(value)
  }

  if (!hasContent(course.title) || !hasContent(course.excerpt)) {
    const availableLocales = await getAvailableLocales('courses', slug, isDraft)
    if (availableLocales.length > 0) {
      return (
        <LanguageFallback
          title={t('notAvailable')}
          description={tCommon('viewInAvailableLanguages')}
          availableLocales={availableLocales}
          currentSlug={slug}
          basePath="/school"
          backLink={{ href: '/school', label: t('back') }}
        />
      )
    }
    notFound()
  }

  const featuredImage = course.featuredImage as MediaType | undefined
  const duration = course.duration as { value: number; unit: string } | undefined
  const curriculum = (course.curriculum || []) as Array<{ module: string; topics?: Array<{ topic: string }> }>
  const instructor = course.instructor as { name: string; title?: string; bio?: string; photo?: MediaType } | undefined

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <HeroSection
        title={course.title}
        subtitle={course.excerpt || ''}
        backgroundImage={featuredImage?.url || ''}
      />
      
      {/* Overview - White */}
      <section className="py-24 bg-white">
        <div className="container max-w-4xl">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <h2 className="text-3xl font-serif mb-8">{tCommon('overview')}</h2>
            </FadeInStagger>
            <FadeInStagger>
              <div className="prose prose-lg font-light leading-relaxed text-foreground max-w-none">
                {course.description && typeof course.description === 'string' ? (
                  <p>{course.description}</p>
                ) : (
                  <p>{course.excerpt}</p>
                )}
              </div>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </div>
      </section>
      
      {/* Course Details - Gray */}
      <section className="py-24 bg-neutral-50">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Duration */}
            <FadeInStaggerContainer>
              <FadeInStagger>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  {t('duration')}
                </h3>
                <p className="text-lg font-light">{duration?.value} {duration?.unit}</p>
              </FadeInStagger>
            </FadeInStaggerContainer>
            
            {/* Level */}
            <FadeInStaggerContainer>
              <FadeInStagger>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  {t('level')}
                </h3>
                <p className="text-lg font-light">{t(`levels.${course.level || 'beginner'}`)}</p>
              </FadeInStagger>
            </FadeInStaggerContainer>
            
            {/* Format */}
            <FadeInStaggerContainer>
              <FadeInStagger>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  {t('format')}
                </h3>
                <p className="text-lg font-light">{t(`formats.${course.format || 'online'}`)}</p>
              </FadeInStagger>
            </FadeInStaggerContainer>
          </div>
        </div>
      </section>
      
      {/* Prerequisites & Materials - White */}
      {(course.prerequisites || course.materials) && (
        <section className="py-24 bg-white">
          <div className="container max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {course.prerequisites && (
                <FadeInStaggerContainer>
                  <FadeInStagger>
                    <h3 className="text-2xl font-serif mb-6">{t('prerequisites')}</h3>
                    <p className="text-lg font-light leading-relaxed text-muted-foreground">
                      {course.prerequisites}
                    </p>
                  </FadeInStagger>
                </FadeInStaggerContainer>
              )}
              {course.materials && (
                <FadeInStaggerContainer>
                  <FadeInStagger>
                    <h3 className="text-2xl font-serif mb-6">{t('materials')}</h3>
                    <p className="text-lg font-light leading-relaxed text-muted-foreground">
                      {course.materials}
                    </p>
                  </FadeInStagger>
                </FadeInStaggerContainer>
              )}
            </div>
          </div>
        </section>
      )}
      
      {/* Curriculum - Gray */}
      {curriculum.length > 0 && (
        <section className="py-24 bg-neutral-50">
          <div className="container max-w-4xl">
            <FadeInStaggerContainer>
              <FadeInStagger>
                <h2 className="text-3xl font-serif mb-16 text-center">{t('curriculum')}</h2>
              </FadeInStagger>
              <div className="space-y-12">
                {curriculum.map((module, index) => (
                  <FadeInStagger key={index}>
                    <div className="border-b border-neutral-200 pb-8">
                      <h3 className="text-xl font-medium mb-4">
                        <span className="text-muted-foreground mr-4">0{index + 1}</span>
                        {module.module}
                      </h3>
                      {module.topics && module.topics.length > 0 && (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {module.topics.map((topic, tIndex) => (
                            <li key={tIndex} className="text-muted-foreground font-light flex items-center gap-2">
                              <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                              {topic.topic}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </FadeInStagger>
                ))}
              </div>
            </FadeInStaggerContainer>
          </div>
        </section>
      )}
      
      {/* Instructor - White */}
      {instructor && (
        <section className="py-24 bg-white">
          <div className="container max-w-4xl">
            <FadeInStaggerContainer>
              <div className="flex flex-col md:flex-row items-center gap-12">
                {instructor.photo && typeof instructor.photo === 'object' && (
                  <FadeInStagger>
                    <div className="w-48 h-48 relative overflow-hidden rounded-full grayscale">
                      <Image
                        src={instructor.photo.url || ''}
                        alt={instructor.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </FadeInStagger>
                )}
                <FadeInStagger>
                  <div className="text-center md:text-left">
                    <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                      {t('instructor')}
                    </h3>
                    <h2 className="text-3xl font-serif mb-4">{instructor.name}</h2>
                    <p className="text-lg font-light text-muted-foreground leading-relaxed">
                      {instructor.bio}
                    </p>
                  </div>
                </FadeInStagger>
              </div>
            </FadeInStaggerContainer>
          </div>
        </section>
      )}
      
      {/* CTA - Gray */}
      <section className="py-32 bg-neutral-50">
        <div className="container text-center">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <h2 className="text-4xl font-serif mb-8">{t('readyToStart')}</h2>
            </FadeInStagger>
            <FadeInStagger>
              <Button asChild variant="primary" size="lg">
                <Link href="/contact">
                  {tCommon('bookConsultation')}
                </Link>
              </Button>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </div>
      </section>
    </main>
  )
}

