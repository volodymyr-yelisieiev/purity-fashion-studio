import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "lookbooks_locales" ADD COLUMN IF NOT EXISTS "materials" varchar;
  ALTER TABLE "lookbooks_locales" ADD COLUMN IF NOT EXISTS "care_instructions" varchar;
  ALTER TABLE "lookbooks_locales" ADD COLUMN IF NOT EXISTS "sizes" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "lookbooks_locales" DROP COLUMN "materials";
  ALTER TABLE "lookbooks_locales" DROP COLUMN "care_instructions";
  ALTER TABLE "lookbooks_locales" DROP COLUMN "sizes";`)
}
