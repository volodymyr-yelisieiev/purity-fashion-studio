import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload: _payload,
  req: _req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_services_blocks_liquid_cinematic_hero_reveal_intensity" AS ENUM('subtle', 'medium', 'bold');
  CREATE TYPE "public"."enum_services_blocks_methodology_timeline_steps_stage" AS ENUM('research', 'imagine', 'create');
  CREATE TYPE "public"."enum_portfolio_blocks_liquid_cinematic_hero_reveal_intensity" AS ENUM('subtle', 'medium', 'bold');
  CREATE TYPE "public"."enum_portfolio_blocks_methodology_timeline_steps_stage" AS ENUM('research', 'imagine', 'create');
  CREATE TYPE "public"."enum_courses_blocks_liquid_cinematic_hero_reveal_intensity" AS ENUM('subtle', 'medium', 'bold');
  CREATE TYPE "public"."enum_courses_blocks_methodology_timeline_steps_stage" AS ENUM('research', 'imagine', 'create');
  CREATE TABLE "services_blocks_liquid_cinematic_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"background_image_id" integer NOT NULL,
  	"foreground_image_id" integer NOT NULL,
  	"reveal_intensity" "enum_services_blocks_liquid_cinematic_hero_reveal_intensity" DEFAULT 'medium',
  	"cta_label" varchar,
  	"cta_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_methodology_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"stage" "enum_services_blocks_methodology_timeline_steps_stage" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"media_id" integer NOT NULL
  );
  
  CREATE TABLE "services_blocks_methodology_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "services_deliverables" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "portfolio_blocks_liquid_cinematic_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"background_image_id" integer NOT NULL,
  	"foreground_image_id" integer NOT NULL,
  	"reveal_intensity" "enum_portfolio_blocks_liquid_cinematic_hero_reveal_intensity" DEFAULT 'medium',
  	"cta_label" varchar,
  	"cta_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio_blocks_methodology_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"stage" "enum_portfolio_blocks_methodology_timeline_steps_stage" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"media_id" integer NOT NULL
  );
  
  CREATE TABLE "portfolio_blocks_methodology_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "courses_blocks_liquid_cinematic_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"background_image_id" integer NOT NULL,
  	"foreground_image_id" integer NOT NULL,
  	"reveal_intensity" "enum_courses_blocks_liquid_cinematic_hero_reveal_intensity" DEFAULT 'medium',
  	"cta_label" varchar,
  	"cta_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "courses_blocks_methodology_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"stage" "enum_courses_blocks_methodology_timeline_steps_stage" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"media_id" integer NOT NULL
  );
  
  CREATE TABLE "courses_blocks_methodology_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"block_name" varchar
  );
  
  ALTER TABLE "services_locales" ALTER COLUMN "excerpt" SET NOT NULL;
  ALTER TABLE "portfolio_locales" ALTER COLUMN "excerpt" SET NOT NULL;
  ALTER TABLE "services_locales" ADD COLUMN "description" varchar DEFAULT '' NOT NULL;
  ALTER TABLE "portfolio_locales" ADD COLUMN "challenge" varchar DEFAULT '' NOT NULL;
  ALTER TABLE "portfolio_locales" ADD COLUMN "transformation" varchar DEFAULT '' NOT NULL;
  ALTER TABLE "portfolio_locales" ADD COLUMN "solution" varchar DEFAULT '' NOT NULL;
  ALTER TABLE "services_blocks_liquid_cinematic_hero" ADD CONSTRAINT "services_blocks_liquid_cinematic_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_liquid_cinematic_hero" ADD CONSTRAINT "services_blocks_liquid_cinematic_hero_foreground_image_id_media_id_fk" FOREIGN KEY ("foreground_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_liquid_cinematic_hero" ADD CONSTRAINT "services_blocks_liquid_cinematic_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_methodology_timeline_steps" ADD CONSTRAINT "services_blocks_methodology_timeline_steps_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_methodology_timeline_steps" ADD CONSTRAINT "services_blocks_methodology_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_methodology_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_methodology_timeline" ADD CONSTRAINT "services_blocks_methodology_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_process" ADD CONSTRAINT "services_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_deliverables" ADD CONSTRAINT "services_deliverables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_blocks_liquid_cinematic_hero" ADD CONSTRAINT "portfolio_blocks_liquid_cinematic_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_blocks_liquid_cinematic_hero" ADD CONSTRAINT "portfolio_blocks_liquid_cinematic_hero_foreground_image_id_media_id_fk" FOREIGN KEY ("foreground_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_blocks_liquid_cinematic_hero" ADD CONSTRAINT "portfolio_blocks_liquid_cinematic_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_blocks_methodology_timeline_steps" ADD CONSTRAINT "portfolio_blocks_methodology_timeline_steps_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_blocks_methodology_timeline_steps" ADD CONSTRAINT "portfolio_blocks_methodology_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_blocks_methodology_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_blocks_methodology_timeline" ADD CONSTRAINT "portfolio_blocks_methodology_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_blocks_liquid_cinematic_hero" ADD CONSTRAINT "courses_blocks_liquid_cinematic_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_blocks_liquid_cinematic_hero" ADD CONSTRAINT "courses_blocks_liquid_cinematic_hero_foreground_image_id_media_id_fk" FOREIGN KEY ("foreground_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_blocks_liquid_cinematic_hero" ADD CONSTRAINT "courses_blocks_liquid_cinematic_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_blocks_methodology_timeline_steps" ADD CONSTRAINT "courses_blocks_methodology_timeline_steps_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_blocks_methodology_timeline_steps" ADD CONSTRAINT "courses_blocks_methodology_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses_blocks_methodology_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_blocks_methodology_timeline" ADD CONSTRAINT "courses_blocks_methodology_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_blocks_liquid_cinematic_hero_order_idx" ON "services_blocks_liquid_cinematic_hero" USING btree ("_order");
  CREATE INDEX "services_blocks_liquid_cinematic_hero_parent_id_idx" ON "services_blocks_liquid_cinematic_hero" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_liquid_cinematic_hero_path_idx" ON "services_blocks_liquid_cinematic_hero" USING btree ("_path");
  CREATE INDEX "services_blocks_liquid_cinematic_hero_locale_idx" ON "services_blocks_liquid_cinematic_hero" USING btree ("_locale");
  CREATE INDEX "services_blocks_liquid_cinematic_hero_background_image_idx" ON "services_blocks_liquid_cinematic_hero" USING btree ("background_image_id");
  CREATE INDEX "services_blocks_liquid_cinematic_hero_foreground_image_idx" ON "services_blocks_liquid_cinematic_hero" USING btree ("foreground_image_id");
  CREATE INDEX "services_blocks_methodology_timeline_steps_order_idx" ON "services_blocks_methodology_timeline_steps" USING btree ("_order");
  CREATE INDEX "services_blocks_methodology_timeline_steps_parent_id_idx" ON "services_blocks_methodology_timeline_steps" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_methodology_timeline_steps_locale_idx" ON "services_blocks_methodology_timeline_steps" USING btree ("_locale");
  CREATE INDEX "services_blocks_methodology_timeline_steps_media_idx" ON "services_blocks_methodology_timeline_steps" USING btree ("media_id");
  CREATE INDEX "services_blocks_methodology_timeline_order_idx" ON "services_blocks_methodology_timeline" USING btree ("_order");
  CREATE INDEX "services_blocks_methodology_timeline_parent_id_idx" ON "services_blocks_methodology_timeline" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_methodology_timeline_path_idx" ON "services_blocks_methodology_timeline" USING btree ("_path");
  CREATE INDEX "services_blocks_methodology_timeline_locale_idx" ON "services_blocks_methodology_timeline" USING btree ("_locale");
  CREATE INDEX "services_process_order_idx" ON "services_process" USING btree ("_order");
  CREATE INDEX "services_process_parent_id_idx" ON "services_process" USING btree ("_parent_id");
  CREATE INDEX "services_process_locale_idx" ON "services_process" USING btree ("_locale");
  CREATE INDEX "services_deliverables_order_idx" ON "services_deliverables" USING btree ("_order");
  CREATE INDEX "services_deliverables_parent_id_idx" ON "services_deliverables" USING btree ("_parent_id");
  CREATE INDEX "services_deliverables_locale_idx" ON "services_deliverables" USING btree ("_locale");
  CREATE INDEX "portfolio_blocks_liquid_cinematic_hero_order_idx" ON "portfolio_blocks_liquid_cinematic_hero" USING btree ("_order");
  CREATE INDEX "portfolio_blocks_liquid_cinematic_hero_parent_id_idx" ON "portfolio_blocks_liquid_cinematic_hero" USING btree ("_parent_id");
  CREATE INDEX "portfolio_blocks_liquid_cinematic_hero_path_idx" ON "portfolio_blocks_liquid_cinematic_hero" USING btree ("_path");
  CREATE INDEX "portfolio_blocks_liquid_cinematic_hero_locale_idx" ON "portfolio_blocks_liquid_cinematic_hero" USING btree ("_locale");
  CREATE INDEX "portfolio_blocks_liquid_cinematic_hero_background_image_idx" ON "portfolio_blocks_liquid_cinematic_hero" USING btree ("background_image_id");
  CREATE INDEX "portfolio_blocks_liquid_cinematic_hero_foreground_image_idx" ON "portfolio_blocks_liquid_cinematic_hero" USING btree ("foreground_image_id");
  CREATE INDEX "portfolio_blocks_methodology_timeline_steps_order_idx" ON "portfolio_blocks_methodology_timeline_steps" USING btree ("_order");
  CREATE INDEX "portfolio_blocks_methodology_timeline_steps_parent_id_idx" ON "portfolio_blocks_methodology_timeline_steps" USING btree ("_parent_id");
  CREATE INDEX "portfolio_blocks_methodology_timeline_steps_locale_idx" ON "portfolio_blocks_methodology_timeline_steps" USING btree ("_locale");
  CREATE INDEX "portfolio_blocks_methodology_timeline_steps_media_idx" ON "portfolio_blocks_methodology_timeline_steps" USING btree ("media_id");
  CREATE INDEX "portfolio_blocks_methodology_timeline_order_idx" ON "portfolio_blocks_methodology_timeline" USING btree ("_order");
  CREATE INDEX "portfolio_blocks_methodology_timeline_parent_id_idx" ON "portfolio_blocks_methodology_timeline" USING btree ("_parent_id");
  CREATE INDEX "portfolio_blocks_methodology_timeline_path_idx" ON "portfolio_blocks_methodology_timeline" USING btree ("_path");
  CREATE INDEX "portfolio_blocks_methodology_timeline_locale_idx" ON "portfolio_blocks_methodology_timeline" USING btree ("_locale");
  CREATE INDEX "courses_blocks_liquid_cinematic_hero_order_idx" ON "courses_blocks_liquid_cinematic_hero" USING btree ("_order");
  CREATE INDEX "courses_blocks_liquid_cinematic_hero_parent_id_idx" ON "courses_blocks_liquid_cinematic_hero" USING btree ("_parent_id");
  CREATE INDEX "courses_blocks_liquid_cinematic_hero_path_idx" ON "courses_blocks_liquid_cinematic_hero" USING btree ("_path");
  CREATE INDEX "courses_blocks_liquid_cinematic_hero_locale_idx" ON "courses_blocks_liquid_cinematic_hero" USING btree ("_locale");
  CREATE INDEX "courses_blocks_liquid_cinematic_hero_background_image_idx" ON "courses_blocks_liquid_cinematic_hero" USING btree ("background_image_id");
  CREATE INDEX "courses_blocks_liquid_cinematic_hero_foreground_image_idx" ON "courses_blocks_liquid_cinematic_hero" USING btree ("foreground_image_id");
  CREATE INDEX "courses_blocks_methodology_timeline_steps_order_idx" ON "courses_blocks_methodology_timeline_steps" USING btree ("_order");
  CREATE INDEX "courses_blocks_methodology_timeline_steps_parent_id_idx" ON "courses_blocks_methodology_timeline_steps" USING btree ("_parent_id");
  CREATE INDEX "courses_blocks_methodology_timeline_steps_locale_idx" ON "courses_blocks_methodology_timeline_steps" USING btree ("_locale");
  CREATE INDEX "courses_blocks_methodology_timeline_steps_media_idx" ON "courses_blocks_methodology_timeline_steps" USING btree ("media_id");
  CREATE INDEX "courses_blocks_methodology_timeline_order_idx" ON "courses_blocks_methodology_timeline" USING btree ("_order");
  CREATE INDEX "courses_blocks_methodology_timeline_parent_id_idx" ON "courses_blocks_methodology_timeline" USING btree ("_parent_id");
  CREATE INDEX "courses_blocks_methodology_timeline_path_idx" ON "courses_blocks_methodology_timeline" USING btree ("_path");
  CREATE INDEX "courses_blocks_methodology_timeline_locale_idx" ON "courses_blocks_methodology_timeline" USING btree ("_locale");`);
}

export async function down({
  db,
  payload: _payload,
  req: _req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_blocks_liquid_cinematic_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_methodology_timeline_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_methodology_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_deliverables" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio_blocks_liquid_cinematic_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio_blocks_methodology_timeline_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio_blocks_methodology_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "courses_blocks_liquid_cinematic_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "courses_blocks_methodology_timeline_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "courses_blocks_methodology_timeline" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "services_blocks_liquid_cinematic_hero" CASCADE;
  DROP TABLE "services_blocks_methodology_timeline_steps" CASCADE;
  DROP TABLE "services_blocks_methodology_timeline" CASCADE;
  DROP TABLE "services_process" CASCADE;
  DROP TABLE "services_deliverables" CASCADE;
  DROP TABLE "portfolio_blocks_liquid_cinematic_hero" CASCADE;
  DROP TABLE "portfolio_blocks_methodology_timeline_steps" CASCADE;
  DROP TABLE "portfolio_blocks_methodology_timeline" CASCADE;
  DROP TABLE "courses_blocks_liquid_cinematic_hero" CASCADE;
  DROP TABLE "courses_blocks_methodology_timeline_steps" CASCADE;
  DROP TABLE "courses_blocks_methodology_timeline" CASCADE;
  ALTER TABLE "services_locales" ALTER COLUMN "excerpt" DROP NOT NULL;
  ALTER TABLE "portfolio_locales" ALTER COLUMN "excerpt" DROP NOT NULL;
  ALTER TABLE "services_locales" DROP COLUMN "description";
  ALTER TABLE "portfolio_locales" DROP COLUMN "challenge";
  ALTER TABLE "portfolio_locales" DROP COLUMN "transformation";
  ALTER TABLE "portfolio_locales" DROP COLUMN "solution";
  DROP TYPE "public"."enum_services_blocks_liquid_cinematic_hero_reveal_intensity";
  DROP TYPE "public"."enum_services_blocks_methodology_timeline_steps_stage";
  DROP TYPE "public"."enum_portfolio_blocks_liquid_cinematic_hero_reveal_intensity";
  DROP TYPE "public"."enum_portfolio_blocks_methodology_timeline_steps_stage";
  DROP TYPE "public"."enum_courses_blocks_liquid_cinematic_hero_reveal_intensity";
  DROP TYPE "public"."enum_courses_blocks_methodology_timeline_steps_stage";`);
}
