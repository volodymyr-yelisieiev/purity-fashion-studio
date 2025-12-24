import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Services includes (localized inline)
    CREATE TABLE IF NOT EXISTS "services_includes" (
      id serial PRIMARY KEY,
      _parent_id integer NOT NULL,
      _order integer DEFAULT 0,
      _locale varchar,
      item text
    );
    CREATE INDEX IF NOT EXISTS "idx_services_includes_parent" ON "services_includes" ("_parent_id");

    -- Services steps (items table)
    CREATE TABLE IF NOT EXISTS "services_steps" (
      id serial PRIMARY KEY,
      _parent_id integer NOT NULL,
      _order integer DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS "idx_services_steps_parent" ON "services_steps" ("_parent_id");

    -- Locales for steps
    CREATE TABLE IF NOT EXISTS "services_steps_locales" (
      id serial PRIMARY KEY,
      _parent_id integer NOT NULL,
      title text,
      description text,
      _locale varchar
    );
    CREATE INDEX IF NOT EXISTS "idx_services_steps_locales_parent" ON "services_steps_locales" ("_parent_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "services_steps_locales";
    DROP TABLE IF EXISTS "services_steps";
    DROP TABLE IF EXISTS "services_includes";
  `)
}
