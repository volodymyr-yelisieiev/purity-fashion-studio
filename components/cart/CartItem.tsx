'use client'

import { Minus, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import type { CartItem as CartItemType } from '@/lib/store/cart'
import Image from 'next/image'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity, currency } = useCart()

  return (
    <div className="flex gap-4 py-4 border-b border-border">
      {/* Image placeholder */}
      <div className="w-20 h-20 bg-muted flex items-center justify-center shrink-0 relative overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <span className="text-xs text-muted-foreground uppercase">
            {item.type}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <span className="block font-medium text-sm truncate">{item.name}</span>
        <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
        {item.bookingDate && (
          <p className="text-xs text-muted-foreground mt-1">
            {item.bookingDate} {item.bookingTime && `at ${item.bookingTime}`}
          </p>
        )}
        <p className="text-sm font-medium mt-2">
          {formatPrice(item.price, currency)}
        </p>
      </div>

      {/* Quantity controls */}
      <div className="flex flex-col items-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => removeItem(item.id)}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Remove</span>
        </Button>

        {item.type === 'product' && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
