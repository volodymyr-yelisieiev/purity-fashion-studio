import test from 'node:test'
import assert from 'node:assert/strict'

import { createAnalytics } from './analytics'

test('createAnalytics ignores events when analytics is off', () => {
  const events: unknown[] = []
  const analytics = createAnalytics({
    enabled: false,
    mode: 'off',
    dispatch: (event) => {
      events.push(event)
    },
  })

  analytics.track('page_view', { path: '/en' })

  assert.equal(events.length, 0)
})

test('createAnalytics dispatches normalized events when enabled', () => {
  const events: Array<{ name: string; payload: Record<string, unknown> }> = []
  const analytics = createAnalytics({
    enabled: true,
    mode: 'console',
    dispatch: (event) => {
      events.push(event)
    },
  })

  analytics.track('booking_lead_submit_succeeded', {
    kind: 'service',
    slug: 'atelier-service',
    source: 'mock',
  })

  assert.deepEqual(events, [
    {
      name: 'booking_lead_submit_succeeded',
      payload: {
        kind: 'service',
        slug: 'atelier-service',
        source: 'mock',
      },
    },
  ])
})
