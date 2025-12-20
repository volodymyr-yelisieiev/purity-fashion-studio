import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { ArrowLeft, Clock, Monitor, Calendar, Users, CheckCircle } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { Media as MediaType, Course } from '@/payload-types'
import { getTranslations } from 'next-intl/server'

interface CourseDetailPageProps {
  params: Promise<{
    courseSlug: string
    locale: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  
  const courses = await payload.find({
    collection: 'courses',
    limit: 100,
    where: {
      status: { equals: 'published' },
    },
  })
  
  const locales = ['en', 'uk', 'ru']
  
  return courses.docs
    .filter((item) => item.slug)
    .flatMap((item) =>
      locales.map((locale) => ({
        locale,
        courseSlug: item.slug,
      }))
    )
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { courseSlug, locale } = await params
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations('school')

  const result = await payload.find({
    collection: 'courses',
    where: {
      slug: { equals: courseSlug },
      status: { equals: 'published' },
    },
    locale: locale as 'en' | 'ru' | 'uk',
    limit: 1,
  })

  if (result.docs.length === 0) {
    notFound()
  }

  const course = result.docs[0] as Course
  const featuredImage = course.featuredImage as MediaType | undefined
  const duration = course.duration as { value: number; unit: string } | undefined
  const price = course.price as { amount: number; currency: string; earlyBirdAmount?: number } | undefined
  const curriculum = (course.curriculum || []) as Array<{ module: string; topics?: Array<{ topic: string }> }>
  const instructor = course.instructor as { name: string; title?: string; bio?: string; photo?: MediaType } | undefined
  const testimonials = (course.testimonials || []) as Array<{ name: string; quote: string; photo?: MediaType }>
  const upcomingDates = (course.upcomingDates || []) as Array<{ startDate: string; endDate?: string; spotsAvailable?: number }>
  const faq = (course.faq || []) as Array<{ question: string; answer: string }>

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Back Button */}
      <Button asChild variant="ghost" className="mb-8">
        <Link href={`/${locale}/school`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('back')}
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">
                {t(`formats.${course.format || 'online'}`)}
              </span>
              <span className="px-3 py-1 text-sm bg-muted rounded-full">
                {t(`levels.${course.level || 'beginner'}`)}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            {course.excerpt && (
              <p className="text-xl text-muted-foreground">{course.excerpt}</p>
            )}
          </header>

          {/* Featured Image */}
          {featuredImage?.url && (
            <div className="aspect-video relative overflow-hidden rounded-sm mb-12">
              <Image
                src={featuredImage.url}
                alt={course.title || ''}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Key Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 p-6 bg-muted/50 rounded-sm">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('duration')}</p>
                <p className="font-medium">{duration?.value} {duration?.unit}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Monitor className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('format')}</p>
                <p className="font-medium">{t(`formats.${course.format || 'online'}`)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('upcomingDates')}</p>
                <p className="font-medium">{upcomingDates.length > 0 ? new Date(upcomingDates[0].startDate).toLocaleDateString(locale) : '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('level')}</p>
                <p className="font-medium">{t(`levels.${course.level || 'beginner'}`)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: course.description || '' }} />
          </div>

          {/* Curriculum */}
          {curriculum.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{t('curriculum')}</h2>
              <div className="space-y-4">
                {curriculum.map((item, index) => (
                  <div key={index} className="border border-border rounded-sm p-6">
                    <h3 className="font-bold mb-3 flex items-center gap-3">
                      <span className="text-primary">{(index + 1).toString().padStart(2, '0')}</span>
                      {item.module}
                    </h3>
                    <ul className="space-y-2">
                      {item.topics?.map((topic, tIndex) => (
                        <li key={tIndex} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle className="h-4 w-4 mt-1 text-primary/60 shrink-0" />
                          <span>{topic.topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Instructor */}
          {instructor && (
            <section className="mb-12 p-8 bg-muted rounded-sm">
              <h2 className="text-2xl font-bold mb-6">{t('instructor')}</h2>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {instructor.photo?.url && (
                  <div className="w-32 h-32 relative shrink-0 rounded-full overflow-hidden">
                    <Image
                      src={instructor.photo.url}
                      alt={instructor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold mb-1">{instructor.name}</h3>
                  {instructor.title && (
                    <p className="text-primary font-medium mb-4">{instructor.title}</p>
                  )}
                  {instructor.bio && (
                    <p className="text-muted-foreground leading-relaxed">{instructor.bio}</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Testimonials */}
          {testimonials.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{t('testimonials')}</h2>
              <div className="grid gap-6">
                {testimonials.map((testimonial, index) => (
                  <blockquote key={index} className="p-8 bg-muted/50 rounded-sm border border-border">
                    <p className="text-lg italic font-serif leading-relaxed mb-6">&quot;{testimonial.quote}&quot;</p>
                    <cite className="flex items-center gap-4 not-italic">
                      {testimonial.photo?.url && (
                        <div className="w-12 h-12 relative rounded-full overflow-hidden">
                          <Image
                            src={testimonial.photo.url}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <span className="font-bold">{testimonial.name}</span>
                    </cite>
                  </blockquote>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          {faq.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{t('faq')}</h2>
              <div className="space-y-4">
                {faq.map((item, index) => (
                  <details key={index} className="group border border-border rounded-sm">
                    <summary className="flex items-center justify-between p-6 cursor-pointer font-bold list-none">
                      {item.question}
                      <span className="transition-transform group-open:rotate-180">↓</span>
                    </summary>
                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Pricing Card */}
            <div className="border border-border rounded-sm p-6 bg-background shadow-sm">
              <div className="mb-6">
                {price?.earlyBirdAmount && (
                  <div className="mb-2">
                    <span className="text-sm text-muted-foreground line-through mr-2">
                      {price.amount} {price.currency}
                    </span>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded uppercase">
                      {t('earlyBird')}
                    </span>
                  </div>
                )}
                <p className="text-4xl font-bold">
                  {price?.earlyBirdAmount || price?.amount} {price?.currency}
                </p>
              </div>

              <Button className="w-full mb-4" size="lg">
                {t('enroll')}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Secure checkout with Stripe or LiqPay
              </p>
            </div>

            {/* Upcoming Dates */}
            {upcomingDates.length > 0 && (
              <div className="border border-border rounded-sm p-6">
                <h3 className="font-bold mb-4">{t('upcomingDates')}</h3>
                <div className="space-y-4">
                  {upcomingDates.map((date, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium">
                          {new Date(date.startDate).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        {date.spotsAvailable && (
                          <p className="text-xs text-primary">{date.spotsAvailable} {t('spotsLeft')}</p>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

