import { Link, createFileRoute } from '@tanstack/react-router'
import { adminDefaultLocale } from '~/lib/admin'
import { contentQueries } from '~/lib/query'

export const Route = createFileRoute('/admin/content/')({
  loader: async ({ context }) => {
    const locale = adminDefaultLocale
    const [navigation, entries] = await Promise.all([
      context.queryClient.ensureQueryData(contentQueries.adminNavigation(locale)),
      context.queryClient.ensureQueryData(contentQueries.managedContentIndex(locale)),
    ])

    return { navigation, entries }
  },
  component: ContentAdminIndex,
})

function ContentAdminIndex() {
  const { navigation, entries } = Route.useLoaderData()

  return (
    <section className="section-space">
      <div className="offer-grid offer-grid-third">
        {navigation.map((item: (typeof navigation)[number]) => (
          <article key={item.kind} className="editorial-panel editorial-panel-compact">
            <p className="eyebrow">{item.label}</p>
            <h2 className="section-subtitle">{item.count} entries</h2>
            <p className="editorial-copy">{item.description}</p>
            <a href={item.to} className="button-secondary">
              Open {item.label.toLowerCase()}
            </a>
          </article>
        ))}
      </div>

      <div className="editorial-panel" style={{ marginTop: '2rem' }}>
        <div className="section-head">
          <p className="eyebrow">Publishing queue</p>
          <h2 className="section-subtitle">Current managed entities</h2>
        </div>

        <div className="detail-stack">
          {entries.slice(0, 12).map((entry: (typeof entries)[number]) => (
            <a key={entry.id} href={entry.to} className="detail-line-item">
              <p className="detail-line-title">{entry.title}</p>
              <p className="editorial-copy">
                {entry.kind} / {entry.state} / {entry.localeCoverage.join(', ')} / media {entry.mediaCount}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
