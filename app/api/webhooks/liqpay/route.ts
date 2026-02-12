import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import {
  verifyLiqPayCallback,
  parseLiqPayCallback,
  mapLiqPayStatus,
} from "@/lib/liqpay";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { features } from "@/lib/env";
import type { Order } from "@/payload-types";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!features.liqpay) {
    return NextResponse.json(
      { error: "LiqPay webhooks not configured" },
      { status: 503 },
    );
  }

  try {
    // LiqPay sends data as form-urlencoded
    const formData = await request.formData();
    const data = formData.get("data") as string;
    const signature = formData.get("signature") as string;

    if (!data || !signature) {
      return NextResponse.json(
        { error: "Missing data or signature" },
        { status: 400 },
      );
    }

    // Verify callback signature
    if (!verifyLiqPayCallback(data, signature)) {
      logger.error("LiqPay signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Parse callback data
    const callbackData = parseLiqPayCallback(data);
    const { order_id: orderId, status, payment_id } = callbackData;

    const payload = await getPayload({ config: configPromise });

    // Map LiqPay status to our order status
    const orderStatus = mapLiqPayStatus(status);

    // Update order
    const order = (await payload.update({
      collection: "orders",
      id: orderId,
      data: {
        status: orderStatus,
        paymentStatus: status,
        paymentIntentId: payment_id?.toString(),
        ...(orderStatus === "paid" && { paidAt: new Date().toISOString() }),
      },
    })) as Order;

    // Send confirmation email if paid
    if (orderStatus === "paid") {
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

      logger.info(`✓ Order ${order.orderNumber} marked as paid (LiqPay)`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("LiqPay webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
