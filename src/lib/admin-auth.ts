import { createServerFn } from '@tanstack/react-start'
import {
  clearAdminSession,
  createAdminSession,
  readAdminAuthState,
} from './admin-session'

export const getAdminAuthState = createServerFn({ method: 'GET' }).handler(readAdminAuthState)

export const loginAdmin = createServerFn({ method: 'POST' })
  .inputValidator((data: { username?: string; password?: string; token?: string }) => ({
    username: typeof data.username === 'string' ? data.username.trim() : '',
    password:
      typeof data.password === 'string'
        ? data.password
        : typeof data.token === 'string'
          ? data.token
          : '',
  }))
  .handler(async ({ data }) => createAdminSession(data))

export const logoutAdmin = createServerFn({ method: 'POST' }).handler(clearAdminSession)
