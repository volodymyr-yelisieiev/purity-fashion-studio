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
    read: () => true,
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
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return slugify(data.name)
            }
            return value
          },
        ],
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
