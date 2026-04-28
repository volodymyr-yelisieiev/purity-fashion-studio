import { Link, Outlet, createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { adminDefaultLocale } from '~/lib/admin'
import { getAdminAuthState } from '~/lib/admin-auth'
import { publicEnv } from '~/lib/env'
import { contentQueries } from '~/lib/query'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    if (!publicEnv.enableAdmin) {
      throw notFound()
    }

    if (location.pathname === '/admin/login') {
      return
    }

    const auth = await getAdminAuthState()

    if (!auth.authenticated) {
      throw redirect({ to: '/admin/login' })
    }
  },
  loader: async ({ context }) => {
    const locale = adminDefaultLocale
    const [navigation] = await Promise.all([
      context.queryClient.ensureQueryData(contentQueries.adminNavigation(locale)),
    ])

    return { locale, navigation }
  },
  component: AdminLayout,
})

function AdminLayout() {
  const { navigation } = Route.useLoaderData()

  return (
    <main className="site-container section-space">
      <div className="section-head">
        <p className="eyebrow">Admin</p>
        <h1 className="section-title">Content Platform</h1>
        <p className="editorial-copy editorial-copy-measure">
          Adapter-ready content management for Headless CMS publishing. The route is config-gated
          and disabled by default in production until auth and provider credentials are configured.
        </p>
      </div>

      <nav className="micro-tag-row" aria-label="Admin sections">
        <Link to="/admin/content" className="button-secondary">
          All content
        </Link>
        {navigation.map((item: (typeof navigation)[number]) => (
          <a key={item.kind} href={item.to} className="micro-tag">
            {item.label}
          </a>
        ))}
      </nav>

      <Outlet />
    </main>
  )
}
