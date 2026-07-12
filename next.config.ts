import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  images: {
    unoptimized: process.env.CI === "true",
  },
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
