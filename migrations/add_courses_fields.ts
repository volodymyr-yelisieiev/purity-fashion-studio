import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Add localized columns for course locales
    ALTER TABLE "courses_locales" ADD COLUMN IF NOT EXISTS "prerequisites" varchar;
    ALTER TABLE "courses_locales" ADD COLUMN IF NOT EXISTS "materials" varchar;

    -- Add price override columns and flags on courses
    ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "price_e_u_r" numeric;
    ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "price_u_a_h" numeric;
    ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "bookable" boolean DEFAULT true;
    ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "payment_enabled" boolean DEFAULT false;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "courses_locales" DROP COLUMN IF EXISTS "prerequisites";
    ALTER TABLE "courses_locales" DROP COLUMN IF EXISTS "materials";

    ALTER TABLE "courses" DROP COLUMN IF EXISTS "price_e_u_r";
    ALTER TABLE "courses" DROP COLUMN IF EXISTS "price_u_a_h";
    ALTER TABLE "courses" DROP COLUMN IF EXISTS "bookable";
    ALTER TABLE "courses" DROP COLUMN IF EXISTS "payment_enabled";
  `)
}
