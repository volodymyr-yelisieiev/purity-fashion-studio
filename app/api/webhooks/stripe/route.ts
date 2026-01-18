import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { constructWebhookEvent, getStripe } from "@/lib/stripe";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { getStripeConfig } from "@/config/env";
import type { Order } from "@/payload-types";
import { logger } from "@/lib/logger";

// Disable body parsing - we need raw body for signature verification
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const stripe = getStripe();
  const stripeConfig = getStripeConfig();

  if (!stripe || !stripeConfig?.webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhooks not configured" },
      { status: 503 },
    );
  }

  try {
    // Get the raw body as text
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 },
      );
    }

    // Verify webhook signature
    const event = constructWebhookEvent(
      body,
      signature,
      stripeConfig.webhookSecret,
    );

    const payload = await getPayload({ config: configPromise });

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          // Update order status
          const order = (await payload.update({
            collection: "orders",
            id: orderId,
            data: {
              status: "paid",
              paymentStatus: "succeeded",
              paidAt: new Date().toISOString(),
            },
          })) as Order;

          // Send confirmation email
          const customer = order.customer;

          await sendOrderConfirmationEmail({
            orderNumber: order.orderNumber,
            customerName: `${customer.firstName} ${customer.lastName}`,
            customerEmail: customer.email,
            items: order.items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
            total: order.total,
            currency: order.currency,
          });

          logger.info(`✓ Order ${order.orderNumber} marked as paid`);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          await payload.update({
            collection: "orders",
            id: orderId,
            data: {
              status: "failed",
              paymentStatus:
                paymentIntent.last_payment_error?.message || "Payment failed",
            },
          });

          logger.info(`✗ Order ${orderId} payment failed`);
        }
        break;
      }

      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 },
    );
  }
}
