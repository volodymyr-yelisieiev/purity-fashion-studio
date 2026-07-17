import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import { withPayload } from "@payloadcms/next/withPayload"

const previewLiveFeedbackOrigin =
  process.env.VERCEL_ENV === "preview" ? " https://vercel.live" : ""
const developmentUnsafeEval =
  process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${previewLiveFeedbackOrigin}${developmentUnsafeEval}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://*.sentry.io",
  `frame-src 'self' https://www.google.com https://www.openstreetmap.org${previewLiveFeedbackOrigin}`,
  "form-action 'self' https://checkout.stripe.com https://www.liqpay.ua https://pay.fondy.eu",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
].join("; ")

const productionDomainConfirmed = (() => {
  try {
    return (
      new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")
        .hostname === "purity-fashion-studio.ua"
    )
  } catch {
    return false
  }
})()

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          ...(productionDomainConfirmed
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=31536000; includeSubDomains; preload",
                },
              ]
            : []),
        ],
      },
    ]
  },
  images: {
    unoptimized: process.env.CI === "true",
  },
}

const withNextIntl = createNextIntlPlugin()

export default withPayload(withNextIntl(nextConfig), {
  devBundleServerPackages: false,
})
