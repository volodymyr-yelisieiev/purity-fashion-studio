import type { CollectionConfig } from 'payload'

export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Styling', value: 'styling' },
        { label: 'Wardrobe Audit', value: 'wardrobe-audit' },
      ],
    },
    {
      name: 'beforeImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'afterImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'servicesUsed',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
