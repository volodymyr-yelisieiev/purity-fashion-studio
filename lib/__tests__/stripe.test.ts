import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock lib/env
const mockFeatures = { stripe: false };
vi.mock("@/lib/env", () => ({
  get features() {
    return mockFeatures;
  },
  getStripeConfig: () =>
    mockFeatures.stripe
      ? {
          secretKey: "sk_test_123",
          publishableKey: "pk_test_123",
          webhookSecret: "whsec_test",
        }
      : null,
}));

// Import after mocks
import { toSmallestUnit, fromSmallestUnit, getStripe } from "../stripe";

describe("toSmallestUnit", () => {
  it("converts UAH to kopiyka", () => {
    expect(toSmallestUnit(12.5, "UAH")).toBe(1250);
  });

  it("converts EUR to cents", () => {
    expect(toSmallestUnit(99.99, "EUR")).toBe(9999);
  });

  it("handles zero", () => {
    expect(toSmallestUnit(0, "UAH")).toBe(0);
  });

  it("handles whole numbers", () => {
    expect(toSmallestUnit(100, "UAH")).toBe(10000);
  });

  it("rounds correctly", () => {
    expect(toSmallestUnit(10.005, "UAH")).toBe(1001);
  });
});

describe("fromSmallestUnit", () => {
  it("converts kopiyka to UAH", () => {
    expect(fromSmallestUnit(1250, "UAH")).toBe(12.5);
  });

  it("converts cents to EUR", () => {
    expect(fromSmallestUnit(9999, "EUR")).toBe(99.99);
  });

  it("handles zero", () => {
    expect(fromSmallestUnit(0, "UAH")).toBe(0);
  });

  it("roundtrips correctly", () => {
    const original = 42.5;
    expect(fromSmallestUnit(toSmallestUnit(original, "EUR"), "EUR")).toBe(
      original,
    );
  });
});

describe("getStripe", () => {
  beforeEach(() => {
    mockFeatures.stripe = false;
  });

  it("returns null when stripe feature is disabled", () => {
    mockFeatures.stripe = false;
    expect(getStripe()).toBeNull();
  });
});
