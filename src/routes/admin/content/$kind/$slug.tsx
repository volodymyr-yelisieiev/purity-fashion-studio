import { createFileRoute, notFound } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useQueryClient } from '@tanstack/react-query'
import * as React from 'react'
import { adminDefaultLocale, isAdminEntityKind, requireAdminEntityKind } from '~/lib/admin'
import {
  adminDraftFieldSpecs,
  adminDraftFieldsFromRaw,
  isEditableOfferKind,
} from '~/lib/admin-edit-fields'
import { submitManagedContentMutation } from '~/lib/admin-content'
import { contentQueries } from '~/lib/query'
import type {
  Locale,
  ManagedContentMutationAction,
  ManagedContentMutationResult,
  ManagedOfferDraftFields,
  PublishState,
} from '~/lib/types'

export const Route = createFileRoute('/admin/content/$kind/$slug')({
  loader: async ({ context, params }) => {
    if (!isAdminEntityKind(params.kind)) {
      throw notFound()
    }

    const locale = adminDefaultLocale
    const kind = requireAdminEntityKind(params.kind)
    const record = await context.queryClient.ensureQueryData(
      contentQueries.managedContentRecord(locale, kind, params.slug),
    )

    if (!record) {
      throw notFound()
    }

    return { record }
  },
  component: ContentRecordPage,
})

function ContentRecordPage() {
  const { record } = Route.useLoaderData()
  const queryClient = useQueryClient()
  const submitMutation = useServerFn(submitManagedContentMutation)
  const [isEnhanced, setIsEnhanced] = React.useState(false)
  const [mutation, setMutation] = React.useState<ManagedContentMutationResult | null>(null)
  const [pending, setPending] = React.useState(false)
  const [locale, setLocale] = React.useState<Locale>(adminDefaultLocale)
  const draftFields = adminDraftFieldsFromRaw(record.raw)
  const activeLocalization =
    record.localizations.find((entry) => entry.locale === locale) ?? record.localizations[0]
  const fieldSpecs = adminDraftFieldSpecs[record.kind] ?? []

  React.useEffect(() => {
    setIsEnhanced(true)
  }, [])

  async function onMutationSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const action = String(form.get('action') ?? 'update') as ManagedContentMutationAction
    const summary = String(form.get('summary') ?? '').trim()
    const fields = Object.fromEntries(
      fieldSpecs
        .map((field) => [field.name, String(form.get(field.name) ?? '').trim()])
        .filter(([, value]) => value),
    ) as ManagedOfferDraftFields

    setPending(true)
    try {
      const result = (await submitMutation({
        data: {
          action,
          kind: record.kind,
          slug: record.slug,
          locale,
          title: String(form.get('title') ?? '').trim(),
          summary: action === 'update' ? summary : undefined,
          reason: action === 'archive' ? summary : undefined,
          state: String(form.get('state') ?? record.meta.lifecycle.state) as PublishState,
          fields,
        },
      })) as ManagedContentMutationResult
      await queryClient.invalidateQueries({ queryKey: ['admin'] })
      setMutation(result)
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="section-space">
      <div className="section-head">
        <p className="eyebrow">
          {record.kind} / {record.meta.lifecycle.state}
        </p>
        <h2 className="section-title">{record.slug}</h2>
        <p className="editorial-copy editorial-copy-measure">
          Revision v{record.meta.currentRevision.version} by {record.meta.lastEditedBy.name}. Preview key:{' '}
          <code>{record.meta.previewKey}</code>
        </p>
      </div>

      <div className="editorial-two-column">
        <article className="editorial-panel">
          <p className="eyebrow">Locales</p>
          <div className="detail-stack">
            {record.localizations.map((entry: (typeof record.localizations)[number]) => (
              <div key={entry.locale} className="detail-line-item">
                <p className="detail-line-title">{entry.locale.toUpperCase()} · {entry.title}</p>
                <p className="editorial-copy">{entry.summary ?? 'No summary'}</p>
              </div>
            ))}
          </div>
        </article>

        <aside className="editorial-side-stack">
          <article className="editorial-panel editorial-panel-compact">
            <p className="eyebrow">Workflow</p>
            <div className="detail-stack">
              {record.workflowNotes.map((note: string) => (
                <div key={note} className="detail-line-item detail-line-item-note">
                  <p className="editorial-copy">{note}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="editorial-panel editorial-panel-compact">
            <p className="eyebrow">Edit / archive contract</p>
            <form
              className="editorial-form"
              data-enhanced={isEnhanced ? 'true' : 'false'}
              onSubmit={onMutationSubmit}
              aria-busy={pending}
            >
              <div className="form-grid">
                <label className="field">
                  <span>Action</span>
                  <select name="action" defaultValue="update">
                    <option value="update">Update entry</option>
                    <option value="archive">Archive entry</option>
                  </select>
                </label>
                <label className="field">
                  <span>Locale</span>
                  <select name="locale" value={locale} onChange={(event) => setLocale(event.target.value as Locale)}>
                    <option value="uk">UK</option>
                    <option value="en">EN</option>
                    <option value="ru">RU</option>
                  </select>
                </label>
                <label className="field">
                  <span>Public state</span>
                  <select name="state" defaultValue={record.meta.lifecycle.state}>
                    <option value="published">Published</option>
                    <option value="review">Review</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
              </div>
              <label className="field">
                <span>Localized title</span>
                <input key={`${locale}-title`} required name="title" type="text" defaultValue={activeLocalization?.title ?? record.slug} />
              </label>
              <label className="field">
                <span>Summary or archive reason</span>
                <textarea key={`${locale}-summary`} name="summary" rows={4} defaultValue={activeLocalization?.summary ?? ''} />
              </label>
              {isEditableOfferKind(record.kind) ? (
                <div className="form-grid">
                  {fieldSpecs.map((field) => (
                    <label key={field.name} className="field">
                      <span>{field.label}</span>
                      <input
                        name={field.name}
                        type="text"
                        defaultValue={draftFields[field.name] ?? ''}
                      />
                    </label>
                  ))}
                </div>
              ) : null}
              <p className="form-status">
                This persists title, summary, price/media fields, and archive state to the JSON overlay.
                Public offer pages read those overlay fields before falling back to the seed.
              </p>
              <button className="button-secondary w-fit" type="submit" disabled={pending || !isEnhanced}>
                {pending ? 'Saving change' : 'Save change'}
              </button>
              <div aria-live="polite">
                {mutation ? (
                  <p className="form-status">
                    {mutation.message} Reference: {mutation.reference}
                  </p>
                ) : null}
              </div>
            </form>
          </article>

          <article className="editorial-panel editorial-panel-compact">
            <p className="eyebrow">Raw scaffold</p>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.85rem' }}>
              {JSON.stringify(record.raw, null, 2)}
            </pre>
          </article>
        </aside>
      </div>
    </section>
  )
}
