import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "portfolio_locales" ADD COLUMN IF NOT EXISTS "challenge" varchar;
  ALTER TABLE "portfolio_locales" ADD COLUMN IF NOT EXISTS "solution" varchar;
  ALTER TABLE "portfolio_locales" ADD COLUMN IF NOT EXISTS "result" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "portfolio_locales" DROP COLUMN "challenge";
  ALTER TABLE "portfolio_locales" DROP COLUMN "solution";
  ALTER TABLE "portfolio_locales" DROP COLUMN "result";`)
}
