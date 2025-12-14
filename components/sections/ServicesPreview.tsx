import Link from 'next/link'

interface Service {
  id: string
  title: string
  slug: string
  description?: string
  category: string
}

interface ServicesPreviewProps {
  services: Service[]
  viewAllText?: string
  viewAllLink?: string
}

export function ServicesPreview({
  services,
  viewAllText = 'View All Services',
  viewAllLink = '/services',
}: ServicesPreviewProps) {
  return (
    <section className="bg-background px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group block border border-border p-8 transition-colors hover:border-foreground"
            >
              <span className="mb-4 block text-body-xs uppercase tracking-widest text-muted-foreground">
                {service.category}
              </span>
              <h3 className="font-display text-heading-md font-light text-foreground">
                {service.title}
              </h3>
              {service.description && (
                <p className="mt-4 line-clamp-3 text-body-md text-muted-foreground">
                  {service.description}
                </p>
              )}
              <span className="mt-6 inline-block text-body-sm font-medium uppercase tracking-widest text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                Learn More →
              </span>
            </Link>
          ))}
        </div>
        {viewAllLink && (
          <div className="mt-16 text-center">
            <Link
              href={viewAllLink}
              className="inline-block border border-foreground px-8 py-4 text-body-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              {viewAllText}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
