import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Media as MediaType, Portfolio as PortfolioType } from '@/payload-types'
import { getPayload } from '@/lib/payload'

export default async function TransformationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  
  const payload = await getPayload()
  
  // Get transformation-related portfolio items
  const transformations = await payload.find({
    collection: 'portfolio',
    where: {
      category: { equals: 'transformation' },
    },
    locale: locale as 'en' | 'ru' | 'uk',
    limit: 6,
    sort: '-createdAt',
  })

  // Get styling services
  const services = await payload.find({
    collection: 'services',
    where: {
      category: { equals: 'styling' },
    },
    locale: locale as 'en' | 'ru' | 'uk',
    limit: 4,
  })

  const benefits = {
    uk: [
      'Персоналізований підхід до вашого стилю',
      'Економія часу та грошей на покупках',
      'Впевненість у своєму зовнішньому вигляді',
      'Гардероб, який працює на вас',
      'Підтримка стиліста на кожному етапі',
    ],
    ru: [
      'Персонализированный подход к вашему стилю',
      'Экономия времени и денег на покупках',
      'Уверенность в своем внешнем виде',
      'Гардероб, который работает на вас',
      'Поддержка стилиста на каждом этапе',
    ],
    en: [
      'Personalized approach to your style',
      'Save time and money on shopping',
      'Confidence in your appearance',
      'A wardrobe that works for you',
      'Stylist support every step of the way',
    ],
  }

  const process = {
    uk: [
      { step: 1, title: 'Консультація', desc: 'Знайомство, аналіз потреб та цілей' },
      { step: 2, title: 'Аналіз', desc: 'Визначення кольоротипу та форми тіла' },
      { step: 3, title: 'Аудит гардеробу', desc: 'Ревізія існуючого одягу' },
      { step: 4, title: 'Шопінг', desc: 'Підбір нових речей під ваш стиль' },
      { step: 5, title: 'Підсумок', desc: 'Готовий капсульний гардероб' },
    ],
    ru: [
      { step: 1, title: 'Консультация', desc: 'Знакомство, анализ потребностей и целей' },
      { step: 2, title: 'Анализ', desc: 'Определение цветотипа и формы тела' },
      { step: 3, title: 'Аудит гардероба', desc: 'Ревизия существующей одежды' },
      { step: 4, title: 'Шоппинг', desc: 'Подбор новых вещей под ваш стиль' },
      { step: 5, title: 'Итог', desc: 'Готовый капсульный гардероб' },
    ],
    en: [
      { step: 1, title: 'Consultation', desc: 'Introduction, needs and goals analysis' },
      { step: 2, title: 'Analysis', desc: 'Color type and body shape assessment' },
      { step: 3, title: 'Wardrobe Audit', desc: 'Review of existing clothing' },
      { step: 4, title: 'Shopping', desc: 'Selection of new items for your style' },
      { step: 5, title: 'Result', desc: 'Complete capsule wardrobe' },
    ],
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-24 bg-linear-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {locale === 'uk'
                ? 'Ваша стильова трансформація'
                : locale === 'ru'
                  ? 'Ваша стильовая трансформация'
                  : 'Your Style Transformation'}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {locale === 'uk'
                ? 'Відкрийте свій унікальний стиль разом з PURITY. Ми допоможемо створити гардероб, який підкреслює вашу індивідуальність.'
                : locale === 'ru'
                  ? 'Откройте свой уникальный стиль вместе с PURITY. Мы поможем создать гардероб, который подчеркивает вашу индивидуальность.'
                  : 'Discover your unique style with PURITY. We help create a wardrobe that highlights your individuality.'}
            </p>
            <Button asChild size="lg">
              <Link href={`/${locale}/booking`}>
                {locale === 'uk' ? 'Почати трансформацію' : locale === 'ru' ? 'Начать трансформацию' : 'Start Your Transformation'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {locale === 'uk' ? 'Що ви отримаєте' : locale === 'ru' ? 'Что вы получите' : 'What You Get'}
          </h2>
          <div className="max-w-2xl mx-auto">
            <ul className="space-y-4">
              {benefits[locale as keyof typeof benefits].map((benefit, index) => (
                <li key={index} className="flex items-center gap-4 p-4 bg-background">
                  <CheckCircle className="h-6 w-6 text-primary shrink-0" />
                  <span className="text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {locale === 'uk' ? 'Як це працює' : locale === 'ru' ? 'Как это работает' : 'How It Works'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {process[locale as keyof typeof process].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transformations Gallery */}
      {transformations.docs.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {locale === 'uk' ? 'Наші трансформації' : locale === 'ru' ? 'Наши трансформации' : 'Our Transformations'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformations.docs.map((item) => {
                const portfolio = item as PortfolioType
                // Use afterImage as cover (transformation result)
                const coverImage = (typeof portfolio.afterImage === 'object' ? portfolio.afterImage : null) as MediaType | null
                
                return (
                  <Link
                    key={portfolio.id}
                    href={`/${locale}/portfolio/${portfolio.slug}`}
                    className="group block"
                  >
                    <article className="bg-background overflow-hidden border transition-shadow hover:shadow-lg">
                      {coverImage?.url && (
                        <div className="aspect-4/5 relative overflow-hidden">
                          <Image
                            src={coverImage.url}
                            alt={portfolio.title || ''}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {portfolio.title}
                        </h3>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link href={`/${locale}/portfolio`}>
                  {locale === 'uk' ? 'Дивитись всі проекти' : locale === 'ru' ? 'Смотреть все проекты' : 'View All Projects'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {services.docs.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {locale === 'uk' ? 'Наші послуги' : locale === 'ru' ? 'Наши услуги' : 'Our Services'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.docs.map((service) => (
                <Link
                  key={service.id}
                  href={`/${locale}/services/${service.slug}`}
                  className="group p-6 bg-muted hover:bg-primary/10 transition-colors"
                >
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  {service.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {service.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild>
                <Link href={`/${locale}/services`}>
                  {locale === 'uk' ? 'Всі послуги' : locale === 'ru' ? 'Все услуги' : 'All Services'}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {locale === 'uk'
              ? 'Готові змінитися?'
              : locale === 'ru'
                ? 'Готовы измениться?'
                : 'Ready to Transform?'}
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            {locale === 'uk'
              ? 'Запишіться на безкоштовну консультацію та зробіть перший крок до нового себе'
              : locale === 'ru'
                ? 'Запишитесь на бесплатную консультацию и сделайте первый шаг к новому себе'
                : 'Book a free consultation and take the first step towards a new you'}
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href={`/${locale}/booking`}>
              {locale === 'uk' ? 'Записатися зараз' : locale === 'ru' ? 'Записаться сейчас' : 'Book Now'}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
