import { describe, it, expect, vi } from "vitest";

// Mock lib/env before importing liqpay
vi.mock("@/lib/env", () => ({
  features: { liqpay: true },
  getLiqPayConfig: () => ({
    publicKey: "test_public_key",
    privateKey: "test_private_key",
  }),
  getSiteConfig: () => ({
    url: "https://purity.test",
    name: "PURITY Fashion Studio",
  }),
}));

vi.mock("@/lib/logger", () => ({
  logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

import {
  createLiqPayCheckout,
  verifyLiqPayCallback,
  parseLiqPayCallback,
  mapLiqPayStatus,
} from "../liqpay";

describe("mapLiqPayStatus", () => {
  it("maps 'success' to 'paid'", () => {
    expect(mapLiqPayStatus("success")).toBe("paid");
  });

  it("maps 'failure' to 'failed'", () => {
    expect(mapLiqPayStatus("failure")).toBe("failed");
  });

  it("maps 'error' to 'failed'", () => {
    expect(mapLiqPayStatus("error")).toBe("failed");
  });

  it("maps 'reversed' to 'refunded'", () => {
    expect(mapLiqPayStatus("reversed")).toBe("refunded");
  });

  it("maps 'sandbox' to 'paid'", () => {
    expect(mapLiqPayStatus("sandbox")).toBe("paid");
  });

  it("maps 'wait_accept' to 'processing'", () => {
    expect(mapLiqPayStatus("wait_accept")).toBe("processing");
  });

  it("maps 'wait_secure' to 'processing'", () => {
    expect(mapLiqPayStatus("wait_secure")).toBe("processing");
  });

  it("maps 'processing' to 'processing'", () => {
    expect(mapLiqPayStatus("processing")).toBe("processing");
  });

  it("maps unknown status to 'pending'", () => {
    expect(mapLiqPayStatus("unknown_status_xyz")).toBe("pending");
    expect(mapLiqPayStatus("")).toBe("pending");
  });
});

describe("createLiqPayCheckout", () => {
  it("returns data, signature, and checkoutUrl", () => {
    const result = createLiqPayCheckout({
      orderId: 123,
      amount: 1500,
      currency: "UAH",
      description: "Test order",
      customerEmail: "test@test.com",
    });

    expect(result).not.toBeNull();
    expect(result!.data).toBeTruthy();
    expect(result!.signature).toBeTruthy();
    expect(result!.checkoutUrl).toBe("https://www.liqpay.ua/api/3/checkout");
  });

  it("generates valid base64 data", () => {
    const result = createLiqPayCheckout({
      orderId: 123,
      amount: 1500,
      currency: "UAH",
      description: "Test order",
    });

    // Decode base64 data and verify it contains expected fields
    const decoded = JSON.parse(
      Buffer.from(result!.data, "base64").toString("utf-8"),
    );
    expect(decoded.public_key).toBe("test_public_key");
    expect(decoded.amount).toBe(1500);
    expect(decoded.currency).toBe("UAH");
    expect(decoded.order_id).toBe(123);
    expect(decoded.action).toBe("pay");
    expect(decoded.version).toBe("3");
  });

  it("includes result_url and server_url with site URL", () => {
    const result = createLiqPayCheckout({
      orderId: 42,
      amount: 100,
      currency: "EUR",
      description: "Test",
    });

    const decoded = JSON.parse(
      Buffer.from(result!.data, "base64").toString("utf-8"),
    );
    expect(decoded.result_url).toContain("https://purity.test");
    expect(decoded.server_url).toContain("https://purity.test");
  });

  it("defaults language to 'uk'", () => {
    const result = createLiqPayCheckout({
      orderId: 1,
      amount: 100,
      currency: "UAH",
      description: "Test",
    });

    const decoded = JSON.parse(
      Buffer.from(result!.data, "base64").toString("utf-8"),
    );
    expect(decoded.language).toBe("uk");
  });
});

describe("verifyLiqPayCallback", () => {
  it("returns true for valid signature", () => {
    // Generate a checkout to get a known data+signature pair
    const checkout = createLiqPayCheckout({
      orderId: 1,
      amount: 100,
      currency: "UAH",
      description: "Test",
    });

    expect(verifyLiqPayCallback(checkout!.data, checkout!.signature)).toBe(
      true,
    );
  });

  it("returns false for tampered signature", () => {
    const checkout = createLiqPayCheckout({
      orderId: 1,
      amount: 100,
      currency: "UAH",
      description: "Test",
    });

    expect(verifyLiqPayCallback(checkout!.data, "invalid_signature")).toBe(
      false,
    );
  });

  it("returns false for tampered data", () => {
    const checkout = createLiqPayCheckout({
      orderId: 1,
      amount: 100,
      currency: "UAH",
      description: "Test",
    });

    const tamperedData = Buffer.from(JSON.stringify({ amount: 999 })).toString(
      "base64",
    );
    expect(verifyLiqPayCallback(tamperedData, checkout!.signature)).toBe(false);
  });
});

describe("parseLiqPayCallback", () => {
  it("decodes base64 callback data", () => {
    const original = {
      action: "pay",
      payment_id: 12345,
      status: "success",
      order_id: "42",
      amount: 1500,
      currency: "UAH",
    };
    const encoded = Buffer.from(JSON.stringify(original)).toString("base64");

    const result = parseLiqPayCallback(encoded);
    expect(result.action).toBe("pay");
    expect(result.payment_id).toBe(12345);
    expect(result.status).toBe("success");
    expect(result.order_id).toBe("42");
    expect(result.amount).toBe(1500);
  });
});
