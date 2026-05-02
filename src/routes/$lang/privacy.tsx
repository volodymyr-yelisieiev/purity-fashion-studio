import { Link, createFileRoute } from '@tanstack/react-router'
import { Section } from '~/components/editorial/Section'
import { buildLocalePath } from '~/lib/i18n'
import { pageMedia } from '~/lib/media-plan'
import { contentQueries } from '~/lib/query'
import { buildSeoHead } from '~/lib/seo'
import type { Locale } from '~/lib/types'

const privacyCopy: Record<Locale, {
  eyebrow: string
  title: string
  intro: string
  sections: Array<{ title: string; body: string }>
}> = {
  uk: {
    eyebrow: 'PURITY / Політика приватності',
    title: 'Політика приватності',
    intro:
      'Ця сторінка пояснює, як PURITY Fashion Studio обробляє контактні дані, які ви залишаєте у формах запиту.',
    sections: [
      {
        title: 'Які дані ми отримуємо',
        body: "Ім'я, email, телефон, обраний напрям, бажану дату та коментар, які ви добровільно надсилаєте через форми контакту або booking.",
      },
      {
        title: 'Для чого це потрібно',
        body: 'Дані використовуються тільки для відповіді студії, уточнення брифу, підбору формату та узгодження наступного кроку.',
      },
      {
        title: 'Передача і платежі',
        body: 'Запити можуть передаватися у захищений робочий webhook або email студії. Сайт не збирає платіжні картки й не виконує Stripe або LiqPay оплату у V1.',
      },
      {
        title: 'Ваш запит',
        body: 'Щоб уточнити, оновити або видалити контактні дані, напишіть на voronina@purity-fashion.com.',
      },
    ],
  },
  en: {
    eyebrow: 'PURITY / Privacy notice',
    title: 'Privacy notice',
    intro:
      'This page explains how PURITY Fashion Studio handles contact details submitted through request forms.',
    sections: [
      {
        title: 'Data we receive',
        body: 'Name, email, phone, area of interest, preferred date, and notes that you voluntarily submit through contact or booking forms.',
      },
      {
        title: 'Why we use it',
        body: 'The data is used only to answer from the studio, clarify the brief, choose the right format, and coordinate the next step.',
      },
      {
        title: 'Transfer and payments',
        body: 'Requests may be delivered to a secure studio webhook or email. The site does not collect payment-card data and does not run Stripe or LiqPay payments in V1.',
      },
      {
        title: 'Your request',
        body: 'To clarify, update, or delete contact details, write to voronina@purity-fashion.com.',
      },
    ],
  },
  ru: {
    eyebrow: 'PURITY / Политика приватности',
    title: 'Политика приватности',
    intro:
      'Эта страница объясняет, как PURITY Fashion Studio обрабатывает контактные данные, которые вы оставляете в формах запроса.',
    sections: [
      {
        title: 'Какие данные мы получаем',
        body: 'Имя, email, телефон, интересующее направление, желаемую дату и комментарий, которые вы добровольно отправляете через формы контакта или booking.',
      },
      {
        title: 'Зачем это нужно',
        body: 'Данные используются только для ответа студии, уточнения брифа, выбора формата и согласования следующего шага.',
      },
      {
        title: 'Передача и оплаты',
        body: 'Запросы могут передаваться в защищённый рабочий webhook или email студии. Сайт не собирает данные платёжных карт и не проводит Stripe или LiqPay оплаты в V1.',
      },
      {
        title: 'Ваш запрос',
        body: 'Чтобы уточнить, обновить или удалить контактные данные, напишите на voronina@purity-fashion.com.',
      },
    ],
  },
}

export const Route = createFileRoute('/$lang/privacy')({
  loader: async ({ context, params }) => {
    const locale = params.lang as Locale
    const ui = await context.queryClient.ensureQueryData(contentQueries.ui(locale))

    return { locale, ui, copy: privacyCopy[locale] }
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildSeoHead({
          locale: loaderData.locale,
          pathname: buildLocalePath(loaderData.locale, '/privacy'),
          metadata: {
            title: `PURITY | ${loaderData.copy.title}`,
            description: loaderData.copy.intro,
            keywords: ['PURITY privacy', 'fashion studio contact data', 'privacy notice'],
            image: pageMedia.contactsAside,
          },
        })
      : {},
  component: PrivacyPage,
})

function PrivacyPage() {
  const { locale, ui, copy } = Route.useLoaderData()

  return (
    <Section className="legal-page">
      <div className="legal-page-head">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 className="section-title">{copy.title}</h1>
        <p className="editorial-copy editorial-lead-measure">{copy.intro}</p>
      </div>

      <div className="legal-page-grid">
        {copy.sections.map((section) => (
          <article key={section.title} className="legal-page-item">
            <h2 className="section-subtitle">{section.title}</h2>
            <p className="editorial-copy">{section.body}</p>
          </article>
        ))}
      </div>

      <Link to={buildLocalePath(locale, '/contacts')} className="button-primary">
        {ui.actions.sendInquiry}
      </Link>
    </Section>
  )
}
