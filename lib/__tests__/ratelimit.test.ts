import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, getClientIp } from "../ratelimit";

describe("rateLimit", () => {
  // Use a unique identifier prefix per test to avoid cross-test pollution
  let testId: string;

  beforeEach(() => {
    testId = `test-${Date.now()}-${Math.random()}`;
  });

  it("allows first request", () => {
    const result = rateLimit(testId, { limit: 5, windowMs: 60000 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("decrements remaining on each request", () => {
    const id = `${testId}-dec`;
    rateLimit(id, { limit: 5, windowMs: 60000 });
    const result = rateLimit(id, { limit: 5, windowMs: 60000 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(3);
  });

  it("blocks when limit is exceeded", () => {
    const id = `${testId}-block`;
    const opts = { limit: 2, windowMs: 60000 };

    rateLimit(id, opts); // 1
    rateLimit(id, opts); // 2
    const result = rateLimit(id, opts); // 3 — blocked

    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("resets after window expires", () => {
    const id = `${testId}-reset`;
    const opts = { limit: 1, windowMs: 1 }; // 1ms window

    rateLimit(id, opts); // Use up the limit

    // Wait for window to expire
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const result = rateLimit(id, opts);
        expect(result.success).toBe(true);
        resolve();
      }, 10);
    });
  });

  it("uses default options when not provided", () => {
    const result = rateLimit(`${testId}-defaults`);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4); // default limit is 5
  });
});

describe("getClientIp", () => {
  it("extracts IP from x-forwarded-for (first IP)", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(getClientIp(request)).toBe("1.2.3.4");
  });

  it("extracts single IP from x-forwarded-for", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "10.0.0.1" },
    });
    expect(getClientIp(request)).toBe("10.0.0.1");
  });

  it("falls back to x-real-ip", () => {
    const request = new Request("http://localhost", {
      headers: { "x-real-ip": "10.0.0.1" },
    });
    expect(getClientIp(request)).toBe("10.0.0.1");
  });

  it("falls back to cf-connecting-ip", () => {
    const request = new Request("http://localhost", {
      headers: { "cf-connecting-ip": "172.16.0.1" },
    });
    expect(getClientIp(request)).toBe("172.16.0.1");
  });

  it("returns 'unknown' when no IP headers present", () => {
    const request = new Request("http://localhost");
    expect(getClientIp(request)).toBe("unknown");
  });

  it("prioritizes x-forwarded-for over x-real-ip", () => {
    const request = new Request("http://localhost", {
      headers: {
        "x-forwarded-for": "1.2.3.4",
        "x-real-ip": "5.6.7.8",
      },
    });
    expect(getClientIp(request)).toBe("1.2.3.4");
  });
});
