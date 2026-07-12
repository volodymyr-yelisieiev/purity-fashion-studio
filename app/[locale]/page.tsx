import Link from "next/link"
import { notFound } from "next/navigation"

import {
  BookingCTA,
  FeatureList,
  ImageFrame,
  OfferCard,
  ServiceCard,
} from "@/components/purity"
import { SiteFooter, SiteHeader } from "@/components/site-shell"
import { buttonVariants } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
    uk: "Поширені запитання.",
    ru: "Частые вопросы.",
    en: "Frequently asked questions.",
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
  const navigation = getNavigation(locale)
  const visibleServices = services.filter((service) => service.visibleInMvp)
  const visibleCourses = courses.filter((course) => course.visibleInMvp)
  const visibleCollections = collections.filter(
    (collection) => collection.visibleInMvp
  )
  const heroImage = getMediaAsset("generated-fabric-study")
  const atelierService = visibleServices.find(
    (service) => service.category === "atelier"
  )
  const atelierCategory = serviceCategories.find(
    (category) => category.slug === "atelier"
  )
  const atelierImage = getFirstMediaAsset(atelierService?.mediaIds)
  const bookingPage = publicPages.find((page) => page.slug === "booking")
  const portfolioCase = portfolioCases.find((item) => item.visibleInMvp)
  const researchLabel =
    navigation.find((item) => item.id === "research")?.label ??
    siteSettings.home.secondaryCta.label[locale]
  const researchPath =
    navigation.find((item) => item.id === "research")?.path ??
    siteSettings.home.secondaryCta.path
  const studioLabel =
    navigation.find((item) => item.id === "studio")?.label ??
    siteSettings.home.studioEyebrow[locale]
  const heroSignals = [
    {
      value: visibleServices.length.toString(),
      label: homeEditorialCopy.signalLabels.directions[locale],
      detail: homeEditorialCopy.signalDetails.directions[locale],
    },
    {
      value: siteSettings.contacts.phones.length.toString(),
      label: homeEditorialCopy.signalLabels.contacts[locale],
      detail: homeEditorialCopy.signalDetails.contacts[locale],
    },
    {
      value: siteSettings.contacts.hours[locale].replace(
        /^(Щодня|Каждый день|Daily)\s+/,
        ""
      ),
      label: homeEditorialCopy.signalLabels.studio[locale],
      detail: homeEditorialCopy.signalDetails.studio[locale],
    },
  ]
  const studioDetails = homeEditorialCopy.methodDetails[locale]

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader locale={locale} />

      <main>
        <section className="mx-auto grid w-full max-w-6xl min-w-0 gap-8 px-6 py-10 md:grid-cols-[1.05fr_0.95fr] md:items-end md:px-10 md:py-12">
          <div className="grid min-w-0 gap-7">
            <p className="text-xs tracking-normal text-muted-foreground uppercase">
              {siteSettings.home.eyebrow[locale]}
            </p>
            <h1 className="max-w-4xl text-4xl leading-none font-medium text-balance sm:text-5xl md:text-7xl">
              {siteSettings.home.title[locale]}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              {siteSettings.home.summary[locale]}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={localizePath(locale, siteSettings.home.primaryCta.path)}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" })
                )}
              >
                {siteSettings.home.primaryCta.label[locale]}
              </Link>
              <Link
                href={localizePath(locale, siteSettings.home.secondaryCta.path)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" })
                )}
              >
                {siteSettings.home.secondaryCta.label[locale]}
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {heroSignals.map((signal) => (
                <div key={signal.label} className="border-t border-border pt-4">
                  <p className="font-heading text-3xl leading-none text-foreground">
                    {signal.value}
                  </p>
                  <p className="mt-2 text-xs tracking-widest text-muted-foreground uppercase">
                    {signal.label}
                  </p>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    {signal.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid min-w-0 gap-4">
            <ImageFrame
              alt={heroImage?.alt[locale] ?? siteSettings.home.title[locale]}
              src={heroImage?.src}
              label={siteSettings.home.eyebrow[locale]}
              eager
              className="aspect-[4/5]"
            />
            <div className="grid gap-3 border border-border p-4 text-xs leading-5 text-muted-foreground sm:grid-cols-2">
              <p>{siteSettings.contacts.address[locale]}</p>
              <p>{homeEditorialCopy.contactSummary[locale]}</p>
            </div>
          </div>
        </section>

        <section className="bg-muted">
          <div className="mx-auto grid max-w-6xl min-w-0 gap-6 px-6 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-10">
            <div className="min-w-0">
              <p className="mb-4 text-xs text-muted-foreground uppercase">
                Portfolio
              </p>
              <h2 className="text-4xl leading-tight font-medium text-balance md:text-6xl">
                {homeEditorialCopy.portfolioTitle[locale]}
              </h2>
            </div>
            <Card className="relative min-h-72 min-w-0 border-border bg-background">
              <div
                aria-hidden="true"
                className="absolute top-0 right-0 h-full w-2 bg-primary"
              />
              <CardHeader>
                <p className="text-xs tracking-widest text-muted-foreground uppercase">
                  PURITY / 01
                </p>
                <CardDescription className="min-w-0 break-words">
                  {homeEditorialCopy.portfolioSummary[locale]}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto grid gap-3 border-t border-border pt-5 sm:grid-cols-3">
                {homeEditorialCopy.portfolioSignals[locale].map(
                  (signal, index) => (
                    <div key={signal} className="grid gap-1">
                      <span className="text-xs text-muted-foreground">
                        0{index + 1}
                      </span>
                      <span className="text-xs font-semibold tracking-wider uppercase">
                        {signal}
                      </span>
                    </div>
                  )
                )}
              </CardContent>
              {portfolioCase && (
                <CardContent className="mt-auto border-t border-border pt-5">
                  <Link
                    href={localizePath(
                      locale,
                      portfolioCasePath(portfolioCase.routeSegment)
                    )}
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "lg",
                      })
                    )}
                  >
                    {portfolioCase.title[locale]}
                  </Link>
                </CardContent>
              )}
            </Card>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl min-w-0 px-6 py-14 md:px-10">
          <h2 className="mb-8 text-3xl leading-tight font-medium md:text-5xl">
            {homeEditorialCopy.faqTitle[locale]}
          </h2>
          <Accordion>
            {homeEditorialCopy.faq[locale].map(([question, answer]) => (
              <AccordionItem key={question} value={question}>
                <AccordionTrigger>{question}</AccordionTrigger>
                <AccordionContent className="max-w-3xl leading-7 text-muted-foreground">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="mx-auto w-full max-w-6xl min-w-0 px-6 py-14 md:px-10">
          <div className="mb-8 grid gap-4 border-t border-border pt-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="mb-3 text-xs tracking-normal text-muted-foreground uppercase">
                {siteSettings.home.serviceRailTitle[locale]}
              </p>
              <h2 className="text-3xl leading-tight font-medium md:text-5xl">
                {siteSettings.home.serviceRailTitle[locale]}
              </h2>
            </div>
            <div className="grid gap-3 md:justify-items-end">
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-right">
                {homeEditorialCopy.serviceIntro[locale]}
              </p>
              <Link
                href={localizePath(locale, researchPath)}
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "sm",
                  })
                )}
              >
                {researchLabel}
              </Link>
            </div>
          </div>
          <div className="grid min-w-0 auto-rows-fr gap-4 md:grid-cols-3">
            {visibleServices.map((service) => {
              const serviceImage = getFirstMediaAsset(service.mediaIds)

              return (
                <Link
                  key={service.slug}
                  href={localizePath(locale, servicePath(service.routeSegment))}
                  className="block h-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <ServiceCard
                    title={service.title[locale]}
                    summary={service.summary[locale]}
                    meta={
                      serviceCategories.find(
                        (category) => category.slug === service.category
                      )?.title[locale]
                    }
                    status={service.commercialStatus[locale]}
                    priceNote={homeEditorialCopy.priceNote[locale]}
                    image={
                      serviceImage?.src
                        ? {
                            src: serviceImage.src,
                            alt: serviceImage.alt[locale],
                          }
                        : undefined
                    }
                  />
                </Link>
              )
            })}
          </div>
        </section>

        <section className="bg-muted">
          <div className="mx-auto grid max-w-6xl min-w-0 gap-10 px-6 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-start md:px-10">
            <div>
              <p className="mb-4 text-xs text-muted-foreground uppercase">
                {homeEditorialCopy.methodEyebrow[locale]}
              </p>
              <h2 className="text-4xl leading-tight font-medium text-balance md:text-6xl">
                {homeEditorialCopy.methodTitle[locale]}
              </h2>
            </div>
            <div className="grid gap-4">
              <p className="text-sm leading-7 text-muted-foreground">
                {siteSettings.home.studioSummary[locale]}
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {studioDetails.map((detail) => (
                  <Card
                    key={detail}
                    data-size="sm"
                    className="border-border bg-background"
                  >
                    <CardContent className="text-sm leading-7 text-muted-foreground">
                      {detail}
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Link
                href={localizePath(locale, "/studio")}
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "w-fit max-w-full",
                  })
                )}
              >
                {studioLabel}
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl min-w-0 gap-4 px-6 py-14 md:grid-cols-3 md:px-10">
          <Card className="min-w-0 border-border bg-background md:col-span-2">
            <CardHeader>
              <CardTitle className="min-w-0 break-words">
                {homeEditorialCopy.contactTitle[locale]}
              </CardTitle>
              <CardDescription className="min-w-0 break-words">
                {homeEditorialCopy.contactSummary[locale]}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 border-t border-border pt-5 text-sm leading-7 text-muted-foreground md:grid-cols-3">
              {siteSettings.contacts.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="inline-flex min-h-11 items-center break-words hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {phone}
                </a>
              ))}
              {siteSettings.contacts.email && (
                <a
                  href={`mailto:${siteSettings.contacts.email}`}
                  className="inline-flex min-h-11 items-center [overflow-wrap:anywhere] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {siteSettings.contacts.email}
                </a>
              )}
            </CardContent>
          </Card>
          <Card className="min-w-0 border-primary-foreground/20 bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="min-w-0 break-words">
                {siteSettings.contacts.city[locale]}
              </CardTitle>
              <CardDescription className="text-secondary">
                {siteSettings.contacts.hours[locale]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={localizePath(locale, "/booking")}
                className={cn(
                  buttonVariants({
                    variant: "default",
                    size: "lg",
                    className:
                      "bg-background text-foreground hover:bg-secondary",
                  })
                )}
              >
                {siteSettings.home.primaryCta.label[locale]}
              </Link>
            </CardContent>
          </Card>
        </section>

        {atelierService && (
          <section className="bg-muted">
            <div className="mx-auto grid max-w-6xl min-w-0 gap-10 px-6 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-center md:px-10">
              {atelierImage?.src && (
                <ImageFrame
                  alt={atelierImage.alt[locale]}
                  src={atelierImage.src}
                  label={
                    atelierCategory?.title[locale] ??
                    atelierService.title[locale]
                  }
                  eager
                  className="aspect-[4/5]"
                />
              )}
              <div className="min-w-0">
                <p className="mb-4 text-xs text-muted-foreground uppercase">
                  {atelierCategory?.title[locale] ??
                    atelierService.title[locale]}
                </p>
                <h2 className="text-4xl leading-tight font-medium text-balance md:text-6xl">
                  {atelierService.title[locale]}
                </h2>
                <p className="mt-6 text-sm leading-7 text-muted-foreground">
                  {atelierService.summary[locale]}
                </p>
                <div className="mt-6">
                  <FeatureList items={atelierService.outcomes[locale]} />
                </div>
                <Link
                  href={localizePath(
                    locale,
                    servicePath(atelierService.routeSegment)
                  )}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "lg",
                      className: "mt-8",
                    })
                  )}
                >
                  {atelierService.title[locale]}
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="mx-auto w-full max-w-6xl min-w-0 px-6 py-14 md:px-10">
          <div className="mb-8 grid gap-4 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <h2 className="text-3xl leading-tight font-medium md:text-5xl">
              {siteSettings.home.collectionRailTitle[locale]}
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              {siteSettings.home.portfolioNote[locale]}
            </p>
          </div>
          <div className="grid auto-rows-fr gap-4 md:grid-cols-2">
            {visibleCourses.map((course) => {
              const courseImage = getFirstMediaAsset(course.mediaIds)

              return (
                <Link
                  key={course.slug}
                  href={localizePath(locale, coursePath(course.routeSegment))}
                  className="block h-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <OfferCard
                    title={course.title[locale]}
                    summary={course.summary[locale]}
                    status={course.commercialStatus[locale]}
                    priceNote={homeEditorialCopy.priceNote[locale]}
                    image={
                      courseImage?.src
                        ? { src: courseImage.src, alt: courseImage.alt[locale] }
                        : undefined
                    }
                  >
                    <FeatureList items={course.lessons[locale]} />
                  </OfferCard>
                </Link>
              )
            })}
            {visibleCollections.map((collection) => {
              const collectionImage = getFirstMediaAsset(collection.mediaIds)

              return (
                <Link
                  key={collection.slug}
                  href={localizePath(
                    locale,
                    collectionPath(collection.routeSegment)
                  )}
                  className="block h-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <OfferCard
                    title={collection.title[locale]}
                    summary={collection.summary[locale]}
                    status={collection.commercialStatus[locale]}
                    priceNote={homeEditorialCopy.priceNote[locale]}
                    image={
                      collectionImage?.src
                        ? {
                            src: collectionImage.src,
                            alt: collectionImage.alt[locale],
                          }
                        : undefined
                    }
                  >
                    <FeatureList items={collection.materials[locale]} />
                  </OfferCard>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl min-w-0 px-6 py-14 md:px-10">
          <BookingCTA
            title={
              bookingPage?.title[locale] ??
              siteSettings.home.primaryCta.label[locale]
            }
            summary={
              bookingPage?.summary[locale] ?? siteSettings.home.summary[locale]
            }
            action={siteSettings.home.primaryCta.label[locale]}
            href={localizePath(locale, "/booking")}
          />
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  )
}
