/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock dependencies
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: (...args: unknown[]) => mockPush(...args),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/en/checkout",
  useParams: () => ({ locale: "en" }),
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
  permanentRedirect: vi.fn(),
  notFound: vi.fn(),
  useSelectedLayoutSegment: () => null,
  useSelectedLayoutSegments: () => [],
}));

import { CheckoutForm } from "../CheckoutForm";

const mockCartState = {
  items: [
    {
      id: "item-1",
      type: "service",
      name: "Style Consultation",
      slug: "style-consultation",
      price: 2500,
      quantity: 1,
    },
  ],
  subtotal: 2500,
  currency: "UAH" as const,
  clearCart: vi.fn(),
};

vi.mock("@/hooks/useCart", () => ({
  useCart: () => mockCartState,
}));

vi.mock("@/lib/env", () => ({
  features: { stripe: true, liqpay: true },
}));

vi.mock("@/lib/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/utils")>();
  return {
    ...actual,
    formatPrice: (amount: number, currency: string) =>
      `${currency === "EUR" ? "€" : "₴"}${amount.toFixed(2)}`,
  };
});

vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("CheckoutForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCartState.items = [
      {
        id: "item-1",
        type: "service",
        name: "Style Consultation",
        slug: "style-consultation",
        price: 2500,
        quantity: 1,
      },
    ];
    mockCartState.subtotal = 2500;
    mockCartState.clearCart = vi.fn();
  });

  it("renders customer information fields", () => {
    render(<CheckoutForm locale="en" />);

    expect(screen.getByLabelText("First Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("Last Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("Email *")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone *")).toBeInTheDocument();
  });

  it("renders optional address fields", () => {
    render(<CheckoutForm locale="en" />);

    expect(screen.getByLabelText("Street Address")).toBeInTheDocument();
    expect(screen.getByLabelText("City")).toBeInTheDocument();
    expect(screen.getByLabelText("Postal Code")).toBeInTheDocument();
  });

  it("renders payment method options", () => {
    render(<CheckoutForm locale="en" />);

    expect(screen.getByText("LiqPay")).toBeInTheDocument();
    expect(screen.getByText(/Credit Card.*Stripe/)).toBeInTheDocument();
  });

  it("shows pay button with formatted price", () => {
    render(<CheckoutForm locale="en" />);

    expect(
      screen.getByRole("button", { name: /Pay.*₴2500\.00/ }),
    ).toBeInTheDocument();
  });

  it("disables submit when cart is empty", () => {
    mockCartState.items = [];
    mockCartState.subtotal = 0;

    render(<CheckoutForm locale="en" />);

    expect(screen.getByRole("button", { name: /Pay/ })).toBeDisabled();
  });

  it("shows validation errors for empty required fields", async () => {
    const user = userEvent.setup();
    render(<CheckoutForm locale="en" />);

    await user.click(screen.getByRole("button", { name: /Pay/ }));

    await waitFor(() => {
      // Should show validation errors for required fields
      const errorMessages = screen.getAllByText(/required|invalid|minimum/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  it("sends order + Stripe payment on submit", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: "order-1", orderNumber: "ORD-001" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            clientSecret: "cs_test",
            paymentIntentId: "pi_test",
          }),
      });

    const user = userEvent.setup();
    render(<CheckoutForm locale="en" />);

    await user.type(screen.getByLabelText("First Name *"), "Jane");
    await user.type(screen.getByLabelText("Last Name *"), "Doe");
    await user.type(screen.getByLabelText("Email *"), "jane@test.com");
    await user.type(screen.getByLabelText("Phone *"), "+380501234567");

    // Select Stripe payment
    await user.click(screen.getByLabelText(/Credit Card/));

    await user.click(screen.getByRole("button", { name: /Pay/ }));

    await waitFor(() => {
      // First call: create order
      expect(mockFetch).toHaveBeenCalledWith("/api/orders", expect.any(Object));
      // Second call: Stripe payment
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/payments/stripe",
        expect.any(Object),
      );
    });
  });

  it("shows error when order creation fails", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });

    const user = userEvent.setup();
    render(<CheckoutForm locale="en" />);

    await user.type(screen.getByLabelText("First Name *"), "Jane");
    await user.type(screen.getByLabelText("Last Name *"), "Doe");
    await user.type(screen.getByLabelText("Email *"), "jane@test.com");
    await user.type(screen.getByLabelText("Phone *"), "+380501234567");

    await user.click(screen.getByRole("button", { name: /Pay/ }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to create order/)).toBeInTheDocument();
    });
  });
});
