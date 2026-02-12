import { z } from "zod";

/* ── Zod-validated env schema ─────────────────────────── */
const envSchema = z.object({
  DATABASE_URL: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().url().optional(),
  ),
  PAYLOAD_SECRET: z.string().min(32).optional(),
  PAYLOAD_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().url().default("http://localhost:3000"),
  ),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  STRIPE_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  LIQPAY_PUBLIC_KEY: z.string().optional(),
  LIQPAY_PRIVATE_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  TEST_ADMIN_EMAIL: z.string().email().optional(),
  TEST_ADMIN_PASSWORD: z.string().optional(),
});

export const env = envSchema.parse(process.env);

export const isDev = env.NODE_ENV === "development";

/* ── Feature flags ────────────────────────────────────── */
export const features = {
  stripe: !!env.STRIPE_SECRET_KEY,
  liqpay: !!(env.LIQPAY_PUBLIC_KEY && env.LIQPAY_PRIVATE_KEY),
  email: !!env.RESEND_API_KEY,
  database: !!env.DATABASE_URL,
} as const;

export function isPaymentsEnabled(): boolean {
  return features.stripe || features.liqpay;
}

export function isEmailEnabled(): boolean {
  return features.email;
}

export function isDatabaseEnabled(): boolean {
  return features.database;
}

/* ── Lazy-loaded config getters ───────────────────────── */
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
        `Please add it to your .env.local file.`,
    );
  }
  return value;
}

export function getDatabaseConfig() {
  return {
    url: getRequiredEnv("DATABASE_URL"),
  };
}

export function getPayloadConfig() {
  return {
    secret: getRequiredEnv("PAYLOAD_SECRET"),
  };
}

export function getStripeConfig() {
  if (!features.stripe) return null;
  return {
    secretKey: env.STRIPE_SECRET_KEY!,
    publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    webhookSecret: env.STRIPE_WEBHOOK_SECRET || "",
  };
}

export function getLiqPayConfig() {
  if (!features.liqpay) return null;
  return {
    publicKey: env.LIQPAY_PUBLIC_KEY!,
    privateKey: env.LIQPAY_PRIVATE_KEY!,
  };
}

export function getEmailConfig() {
  if (!features.email) return null;
  return {
    apiKey: env.RESEND_API_KEY!,
    fromEmail: env.EMAIL_FROM || "PURITY <noreply@purityfashion.studio>",
  };
}

export function getSiteConfig() {
  return {
    url: env.NEXT_PUBLIC_SITE_URL,
    name: "PURITY Fashion Studio",
  };
}

export function getEnvSummary() {
  return {
    features,
    hasDatabase: !!env.DATABASE_URL,
    hasPayloadSecret: !!env.PAYLOAD_SECRET,
    siteUrl: getSiteConfig().url,
  };
}
