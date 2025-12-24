import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import type { Order } from "@/payload-types";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      items,
      subtotal,
      total,
      currency,
      customer,
      notes,
      paymentProvider,
    } = body;

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    if (
      !customer?.email ||
      !customer?.firstName ||
      !customer?.lastName ||
      !customer?.phone
    ) {
      return NextResponse.json(
        { error: "Customer information is required" },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config: configPromise });

    // Create the order
    const order = await (
      payload.create as (options: {
        collection: "orders";
        data: Record<string, unknown>;
      }) => Promise<Order>
    )({
      collection: "orders",
      data: {
        items,
        subtotal,
        total,
        currency: currency || "UAH",
        customer,
        notes,
        paymentProvider,
        status: "pending" as const,
      },
    });

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    logger.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("id");

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400 }
    );
  }

  try {
    const payload = await getPayload({ config: configPromise });
    const order = await payload.findByID({
      collection: "orders",
      id: orderId,
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Return only safe fields (not internal payment data)
    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      items: order.items,
      subtotal: order.subtotal,
      total: order.total,
      currency: order.currency,
      createdAt: order.createdAt,
      paidAt: order.paidAt,
    });
  } catch (error) {
    logger.error("Order fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
