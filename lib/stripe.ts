import Stripe from 'stripe'
import { getStripeConfig, features } from '@/config/env'

// Create a singleton Stripe instance
let stripeInstance: Stripe | null = null

export function getStripe(): Stripe | null {
  if (!features.stripe) {
    return null
  }

  if (!stripeInstance) {
    const config = getStripeConfig()
    if (!config) return null

    stripeInstance = new Stripe(config.secretKey, {
      apiVersion: '2025-11-17.clover',
      typescript: true,
    })
  }

  return stripeInstance
}

export interface CreatePaymentIntentParams {
  amount: number // in smallest currency unit (cents for EUR, kopiyka for UAH)
  currency: 'uah' | 'eur'
  orderId: number
  customerEmail: string
  metadata?: Record<string, string>
}

export async function createPaymentIntent(params: CreatePaymentIntentParams) {
  const stripe = getStripe()
  if (!stripe) {
    throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.')
  }

  const { amount, currency, orderId, customerEmail, metadata = {} } = params

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    metadata: {
      orderId: String(orderId),
      ...metadata,
    },
    receipt_email: customerEmail,
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  }
}

export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  const stripe = getStripe()
  if (!stripe) {
    throw new Error('Stripe is not configured')
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

// Helper to convert amount to smallest currency unit
export function toSmallestUnit(amount: number, _currency: 'UAH' | 'EUR'): number {
  // Both UAH and EUR use 2 decimal places
  return Math.round(amount * 100)
}

// Helper to convert from smallest unit to display amount
export function fromSmallestUnit(amount: number, _currency: 'UAH' | 'EUR'): number {
  return amount / 100
}
