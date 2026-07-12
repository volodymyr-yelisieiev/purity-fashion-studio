import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  PAYMENT_MODE: z.enum(["test", "live"]).default("test"),
  STRIPE_SECRET_KEY: z.string().optional(),
  LIQPAY_PRIVATE_KEY: z.string().optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  throw new Error(z.prettifyError(parsed.error))
}

if (parsed.data.PAYMENT_MODE === "live") {
  const missing = [
    ["STRIPE_SECRET_KEY", parsed.data.STRIPE_SECRET_KEY],
    ["LIQPAY_PRIVATE_KEY", parsed.data.LIQPAY_PRIVATE_KEY],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length) {
    throw new Error(`Missing live payment secrets: ${missing.join(", ")}`)
  }
}

export const env = parsed.data
