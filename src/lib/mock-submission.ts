type SubmissionShape = Record<string, string | null | undefined>

function normalizeValue(key: string, value: string | null | undefined) {
  const compact = String(value ?? '').trim().replace(/\s+/g, ' ')

  if (key === 'email') {
    return compact.toLowerCase()
  }

  return compact
}

export function buildSubmissionSignature(payload: SubmissionShape) {
  return JSON.stringify(
    Object.keys(payload)
      .sort()
      .reduce<Record<string, string>>((acc, key) => {
        acc[key] = normalizeValue(key, payload[key])
        return acc
      }, {}),
  )
}

export function isDuplicateSubmission(previous: SubmissionShape, next: SubmissionShape) {
  return buildSubmissionSignature(previous) === buildSubmissionSignature(next)
}

export function shouldForceMockFailure(payload: SubmissionShape) {
  return Object.values(payload).some((value) => String(value ?? '').includes('[force-error]'))
}

export function isOfflineSubmission() {
  return typeof navigator !== 'undefined' && 'onLine' in navigator && navigator.onLine === false
}
