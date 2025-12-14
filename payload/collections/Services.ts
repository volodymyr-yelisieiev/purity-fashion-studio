import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
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
        { label: 'Research', value: 'research' },
        { label: 'Implementation', value: 'implementation' },
      ],
      required: true,
    },
    {
      name: 'format',
      type: 'select',
      options: [
        { label: 'Online', value: 'online' },
        { label: 'Studio', value: 'studio' },
      ],
    },
    {
      name: 'priceEUR',
      type: 'number',
      min: 0,
    },
    {
      name: 'priceUAH',
      type: 'number',
      min: 0,
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'steps',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
      ],
    },
    {
      name: 'benefits',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'duration',
      type: 'text',
      localized: true, // e.g. "2 hours" vs "2 години"
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
