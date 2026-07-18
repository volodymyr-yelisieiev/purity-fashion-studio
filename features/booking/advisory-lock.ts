import type { Payload } from "payload"

const lockPrefix = "purity"

export async function acquireAdvisoryLock(
  payload: Payload,
  namespace: string,
  key: string,
  { wait = true }: { wait?: boolean } = {}
): Promise<null | (() => Promise<void>)> {
  const lockID = `${lockPrefix}:${namespace}:${key}`
  const deadline = Date.now() + 30_000

  while (true) {
    const client = await payload.db.pool.connect()
    try {
      const result = await client.query<{ acquired: boolean }>(
        "SELECT pg_try_advisory_lock(hashtextextended($1, 0)) AS acquired",
        [lockID]
      )
      if (!result.rows[0]?.acquired) {
        client.release()
        if (!wait) return null
        if (Date.now() >= deadline) {
          return Promise.reject(
            new Error(`Timed out acquiring ${namespace} lock`)
          )
        }
        await new Promise((resolve) => setTimeout(resolve, 10))
        continue
      }

      let released = false
      return async () => {
        if (released) return
        released = true
        try {
          await client.query(
            "SELECT pg_advisory_unlock(hashtextextended($1, 0))",
            [lockID]
          )
        } finally {
          client.release()
        }
      }
    } catch (error) {
      client.release()
      throw error
    }
  }
}

export async function withAdvisoryLock<T>(
  payload: Payload,
  namespace: string,
  key: string,
  operation: () => Promise<T>
): Promise<T> {
  const release = await acquireAdvisoryLock(payload, namespace, key)
  if (!release) throw new Error("Failed to acquire advisory lock")
  try {
    return await operation()
  } finally {
    await release()
  }
}
