import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getLocale } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { GraduationCap, Clock, Users, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Media as MediaType, Course } from '@/payload-types'

export default async function SchoolPage() {
  const locale = await getLocale()
  const payload = await getPayload({ config: configPromise })

  const courses = await payload.find({
    collection: 'courses',
    where: {
      status: { equals: 'published' },
    },
    locale: locale as 'en' | 'ru' | 'uk',
    limit: 50,
    sort: '-createdAt',
  })

  // Group courses by category
  const coursesByCategory = courses.docs.reduce((acc, course) => {
    const category = course.category || 'other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(course)
    return acc
  }, {} as Record<string, Course[]>)

  const categoryLabels: Record<string, Record<string, string>> = {
    'personal-styling': {
      uk: 'Персональний стайлінг',
      ru: 'Персональный стайлинг',
      en: 'Personal Styling',
    },
    'color-analysis': {
      uk: 'Колористика',
      ru: 'Колористика',
      en: 'Color Analysis',
    },
    'wardrobe-audit': {
      uk: 'Аудит гардеробу',
      ru: 'Аудит гардероба',
      en: 'Wardrobe Audit',
    },
    shopping: {
      uk: 'Шопінг',
      ru: 'Шоппинг',
      en: 'Shopping Skills',
    },
    professional: {
      uk: 'Професійний розвиток',
      ru: 'Профессиональное развитие',
      en: 'Professional Development',
    },
    masterclass: {
      uk: 'Майстер-класи',
      ru: 'Мастер-классы',
      en: 'Masterclasses',
    },
  }

  const formatLabels: Record<string, Record<string, string>> = {
    online: { uk: 'Онлайн', ru: 'Онлайн', en: 'Online' },
    'in-person': { uk: 'Офлайн', ru: 'Офлайн', en: 'In-Person' },
    hybrid: { uk: 'Гібрид', ru: 'Гибрид', en: 'Hybrid' },
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <header className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
          <GraduationCap className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {locale === 'uk' ? 'Школа стилю PURITY' : locale === 'ru' ? 'Школа стиля PURITY' : 'PURITY Style School'}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {locale === 'uk'
            ? 'Професійні курси та майстер-класи зі стилю, колористики та моди'
            : locale === 'ru'
              ? 'Профессиональные курсы и мастер-классы по стилю, колористике и моде'
              : 'Professional courses and masterclasses in style, color analysis, and fashion'}
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="text-center p-6 bg-muted rounded-lg">
          <div className="text-3xl font-bold text-primary mb-2">{courses.totalDocs}+</div>
          <p className="text-muted-foreground">
            {locale === 'uk' ? 'Курсів' : locale === 'ru' ? 'Курсов' : 'Courses'}
          </p>
        </div>
        <div className="text-center p-6 bg-muted rounded-lg">
          <div className="text-3xl font-bold text-primary mb-2">500+</div>
          <p className="text-muted-foreground">
            {locale === 'uk' ? 'Випускників' : locale === 'ru' ? 'Выпускников' : 'Graduates'}
          </p>
        </div>
        <div className="text-center p-6 bg-muted rounded-lg">
          <div className="text-3xl font-bold text-primary mb-2">10+</div>
          <p className="text-muted-foreground">
            {locale === 'uk' ? 'Років досвіду' : locale === 'ru' ? 'Лет опыта' : 'Years Experience'}
          </p>
        </div>
      </div>

      {/* Courses by Category */}
      {Object.entries(coursesByCategory).map(([category, categoryCourses]) => (
        <section key={category} className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">
            {categoryLabels[category]?.[locale] || category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryCourses.map((course) => {
              const featuredImage = course.featuredImage as MediaType | undefined
              const duration = course.duration as { value: number; unit: string } | undefined
              const format = course.format || 'online'
              const price = course.price as { amount: number; currency: string } | undefined
              
              return (
                <Link
                  key={course.id}
                  href={`/${locale}/school/${course.slug}`}
                  className="group block"
                >
                  <article className="bg-card rounded-lg overflow-hidden border transition-shadow hover:shadow-lg h-full flex flex-col">
                    {featuredImage?.url && (
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={featuredImage.url}
                          alt={course.title || ''}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Monitor className="h-4 w-4" />
                          {formatLabels[format]?.[locale] || format}
                        </span>
                        {duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {duration.value} {duration.unit}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      {course.excerpt && (
                        <p className="text-muted-foreground text-sm line-clamp-2 flex-1">
                          {course.excerpt}
                        </p>
                      )}
                      {price && (
                        <div className="mt-4 pt-4 border-t">
                          <span className="text-lg font-bold">
                            {price.currency === 'UAH' ? '₴' : '€'}
                            {price.amount}
                          </span>
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        </section>
      ))}

      {/* No Courses */}
      {courses.docs.length === 0 && (
        <div className="text-center py-16">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg mb-6">
            {locale === 'uk'
              ? 'Курси скоро будуть доступні'
              : locale === 'ru'
                ? 'Курсы скоро будут доступны'
                : 'Courses coming soon'}
          </p>
          <Button asChild>
            <Link href={`/${locale}/contact`}>
              {locale === 'uk' ? 'Отримати сповіщення' : locale === 'ru' ? 'Получить уведомление' : 'Get Notified'}
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
