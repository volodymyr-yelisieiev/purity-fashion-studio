import { randomUUID } from "node:crypto"
import * as Sentry from "@sentry/nextjs"
import type { Payload } from "payload"

const correlationPattern = /^[a-zA-Z0-9_-]{8,128}$/

export function correlationID(request: Request) {
  const supplied = request.headers.get("x-correlation-id")
  return supplied && correlationPattern.test(supplied) ? supplied : randomUUID()
}

export function logOperationError({
  payload,
  correlationID,
  operation,
  code,
  error,
}: {
  payload: Payload
  correlationID: string
  operation: string
  code: string
  error: unknown
}) {
  const safeError = new Error(code)
  safeError.name = error instanceof Error ? error.name : "UnknownError"
  payload.logger.error({
    correlationID,
    operation,
    code,
    err: { name: safeError.name, message: safeError.message },
  })
  Sentry.captureException(safeError, {
    tags: { code, correlationID, operation },
  })
}
