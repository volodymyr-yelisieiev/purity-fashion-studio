import { createFileRoute, notFound } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useQueryClient } from '@tanstack/react-query'
import * as React from 'react'
import { adminDefaultLocale, isAdminEntityKind, requireAdminEntityKind } from '~/lib/admin'
import { adminDraftFieldSpecs, isEditableOfferKind } from '~/lib/admin-edit-fields'
import { submitManagedContentMutation } from '~/lib/admin-content'
import { contentQueries } from '~/lib/query'
import type { Locale, ManagedContentMutationResult, ManagedOfferDraftFields, PublishState } from '~/lib/types'

export const Route = createFileRoute('/admin/content/$kind/')({
  loader: async ({ context, params }) => {
    if (!isAdminEntityKind(params.kind)) {
      throw notFound()
    }

    const locale = adminDefaultLocale
    const kind = requireAdminEntityKind(params.kind)
    const [entries] = await Promise.all([
      context.queryClient.ensureQueryData(contentQueries.managedContentIndex(locale, kind)),
    ])

    return { kind, entries }
  },
  component: ContentKindIndex,
})

function ContentKindIndex() {
  const { kind, entries } = Route.useLoaderData()
  const queryClient = useQueryClient()
  const submitMutation = useServerFn(submitManagedContentMutation)
  const [isEnhanced, setIsEnhanced] = React.useState(false)
  const [mutation, setMutation] = React.useState<ManagedContentMutationResult | null>(null)
  const [pending, setPending] = React.useState(false)
  const fieldSpecs = adminDraftFieldSpecs[kind] ?? []

  React.useEffect(() => {
    setIsEnhanced(true)
  }, [])

  async function onCreateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const fields = Object.fromEntries(
      fieldSpecs
        .map((field) => [field.name, String(form.get(field.name) ?? '').trim()])
        .filter(([, value]) => value),
    ) as ManagedOfferDraftFields

    setPending(true)
    try {
      const result = (await submitMutation({
        data: {
          action: 'create',
          kind,
          locale: String(form.get('locale') ?? 'en') as Locale,
          slug: String(form.get('slug') ?? '').trim(),
          title: String(form.get('title') ?? '').trim(),
          summary: String(form.get('summary') ?? '').trim(),
          state: String(form.get('state') ?? 'draft') as PublishState,
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
        <p className="eyebrow">Content list</p>
        <h2 className="section-title">{kind}</h2>
        <p className="editorial-copy editorial-copy-measure">
          Adapter-ready list view for Headless CMS management. Create, edit, and archive actions
          share one mutation contract and stay provider-neutral until credentials are configured.
        </p>
      </div>

      <article className="editorial-panel" style={{ marginBottom: '2rem' }}>
        <p className="eyebrow">Create contract</p>
        <form
          className="editorial-form"
          data-enhanced={isEnhanced ? 'true' : 'false'}
          onSubmit={onCreateSubmit}
          aria-busy={pending}
        >
          <div className="form-grid">
            <label className="field">
              <span>Locale</span>
              <select name="locale" defaultValue="en">
                <option value="uk">UK</option>
                <option value="en">EN</option>
                <option value="ru">RU</option>
              </select>
            </label>
            <label className="field">
              <span>Public state</span>
              <select name="state" defaultValue="draft">
                <option value="draft">Draft</option>
                <option value="review">Review</option>
              </select>
            </label>
            <label className="field">
              <span>Draft slug</span>
              <input required name="slug" type="text" />
            </label>
          </div>
          <label className="field">
            <span>Title</span>
            <input required name="title" type="text" />
          </label>
          <label className="field">
            <span>Summary</span>
            <textarea name="summary" rows={3} />
          </label>
          {isEditableOfferKind(kind) ? (
            <div className="form-grid">
              {fieldSpecs.map((field) => (
                <label key={field.name} className="field">
                  <span>{field.label}</span>
                  <input name={field.name} type="text" />
                </label>
              ))}
            </div>
          ) : null}
          <p className="form-status">
            Saves to the JSON content overlay now, including offer price/media fields where this
            content type has public cards or detail pages. New records stay draft/review until a
            complete public schema is approved.
          </p>
          <button className="button-secondary w-fit" type="submit" disabled={pending || !isEnhanced}>
            {pending ? 'Saving draft' : 'Create editable draft'}
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

      <div className="detail-stack">
        {entries.map((entry: (typeof entries)[number]) => (
          <article key={entry.id} className="detail-line-item">
            <div>
              <p className="detail-line-title">{entry.title}</p>
              <p className="editorial-copy">
                {entry.state} / updated {new Date(entry.updatedAt).toLocaleDateString()} / owner {entry.ownerName}
              </p>
            </div>
            <a href={entry.to} className="button-secondary">
              Open
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
