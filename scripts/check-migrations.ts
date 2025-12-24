import { getPayload as getPayloadInstance } from "payload";
import configPromise from "@payload-config";

async function checkMigrations() {
  try {
    const payload = await getPayloadInstance({ config: configPromise });
    // @ts-expect-error - payload exposes db.migrate in @payloadcms/db-postgres
    const status = await payload.db.migrate.status();

    const pending = status.filter(
      (m: { status: string }) => m.status === "down"
    );
    if (pending.length > 0) {
      console.error("❌ Pending migrations found:");
      for (const p of pending) {
        console.error(`- ${p.name}`);
      }
      process.exit(1);
    }

    console.log("✅ All migrations applied");
    process.exit(0);
  } catch (err) {
    console.error("Error checking migrations:", err);
    process.exit(1);
  }
}

checkMigrations();
