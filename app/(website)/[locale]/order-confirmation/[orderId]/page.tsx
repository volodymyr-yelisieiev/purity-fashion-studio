import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Link } from '@/i18n/navigation'
import { CheckCircle, Clock, XCircle } from 'lucide-react'
import { Button } from '@/components/ui'
import { formatPrice } from '@/lib/utils'

interface OrderConfirmationPageProps {
  params: Promise<{
    locale: string
    orderId: string
  }>
  searchParams: Promise<{
    pending?: string
  }>
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: OrderConfirmationPageProps) {
  const { locale, orderId } = await params
  const { pending } = await searchParams

  let order = null
  let error = null

  try {
    const payload = await getPayload({ config: configPromise })
    order = await payload.findByID({
      collection: 'orders',
      id: orderId,
    })
  } catch (e) {
    console.error('Failed to fetch order:', e)
    error = 'Order not found'
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn&apos;t find the order you&apos;re looking for.
          </p>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  const status = order.status as string
  const isPaid = status === 'paid' || status === 'completed'
  const isPending = status === 'pending' || status === 'processing' || pending === 'true'
  const isFailed = status === 'failed' || status === 'cancelled'

  const customer = order.customer as {
    firstName: string
    lastName: string
    email: string
  }

  const items = (order.items as Array<{
    name: string
    quantity: number
    price: number
    type: string
  }>) || []

  const currency = (order.currency as 'UAH' | 'EUR') || 'UAH'

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Status Header */}
        <div className="text-center mb-12">
          {isPaid && (
            <>
              <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
              <p className="text-lg text-muted-foreground">
                Your order has been confirmed and paid.
              </p>
            </>
          )}
          {isPending && (
            <>
              <Clock className="h-20 w-20 text-amber-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-2">Order Received</h1>
              <p className="text-lg text-muted-foreground">
                We&apos;re waiting for your payment to be confirmed.
              </p>
            </>
          )}
          {isFailed && (
            <>
              <XCircle className="h-20 w-20 text-destructive mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
              <p className="text-lg text-muted-foreground">
                There was an issue with your payment. Please try again.
              </p>
            </>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-muted/50 p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="text-lg font-bold">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">
                {new Date(order.createdAt as string).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Confirmation sent to:
            </p>
            <p className="font-medium">{customer.email}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="border overflow-hidden mb-8">
          <div className="bg-muted px-4 py-3">
            <h2 className="font-semibold">Order Items</h2>
          </div>
          <div className="divide-y">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {item.type} × {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {formatPrice(item.price * item.quantity, currency)}
                </p>
              </div>
            ))}
          </div>
          <div className="bg-muted px-4 py-3 flex justify-between items-center">
            <span className="font-semibold">Total</span>
            <span className="text-lg font-bold">
              {formatPrice(order.total as number, currency)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/services">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Need Help?</Link>
          </Button>
        </div>

        {/* What's Next */}
        {isPaid && (
          <div className="mt-12 text-center">
            <h3 className="font-semibold mb-4">What&apos;s Next?</h3>
            <div className="grid gap-4 sm:grid-cols-3 text-sm">
              <div className="p-4 bg-muted">
                <p className="font-medium mb-1">1. Confirmation Email</p>
                <p className="text-muted-foreground">
                  Check your inbox for order details
                </p>
              </div>
              <div className="p-4 bg-muted">
                <p className="font-medium mb-1">2. We&apos;ll Reach Out</p>
                <p className="text-muted-foreground">
                  Our team will contact you shortly
                </p>
              </div>
              <div className="p-4 bg-muted">
                <p className="font-medium mb-1">3. Your Experience</p>
                <p className="text-muted-foreground">
                  Enjoy your PURITY service
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
