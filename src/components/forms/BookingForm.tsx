import { useServerFn } from '@tanstack/react-start'
import * as React from 'react'
import { Section } from '~/components/editorial/Section'
import { analytics } from '~/lib/analytics'
import { optimizedImageSrc } from '~/lib/media-refs'
import { isDuplicateSubmission } from '~/lib/mock-submission'
import { submitBookingLead } from '~/lib/submissions'
import type { Locale, Price, UiCopy } from '~/lib/types'
import { cn } from '~/lib/utils'

type BookingIntentKind = 'service' | 'course' | 'collection' | 'portfolio' | 'transformation'

const directEmailFailure: Record<Locale, string> = {
  uk: 'Не вдалося надіслати запит. Напишіть напряму на voronina@purity-fashion.com.',
  en: 'The request could not be sent. Please write directly to voronina@purity-fashion.com.',
  ru: 'Не удалось отправить запрос. Напишите напрямую на voronina@purity-fashion.com.',
}

function submissionFailureCopy(locale: Locale, fallback: string, reason?: string) {
  return reason === 'missing-contact-webhook' ? directEmailFailure[locale] : fallback
}

function BookingMetaItem({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="booking-meta-item">
      <p className="eyebrow">{label}</p>
      <p className="booking-meta-value">{value}</p>
      {detail ? <p className="price-secondary">{detail}</p> : null}
    </div>
  )
}

