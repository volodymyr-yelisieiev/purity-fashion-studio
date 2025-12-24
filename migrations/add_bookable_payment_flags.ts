import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "lookbooks" ADD COLUMN IF NOT EXISTS "bookable" boolean DEFAULT false;
    ALTER TABLE "lookbooks" ADD COLUMN IF NOT EXISTS "payment_enabled" boolean DEFAULT false;

    ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "bookable" boolean DEFAULT false;
    ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "payment_enabled" boolean DEFAULT false;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "lookbooks" DROP COLUMN IF EXISTS "bookable";
    ALTER TABLE "lookbooks" DROP COLUMN IF EXISTS "payment_enabled";

    ALTER TABLE "portfolio" DROP COLUMN IF EXISTS "bookable";
    ALTER TABLE "portfolio" DROP COLUMN IF EXISTS "payment_enabled";
  `)
}
