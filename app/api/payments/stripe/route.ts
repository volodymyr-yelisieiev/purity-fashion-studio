import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { createPaymentIntent, toSmallestUnit } from "@/lib/stripe";
import { features } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  // Check if Stripe is configured
  if (!features.stripe) {
    return NextResponse.json(
      { error: "Stripe payments are not configured. Please contact support." },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 },
      );
    }

    // Fetch the order from Payload
    const payload = await getPayload({ config: configPromise });
    const order = await payload.findByID({
      collection: "orders",
      id: orderId,
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Create Stripe PaymentIntent
    const currency = (order.currency as "UAH" | "EUR") || "UAH";
    const amount = toSmallestUnit(order.total as number, currency);

    const customer = order.customer as {
      email: string;
      firstName: string;
      lastName: string;
    };

    const { clientSecret, paymentIntentId } = await createPaymentIntent({
      amount,
      currency: currency.toLowerCase() as "uah" | "eur",
      orderId: order.id,
      customerEmail: customer.email,
      metadata: {
        orderNumber: order.orderNumber as string,
      },
    });

    // Update order with payment intent ID
    await payload.update({
      collection: "orders",
      id: orderId,
      data: {
        paymentIntentId,
        paymentProvider: "stripe",
        status: "processing",
      },
    });

    return NextResponse.json({
      clientSecret,
      paymentIntentId,
    });
  } catch (error) {
    logger.error("Stripe payment error:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 },
    );
  }
}
