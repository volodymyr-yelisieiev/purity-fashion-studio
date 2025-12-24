import type { Metadata } from "next";

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  locale?: string;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://purity.studio";
const locales = ["en", "uk", "ru"] as const;

export function generateSeoMetadata({
  title,
  description,
  path = "",
  image,
  locale,
}: SeoProps): Metadata {
  const url = `${siteUrl}${path}`;

  // Generate hreflang alternates for all locales
  const languages: Record<string, string> = {};
  if (path && locale) {
    // Extract the path without the locale prefix
    const pathWithoutLocale = path.replace(/^\/(en|uk|ru)/, "");
    locales.forEach((loc) => {
      languages[loc] = `${siteUrl}/${loc}${pathWithoutLocale}`;
    });
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "PURITY Fashion Studio",
      type: "website",
      locale: locale || "uk",
      ...(image && { images: [{ url: image }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [image] }),
    },
    alternates: {
      canonical: url,
      ...(Object.keys(languages).length > 0 && { languages }),
    },
  };
}

export function generateServiceMetadata(
  service: { title: string; description?: string; slug: string },
  locale: string
): Metadata {
  return generateSeoMetadata({
    title: `${service.title} | PURITY Fashion Studio`,
    description:
      service.description || `Professional styling service: ${service.title}`,
    path: `/${locale}/services/${service.slug}`,
  });
}
