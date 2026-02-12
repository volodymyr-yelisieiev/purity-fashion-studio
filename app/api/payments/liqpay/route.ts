import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { createLiqPayCheckout } from "@/lib/liqpay";
import { features } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  // Check if LiqPay is configured
  if (!features.liqpay) {
    return NextResponse.json(
      { error: "LiqPay payments are not configured. Please contact support." },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const { orderId, language = "uk" } = body;

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

    const currency = (order.currency as "UAH" | "EUR") || "UAH";
    const customer = order.customer as {
      email: string;
      firstName: string;
      lastName: string;
    };

    // Create LiqPay checkout
    const checkout = createLiqPayCheckout({
      orderId: order.id,
      amount: order.total as number,
      currency,
      description: `PURITY Order ${order.orderNumber}`,
      customerEmail: customer.email,
      language: language as "uk" | "ru" | "en",
    });

    if (!checkout) {
      return NextResponse.json(
        { error: "Failed to create LiqPay checkout" },
        { status: 500 },
      );
    }

    // Update order with payment provider
    await payload.update({
      collection: "orders",
      id: orderId,
      data: {
        paymentProvider: "liqpay",
        status: "processing",
      },
    });

    return NextResponse.json({
      data: checkout.data,
      signature: checkout.signature,
      checkoutUrl: checkout.checkoutUrl,
    });
  } catch (error) {
    logger.error("LiqPay payment error:", error);
    return NextResponse.json(
      { error: "Failed to create LiqPay checkout" },
      { status: 500 },
    );
  }
}
