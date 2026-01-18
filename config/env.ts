/**
 * Environment Configuration Layer
 * Validates and provides type-safe access to environment variables
 * Fails fast with clear messages for missing required variables
 */

// Feature flags for optional integrations
export const features = {
  stripe: !!process.env.STRIPE_SECRET_KEY,
  liqpay: !!(process.env.LIQPAY_PUBLIC_KEY && process.env.LIQPAY_PRIVATE_KEY),
  email: !!process.env.RESEND_API_KEY,
  database: !!process.env.DATABASE_URL,
} as const;

// Guard helpers for runtime checks
export function isPaymentsEnabled(): boolean {
  return features.stripe || features.liqpay;
}

export function isEmailEnabled(): boolean {
  return features.email;
}

export function isDatabaseEnabled(): boolean {
  return features.database;
}

// Core environment variables (always required)
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

// Optional environment variables with defaults
function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

// Lazy-loaded config objects to avoid errors at import time
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
  if (!features.stripe) {
    return null;
  }
  return {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  };
}

export function getLiqPayConfig() {
  if (!features.liqpay) {
    return null;
  }
  return {
    publicKey: process.env.LIQPAY_PUBLIC_KEY!,
    privateKey: process.env.LIQPAY_PRIVATE_KEY!,
  };
}

export function getEmailConfig() {
  if (!features.email) {
    return null;
  }
  return {
    apiKey: process.env.RESEND_API_KEY!,
    fromEmail: getOptionalEnv(
      "EMAIL_FROM",
      "PURITY <noreply@purityfashion.studio>",
    ),
  };
}

export function getSiteConfig() {
  return {
    url: getOptionalEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
    name: "PURITY Fashion Studio",
  };
}

// Export a summary for debugging
export function getEnvSummary() {
  return {
    features,
    hasDatabase: !!process.env.DATABASE_URL,
    hasPayloadSecret: !!process.env.PAYLOAD_SECRET,
    siteUrl: getSiteConfig().url,
  };
}
