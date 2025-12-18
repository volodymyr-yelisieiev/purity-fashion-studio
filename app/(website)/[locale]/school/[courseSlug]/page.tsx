import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { ArrowLeft, Clock, Monitor, Calendar, Users, CheckCircle } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { Media as MediaType, Course } from '@/payload-types'

interface CourseDetailPageProps {
  params: Promise<{
    courseSlug: string
    locale: string
  }>
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { courseSlug, locale } = await params
  const payload = await getPayload({ config: configPromise })

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

  const formatLabels: Record<string, Record<string, string>> = {
    online: { uk: 'Онлайн', ru: 'Онлайн', en: 'Online' },
    'in-person': { uk: 'Офлайн', ru: 'Офлайн', en: 'In-Person' },
    hybrid: { uk: 'Гібрид', ru: 'Гибрид', en: 'Hybrid' },
  }

  const levelLabels: Record<string, Record<string, string>> = {
    beginner: { uk: 'Початковий', ru: 'Начальный', en: 'Beginner' },
    intermediate: { uk: 'Середній', ru: 'Средний', en: 'Intermediate' },
    advanced: { uk: 'Просунутий', ru: 'Продвинутый', en: 'Advanced' },
    all: { uk: 'Всі рівні', ru: 'Все уровни', en: 'All Levels' },
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Back Button */}
      <Button asChild variant="ghost" className="mb-8">
        <Link href={`/${locale}/school`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {locale === 'uk' ? 'Назад до школи' : locale === 'ru' ? 'Назад к школе' : 'Back to School'}
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">
                {formatLabels[course.format || 'online']?.[locale]}
              </span>
              <span className="px-3 py-1 text-sm bg-muted rounded-full">
                {levelLabels[course.level || 'beginner']?.[locale]}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {duration && (
              <div className="p-4 bg-muted text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="font-semibold">{duration.value} {duration.unit}</p>
                <p className="text-sm text-muted-foreground">
                  {locale === 'uk' ? 'Тривалість' : locale === 'ru' ? 'Длительность' : 'Duration'}
                </p>
              </div>
            )}
            <div className="p-4 bg-muted text-center">
              <Monitor className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="font-semibold">{formatLabels[course.format || 'online']?.[locale]}</p>
              <p className="text-sm text-muted-foreground">
                {locale === 'uk' ? 'Формат' : locale === 'ru' ? 'Формат' : 'Format'}
              </p>
            </div>
            {upcomingDates.length > 0 && (
              <div className="p-4 bg-muted text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="font-semibold">
                  {new Date(upcomingDates[0].startDate).toLocaleDateString(locale)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {locale === 'uk' ? 'Старт' : locale === 'ru' ? 'Старт' : 'Start Date'}
                </p>
              </div>
            )}
            {upcomingDates[0]?.spotsAvailable && (
              <div className="p-4 bg-muted text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="font-semibold">{upcomingDates[0].spotsAvailable}</p>
                <p className="text-sm text-muted-foreground">
                  {locale === 'uk' ? 'Місць' : locale === 'ru' ? 'Мест' : 'Spots'}
                </p>
              </div>
            )}
          </div>

          {/* Curriculum */}
          {curriculum.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">
                {locale === 'uk' ? 'Програма курсу' : locale === 'ru' ? 'Программа курса' : 'Curriculum'}
              </h2>
              <div className="space-y-4">
                {curriculum.map((module, index) => (
                  <div key={index} className="border p-6">
                    <h3 className="font-semibold mb-3">
                      {locale === 'uk' ? 'Модуль' : locale === 'ru' ? 'Модуль' : 'Module'} {index + 1}: {module.module}
                    </h3>
                    {module.topics && module.topics.length > 0 && (
                      <ul className="space-y-2">
                        {module.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle className="h-4 w-4 mt-1 text-primary shrink-0" />
                            {topic.topic}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Instructor */}
          {instructor && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">
                {locale === 'uk' ? 'Викладач' : locale === 'ru' ? 'Преподаватель' : 'Instructor'}
              </h2>
              <div className="flex gap-6 p-6 bg-muted">
                {instructor.photo?.url && (
                  <div className="w-24 h-24 relative rounded-full overflow-hidden shrink-0">
                    <Image
                      src={instructor.photo.url}
                      alt={instructor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{instructor.name}</h3>
                  {instructor.title && (
                    <p className="text-primary mb-2">{instructor.title}</p>
                  )}
                  {instructor.bio && (
                    <p className="text-muted-foreground">{instructor.bio}</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Testimonials */}
          {testimonials.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">
                {locale === 'uk' ? 'Відгуки випускників' : locale === 'ru' ? 'Отзывы выпускников' : 'Student Reviews'}
              </h2>
              <div className="grid gap-6">
                {testimonials.map((testimonial, index) => (
                  <blockquote key={index} className="p-6 bg-muted">
                    <p className="text-lg italic mb-4">&quot;{testimonial.quote}&quot;</p>
                    <cite className="flex items-center gap-3 not-italic">
                      {testimonial.photo?.url && (
                        <div className="w-10 h-10 relative rounded-full overflow-hidden">
                          <Image
                            src={testimonial.photo.url}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <span className="font-medium">{testimonial.name}</span>
                    </cite>
                  </blockquote>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          {faq.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                {locale === 'uk' ? 'Часті запитання' : locale === 'ru' ? 'Частые вопросы' : 'FAQ'}
              </h2>
              <div className="space-y-4">
                {faq.map((item, index) => (
                  <details key={index} className="border">
                    <summary className="p-4 cursor-pointer font-medium hover:bg-muted">
                      {item.question}
                    </summary>
                    <div className="p-4 pt-0 text-muted-foreground">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar - Pricing & CTA */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-card border p-6">
            {price && (
              <div className="mb-6">
                {price.earlyBirdAmount && (
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm text-muted-foreground line-through">
                      {price.currency === 'UAH' ? '₴' : '€'}{price.amount}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                      Early Bird
                    </span>
                  </div>
                )}
                <div className="text-3xl font-bold">
                  {price.currency === 'UAH' ? '₴' : '€'}
                  {price.earlyBirdAmount || price.amount}
                </div>
              </div>
            )}

            {/* Upcoming Dates */}
            {upcomingDates.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">
                  {locale === 'uk' ? 'Найближчі дати' : locale === 'ru' ? 'Ближайшие даты' : 'Upcoming Dates'}
                </h3>
                <ul className="space-y-2">
                  {upcomingDates.slice(0, 3).map((date, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span>{new Date(date.startDate).toLocaleDateString(locale)}</span>
                      {date.spotsAvailable !== undefined && (
                        <span className="text-muted-foreground">
                          {date.spotsAvailable} {locale === 'uk' ? 'місць' : locale === 'ru' ? 'мест' : 'spots'}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button asChild className="w-full" size="lg">
              <Link href={`/${locale}/booking?course=${course.slug}`}>
                {locale === 'uk' ? 'Записатися на курс' : locale === 'ru' ? 'Записаться на курс' : 'Enroll Now'}
              </Link>
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              {locale === 'uk'
                ? 'Або зв\'яжіться з нами для консультації'
                : locale === 'ru'
                  ? 'Или свяжитесь с нами для консультации'
                  : 'Or contact us for more info'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
