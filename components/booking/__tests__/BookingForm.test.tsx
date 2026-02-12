/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock next/navigation (required by some dependencies)
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/en",
  useParams: () => ({ locale: "en" }),
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
  permanentRedirect: vi.fn(),
  notFound: vi.fn(),
  useSelectedLayoutSegment: () => null,
  useSelectedLayoutSegments: () => [],
}));

import { BookingForm } from "../BookingForm";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock logger
vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

const mockServices = [
  {
    id: "svc-1",
    title: "Style Consultation",
    pricing: { uah: 2500 },
  },
  {
    id: "svc-2",
    title: "Wardrobe Audit",
    pricing: { uah: 3500 },
  },
] as any[];

describe("BookingForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  it("renders all required fields in English", () => {
    render(
      <BookingForm
        locale="en"
        services={mockServices}
        preSelectedService={null}
      />,
    );

    expect(screen.getByLabelText(/First Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select a Service/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Preferred Date/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Preferred Time/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Book Now" }),
    ).toBeInTheDocument();
  });

  it("renders in Ukrainian when locale is 'uk'", () => {
    render(
      <BookingForm
        locale="uk"
        services={mockServices}
        preSelectedService={null}
      />,
    );

    expect(screen.getByLabelText(/Ім'я/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Прізвище/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Записатися" }),
    ).toBeInTheDocument();
  });

  it("renders service options", () => {
    render(
      <BookingForm
        locale="en"
        services={mockServices}
        preSelectedService={null}
      />,
    );

    expect(screen.getByText(/Style Consultation/)).toBeInTheDocument();
    expect(screen.getByText(/Wardrobe Audit/)).toBeInTheDocument();
  });

  it("pre-selects a service when provided", () => {
    render(
      <BookingForm
        locale="en"
        services={mockServices}
        preSelectedService={mockServices[0]}
      />,
    );

    const serviceSelect = screen.getByLabelText(
      /Select a Service/,
    ) as HTMLSelectElement;
    expect(serviceSelect.value).toBe("svc-1");
  });

  it("shows course note when preSelectedCourse is set", () => {
    render(
      <BookingForm
        locale="en"
        services={mockServices}
        preSelectedService={null}
        preSelectedCourse="Color Theory"
      />,
    );

    expect(screen.getByText(/Color Theory/)).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    render(
      <BookingForm
        locale="en"
        services={mockServices}
        preSelectedService={null}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Book Now" }));

    await waitFor(() => {
      // React Hook Form + Zod will display errors
      expect(
        screen.getAllByText(/Required|Invalid|Please select/).length,
      ).toBeGreaterThan(0);
    });
  });

  it("submits form with valid data", async () => {
    render(
      <BookingForm
        locale="en"
        services={mockServices}
        preSelectedService={null}
      />,
    );

    fireEvent.input(screen.getByLabelText(/First Name/), {
      target: { value: "Jane" },
    });
    fireEvent.input(screen.getByLabelText(/Last Name/), {
      target: { value: "Doe" },
    });
    fireEvent.input(screen.getByLabelText(/Email/), {
      target: { value: "jane@test.com" },
    });
    fireEvent.input(screen.getByLabelText(/Phone/), {
      target: { value: "+380501234567" },
    });
    fireEvent.change(screen.getByLabelText(/Select a Service/), {
      target: { value: "svc-1" },
    });
    fireEvent.change(screen.getByLabelText(/Preferred Date/), {
      target: { value: "2025-12-15" },
    });
    fireEvent.change(screen.getByLabelText(/Preferred Time/), {
      target: { value: "14:00" },
    });

    fireEvent.submit(screen.getByRole("button", { name: "Book Now" }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.stringContaining("booking"),
      });
    });
  });

  it("shows success state after submission", async () => {
    render(
      <BookingForm
        locale="en"
        services={mockServices}
        preSelectedService={null}
      />,
    );

    fireEvent.input(screen.getByLabelText(/First Name/), {
      target: { value: "Jane" },
    });
    fireEvent.input(screen.getByLabelText(/Last Name/), {
      target: { value: "Doe" },
    });
    fireEvent.input(screen.getByLabelText(/Email/), {
      target: { value: "jane@test.com" },
    });
    fireEvent.input(screen.getByLabelText(/Phone/), {
      target: { value: "+380501234567" },
    });
    fireEvent.change(screen.getByLabelText(/Select a Service/), {
      target: { value: "svc-1" },
    });
    fireEvent.change(screen.getByLabelText(/Preferred Date/), {
      target: { value: "2025-12-15" },
    });
    fireEvent.change(screen.getByLabelText(/Preferred Time/), {
      target: { value: "14:00" },
    });

    fireEvent.submit(screen.getByRole("button", { name: "Book Now" }));

    await waitFor(() => {
      expect(screen.getByText("Request Sent!")).toBeInTheDocument();
    });
  });

  it("shows error message on failed submission", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });

    render(
      <BookingForm
        locale="en"
        services={mockServices}
        preSelectedService={null}
      />,
    );

    fireEvent.input(screen.getByLabelText(/First Name/), {
      target: { value: "Jane" },
    });
    fireEvent.input(screen.getByLabelText(/Last Name/), {
      target: { value: "Doe" },
    });
    fireEvent.input(screen.getByLabelText(/Email/), {
      target: { value: "jane@test.com" },
    });
    fireEvent.input(screen.getByLabelText(/Phone/), {
      target: { value: "+380501234567" },
    });
    fireEvent.change(screen.getByLabelText(/Select a Service/), {
      target: { value: "svc-1" },
    });
    fireEvent.change(screen.getByLabelText(/Preferred Date/), {
      target: { value: "2025-12-15" },
    });
    fireEvent.change(screen.getByLabelText(/Preferred Time/), {
      target: { value: "14:00" },
    });

    fireEvent.submit(screen.getByRole("button", { name: "Book Now" }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to submit/)).toBeInTheDocument();
    });
  });
});
