import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   -- Enums (using DO block to handle conditional ADD VALUE for safety)
   DO $$ BEGIN
     ALTER TYPE "public"."enum_services_format" ADD VALUE IF NOT EXISTS 'retreat';
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     ALTER TYPE "public"."enum_courses_category" ADD VALUE IF NOT EXISTS 'construction';
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;

   DO $$ BEGIN
     ALTER TYPE "public"."enum_courses_format" ADD VALUE IF NOT EXISTS 'studio';
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   -- Media Purpose
   ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "purpose" varchar;
   CREATE INDEX IF NOT EXISTS "media_purpose_idx" ON "media" USING btree ("purpose");

   -- Slugs (localized -> global)
   
   -- Lookbooks
   ALTER TABLE "lookbooks" ADD COLUMN IF NOT EXISTS "slug" text;
   UPDATE "lookbooks" 
   SET "slug" = (
     SELECT "slug" 
     FROM "lookbooks_locales" 
     WHERE "lookbooks_locales"."_parent_id" = "lookbooks"."id" 
     AND "slug" IS NOT NULL 
     ORDER BY CASE WHEN "_locale" = 'en' THEN 1 ELSE 2 END 
     LIMIT 1
   );
   ALTER TABLE "lookbooks_locales" DROP COLUMN IF EXISTS "slug";
   DROP INDEX IF EXISTS "lookbooks_slug_idx";
   CREATE UNIQUE INDEX "lookbooks_slug_idx" ON "lookbooks" ("slug");

   -- Courses
   ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "slug" text;
   UPDATE "courses" 
   SET "slug" = (
     SELECT "slug" 
     FROM "courses_locales" 
     WHERE "courses_locales"."_parent_id" = "courses"."id" 
     AND "slug" IS NOT NULL 
     ORDER BY CASE WHEN "_locale" = 'en' THEN 1 ELSE 2 END 
     LIMIT 1
   );
   ALTER TABLE "courses_locales" DROP COLUMN IF EXISTS "slug";
   DROP INDEX IF EXISTS "courses_slug_idx";
   CREATE UNIQUE INDEX "courses_slug_idx" ON "courses" ("slug");

   -- Services
   ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "slug" text;
   UPDATE "services" 
   SET "slug" = (
     SELECT "slug" 
     FROM "services_locales" 
     WHERE "services_locales"."_parent_id" = "services"."id" 
     AND "slug" IS NOT NULL 
     ORDER BY CASE WHEN "_locale" = 'en' THEN 1 ELSE 2 END 
     LIMIT 1
   );
   ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "slug";
   DROP INDEX IF EXISTS "services_slug_idx";
   CREATE UNIQUE INDEX "services_slug_idx" ON "services" ("slug");

   -- Portfolio
   ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "slug" text;
   UPDATE "portfolio" 
   SET "slug" = (
     SELECT "slug" 
     FROM "portfolio_locales" 
     WHERE "portfolio_locales"."_parent_id" = "portfolio"."id" 
     AND "slug" IS NOT NULL 
     ORDER BY CASE WHEN "_locale" = 'en' THEN 1 ELSE 2 END 
     LIMIT 1
   );
   ALTER TABLE "portfolio_locales" DROP COLUMN IF EXISTS "slug";
   DROP INDEX IF EXISTS "portfolio_slug_idx";
   CREATE UNIQUE INDEX "portfolio_slug_idx" ON "portfolio" ("slug");

   -- Posts
   ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "slug" text;
   UPDATE "posts" 
   SET "slug" = (
     SELECT "slug" 
     FROM "posts_locales" 
     WHERE "posts_locales"."_parent_id" = "posts"."id" 
     AND "slug" IS NOT NULL 
     ORDER BY CASE WHEN "_locale" = 'en' THEN 1 ELSE 2 END 
     LIMIT 1
   );
   ALTER TABLE "posts_locales" DROP COLUMN IF EXISTS "slug";
   DROP INDEX IF EXISTS "posts_slug_idx";
   CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" ("slug");

   -- Products
   ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "slug" text;
   UPDATE "products" 
   SET "slug" = (
     SELECT "slug" 
     FROM "products_locales" 
     WHERE "products_locales"."_parent_id" = "products"."id" 
     AND "slug" IS NOT NULL 
     ORDER BY CASE WHEN "_locale" = 'en' THEN 1 ELSE 2 END 
     LIMIT 1
   );
   ALTER TABLE "products_locales" DROP COLUMN IF EXISTS "slug";
   DROP INDEX IF EXISTS "products_slug_idx";
   CREATE UNIQUE INDEX "products_slug_idx" ON "products" ("slug");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   -- Reverting add column
   DROP INDEX IF EXISTS "media_purpose_idx";
   ALTER TABLE "media" DROP COLUMN IF EXISTS "purpose";
   
   -- Reverting Slugs (Global -> Localized)
   -- Lookbooks
   DROP INDEX IF EXISTS "lookbooks_slug_idx";
   ALTER TABLE "lookbooks_locales" ADD COLUMN IF NOT EXISTS "slug" text;
   UPDATE "lookbooks_locales"
   SET "slug" = "lookbooks"."slug"
   FROM "lookbooks"
   WHERE "lookbooks_locales"."_parent_id" = "lookbooks"."id";
   ALTER TABLE "lookbooks" DROP COLUMN IF EXISTS "slug";
   
   -- Courses
   DROP INDEX IF EXISTS "courses_slug_idx";
   ALTER TABLE "courses_locales" ADD COLUMN IF NOT EXISTS "slug" text;
   UPDATE "courses_locales"
   SET "slug" = "courses"."slug"
   FROM "courses"
   WHERE "courses_locales"."_parent_id" = "courses"."id";
   ALTER TABLE "courses" DROP COLUMN IF EXISTS "slug";
   
   -- Services
   DROP INDEX IF EXISTS "services_slug_idx";
   ALTER TABLE "services_locales" ADD COLUMN IF NOT EXISTS "slug" text;
   UPDATE "services_locales"
   SET "slug" = "services"."slug"
   FROM "services"
   WHERE "services_locales"."_parent_id" = "services"."id";
   ALTER TABLE "services" DROP COLUMN IF EXISTS "slug";
   
   -- Portfolio
   DROP INDEX IF EXISTS "portfolio_slug_idx";
   ALTER TABLE "portfolio_locales" ADD COLUMN IF NOT EXISTS "slug" text;
   UPDATE "portfolio_locales"
   SET "slug" = "portfolio"."slug"
   FROM "portfolio"
   WHERE "portfolio_locales"."_parent_id" = "portfolio"."id";
   ALTER TABLE "portfolio" DROP COLUMN IF EXISTS "slug";
   
   -- Posts
   DROP INDEX IF EXISTS "posts_slug_idx";
   ALTER TABLE "posts_locales" ADD COLUMN IF NOT EXISTS "slug" text;
   UPDATE "posts_locales"
   SET "slug" = "posts"."slug"
   FROM "posts"
   WHERE "posts_locales"."_parent_id" = "posts"."id";
   ALTER TABLE "posts" DROP COLUMN IF EXISTS "slug";
   
   -- Products
   DROP INDEX IF EXISTS "products_slug_idx";
   ALTER TABLE "products_locales" ADD COLUMN IF NOT EXISTS "slug" text;
   UPDATE "products_locales"
   SET "slug" = "products"."slug"
   FROM "products"
   WHERE "products_locales"."_parent_id" = "products"."id";
   ALTER TABLE "products" DROP COLUMN IF EXISTS "slug";
  `);
}
