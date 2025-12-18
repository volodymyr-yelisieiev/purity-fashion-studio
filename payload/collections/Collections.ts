import type { CollectionConfig } from 'payload'
import { slugify } from '@/lib/utils'

export const Collections: CollectionConfig = {
  slug: 'collections', // Fashion collections
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'season', 'featured', 'releaseDate'],
    group: 'Content',
    description: 'Curated fashion collections and lookbooks',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'published' } }
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Collection name (e.g., "Autumn Essentials 2024")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      localized: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier',
      },
      hooks: {
        beforeValidate: [
          ({ value, data, req, originalDoc }) => {
            if (value) return value

            const locale = req.locale

            const pickLocalizedText = (source: unknown): string | undefined => {
              if (!source) return undefined
              if (typeof source === 'string' && source) return source
              if (typeof source === 'object' && source !== null) {
                const record = source as Record<string, string | undefined>
                if (locale && record[locale]) return record[locale]
                return record.uk || record.en || record.ru || Object.values(record).find(Boolean)
              }
              return undefined
            }

            const name = pickLocalizedText(data?.name) || pickLocalizedText(originalDoc?.name)
            return name ? slugify(name) : value
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Only published collections are public',
      },
    },
    {
      name: 'season',
      type: 'select',
      options: [
        { label: 'Spring', value: 'spring' },
        { label: 'Summer', value: 'summer' },
        { label: 'Autumn', value: 'autumn' },
        { label: 'Winter', value: 'winter' },
        { label: 'All Season', value: 'all-season' },
      ],
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Collection story and inspiration',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main collection image',
      },
    },
    {
      name: 'images',
      type: 'array',
      admin: {
        description: 'Lookbook images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Show on homepage',
      },
    },
    {
      name: 'releaseDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'When this collection was released',
      },
    },
    {
      name: 'linkedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        description: 'Products featured in this collection',
      },
    },
  ],
}
