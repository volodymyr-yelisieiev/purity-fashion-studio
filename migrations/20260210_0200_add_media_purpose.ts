import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" ADD COLUMN "purpose" text;
    CREATE INDEX IF NOT EXISTS "media_purpose_idx" ON "media" ("purpose");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" DROP COLUMN IF EXISTS "purpose";
    DROP INDEX IF EXISTS "media_purpose_idx";
  `);
}
