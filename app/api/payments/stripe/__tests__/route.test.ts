import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies
const mockCreatePaymentIntent = vi.fn();
const mockToSmallestUnit = vi.fn();
const mockFindByID = vi.fn();
const mockUpdate = vi.fn();
const mockGetPayload = vi.fn();
let mockStripeEnabled = true;

vi.mock("@/lib/env", () => ({
  get features() {
    return { stripe: mockStripeEnabled };
  },
}));

vi.mock("@/lib/stripe", () => ({
  createPaymentIntent: (...args: unknown[]) => mockCreatePaymentIntent(...args),
  toSmallestUnit: (...args: unknown[]) => mockToSmallestUnit(...args),
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
  return new Request("http://localhost:3000/api/payments/stripe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/payments/stripe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStripeEnabled = true;
    mockToSmallestUnit.mockReturnValue(150000);
    mockGetPayload.mockResolvedValue({
      findByID: mockFindByID,
      update: mockUpdate,
    });
  });

  it("returns 503 when Stripe is not configured", async () => {
    mockStripeEnabled = false;

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

  it("creates PaymentIntent for valid order", async () => {
    mockFindByID.mockResolvedValue({
      id: "order-1",
      orderNumber: "ORD-001",
      total: 1500,
      currency: "UAH",
      customer: {
        email: "jane@test.com",
        firstName: "Jane",
        lastName: "Doe",
      },
    });
    mockCreatePaymentIntent.mockResolvedValue({
      clientSecret: "cs_test_123",
      paymentIntentId: "pi_test_123",
    });

    const res = await POST(makeRequest({ orderId: "order-1" }));

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.clientSecret).toBe("cs_test_123");
    expect(data.paymentIntentId).toBe("pi_test_123");
  });

  it("updates order status to processing", async () => {
    mockFindByID.mockResolvedValue({
      id: "order-1",
      orderNumber: "ORD-001",
      total: 1500,
      currency: "UAH",
      customer: { email: "j@t.com", firstName: "J", lastName: "D" },
    });
    mockCreatePaymentIntent.mockResolvedValue({
      clientSecret: "cs_test",
      paymentIntentId: "pi_test",
    });

    await POST(makeRequest({ orderId: "order-1" }));

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: "orders",
        id: "order-1",
        data: expect.objectContaining({
          status: "processing",
          paymentProvider: "stripe",
          paymentIntentId: "pi_test",
        }),
      }),
    );
  });

  it("returns 500 when PaymentIntent creation fails", async () => {
    mockFindByID.mockResolvedValue({
      id: "order-1",
      total: 1500,
      currency: "UAH",
      customer: { email: "j@t.com", firstName: "J", lastName: "D" },
    });
    mockCreatePaymentIntent.mockRejectedValue(new Error("Stripe error"));

    const res = await POST(makeRequest({ orderId: "order-1" }));

    expect(res.status).toBe(500);
  });
});
