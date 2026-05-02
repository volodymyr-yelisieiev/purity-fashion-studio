import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import * as React from 'react'
import { loginAdmin } from '~/lib/admin-auth'

export const Route = createFileRoute('/admin/login')({
  component: AdminLoginPage,
})

function AdminLoginPage() {
  const navigate = useNavigate()
  const login = useServerFn(loginAdmin)
  const [isEnhanced, setIsEnhanced] = React.useState(false)
  const [status, setStatus] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)
  const submitDisabled = pending || !isEnhanced

  React.useEffect(() => {
    setIsEnhanced(true)
  }, [])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (submitDisabled) {
      return
    }

    const form = new FormData(event.currentTarget)

    setPending(true)
    setStatus(null)

    try {
      const result = await login({
        data: {
          username: String(form.get('username') ?? ''),
          password: String(form.get('password') ?? ''),
        },
      })

      if (result.authenticated) {
        await navigate({ to: '/admin/content' })
        return
      }

      setStatus(result.message)
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="section-space">
      <article className="editorial-panel editorial-panel-compact">
        <p className="eyebrow">Protected access</p>
        <h2 className="section-subtitle">Admin login</h2>
        <form
          className="editorial-form"
          method="post"
          data-enhanced={isEnhanced ? 'true' : 'false'}
          onSubmit={onSubmit}
          aria-busy={submitDisabled}
        >
          <label className="field">
            <span>Admin login</span>
            <input
              required
              name="username"
              type="text"
              autoComplete="username"
            />
          </label>
          <label className="field">
            <span>Admin password</span>
            <input
              required
              name="password"
              type="password"
              autoComplete="current-password"
            />
          </label>
          <button className="button-secondary w-fit" type="submit" disabled={submitDisabled}>
            {pending ? 'Checking credentials' : 'Sign in'}
          </button>
          <div aria-live="polite">
            {status ? <p className="form-status">{status}</p> : null}
          </div>
        </form>
      </article>
    </section>
  )
}
