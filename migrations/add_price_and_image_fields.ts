import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "lookbooks" ADD COLUMN IF NOT EXISTS "cover_image_id" integer;
    ALTER TABLE "lookbooks" ADD COLUMN IF NOT EXISTS "price_e_u_r" numeric;
    ALTER TABLE "lookbooks" ADD COLUMN IF NOT EXISTS "price_u_a_h" numeric;

    ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "main_image_id" integer;
    ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "price_e_u_r" numeric;
    ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "price_u_a_h" numeric;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "lookbooks" DROP COLUMN IF EXISTS "cover_image_id";
    ALTER TABLE "lookbooks" DROP COLUMN IF EXISTS "price_e_u_r";
    ALTER TABLE "lookbooks" DROP COLUMN IF EXISTS "price_u_a_h";

    ALTER TABLE "portfolio" DROP COLUMN IF EXISTS "main_image_id";
    ALTER TABLE "portfolio" DROP COLUMN IF EXISTS "price_e_u_r";
    ALTER TABLE "portfolio" DROP COLUMN IF EXISTS "price_u_a_h";
  `)
}
