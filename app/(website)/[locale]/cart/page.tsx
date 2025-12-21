'use client'

import { Link } from '@/i18n/navigation'
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui'
import { CartItem } from '@/components/cart'
import { useCart, formatPrice } from '@/hooks/useCart'
import { useTranslations } from 'next-intl'

export default function CartPage() {
  const { items, subtotal, itemCount, currency, isHydrated, clearCart } = useCart()
  const t = useTranslations('cart')

  if (!isHydrated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted w-1/4" />
          <div className="h-64 bg-muted" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="ghost" size="icon">
          <Link href="/services">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to services</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-serif font-light tracking-tight">{t('title')}</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-xl font-serif font-light mb-2">{t('empty')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('emptyDescription')}
          </p>
          <Button asChild>
            <Link href="/services">{t('browseServices')}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                {t('itemsCount', { count: itemCount })}
              </p>
              <Button variant="ghost" size="sm" onClick={clearCart}>
                Clear all
              </Button>
            </div>
            <div className="border divide-y">
              {items.map((item) => (
                <div key={item.id} className="p-4">
                  <CartItem item={item} />
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-muted/50 p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">{t('checkout')}</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('subtotal')}</span>
                  <span>{formatPrice(subtotal, currency)}</span>
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>{t('total')}</span>
                  <span>{formatPrice(subtotal, currency)}</span>
                </div>
              </div>

              <Button asChild className="w-full mt-6">
                <Link href="/checkout">{t('checkout')}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
