import { clearSession, useSession } from '@tanstack/react-start/server'
import { parseServerEnv } from './env'

interface AdminSessionData {
  adminAuthenticated?: boolean
  adminUsername?: string
}

const SESSION_NAME = 'purity-admin-session'
const DEVELOPMENT_USERNAME = 'admin'
const DEVELOPMENT_PASSWORD = 'purity-local-admin'
const DEVELOPMENT_SECRET = 'purity-development-admin-session-secret-keep-local-only'

function adminConfig() {
  const env = parseServerEnv(process.env)
  const isProduction = env.appEnv === 'production'
  const username = env.adminUsername || (isProduction ? undefined : DEVELOPMENT_USERNAME)
  const password = env.adminPassword || env.adminToken || (isProduction ? undefined : DEVELOPMENT_PASSWORD)
  const sessionSecret = env.adminSessionSecret || (isProduction ? undefined : DEVELOPMENT_SECRET)
  const configured = Boolean(username && password && sessionSecret && sessionSecret.length >= 32)

  return {
    configured,
    username,
    password,
    sessionConfig: {
      password: sessionSecret || DEVELOPMENT_SECRET,
      name: SESSION_NAME,
      maxAge: 60 * 60 * 8,
      cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax' as const,
        path: '/',
      },
    },
  }
}

export async function readAdminAuthState() {
  const config = adminConfig()

  if (!config.configured) {
    return { configured: false, authenticated: false }
  }

  const session = await useSession<AdminSessionData>(config.sessionConfig)

  return {
    configured: true,
    authenticated: Boolean(session.data.adminAuthenticated),
    username: session.data.adminUsername,
  }
}

export async function createAdminSession(input: { username: string; password: string }) {
  const config = adminConfig()

  if (!config.configured) {
    return {
      configured: false,
      authenticated: false,
      message: 'Admin auth requires ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET.',
    }
  }

  if (
    !config.username ||
    !config.password ||
    input.username !== config.username ||
    input.password !== config.password
  ) {
    return {
      configured: true,
      authenticated: false,
      message: 'Invalid admin username or password.',
    }
  }

  const session = await useSession<AdminSessionData>(config.sessionConfig)
  await session.update({ adminAuthenticated: true, adminUsername: input.username })

  return {
    configured: true,
    authenticated: true,
    message: 'Admin session created.',
  }
}

export async function clearAdminSession() {
  const config = adminConfig()

  if (config.configured) {
    await clearSession(config.sessionConfig)
  }

  return { authenticated: false }
}
