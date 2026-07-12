import type { BookingValues, PaymentCurrency, PaymentProvider } from "./schema"
import type { Locale } from "@/i18n/routing"

export type PaymentOrder = {
  id: string
  provider: PaymentProvider
  currency: PaymentCurrency
  checkoutUrl: string
  mode: "test"
}

type CreatePaymentOrderInput = {
  leadId: string
  booking: BookingValues
  origin: string
  locale: Locale
}

export interface PaymentAdapter {
  provider: PaymentProvider
  createOrder(input: CreatePaymentOrderInput): Promise<PaymentOrder>
}

function paymentReturnUrl(
  origin: string,
  locale: Locale,
  status: "success" | "cancel" | "failure"
) {
  return `${origin}/${locale}/payment/${status}`
}

export const stripeAdapter: PaymentAdapter = {
  provider: "stripe",
  async createOrder({ leadId, booking, origin, locale }) {
    return {
      id: `stripe-test-${leadId}`,
      provider: "stripe",
      currency: booking.budgetCurrency,
      checkoutUrl: `${paymentReturnUrl(origin, locale, "success")}?provider=stripe&order=${leadId}`,
      mode: "test",
    }
  },
}

export const liqpayAdapter: PaymentAdapter = {
  provider: "liqpay",
  async createOrder({ leadId, booking, origin, locale }) {
    return {
      id: `liqpay-test-${leadId}`,
      provider: "liqpay",
      currency: booking.budgetCurrency,
      checkoutUrl: `${paymentReturnUrl(origin, locale, "success")}?provider=liqpay&order=${leadId}`,
      mode: "test",
    }
  },
}

export function getPaymentAdapter(provider: PaymentProvider) {
  return provider === "liqpay" ? liqpayAdapter : stripeAdapter
}
