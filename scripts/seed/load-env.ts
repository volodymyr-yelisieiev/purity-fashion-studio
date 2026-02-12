import dotenv from "dotenv";

// Load environment variables in order of precedence: .env.local > .env.development > .env
// dotenv will not override existing variables, so we load high-priority files first.
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env.development" });
dotenv.config({ path: ".env" });

// Enforce SSL for remote database connections
if (
  process.env.DATABASE_URL?.includes("neon.tech") ||
  process.env.DATABASE_URL?.includes("vercel-storage.com")
) {
  process.env.PGSSLMODE = "require";
}
