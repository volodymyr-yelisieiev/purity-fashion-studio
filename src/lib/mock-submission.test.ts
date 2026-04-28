import test from 'node:test'
import assert from 'node:assert/strict'

import { isDuplicateSubmission } from './mock-submission'

test('isDuplicateSubmission only flags identical normalized payloads', () => {
  const first = {
    email: ' person@example.com ',
    format: 'online',
    notes: 'Need early afternoon',
  }
  const second = {
    email: 'person@example.com',
    format: 'online',
    notes: 'Need early afternoon',
  }
  const third = {
    email: 'person@example.com',
    format: 'studio',
    notes: 'Need early afternoon',
  }

  assert.equal(isDuplicateSubmission(first, second), true)
  assert.equal(isDuplicateSubmission(first, third), false)
})
