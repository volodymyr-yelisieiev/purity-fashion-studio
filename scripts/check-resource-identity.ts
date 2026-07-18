import assert from "node:assert/strict"

import {
  assertTargetResourceIdentity,
  blobStoreID,
  databaseIdentity,
} from "./resource-identity"
import { migrations } from "../payload/migrations"
import { migrationHead } from "../payload/migration-head"
import { publicGlobalRead } from "../payload/access"

const preview = {
  VERCEL_ENV: "preview",
  DATABASE_URL: "postgresql://user:secret@preview.db.example/purity_preview",
  EXPECTED_DATABASE_HOST: "preview.db.example",
  EXPECTED_DATABASE_NAME: "purity_preview",
  BLOB_READ_WRITE_TOKEN: "vercel_blob_rw_previewstore_secret",
  EXPECTED_BLOB_STORE_ID: "previewstore",
}

assert.deepEqual(databaseIdentity(preview.DATABASE_URL), {
  host: "preview.db.example",
  name: "purity_preview",
})
assert.equal(blobStoreID(preview.BLOB_READ_WRITE_TOKEN), "previewstore")
assert.doesNotThrow(() => assertTargetResourceIdentity("preview", preview))
assert.throws(() =>
  assertTargetResourceIdentity("preview", {
    ...preview,
    DATABASE_URL: "postgresql://user:secret@production.db.example/purity",
  })
)
assert.equal(migrations.at(-1)?.name, migrationHead)
assert.deepEqual(await publicGlobalRead({ req: { user: null } } as never), {
  _status: { equals: "published" },
})
assert.equal(
  await publicGlobalRead({
    req: { user: { active: true, roles: ["editor"] } },
  } as never),
  true
)
assert.deepEqual(
  await publicGlobalRead({
    req: { user: { active: false, roles: ["editor"] } },
  } as never),
  { _status: { equals: "published" } }
)
assert.throws(() =>
  assertTargetResourceIdentity("preview", {
    ...preview,
    BLOB_READ_WRITE_TOKEN: "vercel_blob_rw_productionstore_secret",
  })
)
assert.throws(() =>
  assertTargetResourceIdentity("preview", { ...preview, VERCEL_ENV: undefined })
)

console.log("Resource identity guards ok.")
