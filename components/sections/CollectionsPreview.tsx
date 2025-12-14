import Image from 'next/image'
import Link from 'next/link'

interface Collection {
  id: string
  title: string
  slug: string
  description?: string
  coverImage?: {
    url: string
    alt?: string
  }
}

interface CollectionsPreviewProps {
  collections: Collection[]
  title?: string
}

export function CollectionsPreview({
  collections,
  title = 'Collections',
}: CollectionsPreviewProps) {
  return (
    <section className="bg-neutral-50 px-6 py-24 dark:bg-neutral-900">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-16 text-center font-display text-heading-lg font-light tracking-tight text-foreground">
          {title}
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="group relative aspect-[4/5] overflow-hidden bg-neutral-200 dark:bg-neutral-800"
            >
              {collection.coverImage?.url && (
                <Image
                  src={collection.coverImage.url}
                  alt={collection.coverImage.alt || collection.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/60 to-transparent p-8 text-white">
                <h3 className="font-display text-heading-md font-light">
                  {collection.title}
                </h3>
                {collection.description && (
                  <p className="mt-2 text-center text-body-sm opacity-90">
                    {collection.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
