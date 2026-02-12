import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies
const mockSendFn = vi.fn();
let mockEmailEnabled = true;

vi.mock("@/lib/env", () => ({
  get features() {
    return { email: mockEmailEnabled };
  },
  getEmailConfig: () =>
    mockEmailEnabled
      ? { apiKey: "re_test_123", fromEmail: "PURITY <noreply@purity.test>" }
      : null,
  getSiteConfig: () => ({
    url: "https://purity.test",
    name: "PURITY Fashion Studio",
  }),
}));

vi.mock("resend", () => {
  return {
    Resend: class MockResend {
      emails = { send: (...args: unknown[]) => mockSendFn(...args) };
    },
  };
});

vi.mock("@/lib/logger", () => ({
  logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

// Must import after mocks
import { sendEmail, sendOrderConfirmationEmail } from "../email";

describe("sendEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEmailEnabled = true;
    mockSendFn.mockResolvedValue({ error: null });
  });

  it("sends email when feature is enabled", async () => {
    const result = await sendEmail({
      to: "user@test.com",
      subject: "Test",
      html: "<p>Hello</p>",
    });

    expect(result.success).toBe(true);
    expect(mockSendFn).toHaveBeenCalled();
  });

  it("skips sending when email feature is disabled", async () => {
    mockEmailEnabled = false;

    // Need to reimport to get fresh module with new feature flag
    // Since we can't easily re-import, test the public API behavior
    // The sendEmail function checks getResend() which checks features.email
    const result = await sendEmail({
      to: "user@test.com",
      subject: "Test",
      html: "<p>Hello</p>",
    });

    // When email is disabled, getResend() returns null, sendEmail returns failure
    expect(result.success).toBe(false);
    expect(result.error).toContain("not configured");
  });

  it("returns error when Resend API fails", async () => {
    mockSendFn.mockResolvedValue({
      error: { message: "Rate limit exceeded" },
    });

    const result = await sendEmail({
      to: "user@test.com",
      subject: "Test",
      html: "<p>Hello</p>",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Rate limit exceeded");
  });

  it("handles thrown exceptions", async () => {
    mockSendFn.mockRejectedValue(new Error("Network error"));

    const result = await sendEmail({
      to: "user@test.com",
      subject: "Test",
      html: "<p>Hello</p>",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Network error");
  });
});

describe("sendOrderConfirmationEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEmailEnabled = true;
    mockSendFn.mockResolvedValue({ error: null });
  });

  it("sends confirmation email with order details", async () => {
    await sendOrderConfirmationEmail({
      orderNumber: "ORD-001",
      customerName: "Jane Doe",
      customerEmail: "jane@test.com",
      items: [
        { name: "Style Consultation", quantity: 1, price: 1500 },
        { name: "Fashion Item", quantity: 2, price: 800 },
      ],
      total: 3100,
      currency: "UAH",
    });

    expect(mockSendFn).toHaveBeenCalledTimes(1);
    const callArgs = mockSendFn.mock.calls[0][0];
    expect(callArgs.to).toBe("jane@test.com");
    expect(callArgs.subject).toContain("ORD-001");
    expect(callArgs.html).toContain("Style Consultation");
    expect(callArgs.html).toContain("Fashion Item");
    expect(callArgs.html).toContain("₴");
    expect(callArgs.html).toContain("3100.00");
    expect(callArgs.text).toContain("Style Consultation");
    expect(callArgs.text).toContain("ORD-001");
  });

  it("uses EUR symbol for EUR currency", async () => {
    await sendOrderConfirmationEmail({
      orderNumber: "ORD-002",
      customerName: "John",
      customerEmail: "john@test.com",
      items: [{ name: "Item", quantity: 1, price: 50 }],
      total: 50,
      currency: "EUR",
    });

    const callArgs = mockSendFn.mock.calls[0][0];
    expect(callArgs.html).toContain("€");
  });
});
