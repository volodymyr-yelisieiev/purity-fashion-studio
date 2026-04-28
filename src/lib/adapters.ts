import type {
  BookingRequest,
  BookingSubmissionAdapter,
  ContactInquiry,
  InquirySubmissionAdapter,
} from './types'
import { publicEnv } from './env'
import { isOfflineSubmission, shouldForceMockFailure } from './mock-submission'

const pause = (ms = 700) => new Promise((resolve) => setTimeout(resolve, ms))

function buildReference(prefix: string) {
  return `${prefix}-${Date.now()}`
}

export const bookingSubmissionAdapter: BookingSubmissionAdapter = {
  async submitBookingRequest(request: BookingRequest) {
    await pause()

    const reference = buildReference(`${request.locale.toUpperCase()}-BOOKING`)

    if (isOfflineSubmission()) {
      return {
        status: 'failure',
        reference,
        message: 'offline',
        source: 'mock',
      }
    }

    if (
      publicEnv.enablePrototypeFlows &&
      publicEnv.enableForcedMockFailures &&
      shouldForceMockFailure({
        name: request.name,
        email: request.email,
        phone: request.phone,
        notes: request.notes,
      })
    ) {
      return {
        status: 'failure',
        reference,
        message: 'forced-demo-failure',
        source: 'mock',
      }
    }

    return {
      status: 'success',
      reference,
      source: 'mock',
    }
  },
}

export const inquirySubmissionAdapter: InquirySubmissionAdapter = {
  async submitInquiry(inquiry: ContactInquiry) {
    await pause(500)

    const reference = buildReference(inquiry.locale.toUpperCase())

    if (isOfflineSubmission()) {
      return {
        status: 'failure',
        reference,
        message: 'offline',
        source: 'mock',
      }
    }

    if (
      publicEnv.enablePrototypeFlows &&
      publicEnv.enableForcedMockFailures &&
      shouldForceMockFailure({
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        interest: inquiry.interest,
        message: inquiry.message,
      })
    ) {
      return {
        status: 'failure',
        reference,
        message: 'forced-demo-failure',
        source: 'mock',
      }
    }

    return {
      status: 'success',
      reference,
      source: 'mock',
    }
  },
}
