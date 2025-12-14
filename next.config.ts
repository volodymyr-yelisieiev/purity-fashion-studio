import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

// Security headers for production
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  },
  // Content Security Policy - adjust based on your CDN and third-party services
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.liqpay.ua",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "frame-src 'self' https://js.stripe.com https://www.liqpay.ua",
      "connect-src 'self' https://api.stripe.com https://www.liqpay.ua",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join('; ')
  }
]

const nextConfig: NextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Security headers
  async headers() {
    return [
      {
        // Apply to all routes except admin panel (Payload handles its own CSP)
        source: '/((?!admin).*)',
        headers: securityHeaders,
      },
    ]
  },
  
  // Redirects for common patterns
  async redirects() {
    return [
      // Redirect www to non-www (or vice versa based on your preference)
      // Uncomment and adjust domain when deploying
      // {
      //   source: '/:path*',
      //   has: [{ type: 'host', value: 'www.purity.studio' }],
      //   destination: 'https://purity.studio/:path*',
      //   permanent: true,
      // },
    ]
  },
};

export default withPayload(withNextIntl(nextConfig));
