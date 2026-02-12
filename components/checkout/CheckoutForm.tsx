"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Textarea,
} from "@/components/ui";
import {
  checkoutSchema,
  type CheckoutFormData,
} from "@/lib/validation/checkoutSchema";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { features } from "@/lib/env";
import { logger } from "@/lib/logger";

interface CheckoutFormProps {
  locale: string;
}

export function CheckoutForm({ locale }: CheckoutFormProps) {
  const router = useRouter();
  const { items, subtotal, currency, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "Ukraine",
      paymentMethod: features.liqpay
        ? "liqpay"
        : features.stripe
          ? "stripe"
          : undefined,
    } as CheckoutFormData,
  });

  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Create order in Payload
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            type: item.type,
            name: item.name,
            slug: item.slug,
            price: item.price,
            quantity: item.quantity,
            bookingDate: item.bookingDate,
            bookingTime: item.bookingTime,
          })),
          subtotal,
          total: subtotal,
          currency,
          customer: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            country: data.country,
            postalCode: data.postalCode,
          },
          notes: data.notes,
          paymentProvider: data.paymentMethod,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const order = await orderResponse.json();

      // 2. Process payment based on selected method
      if (data.paymentMethod === "stripe") {
        // Redirect to Stripe checkout (or use embedded form)
        const paymentResponse = await fetch("/api/payments/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id }),
        });

        if (!paymentResponse.ok) {
          throw new Error("Failed to initialize Stripe payment");
        }

        // Redirect to order confirmation pending payment
        clearCart();
        router.push(`/${locale}/order-confirmation/${order.id}?pending=true`);
      } else if (data.paymentMethod === "liqpay") {
        // Get LiqPay checkout data
        const paymentResponse = await fetch("/api/payments/liqpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id, language: locale }),
        });

        if (!paymentResponse.ok) {
          throw new Error("Failed to initialize LiqPay payment");
        }

        const liqpayData = await paymentResponse.json();

        // Clear cart before redirect
        clearCart();

        // Create and submit LiqPay form
        const form = document.createElement("form");
        form.method = "POST";
        form.action = liqpayData.checkoutUrl;
        form.acceptCharset = "utf-8";

        const dataInput = document.createElement("input");
        dataInput.type = "hidden";
        dataInput.name = "data";
        dataInput.value = liqpayData.data;
        form.appendChild(dataInput);

        const signatureInput = document.createElement("input");
        signatureInput.type = "hidden";
        signatureInput.name = "signature";
        signatureInput.value = liqpayData.signature;
        form.appendChild(signatureInput);

        document.body.appendChild(form);
        form.submit();
      }
    } catch (err) {
      logger.error("Checkout error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Checkout failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const stripeAvailable = features.stripe;
  const liqpayAvailable = features.liqpay;
  const noPaymentMethods = !stripeAvailable && !liqpayAvailable;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Customer Information */}
      <div className="space-y-4">
        <span className="block text-lg font-semibold">Contact Information</span>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              {...register("firstName")}
              className={errors.firstName ? "border-destructive" : ""}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              {...register("lastName")}
              className={errors.lastName ? "border-destructive" : ""}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+380"
            {...register("phone")}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Shipping Address (Optional) */}
      <div className="space-y-4">
        <span className="block text-lg font-semibold">Address (Optional)</span>

        <div className="space-y-2">
          <Label htmlFor="address">Street Address</Label>
          <Input id="address" {...register("address")} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register("city")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input id="postalCode" {...register("postalCode")} />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-4">
        <span className="block text-lg font-semibold">Payment Method</span>

        {noPaymentMethods ? (
          <div className="bg-background p-4">
            <p className="text-sm text-muted-foreground">
              Payment methods are not configured yet. Please contact support.
            </p>
          </div>
        ) : (
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value) =>
              setValue("paymentMethod", value as "stripe" | "liqpay")
            }
            className="space-y-3"
          >
            {liqpayAvailable && (
              <div className="flex items-center space-x-3 border p-4 cursor-pointer hover:bg-background/50">
                <RadioGroupItem value="liqpay" id="liqpay" />
                <Label htmlFor="liqpay" className="flex-1 cursor-pointer">
                  <span className="font-medium">LiqPay</span>
                  <span className="block text-sm text-muted-foreground">
                    Pay with Visa, Mastercard, or Privat24
                  </span>
                </Label>
              </div>
            )}

            {stripeAvailable && (
              <div className="flex items-center space-x-3 border p-4 cursor-pointer hover:bg-background/50">
                <RadioGroupItem value="stripe" id="stripe" />
                <Label htmlFor="stripe" className="flex-1 cursor-pointer">
                  <span className="font-medium">Credit Card (Stripe)</span>
                  <span className="block text-sm text-muted-foreground">
                    Visa, Mastercard, American Express
                  </span>
                </Label>
              </div>
            )}
          </RadioGroup>
        )}

        {errors.paymentMethod && (
          <p className="text-sm text-destructive">
            {errors.paymentMethod.message}
          </p>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Order Notes (Optional)</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          placeholder="Any special instructions or preferences..."
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting || noPaymentMethods || items.length === 0}
      >
        {isSubmitting
          ? "Processing..."
          : `Pay ${formatPrice(subtotal, currency)}`}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By completing this purchase, you agree to our Terms of Service and
        Privacy Policy.
      </p>
    </form>
  );
}
