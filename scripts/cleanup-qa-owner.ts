import { getPayload } from "payload"

import config from "@payload-config"

if (process.env.ALLOW_QA_OWNER_CLEANUP !== "true") {
  throw new Error("QA cleanup requires ALLOW_QA_OWNER_CLEANUP=true.")
}
if (!process.argv.includes("--confirm=QA_OWNER_CLEANUP")) {
  throw new Error("Confirm QA cleanup with --confirm=QA_OWNER_CLEANUP.")
}
if (
  !(["preview", "production"] as string[]).includes(
    process.env.VERCEL_ENV ?? ""
  )
) {
  throw new Error("QA cleanup requires an explicit VERCEL_ENV target.")
}

const payload = await getPayload({ config })
const users = await payload.find({
  collection: "users",
  depth: 0,
  limit: 10_000,
  overrideAccess: true,
  pagination: false,
})

for (const user of users.docs) {
  await payload.delete({
    collection: "users",
    id: user.id,
    overrideAccess: true,
  })
}

const client = await payload.db.pool.connect()
try {
  await client.query("DELETE FROM payload_preferences_rels")
  await client.query("DELETE FROM payload_preferences")
  const [usersResult, sessionsResult, preferencesResult] = await Promise.all([
    client.query<{ count: string }>("SELECT count(*)::int AS count FROM users"),
    client.query<{ count: string }>(
      "SELECT count(*)::int AS count FROM users_sessions"
    ),
    client.query<{ count: string }>(
      "SELECT count(*)::int AS count FROM payload_preferences"
    ),
  ])
  const counts = {
    users: Number(usersResult.rows[0]?.count ?? 0),
    users_sessions: Number(sessionsResult.rows[0]?.count ?? 0),
    payload_preferences: Number(preferencesResult.rows[0]?.count ?? 0),
  }
  if (Object.values(counts).some((count) => count !== 0)) {
    throw new Error(
      `QA cleanup postcondition failed: ${JSON.stringify(counts)}`
    )
  }
  console.log(`QA owner cleanup complete: ${JSON.stringify(counts)}`)
} finally {
  client.release()
}
