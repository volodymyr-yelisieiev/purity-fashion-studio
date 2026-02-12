import { describe, it, expect, vi, beforeEach } from "vitest";

describe("lib/env", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  describe("features", () => {
    it("stripe is true when STRIPE_SECRET_KEY is set", async () => {
      vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_123");
      const { features } = await import("../env");
      expect(features.stripe).toBe(true);
    });

    it("stripe is false when STRIPE_SECRET_KEY is missing", async () => {
      vi.stubEnv("STRIPE_SECRET_KEY", "");
      const { features } = await import("../env");
      expect(features.stripe).toBe(false);
    });

    it("liqpay is true when both keys are set", async () => {
      vi.stubEnv("LIQPAY_PUBLIC_KEY", "pub_test");
      vi.stubEnv("LIQPAY_PRIVATE_KEY", "priv_test");
      const { features } = await import("../env");
      expect(features.liqpay).toBe(true);
    });

    it("liqpay is false when only one key is set", async () => {
      vi.stubEnv("LIQPAY_PUBLIC_KEY", "pub_test");
      vi.stubEnv("LIQPAY_PRIVATE_KEY", "");
      const { features } = await import("../env");
      expect(features.liqpay).toBe(false);
    });

    it("email is true when RESEND_API_KEY is set", async () => {
      vi.stubEnv("RESEND_API_KEY", "re_test_123");
      const { features } = await import("../env");
      expect(features.email).toBe(true);
    });

    it("database is true when DATABASE_URL is set", async () => {
      vi.stubEnv("DATABASE_URL", "postgres://localhost:5432/test");
      const { features } = await import("../env");
      expect(features.database).toBe(true);
    });
  });

  describe("getStripeConfig", () => {
    it("returns config when stripe feature enabled", async () => {
      vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_123");
      vi.stubEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "pk_test_123");
      vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test");
      const { getStripeConfig } = await import("../env");
      const config = getStripeConfig();
      expect(config).not.toBeNull();
      expect(config!.secretKey).toBe("sk_test_123");
    });

    it("returns null when stripe feature disabled", async () => {
      vi.stubEnv("STRIPE_SECRET_KEY", "");
      const { getStripeConfig } = await import("../env");
      expect(getStripeConfig()).toBeNull();
    });
  });

  describe("getLiqPayConfig", () => {
    it("returns config when liqpay feature enabled", async () => {
      vi.stubEnv("LIQPAY_PUBLIC_KEY", "pub_test");
      vi.stubEnv("LIQPAY_PRIVATE_KEY", "priv_test");
      const { getLiqPayConfig } = await import("../env");
      const config = getLiqPayConfig();
      expect(config).not.toBeNull();
      expect(config!.publicKey).toBe("pub_test");
    });

    it("returns null when liqpay feature disabled", async () => {
      vi.stubEnv("LIQPAY_PUBLIC_KEY", "");
      vi.stubEnv("LIQPAY_PRIVATE_KEY", "");
      const { getLiqPayConfig } = await import("../env");
      expect(getLiqPayConfig()).toBeNull();
    });
  });

  describe("getEmailConfig", () => {
    it("returns config when email feature enabled", async () => {
      vi.stubEnv("RESEND_API_KEY", "re_test_123");
      const { getEmailConfig } = await import("../env");
      const config = getEmailConfig();
      expect(config).not.toBeNull();
      expect(config!.apiKey).toBe("re_test_123");
    });

    it("returns null when email feature disabled", async () => {
      vi.stubEnv("RESEND_API_KEY", "");
      const { getEmailConfig } = await import("../env");
      expect(getEmailConfig()).toBeNull();
    });

    it("uses default fromEmail when not set", async () => {
      vi.stubEnv("RESEND_API_KEY", "re_test");
      vi.stubEnv("EMAIL_FROM", "");
      const { getEmailConfig } = await import("../env");
      const config = getEmailConfig();
      expect(config!.fromEmail).toContain("PURITY");
    });
  });

  describe("getSiteConfig", () => {
    it("returns default URL when not set", async () => {
      vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
      const { getSiteConfig } = await import("../env");
      const config = getSiteConfig();
      expect(config.url).toBe("http://localhost:3000");
      expect(config.name).toBe("PURITY Fashion Studio");
    });

    it("returns custom URL when set", async () => {
      vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://purity.style");
      const { getSiteConfig } = await import("../env");
      expect(getSiteConfig().url).toBe("https://purity.style");
    });
  });

  describe("getDatabaseConfig", () => {
    it("returns config with DATABASE_URL", async () => {
      vi.stubEnv("DATABASE_URL", "postgres://localhost/test");
      const { getDatabaseConfig } = await import("../env");
      expect(getDatabaseConfig().url).toBe("postgres://localhost/test");
    });

    it("throws when DATABASE_URL is missing", async () => {
      vi.stubEnv("DATABASE_URL", "");
      const { getDatabaseConfig } = await import("../env");
      expect(() => getDatabaseConfig()).toThrow("DATABASE_URL");
    });
  });

  describe("getEnvSummary", () => {
    it("returns summary object", async () => {
      vi.stubEnv("DATABASE_URL", "postgres://localhost/test");
      vi.stubEnv(
        "PAYLOAD_SECRET",
        "test-secret-that-is-at-least-32-chars-long",
      );
      const { getEnvSummary } = await import("../env");
      const summary = getEnvSummary();
      expect(summary).toHaveProperty("features");
      expect(summary).toHaveProperty("hasDatabase");
      expect(summary).toHaveProperty("siteUrl");
    });
  });

  describe("guard helpers", () => {
    it("isPaymentsEnabled returns true when either payment is configured", async () => {
      vi.stubEnv("STRIPE_SECRET_KEY", "sk_test");
      const { isPaymentsEnabled } = await import("../env");
      expect(isPaymentsEnabled()).toBe(true);
    });

    it("isEmailEnabled returns true when email is configured", async () => {
      vi.stubEnv("RESEND_API_KEY", "re_test");
      const { isEmailEnabled } = await import("../env");
      expect(isEmailEnabled()).toBe(true);
    });

    it("isDatabaseEnabled returns true when database is configured", async () => {
      vi.stubEnv("DATABASE_URL", "postgres://localhost/test");
      const { isDatabaseEnabled } = await import("../env");
      expect(isDatabaseEnabled()).toBe(true);
    });
  });
});
