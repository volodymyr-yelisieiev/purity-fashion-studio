import crypto from 'crypto'
import { getLiqPayConfig, features, getSiteConfig } from '@/config/env'

/**
 * LiqPay Integration
 * Documentation: https://www.liqpay.ua/documentation/api/aquiring/checkout/doc
 */

export interface LiqPayCheckoutParams {
  orderId: number
  amount: number
  currency: 'UAH' | 'EUR'
  description: string
  customerEmail?: string
  language?: 'uk' | 'ru' | 'en'
}

export interface LiqPayCheckoutData {
  data: string
  signature: string
  checkoutUrl: string
}

export interface LiqPayCallbackData {
  action: string
  payment_id: number
  status: string
  order_id: string
  amount: number
  currency: string
  sender_phone?: string
  err_code?: string
  err_description?: string
}

function base64Encode(data: string): string {
  return Buffer.from(data).toString('base64')
}

function generateSignature(data: string, privateKey: string): string {
  const signString = privateKey + data + privateKey
  return crypto.createHash('sha1').update(signString).digest('base64')
}

export function createLiqPayCheckout(params: LiqPayCheckoutParams): LiqPayCheckoutData | null {
  if (!features.liqpay) {
    console.warn('LiqPay is not configured. Please add LIQPAY_PUBLIC_KEY and LIQPAY_PRIVATE_KEY.')
    return null
  }

  const config = getLiqPayConfig()
  if (!config) return null

  const siteConfig = getSiteConfig()
  
  const jsonData = {
    public_key: config.publicKey,
    version: '3',
    action: 'pay',
    amount: params.amount,
    currency: params.currency,
    description: params.description,
    order_id: params.orderId,
    language: params.language || 'uk',
    result_url: `${siteConfig.url}/order-confirmation/${params.orderId}`,
    server_url: `${siteConfig.url}/api/webhooks/liqpay`,
  }

  const data = base64Encode(JSON.stringify(jsonData))
  const signature = generateSignature(data, config.privateKey)

  return {
    data,
    signature,
    checkoutUrl: 'https://www.liqpay.ua/api/3/checkout',
  }
}

export function verifyLiqPayCallback(data: string, signature: string): boolean {
  const config = getLiqPayConfig()
  if (!config) return false

  const expectedSignature = generateSignature(data, config.privateKey)
  return signature === expectedSignature
}

export function parseLiqPayCallback(data: string): LiqPayCallbackData {
  const decoded = Buffer.from(data, 'base64').toString('utf-8')
  return JSON.parse(decoded)
}

export type OrderStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled' | 'completed' | 'refunded'

// Map LiqPay status to our order status
export function mapLiqPayStatus(liqpayStatus: string): OrderStatus {
  const statusMap: Record<string, OrderStatus> = {
    success: 'paid',
    failure: 'failed',
    error: 'failed',
    reversed: 'refunded',
    sandbox: 'paid', // Test mode success
    wait_accept: 'processing',
    wait_secure: 'processing',
    processing: 'processing',
  }

  return statusMap[liqpayStatus] || 'pending'
}
