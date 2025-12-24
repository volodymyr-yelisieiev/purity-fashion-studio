import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.resolve(__dirname, "./schema-config.json");
if (!fs.existsSync(configPath)) {
  console.error("Schema config not found:", configPath);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const { DATABASE_URL, LOCAL_DEV_NO_DB } = process.env;
if (LOCAL_DEV_NO_DB === "true" || LOCAL_DEV_NO_DB === "1") {
  console.log("LOCAL_DEV_NO_DB is set — skipping schema check");
  process.exit(0);
}

if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set. Aborting schema check.");
  process.exit(1);
}

async function check() {
  const client = new Client({ connectionString: DATABASE_URL });
  try {
    await client.connect();
  } catch (err) {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  }

  const missing: Array<{ table: string; missingColumns?: string[] }> = [];

  for (const tableDef of config.tables) {
    const table = tableDef.name;
    const res = await client.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)`,
      [table]
    );
    if (!res.rows[0].exists) {
      missing.push({ table });
      continue;
    }

    // check columns
    const colRes = await client.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = $1`,
      [table]
    );

    const existingCols = new Set(
      colRes.rows.map((r: { column_name: string }) => r.column_name)
    );
    const required = tableDef.columns || [];
    const missingCols = required.filter((c: string) => !existingCols.has(c));
    if (missingCols.length > 0) {
      missing.push({ table, missingColumns: missingCols });
    }
  }

  await client.end();

  if (missing.length > 0) {
    console.error("Schema check failed. Missing tables/columns:");
    for (const m of missing) {
      console.error(
        `- ${m.table}${
          m.missingColumns ? ": " + m.missingColumns.join(", ") : ""
        }`
      );
    }
    process.exit(2);
  }

  console.log("Schema check passed");
  process.exit(0);
}

check().catch((err) => {
  console.error("Schema check error:", err);
  process.exit(1);
});
