import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Payload CMS
const mockCreate = vi.fn();
const mockFindByID = vi.fn();
const mockGetPayload = vi.fn();

vi.mock("payload", () => ({
  getPayload: (...args: unknown[]) => mockGetPayload(...args),
}));

vi.mock("@payload-config", () => ({
  default: Promise.resolve({}),
}));

vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

import { POST, GET } from "../route";

function makeRequest(
  body: Record<string, unknown>,
  opts?: { method?: string; url?: string },
): Request {
  return new Request(opts?.url ?? "http://localhost:3000/api/orders", {
    method: opts?.method ?? "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/orders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetPayload.mockResolvedValue({
      create: mockCreate,
      findByID: mockFindByID,
    });
  });

  it("creates an order with valid data", async () => {
    mockCreate.mockResolvedValue({
      id: "order-1",
      orderNumber: "ORD-001",
    });

    const res = await POST(
      makeRequest({
        items: [{ name: "Service A", quantity: 1, price: 1000 }],
        subtotal: 1000,
        total: 1000,
        currency: "UAH",
        customer: {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@test.com",
          phone: "+380501234567",
        },
      }),
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe("order-1");
    expect(data.orderNumber).toBe("ORD-001");
  });

  it("returns 400 when items are empty", async () => {
    const res = await POST(
      makeRequest({
        items: [],
        customer: {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@test.com",
          phone: "+380501234567",
        },
      }),
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("item");
  });

  it("returns 400 when customer info is incomplete", async () => {
    const res = await POST(
      makeRequest({
        items: [{ name: "Service A", quantity: 1, price: 1000 }],
        customer: { email: "jane@test.com" },
      }),
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Customer");
  });

  it("returns 400 when items are missing", async () => {
    const res = await POST(
      makeRequest({
        customer: {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@test.com",
          phone: "+380501234567",
        },
      }),
    );

    expect(res.status).toBe(400);
  });

  it("defaults currency to UAH", async () => {
    mockCreate.mockResolvedValue({ id: "order-1", orderNumber: "ORD-001" });

    await POST(
      makeRequest({
        items: [{ name: "Service A", quantity: 1, price: 1000 }],
        subtotal: 1000,
        total: 1000,
        customer: {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@test.com",
          phone: "+380501234567",
        },
      }),
    );

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ currency: "UAH" }),
      }),
    );
  });

  it("returns 500 when Payload throws", async () => {
    mockCreate.mockRejectedValue(new Error("DB error"));

    const res = await POST(
      makeRequest({
        items: [{ name: "Test", quantity: 1, price: 100 }],
        total: 100,
        customer: {
          firstName: "A",
          lastName: "B",
          email: "a@b.com",
          phone: "+1",
        },
      }),
    );

    expect(res.status).toBe(500);
  });
});

describe("GET /api/orders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetPayload.mockResolvedValue({
      create: mockCreate,
      findByID: mockFindByID,
    });
  });

  it("returns order by ID", async () => {
    mockFindByID.mockResolvedValue({
      id: "order-1",
      orderNumber: "ORD-001",
      status: "paid",
      items: [],
      subtotal: 1000,
      total: 1000,
      currency: "UAH",
      createdAt: "2025-01-01",
      paidAt: "2025-01-01",
    });

    const req = new Request("http://localhost:3000/api/orders?id=order-1");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe("order-1");
    expect(data.orderNumber).toBe("ORD-001");
    expect(data.status).toBe("paid");
  });

  it("returns 400 when id param is missing", async () => {
    const req = new Request("http://localhost:3000/api/orders");
    const res = await GET(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("ID");
  });

  it("returns 404 when order not found", async () => {
    mockFindByID.mockResolvedValue(null);

    const req = new Request("http://localhost:3000/api/orders?id=nonexistent");
    const res = await GET(req);

    expect(res.status).toBe(404);
  });

  it("returns 500 when Payload throws", async () => {
    mockFindByID.mockRejectedValue(new Error("DB error"));

    const req = new Request("http://localhost:3000/api/orders?id=order-1");
    const res = await GET(req);

    expect(res.status).toBe(500);
  });

  it("does not expose internal payment data", async () => {
    mockFindByID.mockResolvedValue({
      id: "order-1",
      orderNumber: "ORD-001",
      status: "paid",
      items: [],
      subtotal: 1000,
      total: 1000,
      currency: "UAH",
      createdAt: "2025-01-01",
      paidAt: "2025-01-01",
      // Internal data that should NOT be returned
      paymentIntentId: "pi_secret_123",
      paymentProvider: "stripe",
    });

    const req = new Request("http://localhost:3000/api/orders?id=order-1");
    const res = await GET(req);
    const data = await res.json();

    // Should not expose payment internals
    expect(data.paymentIntentId).toBeUndefined();
    expect(data.paymentProvider).toBeUndefined();
  });
});
