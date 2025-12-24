import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_services_category" ADD VALUE 'research' BEFORE 'styling';
  ALTER TYPE "public"."enum_services_category" ADD VALUE 'realisation' BEFORE 'styling';
  ALTER TYPE "public"."enum_services_category" ADD VALUE 'transformation' BEFORE 'styling';
  ALTER TABLE "portfolio_locales" ADD COLUMN IF NOT EXISTS "challenge" varchar;
  ALTER TABLE "portfolio_locales" ADD COLUMN IF NOT EXISTS "solution" varchar;
  ALTER TABLE "portfolio_locales" ADD COLUMN IF NOT EXISTS "result" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE "public"."enum_services_category";
  DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = 'enum_services_category' AND n.nspname = 'public') THEN CREATE TYPE "public"."enum_services_category" AS ENUM('styling', 'atelier', 'consulting', 'shopping', 'events'); END IF; END $$;
  ALTER TABLE "services" ALTER COLUMN "category" SET DATA TYPE "public"."enum_services_category" USING "category"::"public"."enum_services_category";
  ALTER TABLE "portfolio_locales" DROP COLUMN "challenge";
  ALTER TABLE "portfolio_locales" DROP COLUMN "solution";
  ALTER TABLE "portfolio_locales" DROP COLUMN "result";`)
}
