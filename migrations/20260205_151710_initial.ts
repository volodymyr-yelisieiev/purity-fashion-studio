import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload: _payload,
  req: _req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'ru', 'uk');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'user');
  CREATE TYPE "public"."enum_services_blocks_editorial_hero_layout" AS ENUM('full', 'split', 'overlap');
  CREATE TYPE "public"."enum_services_blocks_editorial_hero_theme" AS ENUM('light', 'dark', 'parchment');
  CREATE TYPE "public"."enum_services_blocks_media_grid_items_aspect_ratio" AS ENUM('portrait', 'square', 'landscape');
  CREATE TYPE "public"."enum_services_blocks_media_grid_columns" AS ENUM('2', '3', '4', 'masonry');
  CREATE TYPE "public"."enum_services_blocks_horizontal_marquee_speed" AS ENUM('slow', 'normal', 'fast');
  CREATE TYPE "public"."enum_services_blocks_horizontal_marquee_direction" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_services_category" AS ENUM('research', 'realisation', 'transformation', 'styling', 'atelier', 'consulting', 'shopping', 'events');
  CREATE TYPE "public"."enum_services_format" AS ENUM('online', 'studio', 'onsite', 'hybrid');
  CREATE TYPE "public"."enum_products_details_sizes" AS ENUM('xs', 's', 'm', 'l', 'xl', 'one-size');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published', 'out-of-stock', 'archived');
  CREATE TYPE "public"."enum_products_category" AS ENUM('dresses', 'tops', 'bottoms', 'outerwear', 'accessories', 'bags', 'jewelry');
  CREATE TYPE "public"."enum_portfolio_blocks_editorial_hero_layout" AS ENUM('full', 'split', 'overlap');
  CREATE TYPE "public"."enum_portfolio_blocks_editorial_hero_theme" AS ENUM('light', 'dark', 'parchment');
  CREATE TYPE "public"."enum_portfolio_blocks_media_grid_items_aspect_ratio" AS ENUM('portrait', 'square', 'landscape');
  CREATE TYPE "public"."enum_portfolio_blocks_media_grid_columns" AS ENUM('2', '3', '4', 'masonry');
  CREATE TYPE "public"."enum_portfolio_blocks_horizontal_marquee_speed" AS ENUM('slow', 'normal', 'fast');
  CREATE TYPE "public"."enum_portfolio_blocks_horizontal_marquee_direction" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_portfolio_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_portfolio_category" AS ENUM('styling', 'wardrobe-audit', 'event', 'shopping', 'editorial');
  CREATE TYPE "public"."enum_lookbooks_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_lookbooks_season" AS ENUM('spring', 'summer', 'autumn', 'winter', 'all-season');
  CREATE TYPE "public"."enum_orders_items_type" AS ENUM('service', 'product');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('pending', 'processing', 'paid', 'failed', 'cancelled', 'completed', 'refunded');
  CREATE TYPE "public"."enum_orders_currency" AS ENUM('UAH', 'EUR');
  CREATE TYPE "public"."enum_orders_payment_provider" AS ENUM('stripe', 'liqpay');
  CREATE TYPE "public"."enum_courses_blocks_editorial_hero_layout" AS ENUM('full', 'split', 'overlap');
  CREATE TYPE "public"."enum_courses_blocks_editorial_hero_theme" AS ENUM('light', 'dark', 'parchment');
  CREATE TYPE "public"."enum_courses_blocks_media_grid_items_aspect_ratio" AS ENUM('portrait', 'square', 'landscape');
  CREATE TYPE "public"."enum_courses_blocks_media_grid_columns" AS ENUM('2', '3', '4', 'masonry');
  CREATE TYPE "public"."enum_courses_blocks_horizontal_marquee_speed" AS ENUM('slow', 'normal', 'fast');
  CREATE TYPE "public"."enum_courses_blocks_horizontal_marquee_direction" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_courses_status" AS ENUM('draft', 'published', 'coming-soon', 'archived');
  CREATE TYPE "public"."enum_courses_category" AS ENUM('personal-styling', 'color-analysis', 'wardrobe-audit', 'shopping', 'professional', 'masterclass');
  CREATE TYPE "public"."enum_courses_level" AS ENUM('beginner', 'intermediate', 'advanced', 'all');
  CREATE TYPE "public"."enum_courses_duration_unit" AS ENUM('hours', 'days', 'weeks', 'months');
  CREATE TYPE "public"."enum_courses_format" AS ENUM('online', 'in-person', 'hybrid');
  CREATE TYPE "public"."enum_site_settings_currency_default" AS ENUM('UAH', 'EUR', 'USD');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'user' NOT NULL,
  	"first_name" varchar,
  	"last_name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "services_blocks_editorial_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_services_blocks_editorial_hero_layout" DEFAULT 'full',
  	"media_id" integer NOT NULL,
  	"overlay_media_id" integer,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"theme" "enum_services_blocks_editorial_hero_theme" DEFAULT 'light',
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_media_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"caption" varchar,
  	"aspect_ratio" "enum_services_blocks_media_grid_items_aspect_ratio" DEFAULT 'portrait'
  );
  
  CREATE TABLE "services_blocks_media_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum_services_blocks_media_grid_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_comparison_slider" (
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
  
  CREATE TABLE "services_blocks_horizontal_marquee_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "services_blocks_horizontal_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"speed" "enum_services_blocks_horizontal_marquee_speed" DEFAULT 'slow',
  	"direction" "enum_services_blocks_horizontal_marquee_direction" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_services_status" DEFAULT 'draft' NOT NULL,
  	"category" "enum_services_category" NOT NULL,
  	"format" "enum_services_format",
  	"pricing_uah" numeric,
  	"pricing_eur" numeric,
  	"featured" boolean DEFAULT false,
  	"bookable" boolean DEFAULT true,
  	"payment_enabled" boolean DEFAULT false,
  	"hero_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services_locales" (
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar,
  	"duration" varchar,
  	"pricing_price_note" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "products_images_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_details_sizes" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_products_details_sizes",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_details_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hex" varchar
  );
  
  CREATE TABLE "products_details_colors_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_products_status" DEFAULT 'draft' NOT NULL,
  	"featured" boolean DEFAULT false,
  	"pricing_uah" numeric NOT NULL,
  	"pricing_eur" numeric,
  	"pricing_sale_price" numeric,
  	"sku" varchar,
  	"category" "enum_products_category" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_locales" (
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"pricing_price_note" varchar,
  	"excerpt" varchar,
  	"description" varchar,
  	"details_material" varchar,
  	"details_care" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "portfolio_blocks_editorial_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_portfolio_blocks_editorial_hero_layout" DEFAULT 'full',
  	"media_id" integer NOT NULL,
  	"overlay_media_id" integer,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"theme" "enum_portfolio_blocks_editorial_hero_theme" DEFAULT 'light',
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio_blocks_media_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"caption" varchar,
  	"aspect_ratio" "enum_portfolio_blocks_media_grid_items_aspect_ratio" DEFAULT 'portrait'
  );
  
  CREATE TABLE "portfolio_blocks_media_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum_portfolio_blocks_media_grid_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio_blocks_comparison_slider" (
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
  
  CREATE TABLE "portfolio_blocks_horizontal_marquee_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "portfolio_blocks_horizontal_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"speed" "enum_portfolio_blocks_horizontal_marquee_speed" DEFAULT 'slow',
  	"direction" "enum_portfolio_blocks_horizontal_marquee_direction" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_portfolio_status" DEFAULT 'draft' NOT NULL,
  	"category" "enum_portfolio_category",
  	"main_image_id" integer NOT NULL,
  	"testimonial_client_name" varchar,
  	"testimonial_rating" numeric,
  	"featured" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"pricing_uah" numeric,
  	"pricing_eur" numeric,
  	"bookable" boolean DEFAULT true,
  	"payment_enabled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "portfolio_locales" (
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar,
  	"testimonial_quote" varchar,
  	"pricing_price_note" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "portfolio_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "lookbooks_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "lookbooks_images_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "lookbooks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_lookbooks_status" DEFAULT 'draft' NOT NULL,
  	"season" "enum_lookbooks_season",
  	"cover_image_id" integer,
  	"featured" boolean DEFAULT false,
  	"release_date" timestamp(3) with time zone,
  	"pricing_uah" numeric,
  	"pricing_eur" numeric,
  	"bookable" boolean DEFAULT true,
  	"payment_enabled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lookbooks_locales" (
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"materials" varchar,
  	"care_instructions" varchar,
  	"sizes" varchar,
  	"pricing_price_note" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "lookbooks_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_orders_items_type" NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"price" numeric NOT NULL,
  	"quantity" numeric NOT NULL,
  	"booking_date" varchar,
  	"booking_time" varchar
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_number" varchar NOT NULL,
  	"status" "enum_orders_status" DEFAULT 'pending' NOT NULL,
  	"subtotal" numeric NOT NULL,
  	"total" numeric NOT NULL,
  	"currency" "enum_orders_currency" DEFAULT 'UAH' NOT NULL,
  	"customer_first_name" varchar NOT NULL,
  	"customer_last_name" varchar NOT NULL,
  	"customer_email" varchar NOT NULL,
  	"customer_phone" varchar NOT NULL,
  	"customer_address" varchar,
  	"customer_city" varchar,
  	"customer_country" varchar DEFAULT 'Ukraine',
  	"customer_postal_code" varchar,
  	"notes" varchar,
  	"payment_provider" "enum_orders_payment_provider" NOT NULL,
  	"payment_intent_id" varchar,
  	"payment_status" varchar,
  	"paid_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "courses_blocks_editorial_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_courses_blocks_editorial_hero_layout" DEFAULT 'full',
  	"media_id" integer NOT NULL,
  	"overlay_media_id" integer,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"theme" "enum_courses_blocks_editorial_hero_theme" DEFAULT 'light',
  	"block_name" varchar
  );
  
  CREATE TABLE "courses_blocks_media_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"caption" varchar,
  	"aspect_ratio" "enum_courses_blocks_media_grid_items_aspect_ratio" DEFAULT 'portrait'
  );
  
  CREATE TABLE "courses_blocks_media_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum_courses_blocks_media_grid_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "courses_blocks_comparison_slider" (
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
  
  CREATE TABLE "courses_blocks_horizontal_marquee_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "courses_blocks_horizontal_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"speed" "enum_courses_blocks_horizontal_marquee_speed" DEFAULT 'slow',
  	"direction" "enum_courses_blocks_horizontal_marquee_direction" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "courses_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "courses_upcoming_dates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone,
  	"spots_available" numeric
  );
  
  CREATE TABLE "courses_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "courses_faq_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "courses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_courses_status" DEFAULT 'draft' NOT NULL,
  	"category" "enum_courses_category" NOT NULL,
  	"level" "enum_courses_level" DEFAULT 'beginner' NOT NULL,
  	"duration_value" numeric NOT NULL,
  	"duration_unit" "enum_courses_duration_unit" DEFAULT 'hours' NOT NULL,
  	"format" "enum_courses_format" DEFAULT 'online' NOT NULL,
  	"pricing_uah" numeric,
  	"pricing_eur" numeric,
  	"pricing_sale_price" numeric,
  	"instructor_name" varchar NOT NULL,
  	"instructor_photo_id" integer,
  	"featured" boolean DEFAULT false,
  	"bookable" boolean DEFAULT true,
  	"payment_enabled" boolean DEFAULT false,
  	"featured_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "courses_locales" (
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar,
  	"pricing_price_note" varchar,
  	"instructor_title" varchar,
  	"instructor_bio" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"services_id" integer,
  	"products_id" integer,
  	"portfolio_id" integer,
  	"lookbooks_id" integer,
  	"orders_id" integer,
  	"courses_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'PURITY Fashion Studio' NOT NULL,
  	"logo_id" integer,
  	"favicon_id" integer,
  	"contact_email" varchar NOT NULL,
  	"contact_phone" varchar,
  	"contact_whatsapp" varchar,
  	"contact_telegram" varchar,
  	"social_instagram" varchar,
  	"social_facebook" varchar,
  	"social_linkedin" varchar,
  	"social_pinterest" varchar,
  	"social_youtube" varchar,
  	"currency_default" "enum_site_settings_currency_default" DEFAULT 'UAH',
  	"currency_exchange_rate_eur" numeric,
  	"currency_exchange_rate_usd" numeric,
  	"payments_enable_liq_pay" boolean DEFAULT true,
  	"payments_enable_stripe" boolean DEFAULT false,
  	"payments_enable_bank_transfer" boolean DEFAULT true,
  	"booking_enabled" boolean DEFAULT true,
  	"booking_lead_time" numeric DEFAULT 24,
  	"booking_max_advance_booking" numeric DEFAULT 30,
  	"seo_og_image_id" integer,
  	"seo_google_site_verification" varchar,
  	"analytics_google_analytics_id" varchar,
  	"analytics_facebook_pixel_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"tagline" varchar,
  	"description" varchar,
  	"contact_address" varchar,
  	"contact_working_hours" varchar,
  	"booking_confirmation_email" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_editorial_hero" ADD CONSTRAINT "services_blocks_editorial_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_editorial_hero" ADD CONSTRAINT "services_blocks_editorial_hero_overlay_media_id_media_id_fk" FOREIGN KEY ("overlay_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_editorial_hero" ADD CONSTRAINT "services_blocks_editorial_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_media_grid_items" ADD CONSTRAINT "services_blocks_media_grid_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_media_grid_items" ADD CONSTRAINT "services_blocks_media_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_media_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_media_grid" ADD CONSTRAINT "services_blocks_media_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_comparison_slider" ADD CONSTRAINT "services_blocks_comparison_slider_before_image_id_media_id_fk" FOREIGN KEY ("before_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_comparison_slider" ADD CONSTRAINT "services_blocks_comparison_slider_after_image_id_media_id_fk" FOREIGN KEY ("after_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_comparison_slider" ADD CONSTRAINT "services_blocks_comparison_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_horizontal_marquee_items" ADD CONSTRAINT "services_blocks_horizontal_marquee_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_horizontal_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_horizontal_marquee" ADD CONSTRAINT "services_blocks_horizontal_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_rich_text" ADD CONSTRAINT "services_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_images" ADD CONSTRAINT "products_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_images" ADD CONSTRAINT "products_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_images_locales" ADD CONSTRAINT "products_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_details_sizes" ADD CONSTRAINT "products_details_sizes_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_details_colors" ADD CONSTRAINT "products_details_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_details_colors_locales" ADD CONSTRAINT "products_details_colors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_details_colors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_blocks_editorial_hero" ADD CONSTRAINT "portfolio_blocks_editorial_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_blocks_editorial_hero" ADD CONSTRAINT "portfolio_blocks_editorial_hero_overlay_media_id_media_id_fk" FOREIGN KEY ("overlay_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_blocks_editorial_hero" ADD CONSTRAINT "portfolio_blocks_editorial_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_blocks_media_grid_items" ADD CONSTRAINT "portfolio_blocks_media_grid_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_blocks_media_grid_items" ADD CONSTRAINT "portfolio_blocks_media_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_blocks_media_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_blocks_media_grid" ADD CONSTRAINT "portfolio_blocks_media_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_blocks_comparison_slider" ADD CONSTRAINT "portfolio_blocks_comparison_slider_before_image_id_media_id_fk" FOREIGN KEY ("before_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_blocks_comparison_slider" ADD CONSTRAINT "portfolio_blocks_comparison_slider_after_image_id_media_id_fk" FOREIGN KEY ("after_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_blocks_comparison_slider" ADD CONSTRAINT "portfolio_blocks_comparison_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_blocks_horizontal_marquee_items" ADD CONSTRAINT "portfolio_blocks_horizontal_marquee_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_blocks_horizontal_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_blocks_horizontal_marquee" ADD CONSTRAINT "portfolio_blocks_horizontal_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_blocks_rich_text" ADD CONSTRAINT "portfolio_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio" ADD CONSTRAINT "portfolio_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_locales" ADD CONSTRAINT "portfolio_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_locales" ADD CONSTRAINT "portfolio_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_rels" ADD CONSTRAINT "portfolio_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_rels" ADD CONSTRAINT "portfolio_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lookbooks_images" ADD CONSTRAINT "lookbooks_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lookbooks_images" ADD CONSTRAINT "lookbooks_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lookbooks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lookbooks_images_locales" ADD CONSTRAINT "lookbooks_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lookbooks_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lookbooks" ADD CONSTRAINT "lookbooks_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lookbooks_locales" ADD CONSTRAINT "lookbooks_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lookbooks_locales" ADD CONSTRAINT "lookbooks_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lookbooks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lookbooks_rels" ADD CONSTRAINT "lookbooks_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lookbooks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lookbooks_rels" ADD CONSTRAINT "lookbooks_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_blocks_editorial_hero" ADD CONSTRAINT "courses_blocks_editorial_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_blocks_editorial_hero" ADD CONSTRAINT "courses_blocks_editorial_hero_overlay_media_id_media_id_fk" FOREIGN KEY ("overlay_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_blocks_editorial_hero" ADD CONSTRAINT "courses_blocks_editorial_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_blocks_media_grid_items" ADD CONSTRAINT "courses_blocks_media_grid_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_blocks_media_grid_items" ADD CONSTRAINT "courses_blocks_media_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses_blocks_media_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_blocks_media_grid" ADD CONSTRAINT "courses_blocks_media_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_blocks_comparison_slider" ADD CONSTRAINT "courses_blocks_comparison_slider_before_image_id_media_id_fk" FOREIGN KEY ("before_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_blocks_comparison_slider" ADD CONSTRAINT "courses_blocks_comparison_slider_after_image_id_media_id_fk" FOREIGN KEY ("after_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_blocks_comparison_slider" ADD CONSTRAINT "courses_blocks_comparison_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_blocks_horizontal_marquee_items" ADD CONSTRAINT "courses_blocks_horizontal_marquee_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses_blocks_horizontal_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_blocks_horizontal_marquee" ADD CONSTRAINT "courses_blocks_horizontal_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_blocks_rich_text" ADD CONSTRAINT "courses_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_upcoming_dates" ADD CONSTRAINT "courses_upcoming_dates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_faq" ADD CONSTRAINT "courses_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_faq_locales" ADD CONSTRAINT "courses_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_instructor_photo_id_media_id_fk" FOREIGN KEY ("instructor_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_locales" ADD CONSTRAINT "courses_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_locales" ADD CONSTRAINT "courses_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lookbooks_fk" FOREIGN KEY ("lookbooks_id") REFERENCES "public"."lookbooks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_blocks_editorial_hero_order_idx" ON "services_blocks_editorial_hero" USING btree ("_order");
  CREATE INDEX "services_blocks_editorial_hero_parent_id_idx" ON "services_blocks_editorial_hero" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_editorial_hero_path_idx" ON "services_blocks_editorial_hero" USING btree ("_path");
  CREATE INDEX "services_blocks_editorial_hero_locale_idx" ON "services_blocks_editorial_hero" USING btree ("_locale");
  CREATE INDEX "services_blocks_editorial_hero_media_idx" ON "services_blocks_editorial_hero" USING btree ("media_id");
  CREATE INDEX "services_blocks_editorial_hero_overlay_media_idx" ON "services_blocks_editorial_hero" USING btree ("overlay_media_id");
  CREATE INDEX "services_blocks_media_grid_items_order_idx" ON "services_blocks_media_grid_items" USING btree ("_order");
  CREATE INDEX "services_blocks_media_grid_items_parent_id_idx" ON "services_blocks_media_grid_items" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_media_grid_items_locale_idx" ON "services_blocks_media_grid_items" USING btree ("_locale");
  CREATE INDEX "services_blocks_media_grid_items_media_idx" ON "services_blocks_media_grid_items" USING btree ("media_id");
  CREATE INDEX "services_blocks_media_grid_order_idx" ON "services_blocks_media_grid" USING btree ("_order");
  CREATE INDEX "services_blocks_media_grid_parent_id_idx" ON "services_blocks_media_grid" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_media_grid_path_idx" ON "services_blocks_media_grid" USING btree ("_path");
  CREATE INDEX "services_blocks_media_grid_locale_idx" ON "services_blocks_media_grid" USING btree ("_locale");
  CREATE INDEX "services_blocks_comparison_slider_order_idx" ON "services_blocks_comparison_slider" USING btree ("_order");
  CREATE INDEX "services_blocks_comparison_slider_parent_id_idx" ON "services_blocks_comparison_slider" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_comparison_slider_path_idx" ON "services_blocks_comparison_slider" USING btree ("_path");
  CREATE INDEX "services_blocks_comparison_slider_locale_idx" ON "services_blocks_comparison_slider" USING btree ("_locale");
  CREATE INDEX "services_blocks_comparison_slider_before_image_idx" ON "services_blocks_comparison_slider" USING btree ("before_image_id");
  CREATE INDEX "services_blocks_comparison_slider_after_image_idx" ON "services_blocks_comparison_slider" USING btree ("after_image_id");
  CREATE INDEX "services_blocks_horizontal_marquee_items_order_idx" ON "services_blocks_horizontal_marquee_items" USING btree ("_order");
  CREATE INDEX "services_blocks_horizontal_marquee_items_parent_id_idx" ON "services_blocks_horizontal_marquee_items" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_horizontal_marquee_items_locale_idx" ON "services_blocks_horizontal_marquee_items" USING btree ("_locale");
  CREATE INDEX "services_blocks_horizontal_marquee_order_idx" ON "services_blocks_horizontal_marquee" USING btree ("_order");
  CREATE INDEX "services_blocks_horizontal_marquee_parent_id_idx" ON "services_blocks_horizontal_marquee" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_horizontal_marquee_path_idx" ON "services_blocks_horizontal_marquee" USING btree ("_path");
  CREATE INDEX "services_blocks_horizontal_marquee_locale_idx" ON "services_blocks_horizontal_marquee" USING btree ("_locale");
  CREATE INDEX "services_blocks_rich_text_order_idx" ON "services_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "services_blocks_rich_text_parent_id_idx" ON "services_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_rich_text_path_idx" ON "services_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "services_blocks_rich_text_locale_idx" ON "services_blocks_rich_text" USING btree ("_locale");
  CREATE INDEX "services_status_idx" ON "services" USING btree ("status");
  CREATE INDEX "services_category_idx" ON "services" USING btree ("category");
  CREATE INDEX "services_featured_idx" ON "services" USING btree ("featured");
  CREATE INDEX "services_hero_image_idx" ON "services" USING btree ("hero_image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services_locales" USING btree ("slug","_locale");
  CREATE INDEX "services_meta_meta_image_idx" ON "services_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "services_locales_locale_parent_id_unique" ON "services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_images_order_idx" ON "products_images" USING btree ("_order");
  CREATE INDEX "products_images_parent_id_idx" ON "products_images" USING btree ("_parent_id");
  CREATE INDEX "products_images_image_idx" ON "products_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "products_images_locales_locale_parent_id_unique" ON "products_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_details_sizes_order_idx" ON "products_details_sizes" USING btree ("order");
  CREATE INDEX "products_details_sizes_parent_idx" ON "products_details_sizes" USING btree ("parent_id");
  CREATE INDEX "products_details_colors_order_idx" ON "products_details_colors" USING btree ("_order");
  CREATE INDEX "products_details_colors_parent_id_idx" ON "products_details_colors" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_details_colors_locales_locale_parent_id_unique" ON "products_details_colors_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_status_idx" ON "products" USING btree ("status");
  CREATE INDEX "products_featured_idx" ON "products" USING btree ("featured");
  CREATE UNIQUE INDEX "products_sku_idx" ON "products" USING btree ("sku");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products_locales" USING btree ("slug","_locale");
  CREATE INDEX "products_meta_meta_image_idx" ON "products_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "portfolio_blocks_editorial_hero_order_idx" ON "portfolio_blocks_editorial_hero" USING btree ("_order");
  CREATE INDEX "portfolio_blocks_editorial_hero_parent_id_idx" ON "portfolio_blocks_editorial_hero" USING btree ("_parent_id");
  CREATE INDEX "portfolio_blocks_editorial_hero_path_idx" ON "portfolio_blocks_editorial_hero" USING btree ("_path");
  CREATE INDEX "portfolio_blocks_editorial_hero_locale_idx" ON "portfolio_blocks_editorial_hero" USING btree ("_locale");
  CREATE INDEX "portfolio_blocks_editorial_hero_media_idx" ON "portfolio_blocks_editorial_hero" USING btree ("media_id");
  CREATE INDEX "portfolio_blocks_editorial_hero_overlay_media_idx" ON "portfolio_blocks_editorial_hero" USING btree ("overlay_media_id");
  CREATE INDEX "portfolio_blocks_media_grid_items_order_idx" ON "portfolio_blocks_media_grid_items" USING btree ("_order");
  CREATE INDEX "portfolio_blocks_media_grid_items_parent_id_idx" ON "portfolio_blocks_media_grid_items" USING btree ("_parent_id");
  CREATE INDEX "portfolio_blocks_media_grid_items_locale_idx" ON "portfolio_blocks_media_grid_items" USING btree ("_locale");
  CREATE INDEX "portfolio_blocks_media_grid_items_media_idx" ON "portfolio_blocks_media_grid_items" USING btree ("media_id");
  CREATE INDEX "portfolio_blocks_media_grid_order_idx" ON "portfolio_blocks_media_grid" USING btree ("_order");
  CREATE INDEX "portfolio_blocks_media_grid_parent_id_idx" ON "portfolio_blocks_media_grid" USING btree ("_parent_id");
  CREATE INDEX "portfolio_blocks_media_grid_path_idx" ON "portfolio_blocks_media_grid" USING btree ("_path");
  CREATE INDEX "portfolio_blocks_media_grid_locale_idx" ON "portfolio_blocks_media_grid" USING btree ("_locale");
  CREATE INDEX "portfolio_blocks_comparison_slider_order_idx" ON "portfolio_blocks_comparison_slider" USING btree ("_order");
  CREATE INDEX "portfolio_blocks_comparison_slider_parent_id_idx" ON "portfolio_blocks_comparison_slider" USING btree ("_parent_id");
  CREATE INDEX "portfolio_blocks_comparison_slider_path_idx" ON "portfolio_blocks_comparison_slider" USING btree ("_path");
  CREATE INDEX "portfolio_blocks_comparison_slider_locale_idx" ON "portfolio_blocks_comparison_slider" USING btree ("_locale");
  CREATE INDEX "portfolio_blocks_comparison_slider_before_image_idx" ON "portfolio_blocks_comparison_slider" USING btree ("before_image_id");
  CREATE INDEX "portfolio_blocks_comparison_slider_after_image_idx" ON "portfolio_blocks_comparison_slider" USING btree ("after_image_id");
  CREATE INDEX "portfolio_blocks_horizontal_marquee_items_order_idx" ON "portfolio_blocks_horizontal_marquee_items" USING btree ("_order");
  CREATE INDEX "portfolio_blocks_horizontal_marquee_items_parent_id_idx" ON "portfolio_blocks_horizontal_marquee_items" USING btree ("_parent_id");
  CREATE INDEX "portfolio_blocks_horizontal_marquee_items_locale_idx" ON "portfolio_blocks_horizontal_marquee_items" USING btree ("_locale");
  CREATE INDEX "portfolio_blocks_horizontal_marquee_order_idx" ON "portfolio_blocks_horizontal_marquee" USING btree ("_order");
  CREATE INDEX "portfolio_blocks_horizontal_marquee_parent_id_idx" ON "portfolio_blocks_horizontal_marquee" USING btree ("_parent_id");
  CREATE INDEX "portfolio_blocks_horizontal_marquee_path_idx" ON "portfolio_blocks_horizontal_marquee" USING btree ("_path");
  CREATE INDEX "portfolio_blocks_horizontal_marquee_locale_idx" ON "portfolio_blocks_horizontal_marquee" USING btree ("_locale");
  CREATE INDEX "portfolio_blocks_rich_text_order_idx" ON "portfolio_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "portfolio_blocks_rich_text_parent_id_idx" ON "portfolio_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "portfolio_blocks_rich_text_path_idx" ON "portfolio_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "portfolio_blocks_rich_text_locale_idx" ON "portfolio_blocks_rich_text" USING btree ("_locale");
  CREATE INDEX "portfolio_status_idx" ON "portfolio" USING btree ("status");
  CREATE INDEX "portfolio_category_idx" ON "portfolio" USING btree ("category");
  CREATE INDEX "portfolio_main_image_idx" ON "portfolio" USING btree ("main_image_id");
  CREATE INDEX "portfolio_featured_idx" ON "portfolio" USING btree ("featured");
  CREATE INDEX "portfolio_updated_at_idx" ON "portfolio" USING btree ("updated_at");
  CREATE INDEX "portfolio_created_at_idx" ON "portfolio" USING btree ("created_at");
  CREATE UNIQUE INDEX "portfolio_slug_idx" ON "portfolio_locales" USING btree ("slug","_locale");
  CREATE INDEX "portfolio_meta_meta_image_idx" ON "portfolio_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "portfolio_locales_locale_parent_id_unique" ON "portfolio_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "portfolio_rels_order_idx" ON "portfolio_rels" USING btree ("order");
  CREATE INDEX "portfolio_rels_parent_idx" ON "portfolio_rels" USING btree ("parent_id");
  CREATE INDEX "portfolio_rels_path_idx" ON "portfolio_rels" USING btree ("path");
  CREATE INDEX "portfolio_rels_services_id_idx" ON "portfolio_rels" USING btree ("services_id");
  CREATE INDEX "lookbooks_images_order_idx" ON "lookbooks_images" USING btree ("_order");
  CREATE INDEX "lookbooks_images_parent_id_idx" ON "lookbooks_images" USING btree ("_parent_id");
  CREATE INDEX "lookbooks_images_image_idx" ON "lookbooks_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "lookbooks_images_locales_locale_parent_id_unique" ON "lookbooks_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "lookbooks_status_idx" ON "lookbooks" USING btree ("status");
  CREATE INDEX "lookbooks_season_idx" ON "lookbooks" USING btree ("season");
  CREATE INDEX "lookbooks_cover_image_idx" ON "lookbooks" USING btree ("cover_image_id");
  CREATE INDEX "lookbooks_featured_idx" ON "lookbooks" USING btree ("featured");
  CREATE INDEX "lookbooks_updated_at_idx" ON "lookbooks" USING btree ("updated_at");
  CREATE INDEX "lookbooks_created_at_idx" ON "lookbooks" USING btree ("created_at");
  CREATE UNIQUE INDEX "lookbooks_slug_idx" ON "lookbooks_locales" USING btree ("slug","_locale");
  CREATE INDEX "lookbooks_meta_meta_image_idx" ON "lookbooks_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "lookbooks_locales_locale_parent_id_unique" ON "lookbooks_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "lookbooks_rels_order_idx" ON "lookbooks_rels" USING btree ("order");
  CREATE INDEX "lookbooks_rels_parent_idx" ON "lookbooks_rels" USING btree ("parent_id");
  CREATE INDEX "lookbooks_rels_path_idx" ON "lookbooks_rels" USING btree ("path");
  CREATE INDEX "lookbooks_rels_products_id_idx" ON "lookbooks_rels" USING btree ("products_id");
  CREATE INDEX "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "orders_order_number_idx" ON "orders" USING btree ("order_number");
  CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "courses_blocks_editorial_hero_order_idx" ON "courses_blocks_editorial_hero" USING btree ("_order");
  CREATE INDEX "courses_blocks_editorial_hero_parent_id_idx" ON "courses_blocks_editorial_hero" USING btree ("_parent_id");
  CREATE INDEX "courses_blocks_editorial_hero_path_idx" ON "courses_blocks_editorial_hero" USING btree ("_path");
  CREATE INDEX "courses_blocks_editorial_hero_locale_idx" ON "courses_blocks_editorial_hero" USING btree ("_locale");
  CREATE INDEX "courses_blocks_editorial_hero_media_idx" ON "courses_blocks_editorial_hero" USING btree ("media_id");
  CREATE INDEX "courses_blocks_editorial_hero_overlay_media_idx" ON "courses_blocks_editorial_hero" USING btree ("overlay_media_id");
  CREATE INDEX "courses_blocks_media_grid_items_order_idx" ON "courses_blocks_media_grid_items" USING btree ("_order");
  CREATE INDEX "courses_blocks_media_grid_items_parent_id_idx" ON "courses_blocks_media_grid_items" USING btree ("_parent_id");
  CREATE INDEX "courses_blocks_media_grid_items_locale_idx" ON "courses_blocks_media_grid_items" USING btree ("_locale");
  CREATE INDEX "courses_blocks_media_grid_items_media_idx" ON "courses_blocks_media_grid_items" USING btree ("media_id");
  CREATE INDEX "courses_blocks_media_grid_order_idx" ON "courses_blocks_media_grid" USING btree ("_order");
  CREATE INDEX "courses_blocks_media_grid_parent_id_idx" ON "courses_blocks_media_grid" USING btree ("_parent_id");
  CREATE INDEX "courses_blocks_media_grid_path_idx" ON "courses_blocks_media_grid" USING btree ("_path");
  CREATE INDEX "courses_blocks_media_grid_locale_idx" ON "courses_blocks_media_grid" USING btree ("_locale");
  CREATE INDEX "courses_blocks_comparison_slider_order_idx" ON "courses_blocks_comparison_slider" USING btree ("_order");
  CREATE INDEX "courses_blocks_comparison_slider_parent_id_idx" ON "courses_blocks_comparison_slider" USING btree ("_parent_id");
  CREATE INDEX "courses_blocks_comparison_slider_path_idx" ON "courses_blocks_comparison_slider" USING btree ("_path");
  CREATE INDEX "courses_blocks_comparison_slider_locale_idx" ON "courses_blocks_comparison_slider" USING btree ("_locale");
  CREATE INDEX "courses_blocks_comparison_slider_before_image_idx" ON "courses_blocks_comparison_slider" USING btree ("before_image_id");
  CREATE INDEX "courses_blocks_comparison_slider_after_image_idx" ON "courses_blocks_comparison_slider" USING btree ("after_image_id");
  CREATE INDEX "courses_blocks_horizontal_marquee_items_order_idx" ON "courses_blocks_horizontal_marquee_items" USING btree ("_order");
  CREATE INDEX "courses_blocks_horizontal_marquee_items_parent_id_idx" ON "courses_blocks_horizontal_marquee_items" USING btree ("_parent_id");
  CREATE INDEX "courses_blocks_horizontal_marquee_items_locale_idx" ON "courses_blocks_horizontal_marquee_items" USING btree ("_locale");
  CREATE INDEX "courses_blocks_horizontal_marquee_order_idx" ON "courses_blocks_horizontal_marquee" USING btree ("_order");
  CREATE INDEX "courses_blocks_horizontal_marquee_parent_id_idx" ON "courses_blocks_horizontal_marquee" USING btree ("_parent_id");
  CREATE INDEX "courses_blocks_horizontal_marquee_path_idx" ON "courses_blocks_horizontal_marquee" USING btree ("_path");
  CREATE INDEX "courses_blocks_horizontal_marquee_locale_idx" ON "courses_blocks_horizontal_marquee" USING btree ("_locale");
  CREATE INDEX "courses_blocks_rich_text_order_idx" ON "courses_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "courses_blocks_rich_text_parent_id_idx" ON "courses_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "courses_blocks_rich_text_path_idx" ON "courses_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "courses_blocks_rich_text_locale_idx" ON "courses_blocks_rich_text" USING btree ("_locale");
  CREATE INDEX "courses_upcoming_dates_order_idx" ON "courses_upcoming_dates" USING btree ("_order");
  CREATE INDEX "courses_upcoming_dates_parent_id_idx" ON "courses_upcoming_dates" USING btree ("_parent_id");
  CREATE INDEX "courses_faq_order_idx" ON "courses_faq" USING btree ("_order");
  CREATE INDEX "courses_faq_parent_id_idx" ON "courses_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "courses_faq_locales_locale_parent_id_unique" ON "courses_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "courses_status_idx" ON "courses" USING btree ("status");
  CREATE INDEX "courses_category_idx" ON "courses" USING btree ("category");
  CREATE INDEX "courses_level_idx" ON "courses" USING btree ("level");
  CREATE INDEX "courses_instructor_instructor_photo_idx" ON "courses" USING btree ("instructor_photo_id");
  CREATE INDEX "courses_featured_idx" ON "courses" USING btree ("featured");
  CREATE INDEX "courses_featured_image_idx" ON "courses" USING btree ("featured_image_id");
  CREATE INDEX "courses_updated_at_idx" ON "courses" USING btree ("updated_at");
  CREATE INDEX "courses_created_at_idx" ON "courses" USING btree ("created_at");
  CREATE UNIQUE INDEX "courses_slug_idx" ON "courses_locales" USING btree ("slug","_locale");
  CREATE INDEX "courses_meta_meta_image_idx" ON "courses_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "courses_locales_locale_parent_id_unique" ON "courses_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_portfolio_id_idx" ON "payload_locked_documents_rels" USING btree ("portfolio_id");
  CREATE INDEX "payload_locked_documents_rels_lookbooks_id_idx" ON "payload_locked_documents_rels" USING btree ("lookbooks_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_courses_id_idx" ON "payload_locked_documents_rels" USING btree ("courses_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_seo_seo_og_image_idx" ON "site_settings" USING btree ("seo_og_image_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");`);
}

export async function down({
  db,
  payload: _payload,
  req: _req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "services_blocks_editorial_hero" CASCADE;
  DROP TABLE "services_blocks_media_grid_items" CASCADE;
  DROP TABLE "services_blocks_media_grid" CASCADE;
  DROP TABLE "services_blocks_comparison_slider" CASCADE;
  DROP TABLE "services_blocks_horizontal_marquee_items" CASCADE;
  DROP TABLE "services_blocks_horizontal_marquee" CASCADE;
  DROP TABLE "services_blocks_rich_text" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_locales" CASCADE;
  DROP TABLE "products_images" CASCADE;
  DROP TABLE "products_images_locales" CASCADE;
  DROP TABLE "products_details_sizes" CASCADE;
  DROP TABLE "products_details_colors" CASCADE;
  DROP TABLE "products_details_colors_locales" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "portfolio_blocks_editorial_hero" CASCADE;
  DROP TABLE "portfolio_blocks_media_grid_items" CASCADE;
  DROP TABLE "portfolio_blocks_media_grid" CASCADE;
  DROP TABLE "portfolio_blocks_comparison_slider" CASCADE;
  DROP TABLE "portfolio_blocks_horizontal_marquee_items" CASCADE;
  DROP TABLE "portfolio_blocks_horizontal_marquee" CASCADE;
  DROP TABLE "portfolio_blocks_rich_text" CASCADE;
  DROP TABLE "portfolio" CASCADE;
  DROP TABLE "portfolio_locales" CASCADE;
  DROP TABLE "portfolio_rels" CASCADE;
  DROP TABLE "lookbooks_images" CASCADE;
  DROP TABLE "lookbooks_images_locales" CASCADE;
  DROP TABLE "lookbooks" CASCADE;
  DROP TABLE "lookbooks_locales" CASCADE;
  DROP TABLE "lookbooks_rels" CASCADE;
  DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "courses_blocks_editorial_hero" CASCADE;
  DROP TABLE "courses_blocks_media_grid_items" CASCADE;
  DROP TABLE "courses_blocks_media_grid" CASCADE;
  DROP TABLE "courses_blocks_comparison_slider" CASCADE;
  DROP TABLE "courses_blocks_horizontal_marquee_items" CASCADE;
  DROP TABLE "courses_blocks_horizontal_marquee" CASCADE;
  DROP TABLE "courses_blocks_rich_text" CASCADE;
  DROP TABLE "courses_upcoming_dates" CASCADE;
  DROP TABLE "courses_faq" CASCADE;
  DROP TABLE "courses_faq_locales" CASCADE;
  DROP TABLE "courses" CASCADE;
  DROP TABLE "courses_locales" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_services_blocks_editorial_hero_layout";
  DROP TYPE "public"."enum_services_blocks_editorial_hero_theme";
  DROP TYPE "public"."enum_services_blocks_media_grid_items_aspect_ratio";
  DROP TYPE "public"."enum_services_blocks_media_grid_columns";
  DROP TYPE "public"."enum_services_blocks_horizontal_marquee_speed";
  DROP TYPE "public"."enum_services_blocks_horizontal_marquee_direction";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum_services_category";
  DROP TYPE "public"."enum_services_format";
  DROP TYPE "public"."enum_products_details_sizes";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum_products_category";
  DROP TYPE "public"."enum_portfolio_blocks_editorial_hero_layout";
  DROP TYPE "public"."enum_portfolio_blocks_editorial_hero_theme";
  DROP TYPE "public"."enum_portfolio_blocks_media_grid_items_aspect_ratio";
  DROP TYPE "public"."enum_portfolio_blocks_media_grid_columns";
  DROP TYPE "public"."enum_portfolio_blocks_horizontal_marquee_speed";
  DROP TYPE "public"."enum_portfolio_blocks_horizontal_marquee_direction";
  DROP TYPE "public"."enum_portfolio_status";
  DROP TYPE "public"."enum_portfolio_category";
  DROP TYPE "public"."enum_lookbooks_status";
  DROP TYPE "public"."enum_lookbooks_season";
  DROP TYPE "public"."enum_orders_items_type";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_orders_currency";
  DROP TYPE "public"."enum_orders_payment_provider";
  DROP TYPE "public"."enum_courses_blocks_editorial_hero_layout";
  DROP TYPE "public"."enum_courses_blocks_editorial_hero_theme";
  DROP TYPE "public"."enum_courses_blocks_media_grid_items_aspect_ratio";
  DROP TYPE "public"."enum_courses_blocks_media_grid_columns";
  DROP TYPE "public"."enum_courses_blocks_horizontal_marquee_speed";
  DROP TYPE "public"."enum_courses_blocks_horizontal_marquee_direction";
  DROP TYPE "public"."enum_courses_status";
  DROP TYPE "public"."enum_courses_category";
  DROP TYPE "public"."enum_courses_level";
  DROP TYPE "public"."enum_courses_duration_unit";
  DROP TYPE "public"."enum_courses_format";
  DROP TYPE "public"."enum_site_settings_currency_default";`);
}
