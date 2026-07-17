import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import {
  BookingCTA,
  BrandLogo,
  EditorialFaq,
  ImageFrame,
} from "@/components/purity"
import { SiteFooter, SiteHeader } from "@/components/cms-site-shell"
import { buttonVariants } from "@/components/ui/button"
import {
  collections,
  courses,
  portfolioCases,
  publicPages,
  serviceCategories,
  services,
  siteSettings,
} from "@/content/source"
import { getFirstMediaAsset, getMediaAsset } from "@/content/queries"
import {
  getCourseBySlug,
  getFashionCollectionBySlug,
  getHome,
  getPageBySlug,
  getPortfolioCaseBySlug,
  getServiceBySlug,
} from "@/content/public-api"
import {
  collectionPath,
  coursePath,
  getNavigation,
  portfolioCasePath,
  servicePath,
} from "@/content/routes"
import { hasLocale, localizePath, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

type HomePageProps = {
  params: Promise<{ locale: string }>
}

const homeEditorialCopy = {
  filmSteps: {
    uk: ["Досліджуємо", "Уявляємо", "Створюємо"],
    ru: ["Исследуем", "Воображаем", "Создаём"],
    en: ["Research", "Imagine", "Create"],
  },
  serviceIntro: {
    uk: "Від першої консультації до примірки, капсули або корпоративного образу: кожен напрям має зрозумілий вхід, результат і комерційний статус.",
    ru: "От первой консультации до примерки, капсулы или корпоративного образа: у каждого направления есть понятный вход, результат и коммерческий статус.",
    en: "From first consultation to fitting, capsule, or corporate image: every direction has a clear entry point, outcome, and commercial status.",
  },
  priceNote: {
    uk: "Вартість уточнюється після формату, обсягу й строків.",
    ru: "Стоимость уточняется после формата, объёма и сроков.",
    en: "Pricing is clarified after format, scope, and timing.",
  },
  signalLabels: {
    directions: {
      uk: "напрямів",
      ru: "направлений",
      en: "directions",
    },
    contacts: {
      uk: "канали звʼязку",
      ru: "канала связи",
      en: "contact channels",
    },
    studio: {
      uk: "студія",
      ru: "студия",
      en: "studio",
    },
  },
  signalDetails: {
    directions: {
      uk: "Стиліст, шопінг, ательє, гардероб, корпоратив, школа й колекції.",
      ru: "Стилист, шопинг, ателье, гардероб, корпоратив, школа и коллекции.",
      en: "Styling, shopping, atelier, wardrobe, corporate, school, and collections.",
    },
    contacts: {
      uk: "Телефон, Viber, email і соціальні канали з реальної контактної сторінки.",
      ru: "Телефон, Viber, email и социальные каналы с реальной контактной страницы.",
      en: "Phone, Viber, email, and social channels from the real contact page.",
    },
    studio: {
      uk: "Предславинська 44, French Quarter 2, щодня 11:00-20:00.",
      ru: "Предславинская 44, French Quarter 2, ежедневно 11:00-20:00.",
      en: "Predslavynska 44, French Quarter 2, daily 11:00-20:00.",
    },
  },
  methodEyebrow: {
    uk: "Метод",
    ru: "Метод",
    en: "Method",
  },
  methodTitle: {
    uk: "Один процес для стилю, речей і посадки.",
    ru: "Один процесс для стиля, вещей и посадки.",
    en: "One process for style, pieces, and fit.",
  },
  methodDetails: {
    uk: [
      "Команда поєднує стилістів, закрійників, кравців і майстрів аксесуарів навколо запиту «що вдягти».",
      "У студії зібрані майстерня-ательє, шоурум з одягом, тканинами й аксесуарами, клієнтська зона та консультаційний простір.",
    ],
    ru: [
      "Команда соединяет стилистов, закройщиков, портных и мастеров аксессуаров вокруг запроса «что надеть».",
      "В студии собраны мастерская-ателье, шоурум с одеждой, тканями и аксессуарами, клиентская зона и консультационное пространство.",
    ],
    en: [
      "The team brings stylists, cutters, tailors, and accessory makers around the practical question of what to wear.",
      "The studio combines an atelier, showroom with clothing, fabrics and accessories, client area, and consultation space.",
    ],
  },
  contactTitle: {
    uk: "Почати можна з короткого запиту.",
    ru: "Начать можно с короткого запроса.",
    en: "Start with a short request.",
  },
  contactSummary: {
    uk: "Опишіть задачу, бажаний формат і зручний канал звʼязку. Команда повернеться з наступним кроком.",
    ru: "Опишите задачу, желаемый формат и удобный канал связи. Команда вернётся со следующим шагом.",
    en: "Describe the brief, preferred format, and contact channel. The team will return with the next step.",
  },
  portfolioTitle: {
    uk: "Портфоліо — лише з підтвердженим контекстом.",
    ru: "Портфолио — только с подтверждённым контекстом.",
    en: "Portfolio — only with verified context.",
  },
  portfolioSummary: {
    uk: "PURITY не показує згенеровані образи як клієнтський результат. Кейс публікується лише з погодженим брифом, процесом і медіа.",
    ru: "PURITY не показывает сгенерированные образы как клиентский результат. Кейс публикуется только с согласованным брифом, процессом и медиа.",
    en: "PURITY does not present generated images as client results. A case is published only with an approved brief, process, and media.",
  },
  portfolioSignals: {
    uk: ["Погоджений бриф", "Зафіксований процес", "Підтверджені медіа"],
    ru: [
      "Согласованный бриф",
      "Зафиксированный процесс",
      "Подтверждённые медиа",
    ],
    en: ["Approved brief", "Documented process", "Verified media"],
  },
  faqTitle: {
    uk: "Поширені запитання",
    ru: "Частые вопросы",
    en: "Frequently asked questions",
  },
  faq: {
    uk: [
      [
        "З чого почати?",
        "Опишіть задачу в заявці: консультація, шопінг, ательє, гардероб, корпоративний проєкт або навчання. Команда підтвердить формат і наступний крок.",
      ],
      [
        "Чи можна працювати онлайн?",
        "Так. Для частини стилістичних і гардеробних запитів можливий онлайн-формат; фінальне рішення залежить від задачі й потрібних примірок.",
      ],
      [
        "Як формується вартість?",
        "Фіксовані пропозиції мають вказану ціну. Для індивідуальних робіт команда погоджує обсяг, строки та вартість після короткого брифу.",
      ],
    ],
    ru: [
      [
        "С чего начать?",
        "Опишите задачу в заявке: консультация, шопинг, ателье, гардероб, корпоративный проект или обучение. Команда подтвердит формат и следующий шаг.",
      ],
      [
        "Можно работать онлайн?",
        "Да. Для части стилистических и гардеробных запросов доступен онлайн-формат; финальное решение зависит от задачи и необходимых примерок.",
      ],
      [
        "Как формируется стоимость?",
        "У фиксированных предложений есть указанная цена. Для индивидуальных работ команда согласует объём, сроки и стоимость после короткого брифа.",
      ],
    ],
    en: [
      [
        "Where do I start?",
        "Describe the brief in the inquiry: consultation, shopping, atelier, wardrobe, corporate work, or learning. The team will confirm the format and next step.",
      ],
      [
        "Can we work online?",
        "Yes. Some styling and wardrobe requests can be handled online; the final format depends on the brief and whether fittings are needed.",
      ],
      [
        "How is pricing set?",
        "Fixed offers show a stated price. For individual work, the team confirms scope, timing, and price after a short brief.",
      ],
    ],
  },
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params

  if (!hasLocale(rawLocale)) {
    notFound()
  }

  const locale: Locale = rawLocale
  const home = await getHome(locale)
  const navigation = getNavigation(locale)
  const payloadMode = process.env.CONTENT_SOURCE === "payload"
  const [cmsServices, cmsCourses, cmsCollections, cmsPortfolio, cmsBooking] =
    payloadMode
      ? await Promise.all([
          Promise.all(
            home.selectedServiceSlugs.map((slug) =>
              getServiceBySlug(locale, slug)
            )
          ),
          Promise.all(
            home.selectedCourseSlugs.map((slug) =>
              getCourseBySlug(locale, slug)
            )
          ),
          Promise.all(
            home.selectedCollectionSlugs.map((slug) =>
              getFashionCollectionBySlug(locale, slug)
            )
          ),
          Promise.all(
            home.selectedPortfolioSlugs.map((slug) =>
              getPortfolioCaseBySlug(locale, slug)
            )
          ),
          getPageBySlug(locale, "booking"),
        ])
      : [[], [], [], [], null]
  const visibleServices = payloadMode
    ? cmsServices.flatMap((service) =>
        service
          ? [
              {
                routeSegment: service.routeSegment,
                title: service.title,
                summary: service.summary,
                categoryTitle: service.eyebrow,
                outcomes: service.outcomes,
                mediaAsset: service.mediaAsset,
              },
            ]
          : []
      )
    : services
        .filter((service) => service.visibleInMvp)
        .map((service) => ({
          routeSegment: service.routeSegment,
          title: service.title[locale],
          summary: service.summary[locale],
          categoryTitle:
            serviceCategories.find((item) => item.slug === service.category)
              ?.title[locale] ?? service.title[locale],
          outcomes: service.outcomes[locale],
          mediaAsset: getFirstMediaAsset(service.mediaIds),
        }))
  const visibleCourses = payloadMode
    ? cmsCourses.flatMap((course) =>
        course
          ? [
              {
                routeSegment: course.routeSegment,
                title: course.title,
                summary: course.summary,
                audience: course.audience,
                lessons: course.program.map((lesson) => lesson.title),
                commercialStatus: course.commercialStatus,
                mediaAsset: course.mediaAsset,
              },
            ]
          : []
      )
    : courses
        .filter((course) => course.visibleInMvp)
        .map((course) => ({
          routeSegment: course.routeSegment,
          title: course.title[locale],
          summary: course.summary[locale],
          audience: course.audience[locale],
          lessons: course.lessons[locale],
          commercialStatus: course.commercialStatus[locale],
          mediaAsset: getFirstMediaAsset(course.mediaIds),
        }))
  const visibleCollections = payloadMode
    ? cmsCollections.flatMap((collection) =>
        collection
          ? [
              {
                routeSegment: collection.routeSegment,
                title: collection.title,
                priceNote: collection.priceNote,
                mediaAsset: collection.mediaAssets[0],
              },
            ]
          : []
      )
    : collections
        .filter((collection) => collection.visibleInMvp)
        .map((collection) => ({
          routeSegment: collection.routeSegment,
          title: collection.title[locale],
          priceNote: collection.priceNote[locale],
          mediaAsset: getFirstMediaAsset(collection.mediaIds),
        }))
  const heroImage =
    home.heroMedia ?? getMediaAsset("generated-editorial-hero-flow")
  const researchImage = getMediaAsset("generated-editorial-research")
  const imagineImage = getMediaAsset("editorial-collections-flatlay")
  const createImage = getMediaAsset("generated-editorial-create")
  const directionsTexture = getMediaAsset("editorial-directions-texture")
  const studioImage = getMediaAsset("editorial-studio-method")
  const portfolioImage = getMediaAsset("editorial-portfolio-process")
  const atelierService = visibleServices.find(
    (service) => service.routeSegment === "atelier-service"
  )
  const atelierImage = atelierService?.mediaAsset
  const bookingPage = payloadMode
    ? cmsBooking
      ? { title: cmsBooking.title, summary: cmsBooking.summary }
      : undefined
    : (() => {
        const page = publicPages.find((item) => item.slug === "booking")
        return page
          ? { title: page.title[locale], summary: page.summary[locale] }
          : undefined
      })()
  const portfolioCase = payloadMode
    ? (() => {
        const entry = cmsPortfolio.find((item) => item !== null)
        return entry
          ? { routeSegment: entry.routeSegment, title: entry.title }
          : undefined
      })()
    : (() => {
        const entry = portfolioCases.find((item) => item.visibleInMvp)
        return entry
          ? {
              routeSegment: entry.routeSegment,
              title: entry.title[locale],
            }
          : undefined
      })()
  const researchLabel =
    navigation.find((item) => item.id === "research")?.label ??
    siteSettings.home.secondaryCta.label[locale]
  const researchPath =
    navigation.find((item) => item.id === "research")?.path ??
    siteSettings.home.secondaryCta.path
  const studioLabel =
    navigation.find((item) => item.id === "studio")?.label ??
    siteSettings.home.studioEyebrow[locale]
  const studioDetails = homeEditorialCopy.methodDetails[locale]
  const filmSteps = [
    {
      title: homeEditorialCopy.filmSteps[locale][0],
      text: homeEditorialCopy.serviceIntro[locale],
      image: researchImage,
    },
    {
      title: homeEditorialCopy.filmSteps[locale][1],
      text: studioDetails[0],
      image: imagineImage,
    },
    {
      title: homeEditorialCopy.filmSteps[locale][2],
      text: studioDetails[1],
      image: createImage,
    },
  ]
  if (home.method.length > 0) {
    home.method.slice(0, filmSteps.length).forEach((item, index) => {
      filmSteps[index] = {
        ...filmSteps[index],
        title: item.label,
        text: item.description,
      }
    })
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader locale={locale} />

      <main>
        <section
          className="relative min-h-svh overflow-hidden bg-foreground text-background"
          data-testid="editorial-hero"
        >
          <figure className="absolute inset-0">
            {heroImage?.src && (
              <Image
                alt={heroImage.alt[locale]}
                src={heroImage.src}
                fill
                priority
                sizes="100vw"
                className="object-cover object-[62%_center] md:object-center"
              />
            )}
          </figure>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-foreground/45"
          />
          <div className="relative mx-auto flex min-h-svh w-full max-w-screen-2xl items-end px-6 pt-32 pb-12 md:px-10 md:pb-16 lg:px-16 lg:pb-20">
            <div className="grid max-w-5xl gap-6">
              <p className="text-xs tracking-[0.18em] text-background/70 uppercase">
                {home.heroEyebrow}
              </p>
              <h1 className="max-w-[13ch] text-[clamp(3rem,8vw,7.5rem)] leading-[0.86] font-medium text-pretty">
                {home.heroTitle}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-background/75 md:text-base">
                {home.heroSummary}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={localizePath(locale, home.primaryCTA.path)}
                  className={cn(
                    buttonVariants({
                      variant: "secondary",
                      size: "lg",
                    })
                  )}
                >
                  {home.primaryCTA.label}
                </Link>
                <Link
                  href={localizePath(locale, home.secondaryCTA.path)}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "lg",
                    })
                  )}
                >
                  {home.secondaryCTA.label}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section data-editorial-sequence="home-method" className="w-full">
          {filmSteps.map((step, index) => (
            <article key={step.title} className="grid min-w-0 md:grid-cols-2">
              <ImageFrame
                alt={step.image?.alt[locale] ?? step.title}
                src={step.image?.src}
                ratio={3 / 2}
                eager={index === 0}
                className={cn("rounded-none", index % 2 === 1 && "md:order-2")}
              />
              <div
                className={cn(
                  "flex min-h-80 flex-col justify-center gap-5 px-6 py-12 md:px-12 lg:px-20",
                  index === 1 && "bg-muted"
                )}
              >
                <p className="text-xs text-muted-foreground">0{index + 1}</p>
                <h2 className="text-4xl leading-none font-medium text-pretty lg:text-6xl">
                  {step.title}
                </h2>
                <p className="max-w-lg text-sm leading-7 text-muted-foreground">
                  {step.text}
                </p>
              </div>
            </article>
          ))}
        </section>

        <section
          aria-hidden="true"
          className="flex min-h-40 items-center justify-center bg-background px-6 py-10"
        >
          <BrandLogo
            locale={locale}
            variant="mark"
            decorative
            className="w-8 opacity-55"
          />
        </section>

        <section className="relative px-6 py-16 md:px-10 md:py-24">
          {directionsTexture?.src && (
            <Image
              alt=""
              src={directionsTexture.src}
              fill
              sizes="100vw"
              className="object-cover"
            />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-background/85"
          />
          <div className="relative mx-auto grid max-w-screen-2xl gap-12 lg:grid-cols-[0.65fr_1.35fr]">
            <div className="grid content-start gap-6 lg:sticky lg:top-32 lg:self-start">
              <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
                {siteSettings.home.serviceRailTitle[locale]}
              </p>
              <h2 className="text-5xl leading-[0.94] font-medium text-balance md:text-7xl">
                {homeEditorialCopy.methodTitle[locale]}
              </h2>
              <p className="max-w-lg text-sm leading-7 text-muted-foreground">
                {homeEditorialCopy.serviceIntro[locale]}
              </p>
              <Link
                href={localizePath(locale, researchPath)}
                className={cn(
                  buttonVariants({
                    variant: "default",
                    size: "lg",
                    className: "w-fit max-w-full",
                  })
                )}
              >
                {researchLabel}
              </Link>
            </div>
            <nav aria-label={siteSettings.home.serviceRailTitle[locale]}>
              {visibleServices.map((service, index) => {
                return (
                  <Link
                    key={service.routeSegment}
                    href={localizePath(
                      locale,
                      servicePath(service.routeSegment)
                    )}
                    className="group grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5 border-t border-border py-7 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <span className="text-xs text-muted-foreground">
                      0{index + 1}
                    </span>
                    <span className="grid min-w-0 gap-2">
                      <span className="font-heading text-3xl leading-none md:text-5xl">
                        {service.title}
                      </span>
                      <span className="text-xs tracking-[0.12em] text-muted-foreground uppercase">
                        {service.categoryTitle}
                      </span>
                    </span>
                    <ArrowRightIcon
                      aria-hidden="true"
                      data-icon="inline-end"
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                )
              })}
            </nav>
          </div>
        </section>

        <section className="grid min-w-0 bg-foreground text-background lg:grid-cols-2">
          {studioImage?.src && (
            <ImageFrame
              alt={studioImage.alt[locale]}
              src={studioImage.src}
              ratio={3 / 2}
              className="lg:aspect-auto lg:min-h-[44rem]"
            />
          )}
          <div className="grid min-w-0 content-center gap-8 px-6 py-16 md:px-10 lg:px-16">
            <div className="grid content-start gap-6">
              <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
                {homeEditorialCopy.methodEyebrow[locale]}
              </p>
              <h2 className="text-[clamp(2.5rem,12vw,4.5rem)] leading-[0.94] font-medium text-balance">
                {siteSettings.home.studioTitle[locale]}
              </h2>
              <p className="max-w-xl text-sm leading-7 text-background/70">
                {home.studioIntro}
              </p>
              <Link
                href={localizePath(locale, "/studio")}
                className={cn(
                  buttonVariants({
                    variant: "secondary",
                    size: "lg",
                    className: "w-fit max-w-full",
                  })
                )}
              >
                {studioLabel}
              </Link>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {studioDetails.map((detail, index) => (
                <div key={detail} className="grid content-start gap-5">
                  <p className="font-heading text-6xl text-background/25">
                    0{index + 1}
                  </p>
                  <p className="text-sm leading-7 text-background/70">
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {atelierService && (
          <section className="grid min-w-0 bg-primary text-primary-foreground lg:grid-cols-2">
            {atelierImage?.src && (
              <ImageFrame
                alt={atelierImage.alt[locale]}
                src={atelierImage.src}
                ratio={3 / 2}
                eager
                className="rounded-none lg:aspect-auto lg:min-h-[42rem]"
              />
            )}
            <div className="flex flex-col justify-center gap-7 px-6 py-16 md:px-10 lg:px-16">
              <p className="text-xs tracking-[0.16em] text-primary-foreground/65 uppercase">
                {atelierService.categoryTitle}
              </p>
              <h2 className="text-5xl leading-[0.94] font-medium text-balance md:text-7xl">
                {atelierService.title}
              </h2>
              <p className="max-w-xl text-sm leading-7 text-primary-foreground/70">
                {atelierService.summary}
              </p>
              <ol className="grid gap-4 border-t border-primary-foreground/20 pt-6 text-sm text-primary-foreground/70">
                {atelierService.outcomes.map((outcome, index) => (
                  <li key={outcome} className="grid grid-cols-[auto_1fr] gap-4">
                    <span>0{index + 1}</span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ol>
              <Link
                href={localizePath(
                  locale,
                  servicePath(atelierService.routeSegment)
                )}
                className={cn(
                  buttonVariants({
                    variant: "secondary",
                    size: "lg",
                    className: "w-fit max-w-full",
                  })
                )}
              >
                {atelierService.title}
              </Link>
            </div>
          </section>
        )}

        <section className="w-full py-16 md:py-24">
          <div className="grid gap-6 px-6 pb-10 md:grid-cols-[0.8fr_1.2fr] md:items-start md:px-10 lg:px-16">
            <h2 className="text-5xl leading-[0.94] font-medium md:text-7xl">
              {siteSettings.home.collectionRailTitle[locale]}
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:justify-self-end">
              {siteSettings.home.portfolioNote[locale]}
            </p>
          </div>
          <div className="grid lg:grid-cols-2">
            {visibleCourses.map((course) => {
              const courseImage = course.mediaAsset

              return (
                <Link
                  key={course.routeSegment}
                  href={localizePath(locale, coursePath(course.routeSegment))}
                  className="group grid min-w-0 gap-6 pb-10 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none lg:border-r lg:border-border"
                >
                  {courseImage?.src && (
                    <ImageFrame
                      alt={courseImage.alt[locale]}
                      src={courseImage.src}
                      ratio={3 / 2}
                      eager
                      className="rounded-none"
                    />
                  )}
                  <h3 className="px-6 text-4xl leading-none font-medium md:px-10 md:text-5xl lg:px-16">
                    {course.title}
                  </h3>
                  <p className="px-6 text-sm leading-7 text-muted-foreground md:px-10 lg:px-16">
                    {course.summary}
                  </p>
                  <p className="px-6 text-sm leading-7 text-muted-foreground md:px-10 lg:px-16">
                    {course.audience}
                  </p>
                  <ol className="grid grid-cols-2 gap-x-6 gap-y-3 px-6 text-xs tracking-[0.12em] uppercase md:px-10 lg:px-16">
                    {course.lessons.map((lesson, index) => (
                      <li
                        key={lesson}
                        className="grid grid-cols-[auto_1fr] gap-3"
                      >
                        <span className="text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ol>
                  <span className="flex items-center gap-3 px-6 text-xs tracking-[0.14em] uppercase md:px-10 lg:px-16">
                    {course.commercialStatus}
                    <ArrowRightIcon aria-hidden="true" data-icon="inline-end" />
                  </span>
                </Link>
              )
            })}
            <div className="grid min-w-0">
              {visibleCollections.map((collection, index) => {
                const collectionImage = collection.mediaAsset

                return (
                  <Link
                    key={collection.routeSegment}
                    href={localizePath(
                      locale,
                      collectionPath(collection.routeSegment)
                    )}
                    className="group grid min-w-0 grid-cols-[minmax(0,1fr)_7rem] gap-5 px-6 py-8 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:grid-cols-[minmax(0,1fr)_12rem] md:px-10 lg:px-12"
                  >
                    <span className="grid min-w-0 content-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        0{index + 1}
                      </span>
                      <span className="font-heading text-3xl leading-none md:text-4xl">
                        {collection.title}
                      </span>
                      <span className="text-xs leading-5 text-muted-foreground">
                        {collection.priceNote ||
                          homeEditorialCopy.priceNote[locale]}
                      </span>
                    </span>
                    {collectionImage?.src && (
                      <ImageFrame
                        alt={collectionImage.alt[locale]}
                        src={collectionImage.src}
                        ratio={4 / 5}
                        className="rounded-none"
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section className="relative min-h-[44rem] overflow-hidden px-6 py-16 text-background md:px-10 md:py-24 lg:px-16">
          {portfolioImage?.src && (
            <Image
              alt={portfolioImage.alt[locale]}
              src={portfolioImage.src}
              fill
              sizes="100vw"
              className="object-cover"
            />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-foreground/55"
          />
          <div className="relative mx-auto flex min-h-[32rem] max-w-screen-2xl min-w-0 flex-col justify-between gap-16">
            <div className="grid min-w-0 content-start gap-5">
              <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
                Portfolio / 01
              </p>
            </div>
            <div className="grid min-w-0 items-end gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,0.7fr)] lg:gap-20">
              <h2 className="max-w-[11ch] text-5xl leading-[0.94] font-medium text-balance md:text-7xl">
                {homeEditorialCopy.portfolioTitle[locale]}
              </h2>
              <div className="grid min-w-0 gap-8">
                <p className="max-w-2xl text-sm leading-7 text-background/75">
                  {homeEditorialCopy.portfolioSummary[locale]}
                </p>
                <div className="grid gap-6 sm:grid-cols-3">
                  {homeEditorialCopy.portfolioSignals[locale].map(
                    (signal, index) => (
                      <div key={signal} className="grid gap-2">
                        <span className="text-xs text-background/60">
                          0{index + 1}
                        </span>
                        <span className="text-xs font-semibold tracking-[0.12em] uppercase">
                          {signal}
                        </span>
                      </div>
                    )
                  )}
                </div>
                {portfolioCase && (
                  <Link
                    href={localizePath(
                      locale,
                      portfolioCasePath(portfolioCase.routeSegment)
                    )}
                    className={cn(
                      buttonVariants({
                        variant: "secondary",
                        size: "lg",
                        className: "w-fit max-w-full",
                      })
                    )}
                  >
                    {portfolioCase.title}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        <EditorialFaq
          title={homeEditorialCopy.faqTitle[locale]}
          items={homeEditorialCopy.faq[locale].map(
            ([question, answer]) => [question, answer] as const
          )}
        />

        <BookingCTA
          title={bookingPage?.title ?? home.finalCTATitle}
          summary={bookingPage?.summary ?? home.finalCTASummary}
          action={home.primaryCTA.label}
          href={localizePath(locale, "/booking")}
        />
      </main>
      <SiteFooter locale={locale} />
    </div>
  )
}
