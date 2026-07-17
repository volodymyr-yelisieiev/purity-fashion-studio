import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { EditorialHero, FeatureList } from "@/components/purity"
import { SiteFooter, SiteHeader } from "@/components/cms-site-shell"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatOfferPrice } from "@/content/commerce"
import { getLocalizedMetadata } from "@/content/metadata"
import { getCourseBySlug, getPublishedCourseSlugs } from "@/content/public-api"
import { coursePath } from "@/content/routes"
import { BookingStartCta } from "@/features/booking/booking-start-cta"
import { hasLocale, locales, localizePath, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

type CoursePageProps = {
  params: Promise<{ locale: string; slug: string }>
}

const courseCopy = {
  eyebrow: {
    uk: "Практична програма PURITY",
    ru: "Практическая программа PURITY",
    en: "PURITY practical programme",
  },
  intro: {
    uk: "Курс переводить досвід стилістів, ательє та внутрішньої школи PURITY у послідовну систему самостійної роботи з гардеробом. Програма рухається від аудиту речей до силуету, палітри й аргументованих покупок.",
    ru: "Курс переводит опыт стилистов, ателье и внутренней школы PURITY в последовательную систему самостоятельной работы с гардеробом. Программа движется от аудита вещей к силуэту, палитре и аргументированным покупкам.",
    en: "The course turns the experience of PURITY stylists, atelier, and internal school into a structured method for independent wardrobe work. The programme moves from auditing pieces to silhouette, palette, and reasoned purchases.",
  },
  audienceTitle: {
    uk: "Для кого ця програма",
    ru: "Для кого эта программа",
    en: "Who the programme is for",
  },
  audience: {
    uk: "Для тих, хто хоче самостійно оцінювати речі, складати комплекти й планувати покупки за зрозумілими критеріями.",
    ru: "Для тех, кто хочет самостоятельно оценивать вещи, составлять комплекты и планировать покупки по понятным критериям.",
    en: "For people who want to assess pieces, build outfits, and plan purchases independently using clear criteria.",
  },
  formatTitle: {
    uk: "Формат участі",
    ru: "Формат участия",
    en: "Participation format",
  },
  format: {
    uk: "Тривалість, матеріали й формат навчання: placeholder до затвердження фінальної оферти.",
    ru: "Длительность, материалы и формат обучения: placeholder до утверждения финальной оферты.",
    en: "Duration, materials, and learning format: placeholder until the final offer is approved.",
  },
  methodTitle: {
    uk: "Практика між темами",
    ru: "Практика между темами",
    en: "Practice between topics",
  },
  method: {
    uk: "Кожна тема застосовується до реального гардероба: спостереження перетворюються на правила, які можна повторювати після курсу.",
    ru: "Каждая тема применяется к реальному гардеробу: наблюдения превращаются в правила, которые можно повторять после курса.",
    en: "Each topic is applied to a real wardrobe, turning observations into rules that remain useful after the course.",
  },
  prerequisitesTitle: {
    uk: "Prerequisites",
    ru: "Prerequisites",
    en: "Prerequisites",
  },
  prerequisites: {
    uk: "Без попередньої підготовки; вимоги до досвіду й матеріалів — placeholder до затвердження оферти.",
    ru: "Без предварительной подготовки; требования к опыту и материалам — placeholder до утверждения оферты.",
    en: "No prior preparation required; experience and material requirements remain placeholders until the offer is approved.",
  },
  curriculumTitle: {
    uk: "Програма курсу",
    ru: "Программа курса",
    en: "Course curriculum",
  },
  curriculumSummary: {
    uk: "Чотири теми формують один цикл управління гардеробом.",
    ru: "Четыре темы формируют один цикл управления гардеробом.",
    en: "Four topics form one wardrobe-management cycle.",
  },
  lessonDescriptions: {
    uk: [
      "Фіксуємо склад гардероба, дублювання, прогалини та речі, які вже підтримують щоденні сценарії.",
      "Розбираємо пропорції, крій і посадку, щоб бачити роль кожної речі в комплекті.",
      "Будуємо практичну палітру й правила поєднань для наявних і майбутніх речей.",
      "Формуємо критерії покупки: задача, комплектність, матеріал, посадка й місце в системі.",
    ],
    ru: [
      "Фиксируем состав гардероба, дублирование, пробелы и вещи, которые уже поддерживают повседневные сценарии.",
      "Разбираем пропорции, крой и посадку, чтобы видеть роль каждой вещи в комплекте.",
      "Строим практическую палитру и правила сочетаний для существующих и будущих вещей.",
      "Формируем критерии покупки: задача, комплектность, материал, посадка и место в системе.",
    ],
    en: [
      "Map wardrobe composition, duplication, gaps, and the pieces already supporting everyday scenarios.",
      "Study proportion, cut, and fit to understand the role of each piece within an outfit.",
      "Build a practical palette and combination rules for current and future pieces.",
      "Define buying criteria: purpose, outfit value, material, fit, and place within the system.",
    ],
  },
  outcomesTitle: {
    uk: "Що ви зможете робити самостійно",
    ru: "Что вы сможете делать самостоятельно",
    en: "What you will be able to do independently",
  },
  outcomesSummary: {
    uk: "Результат — не разова стилізація, а повторюваний спосіб аналізувати гардероб, збирати комплекти та перевіряти майбутні покупки.",
    ru: "Результат — не разовая стилизация, а повторяемый способ анализировать гардероб, собирать комплекты и проверять будущие покупки.",
    en: "The outcome is not a one-off styling exercise, but a repeatable way to review a wardrobe, build outfits, and assess future purchases.",
  },
  commercialTitle: {
    uk: "Фіксована пропозиція",
    ru: "Фиксированное предложение",
    en: "Fixed offer",
  },
  ctaTitle: {
    uk: "Відкрити checkout placeholder.",
    ru: "Открыть checkout placeholder.",
    en: "Open the checkout placeholder.",
  },
  ctaSummary: {
    uk: "Фінальна ціна, тривалість і prerequisites поки що залишені як placeholder. Кнопка веде в наявний тестовий маршрут оплати.",
    ru: "Финальная цена, длительность и prerequisites пока оставлены как placeholder. Кнопка ведёт в существующий тестовый маршрут оплаты.",
    en: "Final price, duration, and prerequisites remain placeholders for now. The button opens the existing test payment route.",
  },
  serviceLabel: {
    uk: "Переглянути освітній сервіс",
    ru: "Посмотреть образовательный сервис",
    en: "View the educational service",
  },
  checkoutLabel: {
    uk: "Перейти до checkout",
    ru: "Перейти к checkout",
    en: "Continue to checkout",
  },
} satisfies Record<string, Record<Locale, string | string[]>>

export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getPublishedCourseSlugs()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params

  if (!hasLocale(rawLocale)) {
    return {}
  }

  const course = await getCourseBySlug(rawLocale, slug)

  if (!course) {
    return {}
  }

  return getLocalizedMetadata({
    locale: rawLocale,
    path: coursePath(course.routeSegment),
    title: course.seo.title,
    description: course.seo.description,
  })
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { locale: rawLocale, slug } = await params

  if (!hasLocale(rawLocale)) {
    notFound()
  }

  const locale: Locale = rawLocale
  const course = await getCourseBySlug(locale, slug)

  if (!course) {
    notFound()
  }

  const currentPath = coursePath(course.routeSegment)
  const primaryOffer = course.offers.find(
    (offer) => offer.commercialStatus === "active"
  )
  const bookingHref = localizePath(
    locale,
    `/booking?service=wardrobe-management${primaryOffer ? `&offer=${primaryOffer.id}` : ""}`
  )

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader locale={locale} currentPath={currentPath} />

      <main>
        <EditorialHero
          locale={locale}
          eyebrow={courseCopy.eyebrow[locale]}
          title={course.title}
          summary={course.description}
          mediaAsset={course.mediaAsset}
          composition="editorial"
        >
          <div className="flex max-w-full flex-wrap gap-3">
            <BookingStartCta
              href={bookingHref}
              label={course.cta.label}
              serviceSlug="wardrobe-management"
              variant="secondary"
            />
            <Link
              href={localizePath(locale, "/services/wardrobe-management")}
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "h-auto min-h-11 max-w-full whitespace-normal",
                })
              )}
            >
              {courseCopy.serviceLabel[locale]}
            </Link>
          </div>
        </EditorialHero>

        <section className="bg-muted">
          <div className="mx-auto grid max-w-6xl min-w-0 auto-rows-fr gap-4 px-6 py-16 sm:grid-cols-2 md:px-10 lg:grid-cols-3">
            {[
              [courseCopy.audienceTitle[locale], course.audience],
              [courseCopy.formatTitle[locale], course.formats.join(" · ")],
              [courseCopy.methodTitle[locale], course.description],
              [
                courseCopy.prerequisitesTitle[locale],
                course.prerequisites ?? courseCopy.prerequisites[locale],
              ],
              [
                courseCopy.curriculumTitle[locale],
                `${course.sessions} sessions${course.intakeNote ? ` · ${course.intakeNote}` : ""}`,
              ],
            ].map(([title, text]) => (
              <Card
                key={title}
                className="h-full min-w-0 border-border bg-background"
              >
                <CardHeader>
                  <CardTitle className="min-w-0 break-words">{title}</CardTitle>
                  <CardDescription className="min-w-0 break-words">
                    {text}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl min-w-0 gap-8 px-6 py-14 md:grid-cols-[0.72fr_1.28fr] md:px-10">
          <div className="min-w-0">
            <h2 className="text-3xl leading-tight font-medium md:text-5xl">
              {courseCopy.curriculumTitle[locale]}
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              {courseCopy.curriculumSummary[locale]}
            </p>
          </div>
          <Card className="min-w-0 border-border bg-background">
            <CardContent>
              <Accordion defaultValue={[course.program[0]?.title ?? ""]}>
                {course.program.map((lesson, index) => (
                  <AccordionItem key={lesson.title} value={lesson.title}>
                    <AccordionTrigger>
                      <span className="mr-3 text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {lesson.title}
                    </AccordionTrigger>
                    <AccordionContent className="pl-9 leading-7 text-muted-foreground">
                      {lesson.description ||
                        courseCopy.lessonDescriptions[locale][index]}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <section className="bg-muted">
          <div className="mx-auto grid max-w-6xl min-w-0 auto-rows-fr gap-4 px-6 py-16 md:grid-cols-2 md:px-10">
            <Card className="h-full min-w-0 border-primary-foreground/20 bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="min-w-0 break-words">
                  {courseCopy.outcomesTitle[locale]}
                </CardTitle>
                <CardDescription className="text-secondary">
                  {courseCopy.outcomesSummary[locale]}
                </CardDescription>
              </CardHeader>
              <CardContent className="border-t border-primary-foreground/20 pt-5">
                <FeatureList
                  items={course.program.map((lesson) => lesson.title)}
                  className="text-primary-foreground/80"
                />
              </CardContent>
            </Card>
            <Card className="h-full min-w-0 border-border bg-background">
              <CardHeader>
                <CardTitle className="min-w-0 break-words">
                  {courseCopy.commercialTitle[locale]}
                </CardTitle>
                <CardDescription className="min-w-0 break-words">
                  {course.commercialStatus}
                </CardDescription>
              </CardHeader>
              <CardContent className="border-t border-border pt-5 text-sm leading-7 text-muted-foreground">
                {course.offers.length > 0
                  ? course.offers
                      .map(
                        (offer) =>
                          `${offer.title}: ${formatOfferPrice(offer, locale)}`
                      )
                      .join(" · ")
                  : course.priceNote}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl min-w-0 px-6 py-14 md:px-10">
          <Card className="min-w-0 border-border bg-background">
            <CardHeader>
              <CardTitle className="min-w-0 break-words">
                {courseCopy.ctaTitle[locale]}
              </CardTitle>
              <CardDescription className="mt-3 max-w-3xl">
                {courseCopy.ctaSummary[locale]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingStartCta
                href={bookingHref}
                label={course.cta.label}
                serviceSlug="wardrobe-management"
              />
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter locale={locale} currentPath={currentPath} />
    </div>
  )
}
