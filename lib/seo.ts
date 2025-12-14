import type { Metadata } from 'next'

interface SeoProps {
  title: string
  description: string
  path?: string
  image?: string
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://purity.studio'

export function generateSeoMetadata({
  title,
  description,
  path = '',
  image,
}: SeoProps): Metadata {
  const url = `${siteUrl}${path}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'PURITY Fashion Studio',
      type: 'website',
      ...(image && { images: [{ url: image }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image && { images: [image] }),
    },
    alternates: {
      canonical: url,
    },
  }
}

export function generateServiceMetadata(
  service: { title: string; description?: string; slug: string },
  locale: string
): Metadata {
  return generateSeoMetadata({
    title: `${service.title} | PURITY Fashion Studio`,
    description: service.description || `Professional styling service: ${service.title}`,
    path: `/${locale}/services/${service.slug}`,
  })
}