export function BookingLayout({
  locale,
  ui,
  title,
  summary,
  price,
  priceNote,
  media,
  meta,
  formats,
  intentKind,
  intentSlug,
}: {
  locale: Locale
  ui: UiCopy
  title: string
  summary: string
  price?: Price
  priceNote?: string
  media: { src: string; alt: string; caption?: string }
  meta: string[]
  formats: Array<{ id: string; label: string; detail: string }>
  intentKind: BookingIntentKind
  intentSlug: string
}) {
  const submitBooking = useServerFn(submitBookingLead)
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
  const minBookingDate = React.useMemo(() => new Date().toISOString().slice(0, 10), [])

  React.useEffect(() => {
    setIsEnhanced(true)
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget

    if (pending) {
      analytics.track('booking_duplicate_submit_blocked', {
        locale,
        kind: intentKind,
        slug: intentSlug,
      })
      return
    }

    const form = new FormData(formElement)
    const payload = {
      kind: intentKind,
      slug: intentSlug,
      format: String(form.get('format') ?? ''),
      preferredDate: String(form.get('date') ?? ''),
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? ''),
      notes: String(form.get('notes') ?? ''),
    }

    if (
      lastSuccessfulSubmissionRef.current &&
      isDuplicateSubmission(lastSuccessfulSubmissionRef.current, payload)
    ) {
      setSubmission({ state: 'error', message: ui.booking.duplicate })
      analytics.track('booking_duplicate_submit_blocked', {
        locale,
        kind: intentKind,
        slug: intentSlug,
      })
      return
    }

    setSubmission({ state: 'pending', message: ui.booking.pending })
    analytics.track('booking_submit_started', {
      locale,
      kind: intentKind,
      slug: intentSlug,
      format: payload.format || 'none',
    })

    try {
      const result = await submitBooking({ data: {
        kind: payload.kind,
        slug: payload.slug,
        locale,
        format: payload.format,
        preferredDate: payload.preferredDate,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        notes: payload.notes,
      } })

      if (result.status === 'failure') {
        setSubmission({
          state: 'error',
          message: submissionFailureCopy(locale, ui.booking.failure, result.message),
          canRetry: true,
        })
        analytics.track('booking_submit_failed', {
          locale,
          kind: intentKind,
          slug: intentSlug,
          reason: result.message ?? 'adapter-failure',
          reference: result.reference,
        })
        return
      }

      lastSuccessfulSubmissionRef.current = payload
      setSubmission({ state: 'success', message: ui.booking.success })
      analytics.track('booking_submit_succeeded', {
        locale,
        kind: intentKind,
        slug: intentSlug,
        reference: result.reference,
      })
    } catch (submissionError) {
      setSubmission({ state: 'error', message: ui.booking.failure, canRetry: true })
      analytics.track('booking_submit_failed', {
        locale,
        kind: intentKind,
        slug: intentSlug,
        reason: submissionError instanceof Error ? submissionError.message : 'unexpected-error',
      })
    }
  }

  return (
    <Section className="booking-section">
      <div className="booking-workspace">
        <aside className="booking-offer-panel">
          <figure className="booking-offer-media">
            <img
              src={optimizedImageSrc(media.src)}
              alt={media.alt}
              className="detail-hero-image"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </figure>

          <div className="booking-offer-copy">
            <div className="booking-kicker-row">
              <p className="eyebrow">{ui.labels.selectedOffer}</p>
              <span className="micro-tag">{ui.booking.leadRequestTag}</span>
            </div>

            <h1 className="section-title booking-title">{title}</h1>
            <p className="editorial-copy booking-summary">{summary}</p>

            {meta.length ? (
              <div className="micro-tag-row">
                {meta.slice(0, 4).map((item) => (
                  <span key={item} className="micro-tag">
                    {item}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="booking-meta-strip">
              {price ? (
                <>
                  <BookingMetaItem label="EUR" value={price.eur} />
                  <BookingMetaItem label="UAH" value={price.uah} />
                </>
              ) : (
                <BookingMetaItem
                  label={ui.booking.nextStepTitle}
                  value={priceNote ?? ui.booking.nextStepHint}
                />
              )}
            </div>

            <div className="booking-format-list">
              {formats.map((format, index) => (
                <div key={format.id} className="booking-format-row">
                  <span className="list-index">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="detail-line-title">{format.label}</p>
                    <p className="editorial-copy">{format.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <article className="booking-request-panel">
          <div className="booking-request-head">
            <p className="eyebrow">{`PURITY / ${ui.labels.requestStructure}`}</p>
            <h2 className="section-subtitle">{ui.booking.title}</h2>
            <p className="editorial-copy">{ui.booking.intro}</p>
          </div>

          <form
            ref={formRef}
            className="booking-form"
            method="post"
            data-enhanced={isEnhanced ? 'true' : 'false'}
            onSubmit={handleSubmit}
            aria-busy={pending}
          >
            <div className="booking-form-group">
              <p className="eyebrow">{ui.labels.sessionSetup}</p>
              <div className="form-grid form-grid-setup">
                <label className="field">
                  <span>{ui.actions.chooseFormat}</span>
                  <select required name="format" defaultValue="">
                    <option value="" disabled>
                      {ui.actions.chooseFormat}
                    </option>
                    {formats.map((format) => (
                      <option key={format.id} value={format.id}>
                        {format.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>{ui.booking.dateLabel}</span>
                  <input
                    required
                    type="date"
                    name="date"
                    min={minBookingDate}
                    autoComplete="off"
                  />
                </label>
              </div>
            </div>

            <div className="booking-form-group">
              <p className="eyebrow">{ui.labels.clientContact}</p>
              <div className="form-grid">
                <label className="field">
                  <span>{ui.booking.nameLabel}</span>
                  <input required type="text" name="name" autoComplete="name" />
                </label>
                <label className="field">
                  <span>{ui.booking.phoneLabel}</span>
                  <input required type="tel" name="phone" autoComplete="tel" />
                </label>
              </div>

              <label className="field">
                <span>{ui.booking.emailLabel}</span>
                <input required type="email" name="email" autoComplete="email" />
              </label>
            </div>

            <div className="booking-form-group">
              <label className="field">
                <span>{ui.booking.notesLabel}</span>
                <textarea rows={4} name="notes" />
              </label>
              <p className="field-help">{ui.booking.nextStepHint}</p>
            </div>

            <div className="booking-submit-row">
              <button className="button-primary" type="submit" disabled={submitDisabled}>
                {pending ? ui.actions.processing : ui.actions.submit}
              </button>

              {submission.canRetry ? (
                <button
                  className="button-secondary"
                  type="button"
                  onClick={() => {
                    analytics.track('booking_retry_requested', {
                      locale,
                      kind: intentKind,
                      slug: intentSlug,
                    })
                    formRef.current?.requestSubmit()
                  }}
                >
                  {ui.actions.retry}
                </button>
              ) : null}
            </div>

            <div className={cn('booking-status-region', submission.state !== 'idle' && `booking-status-${submission.state}`)} aria-live="polite">
              {submission.message ? <p className="form-status">{submission.message}</p> : null}
            </div>
          </form>
        </article>
      </div>
    </Section>
  )
}
