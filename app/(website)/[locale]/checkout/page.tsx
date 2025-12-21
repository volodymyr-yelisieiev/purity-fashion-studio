'use client'

import { Link } from '@/i18n/navigation'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import { useCart, formatPrice } from '@/hooks/useCart'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function CheckoutPage() {
  const params = useParams()
  const locale = (params.locale as string) || 'uk'
  const { items, subtotal, currency, isHydrated } = useCart()
  const t = useTranslations('checkout')
  const tCart = useTranslations('cart')

  if (!isHydrated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted w-1/4" />
          <div className="h-96 bg-muted" />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-2xl font-serif font-light mb-2">{t('emptyCart')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('emptyCartDescription')}
          </p>
          <Button asChild>
            <Link href="/services">{tCart('browseServices')}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="ghost" size="icon">
          <Link href="/cart">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to cart</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-serif font-light tracking-tight">{t('title')}</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Checkout Form */}
        <div className="lg:order-last">
          <CheckoutForm locale={locale} />
        </div>

        {/* Order Summary */}
        <div className="lg:order-first">
          <div className="bg-muted/50 p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">{t('orderSummary')}</h2>
            
            <div className="space-y-4 mb-4 max-h-80 overflow-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-2">
                  <div className="w-16 h-16 bg-muted flex items-center justify-center shrink-0">
                    <span className="text-xs text-muted-foreground uppercase">
                      {item.type}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium">
                    {formatPrice(item.price * item.quantity, currency)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(subtotal, currency)}</span>
            </div>

            <Link
              href="/cart"
              className="block text-sm text-center text-muted-foreground hover:underline mt-4"
            >
              Edit cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
