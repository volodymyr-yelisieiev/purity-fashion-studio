import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/cache
const mockRevalidatePath = vi.fn();
const mockRevalidateTag = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
  revalidateTag: (...args: unknown[]) => mockRevalidateTag(...args),
}));

vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

import { POST } from "../route";
import { NextRequest } from "next/server";

function makeRequest(
  body: Record<string, unknown>,
  secret?: string,
): NextRequest {
  const url = `http://localhost:3000/api/revalidate${secret ? `?secret=${secret}` : ""}`;
  return new NextRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("PAYLOAD_SECRET", "my-secret");
  });

  it("returns 401 when secret is missing", async () => {
    const res = await POST(makeRequest({ path: "/" }));

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.message).toContain("Invalid");
  });

  it("returns 401 when secret is wrong", async () => {
    const res = await POST(makeRequest({ path: "/" }, "wrong-secret"));

    expect(res.status).toBe(401);
  });

  it("revalidates a single path", async () => {
    const res = await POST(makeRequest({ path: "/uk/services" }, "my-secret"));

    expect(res.status).toBe(200);
    expect(mockRevalidatePath).toHaveBeenCalledWith("/uk/services");
    const data = await res.json();
    expect(data.revalidated).toBe(true);
  });

  it("revalidates multiple paths", async () => {
    const res = await POST(
      makeRequest(
        { paths: ["/uk/services", "/en/services", "/ru/services"] },
        "my-secret",
      ),
    );

    expect(res.status).toBe(200);
    expect(mockRevalidatePath).toHaveBeenCalledTimes(3);
    expect(mockRevalidatePath).toHaveBeenCalledWith("/uk/services");
    expect(mockRevalidatePath).toHaveBeenCalledWith("/en/services");
    expect(mockRevalidatePath).toHaveBeenCalledWith("/ru/services");
  });

  it("revalidates a single tag", async () => {
    const res = await POST(makeRequest({ tag: "services" }, "my-secret"));

    expect(res.status).toBe(200);
    expect(mockRevalidateTag).toHaveBeenCalledWith("services", "default");
  });

  it("revalidates multiple tags", async () => {
    const res = await POST(
      makeRequest({ tags: ["services", "portfolio", "courses"] }, "my-secret"),
    );

    expect(res.status).toBe(200);
    expect(mockRevalidateTag).toHaveBeenCalledTimes(3);
  });

  it("handles both path and tag in one request", async () => {
    const res = await POST(
      makeRequest({ path: "/uk", tag: "global" }, "my-secret"),
    );

    expect(res.status).toBe(200);
    expect(mockRevalidatePath).toHaveBeenCalledWith("/uk");
    expect(mockRevalidateTag).toHaveBeenCalledWith("global", "default");
  });

  it("returns timestamp in response", async () => {
    const before = Date.now();
    const res = await POST(makeRequest({ path: "/" }, "my-secret"));
    const data = await res.json();

    expect(data.now).toBeGreaterThanOrEqual(before);
    expect(data.now).toBeLessThanOrEqual(Date.now());
  });
});
