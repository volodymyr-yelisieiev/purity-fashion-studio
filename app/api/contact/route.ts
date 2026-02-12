import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { features, getSiteConfig } from "@/lib/env";
import { rateLimit, getClientIp } from "@/lib/ratelimit";
import { logger } from "@/lib/logger";

interface ContactRequestBody {
  type: "contact" | "booking";
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
  // Booking-specific fields
  serviceId?: string;
  preferredDate?: string;
  preferredTime?: string;
  course?: string;
}

export async function POST(request: Request) {
  try {
    // Rate limiting: 5 requests per minute per IP
    const clientIp = getClientIp(request);
    const { success, remaining, reset } = rateLimit(clientIp, {
      limit: 5,
      windowMs: 60000,
    });

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(reset),
            "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
          },
        },
      );
    }

    const body: ContactRequestBody = await request.json();

    const {
      type,
      firstName,
      lastName,
      email,
      phone,
      message,
      serviceId,
      preferredDate,
      preferredTime,
      course,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    const siteConfig = getSiteConfig();
    const adminEmail =
      siteConfig.url !== "http://localhost:3000"
        ? `contact@${new URL(siteConfig.url).hostname}`
        : "contact@purity.style";

    // Send email notification
    if (features.email) {
      const isBooking = type === "booking";

      const subject = isBooking
        ? `New Booking Request from ${firstName} ${lastName}`
        : `New Contact Message from ${firstName} ${lastName}`;

      const htmlContent = isBooking
        ? `
          <h2>New Booking Request</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          ${serviceId ? `<p><strong>Service ID:</strong> ${serviceId}</p>` : ""}
          ${course ? `<p><strong>Course:</strong> ${course}</p>` : ""}
          ${
            preferredDate
              ? `<p><strong>Preferred Date:</strong> ${preferredDate}</p>`
              : ""
          }
          ${
            preferredTime
              ? `<p><strong>Preferred Time:</strong> ${preferredTime}</p>`
              : ""
          }
          ${message ? `<p><strong>Message:</strong></p><p>${message}</p>` : ""}
        `
        : `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
          ${message ? `<p><strong>Message:</strong></p><p>${message}</p>` : ""}
        `;

      await sendEmail({
        to: adminEmail,
        subject,
        html: htmlContent,
        text: `${subject}\n\nName: ${firstName} ${lastName}\nEmail: ${email}${
          phone ? `\nPhone: ${phone}` : ""
        }${message ? `\nMessage: ${message}` : ""}`,
      });

      // Send confirmation to user
      const userSubject = isBooking
        ? "PURITY - Booking Request Received"
        : "PURITY - Thank you for contacting us";

      const userHtmlContent = isBooking
        ? `
          <h2>Thank you for your booking request!</h2>
          <p>Dear ${firstName},</p>
          <p>We have received your booking request and will contact you within 24 hours to confirm the details.</p>
          ${
            preferredDate
              ? `<p><strong>Requested Date:</strong> ${preferredDate}</p>`
              : ""
          }
          ${
            preferredTime
              ? `<p><strong>Requested Time:</strong> ${preferredTime}</p>`
              : ""
          }
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br/>PURITY Team</p>
        `
        : `
          <h2>Thank you for contacting us!</h2>
          <p>Dear ${firstName},</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <p>Best regards,<br/>PURITY Team</p>
        `;

      await sendEmail({
        to: email,
        subject: userSubject,
        html: userHtmlContent,
        text: `Thank you for your ${
          isBooking ? "booking request" : "message"
        }! We will get back to you soon.`,
      });
    }

    // Log the contact/booking (in production, you might store this in a database)
    logger.info(
      `${type === "booking" ? "Booking" : "Contact"} request received:`,
      {
        type,
        name: `${firstName} ${lastName}`,
        email,
        phone,
        serviceId,
        preferredDate,
        preferredTime,
        course,
      },
    );

    return NextResponse.json({
      success: true,
      message:
        type === "booking"
          ? "Booking request submitted successfully"
          : "Message sent successfully",
    });
  } catch (error) {
    logger.error("Contact/Booking error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
