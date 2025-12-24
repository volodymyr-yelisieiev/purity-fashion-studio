import fs from "fs";
import path from "path";

const MIGRATIONS_DIR = path.join(process.cwd(), "migrations");

function fail(msg: string) {
  console.error("❌", msg);
  process.exitCode = 1;
}

function ok(msg: string) {
  console.log("✅", msg);
}

function warn(msg: string) {
  console.warn("⚠️", msg);
}

function validateFile(file: string) {
  // Skip index file or json fixtures
  if (file === "index.ts" || file.endsWith(".json")) {
    ok(`${file} skipped (index or non-migration)`);
    return;
  }

  const full = path.join(MIGRATIONS_DIR, file);
  const content = fs.readFileSync(full, "utf8");

  // Check up() and down()
  const hasUp = /export async function up\(/.test(content);
  const hasDown = /export async function down\(/.test(content);

  if (!hasUp) fail(`${file} missing export async function up()`);
  if (!hasDown) fail(`${file} missing export async function down()`);

  // Line-wise inspections for idempotency
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/ADD COLUMN/i.test(line)) {
      // If this line does not have IF NOT EXISTS, check the next 2 lines (in case SQL is split)
      const window = (
        lines[i] +
        "\n" +
        (lines[i + 1] || "") +
        "\n" +
        (lines[i + 2] || "")
      ).toUpperCase();
      if (!/IF NOT EXISTS/.test(window)) {
        fail(`${file} has ADD COLUMN without IF NOT EXISTS at line ${i + 1}`);
      }
    }

    if (/CREATE INDEX/i.test(line)) {
      const window = (lines[i] + "\n" + (lines[i + 1] || "")).toUpperCase();
      if (!/IF NOT EXISTS/.test(window)) {
        warn(
          `${file} contains CREATE INDEX without IF NOT EXISTS at line ${i + 1}`
        );
      }
    }

    if (/DROP TYPE/i.test(line) || /ALTER TYPE .* DROP VALUE/i.test(line)) {
      warn(
        `${file} manipulates enum types; manual review recommended (line ${
          i + 1
        })`
      );
    }
  }

  ok(`${file} basic validation passed`);
}

function main() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.log("No migrations directory, skipping.");
    process.exit(0);
  }

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".ts") || f.endsWith(".json"));
  if (files.length === 0) {
    console.log("No migration files found.");
    process.exit(0);
  }

  for (const file of files) {
    validateFile(file);
  }

  if (process.exitCode && process.exitCode !== 0) {
    console.error("\nMigration validation failed. See messages above.");
    process.exit(1);
  }

  console.log("\nAll migrations validated.");
}

main();
