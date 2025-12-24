import { z } from "zod";

export const checkoutSchema = z.object({
  // Customer Information
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),

  // Address (optional for service-only orders)
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().default("Ukraine"),
  postalCode: z.string().optional(),

  // Payment
  paymentMethod: z.enum(["stripe", "liqpay"], {
    error: "Please select a payment method",
  }),

  // Notes
  notes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Currency type
export type Currency = "UAH" | "EUR";

// Order status type
export type OrderStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "cancelled"
  | "completed"
  | "refunded";
