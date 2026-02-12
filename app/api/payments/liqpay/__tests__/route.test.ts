import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies
const mockCreateLiqPayCheckout = vi.fn();
const mockFindByID = vi.fn();
const mockUpdate = vi.fn();
const mockGetPayload = vi.fn();
let mockLiqPayEnabled = true;

vi.mock("@/lib/env", () => ({
  get features() {
    return { liqpay: mockLiqPayEnabled };
  },
}));

vi.mock("@/lib/liqpay", () => ({
  createLiqPayCheckout: (...args: unknown[]) =>
    mockCreateLiqPayCheckout(...args),
}));

vi.mock("payload", () => ({
  getPayload: (...args: unknown[]) => mockGetPayload(...args),
}));

vi.mock("@payload-config", () => ({
  default: Promise.resolve({}),
}));

vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

import { POST } from "../route";

function makeRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost:3000/api/payments/liqpay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/payments/liqpay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLiqPayEnabled = true;
    mockGetPayload.mockResolvedValue({
      findByID: mockFindByID,
      update: mockUpdate,
    });
  });

  it("returns 503 when LiqPay is not configured", async () => {
    mockLiqPayEnabled = false;

    const res = await POST(makeRequest({ orderId: "order-1" }));

    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toContain("not configured");
  });

  it("returns 400 when orderId is missing", async () => {
    const res = await POST(makeRequest({}));

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Order ID");
  });

  it("returns 404 when order not found", async () => {
    mockFindByID.mockResolvedValue(null);

    const res = await POST(makeRequest({ orderId: "nonexistent" }));

    expect(res.status).toBe(404);
  });

  it("creates LiqPay checkout for valid order", async () => {
    mockFindByID.mockResolvedValue({
      id: "order-1",
      orderNumber: "ORD-001",
      total: 1500,
      currency: "UAH",
      customer: { email: "jane@test.com", firstName: "Jane", lastName: "Doe" },
    });
    mockCreateLiqPayCheckout.mockReturnValue({
      data: "base64data",
      signature: "sig123",
      checkoutUrl: "https://www.liqpay.ua/api/3/checkout",
    });

    const res = await POST(makeRequest({ orderId: "order-1" }));

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.data).toBe("base64data");
    expect(data.signature).toBe("sig123");
    expect(data.checkoutUrl).toContain("liqpay");
  });

  it("updates order status to processing", async () => {
    mockFindByID.mockResolvedValue({
      id: "order-1",
      orderNumber: "ORD-001",
      total: 1500,
      currency: "UAH",
      customer: { email: "j@t.com", firstName: "J", lastName: "D" },
    });
    mockCreateLiqPayCheckout.mockReturnValue({
      data: "d",
      signature: "s",
      checkoutUrl: "u",
    });

    await POST(makeRequest({ orderId: "order-1" }));

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "processing",
          paymentProvider: "liqpay",
        }),
      }),
    );
  });

  it("returns 500 when createLiqPayCheckout returns null", async () => {
    mockFindByID.mockResolvedValue({
      id: "order-1",
      orderNumber: "ORD-001",
      total: 1500,
      currency: "UAH",
      customer: { email: "j@t.com", firstName: "J", lastName: "D" },
    });
    mockCreateLiqPayCheckout.mockReturnValue(null);

    const res = await POST(makeRequest({ orderId: "order-1" }));

    expect(res.status).toBe(500);
  });

  it("passes language from request body", async () => {
    mockFindByID.mockResolvedValue({
      id: "order-1",
      orderNumber: "ORD-001",
      total: 1500,
      currency: "UAH",
      customer: { email: "j@t.com", firstName: "J", lastName: "D" },
    });
    mockCreateLiqPayCheckout.mockReturnValue({
      data: "d",
      signature: "s",
      checkoutUrl: "u",
    });

    await POST(makeRequest({ orderId: "order-1", language: "en" }));

    expect(mockCreateLiqPayCheckout).toHaveBeenCalledWith(
      expect.objectContaining({ language: "en" }),
    );
  });

  it("returns 500 when exception thrown", async () => {
    mockFindByID.mockRejectedValue(new Error("DB error"));

    const res = await POST(makeRequest({ orderId: "order-1" }));

    expect(res.status).toBe(500);
  });
});
