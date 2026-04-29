import test from 'node:test'
import assert from 'node:assert/strict'

import { parsePublicEnv, parseServerEnv } from './env'

test('parsePublicEnv disables prototype-only flags in production by default', () => {
  const env = parsePublicEnv({
    MODE: 'production',
    VITE_APP_ENV: 'production',
  })

  assert.equal(env.mode, 'production')
  assert.equal(env.appEnv, 'production')
  assert.equal(env.showRouterDevtools, false)
  assert.equal(env.enableAdmin, false)
  assert.equal(env.enablePrototypeFlows, false)
  assert.equal(env.analyticsMode, 'off')
})

test('parsePublicEnv refuses prototype-only flags on production surfaces', () => {
  const env = parsePublicEnv({
    MODE: 'production',
    VITE_APP_ENV: 'production',
    VITE_ENABLE_ADMIN: 'true',
    VITE_ENABLE_ROUTER_DEVTOOLS: 'true',
    VITE_ENABLE_PROTOTYPE_FLOWS: 'true',
    VITE_ENABLE_FORCE_MOCK_FAILURES: 'true',
    VITE_ANALYTICS_MODE: 'console',
  })

  assert.equal(env.showRouterDevtools, false)
  assert.equal(env.enableAdmin, false)
  assert.equal(env.enablePrototypeFlows, false)
  assert.equal(env.enableForcedMockFailures, false)
  assert.equal(env.analyticsMode, 'off')
})

test('parsePublicEnv keeps non-production analytics and prototype flows enabled by default', () => {
  const env = parsePublicEnv({
    MODE: 'development',
  })

  assert.equal(env.appEnv, 'development')
  assert.equal(env.showRouterDevtools, false)
  assert.equal(env.enableAdmin, true)
  assert.equal(env.enablePrototypeFlows, true)
  assert.equal(env.analyticsMode, 'console')
})

test('parseServerEnv rejects invalid app environments', () => {
  assert.throws(
    () =>
      parseServerEnv({
        NODE_ENV: 'production',
        APP_ENV: 'preview',
      }),
    /APP_ENV/,
  )
})

test('parseServerEnv reads lead, admin, and content store configuration', () => {
  const env = parseServerEnv({
    NODE_ENV: 'production',
    APP_ENV: 'production',
    CONTACT_WEBHOOK_URL: 'https://example.com/webhook',
    ADMIN_USERNAME: 'owner',
    ADMIN_PASSWORD: 'secret-password',
    ADMIN_SESSION_SECRET: '01234567890123456789012345678901',
    CONTENT_STORE_PATH: '/tmp/purity-content.json',
  })

  assert.equal(env.contactWebhookUrl, 'https://example.com/webhook')
  assert.equal(env.adminUsername, 'owner')
  assert.equal(env.adminPassword, 'secret-password')
  assert.equal(env.adminSessionSecret, '01234567890123456789012345678901')
  assert.equal(env.contentStorePath, '/tmp/purity-content.json')
})
