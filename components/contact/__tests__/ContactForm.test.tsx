/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";

// Mock next/navigation (required by next-intl)
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/en/contact",
  useParams: () => ({ locale: "en" }),
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
  permanentRedirect: vi.fn(),
  notFound: vi.fn(),
  useSelectedLayoutSegment: () => null,
  useSelectedLayoutSegments: () => [],
}));

// next-intl navigation uses next/navigation internally
vi.mock("next/headers", () => ({
  cookies: () => ({ get: vi.fn(), set: vi.fn() }),
  headers: () => new Map(),
}));

import { ContactForm } from "../ContactForm";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("ContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  it("renders all form fields", () => {
    renderWithProviders(<ContactForm />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone")).toBeInTheDocument();
    expect(screen.getByLabelText("Subject")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send Message" }),
    ).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email"), "jane@test.com");
    await user.selectOptions(screen.getByLabelText("Subject"), "consultation");
    await user.type(screen.getByLabelText("Message"), "Hello");

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.stringContaining("jane@test.com"),
      });
    });
  });

  it("shows success state after submission", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Jane");
    await user.type(screen.getByLabelText("Email"), "jane@test.com");
    await user.selectOptions(screen.getByLabelText("Subject"), "services");

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => {
      expect(screen.getByText("Message Sent!")).toBeInTheDocument();
    });
  });

  it("shows error state on failed submission", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });

    const user = userEvent.setup();
    renderWithProviders(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Jane");
    await user.type(screen.getByLabelText("Email"), "jane@test.com");
    await user.selectOptions(screen.getByLabelText("Subject"), "other");

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => {
      expect(screen.getByText("Failed to send message")).toBeInTheDocument();
    });
  });

  it("shows 'Sending...' while submitting", async () => {
    let resolveResponse: (value: unknown) => void;
    mockFetch.mockReturnValue(
      new Promise((resolve) => {
        resolveResponse = resolve;
      }),
    );

    const user = userEvent.setup();
    renderWithProviders(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Jane");
    await user.type(screen.getByLabelText("Email"), "jane@test.com");
    await user.selectOptions(screen.getByLabelText("Subject"), "services");

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(screen.getByText("Sending...")).toBeInTheDocument();

    // Resolve the pending fetch response
    resolveResponse!({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    await waitFor(() => {
      expect(screen.getByText("Message Sent!")).toBeInTheDocument();
    });
  });

  it("has correct subject options", () => {
    renderWithProviders(<ContactForm />);

    const select = screen.getByLabelText("Subject");
    const options = select.querySelectorAll("option");

    // Placeholder + 4 real options
    expect(options.length).toBe(5);
    expect(options[1].textContent).toBe("Consultation");
    expect(options[2].textContent).toBe("Services");
    expect(options[3].textContent).toBe("Atelier");
    expect(options[4].textContent).toBe("Other");
  });
});
