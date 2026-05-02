import { Link, Outlet, createFileRoute, notFound, redirect, useNavigate, useRouterState } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import * as React from 'react'
import { adminDefaultLocale } from '~/lib/admin'
import { getAdminAuthState, logoutAdmin } from '~/lib/admin-auth'
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
  loader: async ({ context, location }) => {
    const locale = adminDefaultLocale

    if (location.pathname === '/admin/login') {
      return { locale, navigation: [] }
    }

    const [navigation] = await Promise.all([
      context.queryClient.ensureQueryData(contentQueries.adminNavigation(locale)),
    ])

    return { locale, navigation }
  },
  component: AdminLayout,
})

function AdminLayout() {
  const { navigation } = Route.useLoaderData()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const navigate = useNavigate()
  const logout = useServerFn(logoutAdmin)
  const [pendingLogout, setPendingLogout] = React.useState(false)

  if (pathname === '/admin/login') {
    return (
      <main className="site-container section-space">
        <Outlet />
      </main>
    )
  }

  async function onLogout() {
    setPendingLogout(true)

    try {
      await logout()
      await navigate({ to: '/admin/login' })
    } finally {
      setPendingLogout(false)
    }
  }

  return (
    <main className="site-container section-space">
      <div className="section-head">
        <p className="eyebrow">Admin</p>
        <h1 className="section-title">Content Platform</h1>
        <p className="editorial-copy editorial-copy-measure">
          Adapter-ready content management for Headless CMS publishing. The route is config-gated,
          disabled by default in production, and can be enabled only with auth and provider
          credentials configured.
        </p>
      </div>

      <nav className="micro-tag-row" aria-label="Admin sections">
        <Link to="/admin/content" className="button-secondary">
          All content
        </Link>
        {navigation.map((item: (typeof navigation)[number]) => (
          <Link key={item.kind} to={item.to} className="micro-tag">
            {item.label}
          </Link>
        ))}
        <button className="micro-tag" type="button" onClick={onLogout} disabled={pendingLogout}>
          {pendingLogout ? 'Signing out' : 'Sign out'}
        </button>
      </nav>

      <Outlet />
    </main>
  )
}
