import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_PAYLOAD_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_INDEXING_ENABLED: z.enum(["true", "false"]).default("false"),
  NEXT_PUBLIC_ANALYTICS_ENABLED: z.enum(["true", "false"]).default("false"),
  NEXT_PUBLIC_GA4_ID: z
    .string()
    .regex(/^G-[A-Z0-9]+$/)
    .optional(),
  CONTENT_SOURCE: z.enum(["seed", "payload"]).default("seed"),
  PAYLOAD_ENABLED: z.enum(["true", "false"]).default("false"),
  PAYLOAD_SECRET: z.string().optional(),
  PREVIEW_SECRET: z.string().optional(),
  DATABASE_URL: z.string().url().optional(),
  S3_BUCKET: z.string().optional(),
  S3_ENDPOINT: z.string().url().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  EMAIL_OVERRIDE_RECIPIENT: z.string().email().optional(),
  SENTRY_DSN: z.string().url().optional(),
  CRON_SECRET: z.string().min(32).optional(),
  PAYMENT_MODE: z.enum(["test", "live"]).default("test"),
  PAYMENT_MERCHANT_READY: z.enum(["true", "false"]).default("false"),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  LIQPAY_PUBLIC_KEY: z.string().optional(),
  LIQPAY_PRIVATE_KEY: z.string().optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  throw new Error(z.prettifyError(parsed.error))
}

if (
  parsed.data.PAYLOAD_ENABLED === "true" ||
  parsed.data.CONTENT_SOURCE === "payload"
) {
  const missing = [
    ["PAYLOAD_SECRET", parsed.data.PAYLOAD_SECRET],
    ["PREVIEW_SECRET", parsed.data.PREVIEW_SECRET],
    ["DATABASE_URL", parsed.data.DATABASE_URL],
    ["RESEND_API_KEY", parsed.data.RESEND_API_KEY],
    ["EMAIL_FROM", parsed.data.EMAIL_FROM],
    ...(parsed.data.NODE_ENV === "production"
      ? [["CRON_SECRET", parsed.data.CRON_SECRET]]
      : []),
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length) {
    throw new Error(`Missing Payload runtime variables: ${missing.join(", ")}`)
  }

  if ((parsed.data.PAYLOAD_SECRET?.length ?? 0) < 32) {
    throw new Error("PAYLOAD_SECRET must contain at least 32 characters")
  }

  if ((parsed.data.PREVIEW_SECRET?.length ?? 0) < 32) {
    throw new Error("PREVIEW_SECRET must contain at least 32 characters")
  }

  if (parsed.data.NODE_ENV === "production") {
    const missingStorage = [
      ["S3_BUCKET", parsed.data.S3_BUCKET],
      ["S3_ENDPOINT", parsed.data.S3_ENDPOINT],
      ["S3_REGION", parsed.data.S3_REGION],
      ["S3_ACCESS_KEY_ID", parsed.data.S3_ACCESS_KEY_ID],
      ["S3_SECRET_ACCESS_KEY", parsed.data.S3_SECRET_ACCESS_KEY],
    ]
      .filter(([, value]) => !value)
      .map(([key]) => key)

    if (missingStorage.length) {
      throw new Error(
        `Missing production media variables: ${missingStorage.join(", ")}`
      )
    }
  }
}

if (parsed.data.PAYMENT_MODE === "live") {
  const missing = [
    ["STRIPE_SECRET_KEY", parsed.data.STRIPE_SECRET_KEY],
    ["STRIPE_WEBHOOK_SECRET", parsed.data.STRIPE_WEBHOOK_SECRET],
    ["LIQPAY_PUBLIC_KEY", parsed.data.LIQPAY_PUBLIC_KEY],
    ["LIQPAY_PRIVATE_KEY", parsed.data.LIQPAY_PRIVATE_KEY],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length) {
    throw new Error(`Missing live payment secrets: ${missing.join(", ")}`)
  }

  if (parsed.data.PAYMENT_MERCHANT_READY !== "true") {
    throw new Error("PAYMENT_MERCHANT_READY must be true in live payment mode")
  }
}

if (
  parsed.data.NEXT_PUBLIC_ANALYTICS_ENABLED === "true" &&
  !parsed.data.NEXT_PUBLIC_GA4_ID
) {
  throw new Error("NEXT_PUBLIC_GA4_ID is required when analytics is enabled")
}

export const env = parsed.data
