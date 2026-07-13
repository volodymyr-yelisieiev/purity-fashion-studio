import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ImageFrame } from "@/components/purity"
import { SiteFooter, SiteHeader } from "@/components/site-shell"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { getEntryMetadata } from "@/content/metadata"
import { getCategory, getMediaAsset } from "@/content/queries"
import { hasLocale, localizePath, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

type PortfolioPageProps = {
  params: Promise<{ locale: string }>
}

const portfolioCopy = {
  eyebrow: {
    uk: "Evidence standard",
    ru: "Evidence standard",
    en: "Evidence standard",
  },
  title: { uk: "Портфоліо", ru: "Портфолио", en: "Portfolio" },
  heroImageLabel: {
    uk: "Редакційний превʼю — не клієнтський кейс",
    ru: "Редакционное превью — не клиентский кейс",
    en: "Editorial preview — not a client case",
  },
  summary: {
    uk: "PURITY публікує роботу як перевірені case records: із зафіксованим запитом, процесом, рішеннями, результатом і матеріалами, погодженими клієнтом.",
    ru: "PURITY публикует работу как проверенные case records: с зафиксированным запросом, процессом, решениями, результатом и материалами, согласованными клиентом.",
    en: "PURITY publishes work as verified case records, with a documented brief, process, decisions, outcome, and client-approved materials.",
  },
  standardsTitle: {
    uk: "Що робить кейс доказовим",
    ru: "Что делает кейс доказательным",
    en: "What makes a case credible",
  },
  standards: [
    {
      title: { uk: "Джерело", ru: "Источник", en: "Source" },
      text: {
        uk: "Фото, відео й факти походять із реальної роботи та мають зрозуміле походження.",
        ru: "Фото, видео и факты происходят из реальной работы и имеют понятное происхождение.",
        en: "Images, video, and facts come from real work with clear provenance.",
      },
    },
    {
      title: { uk: "Контекст", ru: "Контекст", en: "Context" },
      text: {
        uk: "Кейс пояснює початковий запит, обмеження, обраний метод і роль команди PURITY.",
        ru: "Кейс объясняет исходный запрос, ограничения, выбранный метод и роль команды PURITY.",
        en: "The case explains the original brief, constraints, chosen method, and PURITY's role.",
      },
    },
    {
      title: { uk: "Погодження", ru: "Согласование", en: "Approval" },
      text: {
        uk: "Клієнтські матеріали й твердження публікуються лише після погодження.",
        ru: "Клиентские материалы и утверждения публикуются только после согласования.",
        en: "Client materials and claims are published only after approval.",
      },
    },
  ],
  recordTitle: {
    uk: "Структура case record",
    ru: "Структура case record",
    en: "Case record structure",
  },
  recordSummary: {
    uk: "Кожен запис дає достатньо контексту, щоб оцінити не лише фінальний образ, а й якість рішення.",
    ru: "Каждая запись даёт достаточно контекста, чтобы оценить не только финальный образ, но и качество решения.",
    en: "Each record provides enough context to evaluate not only the final look, but the quality of the decision.",
  },
  recordItems: {
    uk: [
      "Запит і критерії",
      "Метод і етапи",
      "Рішення та примірки",
      "Погоджений результат",
    ],
    ru: [
      "Запрос и критерии",
      "Метод и этапы",
      "Решения и примерки",
      "Согласованный результат",
    ],
    en: [
      "Brief and criteria",
      "Method and stages",
      "Decisions and fittings",
      "Approved outcome",
    ],
  },
  currentTitle: {
    uk: "Як оцінити PURITY зараз",
    ru: "Как оценить PURITY сейчас",
    en: "How to evaluate PURITY now",
  },
  current: [
    {
      title: { uk: "Методологія", ru: "Методология", en: "Method" },
      text: {
        uk: "Studio page пояснює команду, простір і шлях від дослідження форми до практичного рішення.",
        ru: "Studio page объясняет команду, пространство и путь от исследования формы к практическому решению.",
        en: "The Studio page explains the team, space, and route from form research to a practical decision.",
      },
    },
    {
      title: {
        uk: "Прозорі формати",
        ru: "Прозрачные форматы",
        en: "Clear formats",
      },
      text: {
        uk: "Сервісні сторінки фіксують етапи, результат, комерційний статус і спосіб почати запит.",
        ru: "Сервисные страницы фиксируют этапы, результат, коммерческий статус и способ начать запрос.",
        en: "Service pages document stages, outcomes, commercial status, and how to start an inquiry.",
      },
    },
    {
      title: { uk: "Особистий бриф", ru: "Личный бриф", en: "Personal brief" },
      text: {
        uk: "Коротка консультація дозволяє перевірити підхід на вашій задачі до погодження проєкту.",
        ru: "Короткая консультация позволяет проверить подход на вашей задаче до согласования проекта.",
        en: "A short consultation lets you evaluate the approach against your brief before agreeing a project.",
      },
    },
  ],
  flowTitle: {
    uk: "Як кейс стає публічним",
    ru: "Как кейс становится публичным",
    en: "How a case is published",
  },
  flow: {
    uk: [
      "Документування",
      "Перевірка фактів",
      "Погодження клієнта",
      "Публікація",
    ],
    ru: [
      "Документирование",
      "Проверка фактов",
      "Согласование клиента",
      "Публикация",
    ],
    en: ["Documentation", "Fact check", "Client approval", "Publication"],
  },
  ctaTitle: {
    uk: "Обговоріть вашу задачу з PURITY.",
    ru: "Обсудите вашу задачу с PURITY.",
    en: "Discuss your brief with PURITY.",
  },
  ctaSummary: {
    uk: "Опишіть напрям, строки й бажаний результат. Команда запропонує відповідний сервіс і наступний крок.",
    ru: "Опишите направление, сроки и желаемый результат. Команда предложит подходящий сервис и следующий шаг.",
    en: "Describe the direction, timing, and intended result. The team will suggest the right service and next step.",
  },
  contactLabel: { uk: "Зв’язатися", ru: "Связаться", en: "Contact PURITY" },
  bookingLabel: { uk: "Почати бриф", ru: "Начать бриф", en: "Start a brief" },
  emptyEyebrow: {
    uk: "Кейси на погодженні",
    ru: "Кейсы на согласовании",
    en: "Cases under approval",
  },
  emptyTitle: {
    uk: "Підтверджені клієнтські кейси зʼявляться після погодження матеріалів.",
    ru: "Подтверждённые клиентские кейсы появятся после согласования материалов.",
    en: "Approved client case records will appear after their materials are cleared.",
  },
  emptySummary: {
    uk: "Поки що сторінка показує методологію й стандарт доказовості. Редакційні зображення не видаються за результат клієнтської роботи.",
    ru: "Пока страница показывает методологию и стандарт доказательности. Редакционные изображения не выдаются за результат клиентской работы.",
    en: "For now, this page shows the methodology and evidence standard. Editorial images are never presented as client outcomes.",
  },
  emptyAction: {
    uk: "Обговорити задачу",
    ru: "Обсудить задачу",
    en: "Discuss a brief",
  },
}

export async function generateMetadata({
  params,
}: PortfolioPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params

  if (!hasLocale(rawLocale)) {
    return {}
  }

  const category = getCategory("portfolio")

  if (!category) {
    return {}
  }

  return getEntryMetadata(category, rawLocale, "/portfolio")
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale: rawLocale } = await params

  if (!hasLocale(rawLocale)) {
    notFound()
  }

  const locale: Locale = rawLocale
  const category = getCategory("portfolio")

  if (!category) {
    notFound()
  }

  const mediaAsset = getMediaAsset("generated-studio-atmosphere")

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader locale={locale} currentPath="/portfolio" />

      <main>
        <section className="mx-auto grid w-full max-w-6xl min-w-0 gap-8 px-6 py-10 md:grid-cols-[1fr_0.95fr] md:items-end md:px-10 md:py-12">
          <div className="grid min-w-0 gap-6">
            <p className="text-xs tracking-normal text-muted-foreground uppercase">
              {portfolioCopy.eyebrow[locale]}
            </p>
            <h1 className="text-4xl leading-none font-medium text-balance sm:text-5xl md:text-7xl">
              {portfolioCopy.title[locale]}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              {portfolioCopy.summary[locale]}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={localizePath(locale, "/contacts")}
                className={cn(buttonVariants({ size: "lg" }))}
              >
                {portfolioCopy.contactLabel[locale]}
              </Link>
              <Link
                href={localizePath(locale, "/booking")}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" })
                )}
              >
                {portfolioCopy.bookingLabel[locale]}
              </Link>
            </div>
          </div>
          {mediaAsset?.src && (
            <ImageFrame
              src={mediaAsset.src}
              alt={mediaAsset.alt[locale]}
              label={portfolioCopy.heroImageLabel[locale]}
              eager
            />
          )}
        </section>

        <section className="bg-muted">
          <div className="mx-auto max-w-6xl min-w-0 px-6 py-14 md:px-10">
            <Empty data-testid="portfolio-empty-state">
              <EmptyHeader>
                <Badge variant="outline">
                  {portfolioCopy.emptyEyebrow[locale]}
                </Badge>
                <EmptyTitle>{portfolioCopy.emptyTitle[locale]}</EmptyTitle>
                <EmptyDescription>
                  {portfolioCopy.emptySummary[locale]}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Link
                  href={localizePath(locale, "/contacts")}
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" })
                  )}
                >
                  {portfolioCopy.emptyAction[locale]}
                </Link>
              </EmptyContent>
            </Empty>
          </div>
        </section>

        <section className="bg-muted">
          <div className="mx-auto max-w-6xl min-w-0 px-6 py-16 md:px-10">
            <h2 className="mb-8 text-3xl leading-tight font-medium md:text-5xl">
              {portfolioCopy.standardsTitle[locale]}
            </h2>
            <div className="grid auto-rows-fr gap-3 md:grid-cols-3">
              {portfolioCopy.standards.map((item) => (
                <Card
                  key={item.title[locale]}
                  className="h-full border-border bg-background"
                >
                  <CardHeader>
                    <CardTitle className="min-w-0 break-words">
                      {item.title[locale]}
                    </CardTitle>
                    <CardDescription className="min-w-0 break-words">
                      {item.text[locale]}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl min-w-0 gap-8 px-6 py-14 md:grid-cols-[0.8fr_1.2fr] md:px-10">
          <div className="min-w-0">
            <h2 className="text-3xl leading-tight font-medium md:text-5xl">
              {portfolioCopy.recordTitle[locale]}
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              {portfolioCopy.recordSummary[locale]}
            </p>
          </div>
          <div className="grid auto-rows-fr gap-3 sm:grid-cols-2">
            {portfolioCopy.recordItems[locale].map((item, index) => (
              <Card
                key={item}
                className="h-full min-w-0 border-border bg-background"
              >
                <CardHeader>
                  <p className="mb-3 text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <CardTitle className="min-w-0 break-words">{item}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-muted">
          <div className="mx-auto max-w-6xl min-w-0 px-6 py-16 md:px-10">
            <h2 className="mb-8 text-3xl leading-tight font-medium md:text-5xl">
              {portfolioCopy.currentTitle[locale]}
            </h2>
            <div className="grid auto-rows-fr gap-3 md:grid-cols-3">
              {portfolioCopy.current.map((item) => (
                <Card
                  key={item.title[locale]}
                  className="h-full border-border bg-background"
                >
                  <CardHeader>
                    <CardTitle className="min-w-0 break-words">
                      {item.title[locale]}
                    </CardTitle>
                    <CardDescription className="min-w-0 break-words">
                      {item.text[locale]}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl min-w-0 px-6 py-14 md:px-10">
          <h2 className="mb-8 text-3xl leading-tight font-medium md:text-5xl">
            {portfolioCopy.flowTitle[locale]}
          </h2>
          <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {portfolioCopy.flow[locale].map((item, index) => (
              <Card
                key={item}
                className="h-full min-w-0 border-border bg-background"
              >
                <CardHeader>
                  <p className="mb-3 text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <CardTitle className="min-w-0 break-words">{item}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto grid max-w-6xl min-w-0 gap-6 px-6 py-14 md:grid-cols-[1fr_auto] md:items-end md:px-10">
            <div>
              <h2 className="text-3xl leading-tight font-medium md:text-5xl">
                {portfolioCopy.ctaTitle[locale]}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-secondary">
                {portfolioCopy.ctaSummary[locale]}
              </p>
            </div>
            <Link
              href={localizePath(locale, "/contacts")}
              className={cn(
                buttonVariants({
                  variant: "secondary",
                  size: "lg",
                })
              )}
            >
              {portfolioCopy.contactLabel[locale]}
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} currentPath="/portfolio" />
    </div>
  )
}
