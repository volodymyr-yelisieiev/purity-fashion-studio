import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteConfig().url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
