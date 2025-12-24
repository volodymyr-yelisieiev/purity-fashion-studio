import { getPayload } from "payload";
import configPromise from "@payload-config";
import { Link } from "@/i18n/navigation";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { Button, H1, H2, H3, Body } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { logger } from "@/lib/logger";

interface OrderConfirmationPageProps {
  params: Promise<{
    locale: string;
    orderId: string;
  }>;
  searchParams: Promise<{
    pending?: string;
  }>;
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: OrderConfirmationPageProps) {
  const { locale, orderId } = await params;
  const { pending } = await searchParams;
  const t = await getTranslations({ locale, namespace: "orderConfirmation" });

  let order = null;
  let error = null;

  try {
    const payload = await getPayload({ config: configPromise });
    order = await payload.findByID({
      collection: "orders",
      id: orderId,
    });
  } catch (e) {
    logger.error("Failed to fetch order:", e);
    error = "Order not found";
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-6" />
          <H1 className="text-2xl mb-2">{t("notFound")}</H1>
          <Body className="mb-6">{t("notFoundDescription")}</Body>
          <Button asChild>
            <Link href="/">{t("goHome")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const status = order.status as string;
  const isPaid = status === "paid" || status === "completed";
  const isPending =
    status === "pending" || status === "processing" || pending === "true";
  const isFailed = status === "failed" || status === "cancelled";

  const customer = order.customer as {
    firstName: string;
    lastName: string;
    email: string;
  };

  const items =
    (order.items as Array<{
      name: string;
      quantity: number;
      price: number;
      type: string;
    }>) || [];

  const currency = (order.currency as "UAH" | "EUR") || "UAH";

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Status Header */}
        <div className="text-center mb-12">
          {isPaid && (
            <>
              <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
              <H1 className="text-3xl mb-2">{t("thankYou")}</H1>
              <Body className="text-lg">{t("orderConfirmed")}</Body>
            </>
          )}
          {isPending && (
            <>
              <Clock className="h-20 w-20 text-amber-500 mx-auto mb-6" />
              <H1 className="text-3xl mb-2">{t("orderReceived")}</H1>
              <Body className="text-lg">{t("waitingPayment")}</Body>
            </>
          )}
          {isFailed && (
            <>
              <XCircle className="h-20 w-20 text-destructive mx-auto mb-6" />
              <H1 className="text-3xl mb-2">{t("paymentFailed")}</H1>
              <Body className="text-lg">{t("paymentFailedDescription")}</Body>
            </>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-background/50 p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("orderNumber")}
              </p>
              <p className="text-lg font-bold">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{t("date")}</p>
              <p className="font-medium">
                {new Date(order.createdAt as string).toLocaleDateString(
                  locale,
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-2">
              {t("confirmationSentTo")}
            </p>
            <p className="font-medium">{customer.email}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="border overflow-hidden mb-8">
          <div className="bg-background px-4 py-3">
            <H2 className="text-lg">{t("orderItems")}</H2>
          </div>
          <div className="divide-y">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4"
              >
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
          <div className="bg-background px-4 py-3 flex justify-between items-center">
            <span className="font-semibold">{t("total")}</span>
            <span className="text-lg font-bold">
              {formatPrice(order.total as number, currency)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/services">{t("continueShopping")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">{t("needHelp")}</Link>
          </Button>
        </div>

        {/* What's Next */}
        {isPaid && (
          <div className="mt-12 text-center">
            <H3 className="text-xl mb-4">{t("whatsNext")}</H3>
            <div className="grid gap-4 sm:grid-cols-3 text-sm">
              <div className="p-4 bg-background">
                <p className="font-medium mb-1">1. {t("step1Title")}</p>
                <p className="text-muted-foreground">{t("step1Description")}</p>
              </div>
              <div className="p-4 bg-background">
                <p className="font-medium mb-1">2. {t("step2Title")}</p>
                <p className="text-muted-foreground">{t("step2Description")}</p>
              </div>
              <div className="p-4 bg-background">
                <p className="font-medium mb-1">3. {t("step3Title")}</p>
                <p className="text-muted-foreground">{t("step3Description")}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
