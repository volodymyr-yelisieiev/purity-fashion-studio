import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload: _payload,
  req: _req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_blocks_editorial_hero_layout" AS ENUM('full', 'split', 'overlap');
  CREATE TYPE "public"."enum_products_blocks_editorial_hero_theme" AS ENUM('light', 'dark', 'parchment');
  CREATE TYPE "public"."enum_products_blocks_media_grid_items_aspect_ratio" AS ENUM('portrait', 'square', 'landscape');
  CREATE TYPE "public"."enum_products_blocks_media_grid_columns" AS ENUM('2', '3', '4', 'masonry');
  CREATE TYPE "public"."enum_products_blocks_horizontal_marquee_speed" AS ENUM('slow', 'normal', 'fast');
  CREATE TYPE "public"."enum_products_blocks_horizontal_marquee_direction" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_products_blocks_liquid_cinematic_hero_reveal_intensity" AS ENUM('subtle', 'medium', 'bold');
  CREATE TYPE "public"."enum_products_blocks_methodology_timeline_steps_stage" AS ENUM('research', 'imagine', 'create');
  CREATE TYPE "public"."enum_lookbooks_blocks_editorial_hero_layout" AS ENUM('full', 'split', 'overlap');
  CREATE TYPE "public"."enum_lookbooks_blocks_editorial_hero_theme" AS ENUM('light', 'dark', 'parchment');
  CREATE TYPE "public"."enum_lookbooks_blocks_media_grid_items_aspect_ratio" AS ENUM('portrait', 'square', 'landscape');
  CREATE TYPE "public"."enum_lookbooks_blocks_media_grid_columns" AS ENUM('2', '3', '4', 'masonry');
  CREATE TYPE "public"."enum_lookbooks_blocks_horizontal_marquee_speed" AS ENUM('slow', 'normal', 'fast');
  CREATE TYPE "public"."enum_lookbooks_blocks_horizontal_marquee_direction" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_lookbooks_blocks_liquid_cinematic_hero_reveal_intensity" AS ENUM('subtle', 'medium', 'bold');
  CREATE TYPE "public"."enum_lookbooks_blocks_methodology_timeline_steps_stage" AS ENUM('research', 'imagine', 'create');
  CREATE TYPE "public"."enum_posts_blocks_editorial_hero_layout" AS ENUM('full', 'split', 'overlap');
  CREATE TYPE "public"."enum_posts_blocks_editorial_hero_theme" AS ENUM('light', 'dark', 'parchment');
  CREATE TYPE "public"."enum_posts_blocks_media_grid_items_aspect_ratio" AS ENUM('portrait', 'square', 'landscape');
  CREATE TYPE "public"."enum_posts_blocks_media_grid_columns" AS ENUM('2', '3', '4', 'masonry');
  CREATE TYPE "public"."enum_posts_blocks_horizontal_marquee_speed" AS ENUM('slow', 'normal', 'fast');
  CREATE TYPE "public"."enum_posts_blocks_horizontal_marquee_direction" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_posts_blocks_liquid_cinematic_hero_reveal_intensity" AS ENUM('subtle', 'medium', 'bold');
  CREATE TYPE "public"."enum_posts_blocks_methodology_timeline_steps_stage" AS ENUM('research', 'imagine', 'create');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_category" AS ENUM('editorial', 'behind-the-scenes', 'style-guide', 'methodology');
  CREATE TABLE "products_blocks_editorial_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_products_blocks_editorial_hero_layout" DEFAULT 'full',
  	"media_id" integer NOT NULL,
  	"overlay_media_id" integer,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"theme" "enum_products_blocks_editorial_hero_theme" DEFAULT 'light',
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_media_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"caption" varchar,
  	"aspect_ratio" "enum_products_blocks_media_grid_items_aspect_ratio" DEFAULT 'portrait'
  );
  
  CREATE TABLE "products_blocks_media_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum_products_blocks_media_grid_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_comparison_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"before_image_id" integer NOT NULL,
  	"after_image_id" integer NOT NULL,
  	"before_label" varchar DEFAULT 'Before',
  	"after_label" varchar DEFAULT 'After',
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_horizontal_marquee_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_horizontal_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"speed" "enum_products_blocks_horizontal_marquee_speed" DEFAULT 'slow',
  	"direction" "enum_products_blocks_horizontal_marquee_direction" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_liquid_cinematic_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"background_image_id" integer NOT NULL,
  	"foreground_image_id" integer NOT NULL,
  	"reveal_intensity" "enum_products_blocks_liquid_cinematic_hero_reveal_intensity" DEFAULT 'medium',
  	"cta_label" varchar,
  	"cta_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_methodology_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"stage" "enum_products_blocks_methodology_timeline_steps_stage" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"media_id" integer NOT NULL
  );
  
  CREATE TABLE "products_blocks_methodology_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "lookbooks_blocks_editorial_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_lookbooks_blocks_editorial_hero_layout" DEFAULT 'full',
  	"media_id" integer NOT NULL,
  	"overlay_media_id" integer,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"theme" "enum_lookbooks_blocks_editorial_hero_theme" DEFAULT 'light',
  	"block_name" varchar
  );
  
  CREATE TABLE "lookbooks_blocks_media_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"caption" varchar,
  	"aspect_ratio" "enum_lookbooks_blocks_media_grid_items_aspect_ratio" DEFAULT 'portrait'
  );
  
  CREATE TABLE "lookbooks_blocks_media_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum_lookbooks_blocks_media_grid_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "lookbooks_blocks_comparison_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"before_image_id" integer NOT NULL,
  	"after_image_id" integer NOT NULL,
  	"before_label" varchar DEFAULT 'Before',
  	"after_label" varchar DEFAULT 'After',
  	"block_name" varchar
  );
  
  CREATE TABLE "lookbooks_blocks_horizontal_marquee_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "lookbooks_blocks_horizontal_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"speed" "enum_lookbooks_blocks_horizontal_marquee_speed" DEFAULT 'slow',
  	"direction" "enum_lookbooks_blocks_horizontal_marquee_direction" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "lookbooks_blocks_liquid_cinematic_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"background_image_id" integer NOT NULL,
  	"foreground_image_id" integer NOT NULL,
  	"reveal_intensity" "enum_lookbooks_blocks_liquid_cinematic_hero_reveal_intensity" DEFAULT 'medium',
  	"cta_label" varchar,
  	"cta_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "lookbooks_blocks_methodology_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"stage" "enum_lookbooks_blocks_methodology_timeline_steps_stage" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"media_id" integer NOT NULL
  );
  
  CREATE TABLE "lookbooks_blocks_methodology_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "lookbooks_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE "posts_blocks_editorial_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_posts_blocks_editorial_hero_layout" DEFAULT 'full',
  	"media_id" integer NOT NULL,
  	"overlay_media_id" integer,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"theme" "enum_posts_blocks_editorial_hero_theme" DEFAULT 'light',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_media_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"caption" varchar,
  	"aspect_ratio" "enum_posts_blocks_media_grid_items_aspect_ratio" DEFAULT 'portrait'
  );
  
  CREATE TABLE "posts_blocks_media_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum_posts_blocks_media_grid_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_comparison_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"before_image_id" integer NOT NULL,
  	"after_image_id" integer NOT NULL,
  	"before_label" varchar DEFAULT 'Before',
  	"after_label" varchar DEFAULT 'After',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_horizontal_marquee_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "posts_blocks_horizontal_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"speed" "enum_posts_blocks_horizontal_marquee_speed" DEFAULT 'slow',
  	"direction" "enum_posts_blocks_horizontal_marquee_direction" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_liquid_cinematic_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"background_image_id" integer NOT NULL,
  	"foreground_image_id" integer NOT NULL,
  	"reveal_intensity" "enum_posts_blocks_liquid_cinematic_hero_reveal_intensity" DEFAULT 'medium',
  	"cta_label" varchar,
  	"cta_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_methodology_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"stage" "enum_posts_blocks_methodology_timeline_steps_stage" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"media_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_blocks_methodology_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_posts_status" DEFAULT 'draft' NOT NULL,
  	"hero_image_id" integer NOT NULL,
  	"author" varchar NOT NULL,
  	"published_at" timestamp(3) with time zone NOT NULL,
  	"category" "enum_posts_category" NOT NULL,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts_locales" (
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "services" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE "public"."enum_services_category";
  CREATE TYPE "public"."enum_services_category" AS ENUM('research', 'imagine', 'create', 'styling', 'atelier', 'consulting', 'shopping', 'events');
  ALTER TABLE "services" ALTER COLUMN "category" SET DATA TYPE "public"."enum_services_category" USING "category"::"public"."enum_services_category";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "products_blocks_editorial_hero" ADD CONSTRAINT "products_blocks_editorial_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_editorial_hero" ADD CONSTRAINT "products_blocks_editorial_hero_overlay_media_id_media_id_fk" FOREIGN KEY ("overlay_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_editorial_hero" ADD CONSTRAINT "products_blocks_editorial_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_media_grid_items" ADD CONSTRAINT "products_blocks_media_grid_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_media_grid_items" ADD CONSTRAINT "products_blocks_media_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_media_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_media_grid" ADD CONSTRAINT "products_blocks_media_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_comparison_slider" ADD CONSTRAINT "products_blocks_comparison_slider_before_image_id_media_id_fk" FOREIGN KEY ("before_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_comparison_slider" ADD CONSTRAINT "products_blocks_comparison_slider_after_image_id_media_id_fk" FOREIGN KEY ("after_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_comparison_slider" ADD CONSTRAINT "products_blocks_comparison_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_horizontal_marquee_items" ADD CONSTRAINT "products_blocks_horizontal_marquee_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_horizontal_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_horizontal_marquee" ADD CONSTRAINT "products_blocks_horizontal_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_liquid_cinematic_hero" ADD CONSTRAINT "products_blocks_liquid_cinematic_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_liquid_cinematic_hero" ADD CONSTRAINT "products_blocks_liquid_cinematic_hero_foreground_image_id_media_id_fk" FOREIGN KEY ("foreground_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_liquid_cinematic_hero" ADD CONSTRAINT "products_blocks_liquid_cinematic_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_methodology_timeline_steps" ADD CONSTRAINT "products_blocks_methodology_timeline_steps_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_methodology_timeline_steps" ADD CONSTRAINT "products_blocks_methodology_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_methodology_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_methodology_timeline" ADD CONSTRAINT "products_blocks_methodology_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_rich_text" ADD CONSTRAINT "products_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lookbooks_blocks_editorial_hero" ADD CONSTRAINT "lookbooks_blocks_editorial_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lookbooks_blocks_editorial_hero" ADD CONSTRAINT "lookbooks_blocks_editorial_hero_overlay_media_id_media_id_fk" FOREIGN KEY ("overlay_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lookbooks_blocks_editorial_hero" ADD CONSTRAINT "lookbooks_blocks_editorial_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lookbooks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lookbooks_blocks_media_grid_items" ADD CONSTRAINT "lookbooks_blocks_media_grid_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lookbooks_blocks_media_grid_items" ADD CONSTRAINT "lookbooks_blocks_media_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lookbooks_blocks_media_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lookbooks_blocks_media_grid" ADD CONSTRAINT "lookbooks_blocks_media_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lookbooks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lookbooks_blocks_comparison_slider" ADD CONSTRAINT "lookbooks_blocks_comparison_slider_before_image_id_media_id_fk" FOREIGN KEY ("before_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lookbooks_blocks_comparison_slider" ADD CONSTRAINT "lookbooks_blocks_comparison_slider_after_image_id_media_id_fk" FOREIGN KEY ("after_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lookbooks_blocks_comparison_slider" ADD CONSTRAINT "lookbooks_blocks_comparison_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lookbooks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lookbooks_blocks_horizontal_marquee_items" ADD CONSTRAINT "lookbooks_blocks_horizontal_marquee_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lookbooks_blocks_horizontal_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lookbooks_blocks_horizontal_marquee" ADD CONSTRAINT "lookbooks_blocks_horizontal_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lookbooks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lookbooks_blocks_liquid_cinematic_hero" ADD CONSTRAINT "lookbooks_blocks_liquid_cinematic_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lookbooks_blocks_liquid_cinematic_hero" ADD CONSTRAINT "lookbooks_blocks_liquid_cinematic_hero_foreground_image_id_media_id_fk" FOREIGN KEY ("foreground_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lookbooks_blocks_liquid_cinematic_hero" ADD CONSTRAINT "lookbooks_blocks_liquid_cinematic_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lookbooks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lookbooks_blocks_methodology_timeline_steps" ADD CONSTRAINT "lookbooks_blocks_methodology_timeline_steps_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lookbooks_blocks_methodology_timeline_steps" ADD CONSTRAINT "lookbooks_blocks_methodology_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lookbooks_blocks_methodology_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lookbooks_blocks_methodology_timeline" ADD CONSTRAINT "lookbooks_blocks_methodology_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lookbooks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lookbooks_blocks_rich_text" ADD CONSTRAINT "lookbooks_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lookbooks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_tags" ADD CONSTRAINT "posts_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_editorial_hero" ADD CONSTRAINT "posts_blocks_editorial_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_editorial_hero" ADD CONSTRAINT "posts_blocks_editorial_hero_overlay_media_id_media_id_fk" FOREIGN KEY ("overlay_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_editorial_hero" ADD CONSTRAINT "posts_blocks_editorial_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_media_grid_items" ADD CONSTRAINT "posts_blocks_media_grid_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_media_grid_items" ADD CONSTRAINT "posts_blocks_media_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_media_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_media_grid" ADD CONSTRAINT "posts_blocks_media_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_comparison_slider" ADD CONSTRAINT "posts_blocks_comparison_slider_before_image_id_media_id_fk" FOREIGN KEY ("before_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_comparison_slider" ADD CONSTRAINT "posts_blocks_comparison_slider_after_image_id_media_id_fk" FOREIGN KEY ("after_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_comparison_slider" ADD CONSTRAINT "posts_blocks_comparison_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_horizontal_marquee_items" ADD CONSTRAINT "posts_blocks_horizontal_marquee_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_horizontal_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_horizontal_marquee" ADD CONSTRAINT "posts_blocks_horizontal_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_liquid_cinematic_hero" ADD CONSTRAINT "posts_blocks_liquid_cinematic_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_liquid_cinematic_hero" ADD CONSTRAINT "posts_blocks_liquid_cinematic_hero_foreground_image_id_media_id_fk" FOREIGN KEY ("foreground_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_liquid_cinematic_hero" ADD CONSTRAINT "posts_blocks_liquid_cinematic_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_methodology_timeline_steps" ADD CONSTRAINT "posts_blocks_methodology_timeline_steps_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_methodology_timeline_steps" ADD CONSTRAINT "posts_blocks_methodology_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_methodology_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_methodology_timeline" ADD CONSTRAINT "posts_blocks_methodology_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_rich_text" ADD CONSTRAINT "posts_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_blocks_editorial_hero_order_idx" ON "products_blocks_editorial_hero" USING btree ("_order");
  CREATE INDEX "products_blocks_editorial_hero_parent_id_idx" ON "products_blocks_editorial_hero" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_editorial_hero_path_idx" ON "products_blocks_editorial_hero" USING btree ("_path");
  CREATE INDEX "products_blocks_editorial_hero_locale_idx" ON "products_blocks_editorial_hero" USING btree ("_locale");
  CREATE INDEX "products_blocks_editorial_hero_media_idx" ON "products_blocks_editorial_hero" USING btree ("media_id");
  CREATE INDEX "products_blocks_editorial_hero_overlay_media_idx" ON "products_blocks_editorial_hero" USING btree ("overlay_media_id");
  CREATE INDEX "products_blocks_media_grid_items_order_idx" ON "products_blocks_media_grid_items" USING btree ("_order");
  CREATE INDEX "products_blocks_media_grid_items_parent_id_idx" ON "products_blocks_media_grid_items" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_media_grid_items_locale_idx" ON "products_blocks_media_grid_items" USING btree ("_locale");
  CREATE INDEX "products_blocks_media_grid_items_media_idx" ON "products_blocks_media_grid_items" USING btree ("media_id");
  CREATE INDEX "products_blocks_media_grid_order_idx" ON "products_blocks_media_grid" USING btree ("_order");
  CREATE INDEX "products_blocks_media_grid_parent_id_idx" ON "products_blocks_media_grid" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_media_grid_path_idx" ON "products_blocks_media_grid" USING btree ("_path");
  CREATE INDEX "products_blocks_media_grid_locale_idx" ON "products_blocks_media_grid" USING btree ("_locale");
  CREATE INDEX "products_blocks_comparison_slider_order_idx" ON "products_blocks_comparison_slider" USING btree ("_order");
  CREATE INDEX "products_blocks_comparison_slider_parent_id_idx" ON "products_blocks_comparison_slider" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_comparison_slider_path_idx" ON "products_blocks_comparison_slider" USING btree ("_path");
  CREATE INDEX "products_blocks_comparison_slider_locale_idx" ON "products_blocks_comparison_slider" USING btree ("_locale");
  CREATE INDEX "products_blocks_comparison_slider_before_image_idx" ON "products_blocks_comparison_slider" USING btree ("before_image_id");
  CREATE INDEX "products_blocks_comparison_slider_after_image_idx" ON "products_blocks_comparison_slider" USING btree ("after_image_id");
  CREATE INDEX "products_blocks_horizontal_marquee_items_order_idx" ON "products_blocks_horizontal_marquee_items" USING btree ("_order");
  CREATE INDEX "products_blocks_horizontal_marquee_items_parent_id_idx" ON "products_blocks_horizontal_marquee_items" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_horizontal_marquee_items_locale_idx" ON "products_blocks_horizontal_marquee_items" USING btree ("_locale");
  CREATE INDEX "products_blocks_horizontal_marquee_order_idx" ON "products_blocks_horizontal_marquee" USING btree ("_order");
  CREATE INDEX "products_blocks_horizontal_marquee_parent_id_idx" ON "products_blocks_horizontal_marquee" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_horizontal_marquee_path_idx" ON "products_blocks_horizontal_marquee" USING btree ("_path");
  CREATE INDEX "products_blocks_horizontal_marquee_locale_idx" ON "products_blocks_horizontal_marquee" USING btree ("_locale");
  CREATE INDEX "products_blocks_liquid_cinematic_hero_order_idx" ON "products_blocks_liquid_cinematic_hero" USING btree ("_order");
  CREATE INDEX "products_blocks_liquid_cinematic_hero_parent_id_idx" ON "products_blocks_liquid_cinematic_hero" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_liquid_cinematic_hero_path_idx" ON "products_blocks_liquid_cinematic_hero" USING btree ("_path");
  CREATE INDEX "products_blocks_liquid_cinematic_hero_locale_idx" ON "products_blocks_liquid_cinematic_hero" USING btree ("_locale");
  CREATE INDEX "products_blocks_liquid_cinematic_hero_background_image_idx" ON "products_blocks_liquid_cinematic_hero" USING btree ("background_image_id");
  CREATE INDEX "products_blocks_liquid_cinematic_hero_foreground_image_idx" ON "products_blocks_liquid_cinematic_hero" USING btree ("foreground_image_id");
  CREATE INDEX "products_blocks_methodology_timeline_steps_order_idx" ON "products_blocks_methodology_timeline_steps" USING btree ("_order");
  CREATE INDEX "products_blocks_methodology_timeline_steps_parent_id_idx" ON "products_blocks_methodology_timeline_steps" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_methodology_timeline_steps_locale_idx" ON "products_blocks_methodology_timeline_steps" USING btree ("_locale");
  CREATE INDEX "products_blocks_methodology_timeline_steps_media_idx" ON "products_blocks_methodology_timeline_steps" USING btree ("media_id");
  CREATE INDEX "products_blocks_methodology_timeline_order_idx" ON "products_blocks_methodology_timeline" USING btree ("_order");
  CREATE INDEX "products_blocks_methodology_timeline_parent_id_idx" ON "products_blocks_methodology_timeline" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_methodology_timeline_path_idx" ON "products_blocks_methodology_timeline" USING btree ("_path");
  CREATE INDEX "products_blocks_methodology_timeline_locale_idx" ON "products_blocks_methodology_timeline" USING btree ("_locale");
  CREATE INDEX "products_blocks_rich_text_order_idx" ON "products_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "products_blocks_rich_text_parent_id_idx" ON "products_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_rich_text_path_idx" ON "products_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "products_blocks_rich_text_locale_idx" ON "products_blocks_rich_text" USING btree ("_locale");
  CREATE INDEX "lookbooks_blocks_editorial_hero_order_idx" ON "lookbooks_blocks_editorial_hero" USING btree ("_order");
  CREATE INDEX "lookbooks_blocks_editorial_hero_parent_id_idx" ON "lookbooks_blocks_editorial_hero" USING btree ("_parent_id");
  CREATE INDEX "lookbooks_blocks_editorial_hero_path_idx" ON "lookbooks_blocks_editorial_hero" USING btree ("_path");
  CREATE INDEX "lookbooks_blocks_editorial_hero_locale_idx" ON "lookbooks_blocks_editorial_hero" USING btree ("_locale");
  CREATE INDEX "lookbooks_blocks_editorial_hero_media_idx" ON "lookbooks_blocks_editorial_hero" USING btree ("media_id");
  CREATE INDEX "lookbooks_blocks_editorial_hero_overlay_media_idx" ON "lookbooks_blocks_editorial_hero" USING btree ("overlay_media_id");
  CREATE INDEX "lookbooks_blocks_media_grid_items_order_idx" ON "lookbooks_blocks_media_grid_items" USING btree ("_order");
  CREATE INDEX "lookbooks_blocks_media_grid_items_parent_id_idx" ON "lookbooks_blocks_media_grid_items" USING btree ("_parent_id");
  CREATE INDEX "lookbooks_blocks_media_grid_items_locale_idx" ON "lookbooks_blocks_media_grid_items" USING btree ("_locale");
  CREATE INDEX "lookbooks_blocks_media_grid_items_media_idx" ON "lookbooks_blocks_media_grid_items" USING btree ("media_id");
  CREATE INDEX "lookbooks_blocks_media_grid_order_idx" ON "lookbooks_blocks_media_grid" USING btree ("_order");
  CREATE INDEX "lookbooks_blocks_media_grid_parent_id_idx" ON "lookbooks_blocks_media_grid" USING btree ("_parent_id");
  CREATE INDEX "lookbooks_blocks_media_grid_path_idx" ON "lookbooks_blocks_media_grid" USING btree ("_path");
  CREATE INDEX "lookbooks_blocks_media_grid_locale_idx" ON "lookbooks_blocks_media_grid" USING btree ("_locale");
  CREATE INDEX "lookbooks_blocks_comparison_slider_order_idx" ON "lookbooks_blocks_comparison_slider" USING btree ("_order");
  CREATE INDEX "lookbooks_blocks_comparison_slider_parent_id_idx" ON "lookbooks_blocks_comparison_slider" USING btree ("_parent_id");
  CREATE INDEX "lookbooks_blocks_comparison_slider_path_idx" ON "lookbooks_blocks_comparison_slider" USING btree ("_path");
  CREATE INDEX "lookbooks_blocks_comparison_slider_locale_idx" ON "lookbooks_blocks_comparison_slider" USING btree ("_locale");
  CREATE INDEX "lookbooks_blocks_comparison_slider_before_image_idx" ON "lookbooks_blocks_comparison_slider" USING btree ("before_image_id");
  CREATE INDEX "lookbooks_blocks_comparison_slider_after_image_idx" ON "lookbooks_blocks_comparison_slider" USING btree ("after_image_id");
  CREATE INDEX "lookbooks_blocks_horizontal_marquee_items_order_idx" ON "lookbooks_blocks_horizontal_marquee_items" USING btree ("_order");
  CREATE INDEX "lookbooks_blocks_horizontal_marquee_items_parent_id_idx" ON "lookbooks_blocks_horizontal_marquee_items" USING btree ("_parent_id");
  CREATE INDEX "lookbooks_blocks_horizontal_marquee_items_locale_idx" ON "lookbooks_blocks_horizontal_marquee_items" USING btree ("_locale");
  CREATE INDEX "lookbooks_blocks_horizontal_marquee_order_idx" ON "lookbooks_blocks_horizontal_marquee" USING btree ("_order");
  CREATE INDEX "lookbooks_blocks_horizontal_marquee_parent_id_idx" ON "lookbooks_blocks_horizontal_marquee" USING btree ("_parent_id");
  CREATE INDEX "lookbooks_blocks_horizontal_marquee_path_idx" ON "lookbooks_blocks_horizontal_marquee" USING btree ("_path");
  CREATE INDEX "lookbooks_blocks_horizontal_marquee_locale_idx" ON "lookbooks_blocks_horizontal_marquee" USING btree ("_locale");
  CREATE INDEX "lookbooks_blocks_liquid_cinematic_hero_order_idx" ON "lookbooks_blocks_liquid_cinematic_hero" USING btree ("_order");
  CREATE INDEX "lookbooks_blocks_liquid_cinematic_hero_parent_id_idx" ON "lookbooks_blocks_liquid_cinematic_hero" USING btree ("_parent_id");
  CREATE INDEX "lookbooks_blocks_liquid_cinematic_hero_path_idx" ON "lookbooks_blocks_liquid_cinematic_hero" USING btree ("_path");
  CREATE INDEX "lookbooks_blocks_liquid_cinematic_hero_locale_idx" ON "lookbooks_blocks_liquid_cinematic_hero" USING btree ("_locale");
  CREATE INDEX "lookbooks_blocks_liquid_cinematic_hero_background_image_idx" ON "lookbooks_blocks_liquid_cinematic_hero" USING btree ("background_image_id");
  CREATE INDEX "lookbooks_blocks_liquid_cinematic_hero_foreground_image_idx" ON "lookbooks_blocks_liquid_cinematic_hero" USING btree ("foreground_image_id");
  CREATE INDEX "lookbooks_blocks_methodology_timeline_steps_order_idx" ON "lookbooks_blocks_methodology_timeline_steps" USING btree ("_order");
  CREATE INDEX "lookbooks_blocks_methodology_timeline_steps_parent_id_idx" ON "lookbooks_blocks_methodology_timeline_steps" USING btree ("_parent_id");
  CREATE INDEX "lookbooks_blocks_methodology_timeline_steps_locale_idx" ON "lookbooks_blocks_methodology_timeline_steps" USING btree ("_locale");
  CREATE INDEX "lookbooks_blocks_methodology_timeline_steps_media_idx" ON "lookbooks_blocks_methodology_timeline_steps" USING btree ("media_id");
  CREATE INDEX "lookbooks_blocks_methodology_timeline_order_idx" ON "lookbooks_blocks_methodology_timeline" USING btree ("_order");
  CREATE INDEX "lookbooks_blocks_methodology_timeline_parent_id_idx" ON "lookbooks_blocks_methodology_timeline" USING btree ("_parent_id");
  CREATE INDEX "lookbooks_blocks_methodology_timeline_path_idx" ON "lookbooks_blocks_methodology_timeline" USING btree ("_path");
  CREATE INDEX "lookbooks_blocks_methodology_timeline_locale_idx" ON "lookbooks_blocks_methodology_timeline" USING btree ("_locale");
  CREATE INDEX "lookbooks_blocks_rich_text_order_idx" ON "lookbooks_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "lookbooks_blocks_rich_text_parent_id_idx" ON "lookbooks_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "lookbooks_blocks_rich_text_path_idx" ON "lookbooks_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "lookbooks_blocks_rich_text_locale_idx" ON "lookbooks_blocks_rich_text" USING btree ("_locale");
  CREATE INDEX "posts_tags_order_idx" ON "posts_tags" USING btree ("_order");
  CREATE INDEX "posts_tags_parent_id_idx" ON "posts_tags" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_editorial_hero_order_idx" ON "posts_blocks_editorial_hero" USING btree ("_order");
  CREATE INDEX "posts_blocks_editorial_hero_parent_id_idx" ON "posts_blocks_editorial_hero" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_editorial_hero_path_idx" ON "posts_blocks_editorial_hero" USING btree ("_path");
  CREATE INDEX "posts_blocks_editorial_hero_locale_idx" ON "posts_blocks_editorial_hero" USING btree ("_locale");
  CREATE INDEX "posts_blocks_editorial_hero_media_idx" ON "posts_blocks_editorial_hero" USING btree ("media_id");
  CREATE INDEX "posts_blocks_editorial_hero_overlay_media_idx" ON "posts_blocks_editorial_hero" USING btree ("overlay_media_id");
  CREATE INDEX "posts_blocks_media_grid_items_order_idx" ON "posts_blocks_media_grid_items" USING btree ("_order");
  CREATE INDEX "posts_blocks_media_grid_items_parent_id_idx" ON "posts_blocks_media_grid_items" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_media_grid_items_locale_idx" ON "posts_blocks_media_grid_items" USING btree ("_locale");
  CREATE INDEX "posts_blocks_media_grid_items_media_idx" ON "posts_blocks_media_grid_items" USING btree ("media_id");
  CREATE INDEX "posts_blocks_media_grid_order_idx" ON "posts_blocks_media_grid" USING btree ("_order");
  CREATE INDEX "posts_blocks_media_grid_parent_id_idx" ON "posts_blocks_media_grid" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_media_grid_path_idx" ON "posts_blocks_media_grid" USING btree ("_path");
  CREATE INDEX "posts_blocks_media_grid_locale_idx" ON "posts_blocks_media_grid" USING btree ("_locale");
  CREATE INDEX "posts_blocks_comparison_slider_order_idx" ON "posts_blocks_comparison_slider" USING btree ("_order");
  CREATE INDEX "posts_blocks_comparison_slider_parent_id_idx" ON "posts_blocks_comparison_slider" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_comparison_slider_path_idx" ON "posts_blocks_comparison_slider" USING btree ("_path");
  CREATE INDEX "posts_blocks_comparison_slider_locale_idx" ON "posts_blocks_comparison_slider" USING btree ("_locale");
  CREATE INDEX "posts_blocks_comparison_slider_before_image_idx" ON "posts_blocks_comparison_slider" USING btree ("before_image_id");
  CREATE INDEX "posts_blocks_comparison_slider_after_image_idx" ON "posts_blocks_comparison_slider" USING btree ("after_image_id");
  CREATE INDEX "posts_blocks_horizontal_marquee_items_order_idx" ON "posts_blocks_horizontal_marquee_items" USING btree ("_order");
  CREATE INDEX "posts_blocks_horizontal_marquee_items_parent_id_idx" ON "posts_blocks_horizontal_marquee_items" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_horizontal_marquee_items_locale_idx" ON "posts_blocks_horizontal_marquee_items" USING btree ("_locale");
  CREATE INDEX "posts_blocks_horizontal_marquee_order_idx" ON "posts_blocks_horizontal_marquee" USING btree ("_order");
  CREATE INDEX "posts_blocks_horizontal_marquee_parent_id_idx" ON "posts_blocks_horizontal_marquee" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_horizontal_marquee_path_idx" ON "posts_blocks_horizontal_marquee" USING btree ("_path");
  CREATE INDEX "posts_blocks_horizontal_marquee_locale_idx" ON "posts_blocks_horizontal_marquee" USING btree ("_locale");
  CREATE INDEX "posts_blocks_liquid_cinematic_hero_order_idx" ON "posts_blocks_liquid_cinematic_hero" USING btree ("_order");
  CREATE INDEX "posts_blocks_liquid_cinematic_hero_parent_id_idx" ON "posts_blocks_liquid_cinematic_hero" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_liquid_cinematic_hero_path_idx" ON "posts_blocks_liquid_cinematic_hero" USING btree ("_path");
  CREATE INDEX "posts_blocks_liquid_cinematic_hero_locale_idx" ON "posts_blocks_liquid_cinematic_hero" USING btree ("_locale");
  CREATE INDEX "posts_blocks_liquid_cinematic_hero_background_image_idx" ON "posts_blocks_liquid_cinematic_hero" USING btree ("background_image_id");
  CREATE INDEX "posts_blocks_liquid_cinematic_hero_foreground_image_idx" ON "posts_blocks_liquid_cinematic_hero" USING btree ("foreground_image_id");
  CREATE INDEX "posts_blocks_methodology_timeline_steps_order_idx" ON "posts_blocks_methodology_timeline_steps" USING btree ("_order");
  CREATE INDEX "posts_blocks_methodology_timeline_steps_parent_id_idx" ON "posts_blocks_methodology_timeline_steps" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_methodology_timeline_steps_locale_idx" ON "posts_blocks_methodology_timeline_steps" USING btree ("_locale");
  CREATE INDEX "posts_blocks_methodology_timeline_steps_media_idx" ON "posts_blocks_methodology_timeline_steps" USING btree ("media_id");
  CREATE INDEX "posts_blocks_methodology_timeline_order_idx" ON "posts_blocks_methodology_timeline" USING btree ("_order");
  CREATE INDEX "posts_blocks_methodology_timeline_parent_id_idx" ON "posts_blocks_methodology_timeline" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_methodology_timeline_path_idx" ON "posts_blocks_methodology_timeline" USING btree ("_path");
  CREATE INDEX "posts_blocks_methodology_timeline_locale_idx" ON "posts_blocks_methodology_timeline" USING btree ("_locale");
  CREATE INDEX "posts_blocks_rich_text_order_idx" ON "posts_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "posts_blocks_rich_text_parent_id_idx" ON "posts_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_rich_text_path_idx" ON "posts_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "posts_blocks_rich_text_locale_idx" ON "posts_blocks_rich_text" USING btree ("_locale");
  CREATE INDEX "posts_status_idx" ON "posts" USING btree ("status");
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE INDEX "posts_seo_seo_og_image_idx" ON "posts" USING btree ("seo_og_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts_locales" USING btree ("slug","_locale");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");`);
}

export async function down({
  db,
  payload: _payload,
  req: _req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products_blocks_editorial_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_blocks_media_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_blocks_media_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_blocks_comparison_slider" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_blocks_horizontal_marquee_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_blocks_horizontal_marquee" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_blocks_liquid_cinematic_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_blocks_methodology_timeline_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_blocks_methodology_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lookbooks_blocks_editorial_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lookbooks_blocks_media_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lookbooks_blocks_media_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lookbooks_blocks_comparison_slider" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lookbooks_blocks_horizontal_marquee_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lookbooks_blocks_horizontal_marquee" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lookbooks_blocks_liquid_cinematic_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lookbooks_blocks_methodology_timeline_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lookbooks_blocks_methodology_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lookbooks_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_editorial_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_media_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_media_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_comparison_slider" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_horizontal_marquee_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_horizontal_marquee" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_liquid_cinematic_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_methodology_timeline_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_methodology_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "products_blocks_editorial_hero" CASCADE;
  DROP TABLE "products_blocks_media_grid_items" CASCADE;
  DROP TABLE "products_blocks_media_grid" CASCADE;
  DROP TABLE "products_blocks_comparison_slider" CASCADE;
  DROP TABLE "products_blocks_horizontal_marquee_items" CASCADE;
  DROP TABLE "products_blocks_horizontal_marquee" CASCADE;
  DROP TABLE "products_blocks_liquid_cinematic_hero" CASCADE;
  DROP TABLE "products_blocks_methodology_timeline_steps" CASCADE;
  DROP TABLE "products_blocks_methodology_timeline" CASCADE;
  DROP TABLE "products_blocks_rich_text" CASCADE;
  DROP TABLE "lookbooks_blocks_editorial_hero" CASCADE;
  DROP TABLE "lookbooks_blocks_media_grid_items" CASCADE;
  DROP TABLE "lookbooks_blocks_media_grid" CASCADE;
  DROP TABLE "lookbooks_blocks_comparison_slider" CASCADE;
  DROP TABLE "lookbooks_blocks_horizontal_marquee_items" CASCADE;
  DROP TABLE "lookbooks_blocks_horizontal_marquee" CASCADE;
  DROP TABLE "lookbooks_blocks_liquid_cinematic_hero" CASCADE;
  DROP TABLE "lookbooks_blocks_methodology_timeline_steps" CASCADE;
  DROP TABLE "lookbooks_blocks_methodology_timeline" CASCADE;
  DROP TABLE "lookbooks_blocks_rich_text" CASCADE;
  DROP TABLE "posts_tags" CASCADE;
  DROP TABLE "posts_blocks_editorial_hero" CASCADE;
  DROP TABLE "posts_blocks_media_grid_items" CASCADE;
  DROP TABLE "posts_blocks_media_grid" CASCADE;
  DROP TABLE "posts_blocks_comparison_slider" CASCADE;
  DROP TABLE "posts_blocks_horizontal_marquee_items" CASCADE;
  DROP TABLE "posts_blocks_horizontal_marquee" CASCADE;
  DROP TABLE "posts_blocks_liquid_cinematic_hero" CASCADE;
  DROP TABLE "posts_blocks_methodology_timeline_steps" CASCADE;
  DROP TABLE "posts_blocks_methodology_timeline" CASCADE;
  DROP TABLE "posts_blocks_rich_text" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_posts_fk";
  
  ALTER TABLE "services" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE "public"."enum_services_category";
  CREATE TYPE "public"."enum_services_category" AS ENUM('research', 'realisation', 'transformation', 'styling', 'atelier', 'consulting', 'shopping', 'events');
  ALTER TABLE "services" ALTER COLUMN "category" SET DATA TYPE "public"."enum_services_category" USING "category"::"public"."enum_services_category";
  DROP INDEX "payload_locked_documents_rels_posts_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "posts_id";
  DROP TYPE "public"."enum_products_blocks_editorial_hero_layout";
  DROP TYPE "public"."enum_products_blocks_editorial_hero_theme";
  DROP TYPE "public"."enum_products_blocks_media_grid_items_aspect_ratio";
  DROP TYPE "public"."enum_products_blocks_media_grid_columns";
  DROP TYPE "public"."enum_products_blocks_horizontal_marquee_speed";
  DROP TYPE "public"."enum_products_blocks_horizontal_marquee_direction";
  DROP TYPE "public"."enum_products_blocks_liquid_cinematic_hero_reveal_intensity";
  DROP TYPE "public"."enum_products_blocks_methodology_timeline_steps_stage";
  DROP TYPE "public"."enum_lookbooks_blocks_editorial_hero_layout";
  DROP TYPE "public"."enum_lookbooks_blocks_editorial_hero_theme";
  DROP TYPE "public"."enum_lookbooks_blocks_media_grid_items_aspect_ratio";
  DROP TYPE "public"."enum_lookbooks_blocks_media_grid_columns";
  DROP TYPE "public"."enum_lookbooks_blocks_horizontal_marquee_speed";
  DROP TYPE "public"."enum_lookbooks_blocks_horizontal_marquee_direction";
  DROP TYPE "public"."enum_lookbooks_blocks_liquid_cinematic_hero_reveal_intensity";
  DROP TYPE "public"."enum_lookbooks_blocks_methodology_timeline_steps_stage";
  DROP TYPE "public"."enum_posts_blocks_editorial_hero_layout";
  DROP TYPE "public"."enum_posts_blocks_editorial_hero_theme";
  DROP TYPE "public"."enum_posts_blocks_media_grid_items_aspect_ratio";
  DROP TYPE "public"."enum_posts_blocks_media_grid_columns";
  DROP TYPE "public"."enum_posts_blocks_horizontal_marquee_speed";
  DROP TYPE "public"."enum_posts_blocks_horizontal_marquee_direction";
  DROP TYPE "public"."enum_posts_blocks_liquid_cinematic_hero_reveal_intensity";
  DROP TYPE "public"."enum_posts_blocks_methodology_timeline_steps_stage";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum_posts_category";`);
}
