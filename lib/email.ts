import { Resend } from "resend";
import { getEmailConfig, features, getSiteConfig } from "@/config/env";
import { logger } from "@/lib/logger";

// Create a singleton Resend instance
let resendInstance: Resend | null = null;

function getResend(): Resend | null {
  if (!features.email) {
    return null;
  }

  if (!resendInstance) {
    const config = getEmailConfig();
    if (!config) return null;
    resendInstance = new Resend(config.apiKey);
  }

  return resendInstance;
}

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(
  params: SendEmailParams
): Promise<{ success: boolean; error?: string }> {
  const resend = getResend();

  if (!resend) {
    logger.warn("Email is not configured. Skipping email send.");
    return { success: false, error: "Email not configured" };
  }

  const config = getEmailConfig();
  if (!config) {
    return { success: false, error: "Email configuration missing" };
  }

  try {
    const { error } = await resend.emails.send({
      from: config.fromEmail,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo: params.replyTo,
    });

    if (error) {
      logger.error("Failed to send email:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    logger.error("Email send error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// Order Confirmation Email
export interface OrderConfirmationEmailParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  currency: "UAH" | "EUR";
}

export async function sendOrderConfirmationEmail(
  params: OrderConfirmationEmailParams
) {
  const siteConfig = getSiteConfig();
  const currencySymbol = params.currency === "UAH" ? "₴" : "€";

  const itemsHtml = params.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${
            item.name
          }</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${
            item.quantity
          }</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${currencySymbol}${item.price.toFixed(
        2
      )}</td>
        </tr>
      `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #000;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: 4px;">PURITY</h1>
        <p style="margin: 5px 0 0; font-size: 12px; color: #666;">Fashion Studio</p>
      </div>

      <div style="padding: 30px 0;">
        <h2 style="margin: 0 0 10px;">Thank you for your order!</h2>
        <p style="color: #666; margin: 0;">Hi ${
          params.customerName
        }, your order has been confirmed.</p>
      </div>

      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 14px; color: #666;">Order Number</p>
        <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold;">${
          params.orderNumber
        }</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background: #f5f5f5;">
            <th style="padding: 12px; text-align: left; font-weight: 600;">Item</th>
            <th style="padding: 12px; text-align: center; font-weight: 600;">Qty</th>
            <th style="padding: 12px; text-align: right; font-weight: 600;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 12px; font-weight: bold;">Total</td>
            <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 18px;">${currencySymbol}${params.total.toFixed(
    2
  )}</td>
          </tr>
        </tfoot>
      </table>

      <div style="text-align: center; padding: 20px; background: #000; color: #fff; border-radius: 8px;">
        <p style="margin: 0 0 10px;">Questions about your order?</p>
        <a href="mailto:info@purityfashion.studio" style="color: #fff; text-decoration: underline;">Contact us</a>
      </div>

      <div style="text-align: center; padding: 20px 0; margin-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} PURITY Fashion Studio. All rights reserved.</p>
        <p style="margin: 5px 0 0;">${siteConfig.url}</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Thank you for your order!

Hi ${params.customerName}, your order has been confirmed.

Order Number: ${params.orderNumber}

Items:
${params.items
  .map(
    (item) =>
      `- ${item.name} x${item.quantity}: ${currencySymbol}${item.price.toFixed(
        2
      )}`
  )
  .join("\n")}

Total: ${currencySymbol}${params.total.toFixed(2)}

Questions? Reply to this email or visit ${siteConfig.url}

© ${new Date().getFullYear()} PURITY Fashion Studio
  `.trim();

  return sendEmail({
    to: params.customerEmail,
    subject: `Order Confirmed - ${params.orderNumber}`,
    html,
    text,
  });
}
