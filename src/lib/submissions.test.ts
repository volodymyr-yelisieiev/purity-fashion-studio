import test from 'node:test'
import assert from 'node:assert/strict'

import { validateBookingRequest, validateContactInquiry } from './submissions'

test('contact submission validation normalizes required lead fields', () => {
  const inquiry = validateContactInquiry({
    locale: 'en',
    name: '  Smoke   Test  ',
    email: 'SMOKE@EXAMPLE.COM ',
    phone: '+380 00 000 00 00',
    interest: '  Research ',
    message: '  Need a lookbook request. ',
  })

  assert.equal(inquiry.name, 'Smoke Test')
  assert.equal(inquiry.email, 'smoke@example.com')
  assert.equal(inquiry.interest, 'Research')
})

test('contact submission validation rejects invalid email and short phone', () => {
  assert.throws(
    () => validateContactInquiry({
      locale: 'uk',
      name: 'Smoke Test',
      email: 'bad-email',
      phone: '123',
      message: 'Need a consultation',
    }),
    /invalid-email/,
  )
})

test('booking submission validation accepts portfolio intents and future dates', () => {
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + 7)

  const booking = validateBookingRequest({
    kind: 'portfolio',
    slug: 'soft-power-capsule',
    locale: 'uk',
    format: 'case-inquiry',
    preferredDate: futureDate.toISOString().slice(0, 10),
    name: 'Smoke Test',
    email: 'smoke@example.com',
    phone: '+380000000000',
    notes: 'Portfolio case inquiry',
  })

  assert.equal(booking.kind, 'portfolio')
  assert.equal(booking.slug, 'soft-power-capsule')
})

test('booking submission validation rejects past dates', () => {
  assert.throws(
    () => validateBookingRequest({
      kind: 'service',
      slug: 'personal-lookbook',
      locale: 'en',
      format: 'studio',
      preferredDate: '2020-01-01',
      name: 'Smoke Test',
      email: 'smoke@example.com',
      phone: '+380000000000',
    }),
    /past-date/,
  )
})
