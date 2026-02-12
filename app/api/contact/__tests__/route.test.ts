import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies
const mockSendEmail = vi.fn();
const mockRateLimit = vi.fn();
const mockGetClientIp = vi.fn();

vi.mock("@/lib/email", () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
}));

vi.mock("@/lib/env", () => ({
  features: { email: true },
  getSiteConfig: () => ({
    url: "https://purity.test",
    name: "PURITY Fashion Studio",
  }),
}));

vi.mock("@/lib/ratelimit", () => ({
  rateLimit: (...args: unknown[]) => mockRateLimit(...args),
  getClientIp: (...args: unknown[]) => mockGetClientIp(...args),
}));

vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

import { POST } from "../route";

function makeRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetClientIp.mockReturnValue("127.0.0.1");
    mockRateLimit.mockReturnValue({
      success: true,
      remaining: 4,
      reset: Date.now() + 60000,
    });
    mockSendEmail.mockResolvedValue({ success: true });
  });

  it("returns 200 for valid contact request", async () => {
    const res = await POST(
      makeRequest({
        type: "contact",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@test.com",
        message: "Hello",
      }),
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain("sent");
  });

  it("returns 200 for valid booking request", async () => {
    const res = await POST(
      makeRequest({
        type: "booking",
        firstName: "John",
        lastName: "Smith",
        email: "john@test.com",
        phone: "+380501234567",
        serviceId: "consultation",
        preferredDate: "2025-03-01",
      }),
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain("Booking");
  });

  it("returns 400 when firstName is missing", async () => {
    const res = await POST(
      makeRequest({
        type: "contact",
        firstName: "",
        lastName: "Doe",
        email: "jane@test.com",
      }),
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("required");
  });

  it("returns 400 when email is missing", async () => {
    const res = await POST(
      makeRequest({
        type: "contact",
        firstName: "Jane",
        lastName: "Doe",
        email: "",
      }),
    );

    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid email format", async () => {
    const res = await POST(
      makeRequest({
        type: "contact",
        firstName: "Jane",
        lastName: "Doe",
        email: "not-an-email",
      }),
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("email");
  });

  it("returns 429 when rate limited", async () => {
    const resetTime = Date.now() + 30000;
    mockRateLimit.mockReturnValue({
      success: false,
      remaining: 0,
      reset: resetTime,
    });

    const res = await POST(
      makeRequest({
        type: "contact",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@test.com",
      }),
    );

    expect(res.status).toBe(429);
    expect(res.headers.get("X-RateLimit-Remaining")).toBe("0");
    expect(res.headers.get("Retry-After")).toBeTruthy();
  });

  it("sends both admin and user emails for contact", async () => {
    await POST(
      makeRequest({
        type: "contact",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@test.com",
        message: "Hello",
      }),
    );

    // Admin notification + user confirmation
    expect(mockSendEmail).toHaveBeenCalledTimes(2);
    // First call is admin notification
    expect(mockSendEmail.mock.calls[0][0].to).toBe("contact@purity.test");
    expect(mockSendEmail.mock.calls[0][0].subject).toContain("Contact");
    // Second call is user confirmation
    expect(mockSendEmail.mock.calls[1][0].to).toBe("jane@test.com");
  });

  it("sends booking-specific emails", async () => {
    await POST(
      makeRequest({
        type: "booking",
        firstName: "John",
        lastName: "Smith",
        email: "john@test.com",
        serviceId: "styling",
        preferredDate: "2025-06-15",
      }),
    );

    expect(mockSendEmail.mock.calls[0][0].subject).toContain("Booking");
    expect(mockSendEmail.mock.calls[0][0].html).toContain("styling");
  });

  it("returns 500 when request body is invalid JSON", async () => {
    const req = new Request("http://localhost:3000/api/contact", {
      method: "POST",
      body: "not json",
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
