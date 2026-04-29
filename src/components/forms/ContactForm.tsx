import { Link, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import * as React from 'react'
import { Section, SectionHead } from '~/components/editorial/Section'
import { analytics } from '~/lib/analytics'
import { publicEnv } from '~/lib/env'
import { buildLocalePath } from '~/lib/i18n'
import { optimizedImageSrc } from '~/lib/media-refs'
import { pageMedia } from '~/lib/media-plan'
import { isDuplicateSubmission } from '~/lib/mock-submission'
import { submitContactLead } from '~/lib/submissions'
import type { ContactsPageData, Locale, StudioSettings, UiCopy } from '~/lib/types'

const directEmailFailure: Record<Locale, string> = {
  uk: 'Не вдалося надіслати запит. Напишіть напряму на voronina@purity-fashion.com.',
  en: 'The request could not be sent. Please write directly to voronina@purity-fashion.com.',
  ru: 'Не удалось отправить запрос. Напишите напрямую на voronina@purity-fashion.com.',
}

function submissionFailureCopy(locale: Locale, fallback: string, reason?: string) {
  return reason === 'missing-contact-webhook' ? directEmailFailure[locale] : fallback
}

export function ContactsLayout({
  page,
  settings,
  locale,
  ui,
}: {
  page: ContactsPageData
  settings: StudioSettings
  locale: Locale
  ui: UiCopy
}) {
  return (
    <Section className="booking-section contact-section">
      <div className="booking-workspace contact-workspace">
        <article className="booking-request-panel contact-request-panel">
          <div className="booking-request-head">
            <p className="eyebrow">{`PURITY / ${ui.nav.contacts}`}</p>
            <h1 className="section-title contact-title">{page.title}</h1>
            <p className="editorial-copy">{page.intro}</p>
          </div>
          <SectionHead
            eyebrow={ui.labels.studioInquiry}
            title={page.inquiryTitle}
            subtitle={page.scheduleNote}
            className="contact-form-head"
          />
          <ContactForm locale={locale} ui={ui} />
        </article>

        <aside className="contact-info-panel">
          <figure className="contact-info-media">
            <img
              src={optimizedImageSrc(pageMedia.contactsAside.src)}
              alt={pageMedia.contactsAside.alt}
              className="editorial-photo-image"
              loading="lazy"
              decoding="async"
            />
          </figure>

          <article className="contact-info-card">
            <p className="eyebrow">{page.corporateTitle}</p>
            <h2 className="section-subtitle">{page.corporateText}</h2>
            <Link to={buildLocalePath(locale, '/book')} className="button-secondary">
              {ui.actions.requestConsultation}
            </Link>
          </article>

          <article className="contact-info-card contact-info-card-compact">
            <p className="eyebrow">{settings.mapLabel}</p>
            <div className="contact-link-list">
              <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
              {settings.corporateEmail ? (
                <a href={`mailto:${settings.corporateEmail}`}>{settings.corporateEmail}</a>
              ) : null}
              {settings.phone ? (
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`}>{settings.phone}</a>
              ) : null}
              <span>{page.addressText}</span>
            </div>
            <div className="contact-social-list">
              {settings.socialLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
              {settings.mapHref ? (
                <a href={settings.mapHref} target="_blank" rel="noreferrer">
                  {settings.mapLabel}
                </a>
              ) : null}
            </div>
          </article>
        </aside>
      </div>
    </Section>
  )
}

export function ContactForm({
  locale,
  ui,
}: {
  locale: Locale
  ui: UiCopy
}) {
  const submitContact = useServerFn(submitContactLead)
  const navigate = useNavigate()
  const formRef = React.useRef<HTMLFormElement | null>(null)
  const lastSuccessfulSubmissionRef = React.useRef<Record<string, string> | null>(null)
  const [isEnhanced, setIsEnhanced] = React.useState(false)
  const [submission, setSubmission] = React.useState<{
    state: 'idle' | 'pending' | 'success' | 'error'
    message?: string
    canRetry?: boolean
  }>({ state: 'idle' })
  const pending = submission.state === 'pending'
  const submitDisabled = pending

  React.useEffect(() => {
    setIsEnhanced(true)
  }, [])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget

    if (pending) {
      analytics.track('contact_duplicate_submit_blocked', { locale })
      return
    }

    const form = new FormData(formElement)
    const payload = {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? ''),
      interest: String(form.get('interest') ?? ''),
      message: String(form.get('message') ?? ''),
    }

    if (
      lastSuccessfulSubmissionRef.current &&
      isDuplicateSubmission(lastSuccessfulSubmissionRef.current, payload)
    ) {
      setSubmission({ state: 'error', message: ui.contact.duplicate })
      analytics.track('contact_duplicate_submit_blocked', { locale })
      return
    }

    setSubmission({ state: 'pending', message: ui.contact.pending })
    analytics.track('contact_submit_started', { locale, interest: payload.interest || 'none' })

    try {
      const result = await submitContact({ data: { locale, ...payload } })

      if (result.status === 'failure') {
        setSubmission({
          state: 'error',
          message: submissionFailureCopy(locale, ui.contact.failure, result.message),
          canRetry: true,
        })
        analytics.track('contact_submit_failed', {
          locale,
          reason: result.message ?? 'adapter-failure',
          reference: result.reference,
        })
        return
      }

      lastSuccessfulSubmissionRef.current = payload
      setSubmission({ state: 'success', message: ui.contact.success })
      formElement.reset()
      analytics.track('contact_submit_succeeded', {
        locale,
        interest: payload.interest || 'none',
        reference: result.reference,
      })
      void navigate({
        to: buildLocalePath(locale, '/contacts'),
        hash: 'contact-form',
      })
    } catch (submissionError) {
      setSubmission({ state: 'error', message: ui.contact.failure, canRetry: true })
      analytics.track('contact_submit_failed', {
        locale,
        reason: submissionError instanceof Error ? submissionError.message : 'unexpected-error',
      })
    }
  }

  return (
    <form
      id="contact-form"
      ref={formRef}
      className="editorial-form"
      method="post"
      data-enhanced={isEnhanced ? 'true' : 'false'}
      onSubmit={onSubmit}
      aria-busy={pending}
    >
      <label className="field">
        <span>{ui.contact.nameLabel}</span>
        <input required name="name" type="text" autoComplete="name" />
      </label>
      <div className="form-grid">
        <label className="field">
          <span>{ui.contact.emailLabel}</span>
          <input required name="email" type="email" autoComplete="email" />
        </label>
        <label className="field">
          <span>{ui.contact.phoneLabel}</span>
          <input required name="phone" type="tel" autoComplete="tel" />
        </label>
      </div>
      <label className="field">
        <span>{ui.contact.interestLabel}</span>
        <input name="interest" type="text" />
      </label>
      <label className="field">
        <span>{ui.contact.messageLabel}</span>
        <textarea required name="message" rows={5} />
      </label>
      {publicEnv.enablePrototypeFlows ? <p className="form-status">{ui.contact.prototypeNotice}</p> : null}
      <button className="button-primary w-fit" type="submit" disabled={submitDisabled}>
        {pending ? ui.actions.sending : ui.actions.sendInquiry}
      </button>

      {submission.canRetry ? (
        <button
          className="button-secondary w-fit"
          type="button"
          onClick={() => {
            analytics.track('contact_retry_requested', { locale })
            formRef.current?.requestSubmit()
          }}
        >
          {ui.actions.retry}
        </button>
      ) : null}

      <div aria-live="polite">
        {submission.message ? <p className="form-status">{submission.message}</p> : null}
      </div>
    </form>
  )
}
