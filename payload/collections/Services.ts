import type { CollectionConfig } from 'payload'
import { slugify } from '@/lib/utils'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'updatedAt'],
    group: 'Content',
    description: 'Styling and atelier services offered by PURITY',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Service name in this language',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier (auto-generated from title)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return slugify(data.title)
            }
            return value
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Only published services are shown on the website',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Full service description with formatting',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Brief description for cards and previews (1-2 sentences)',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Personal Styling', value: 'styling' },
        { label: 'Atelier & Tailoring', value: 'atelier' },
        { label: 'Consulting', value: 'consulting' },
        { label: 'Shopping', value: 'shopping' },
        { label: 'Events', value: 'events' },
      ],
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Service category for filtering',
      },
    },
    {
      name: 'format',
      type: 'select',
      options: [
        { label: 'Online', value: 'online' },
        { label: 'In Studio', value: 'studio' },
        { label: 'At Client Location', value: 'onsite' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
      admin: {
        description: 'How this service is delivered',
      },
    },
    {
      name: 'pricing',
      type: 'group',
      admin: {
        description: 'Pricing information',
      },
      fields: [
        {
          name: 'priceUAH',
          type: 'number',
          min: 0,
          admin: {
            description: 'Price in Ukrainian Hryvnia',
          },
        },
        {
          name: 'priceEUR',
          type: 'number',
          min: 0,
          admin: {
            description: 'Price in Euros',
          },
        },
        {
          name: 'priceNote',
          type: 'text',
          localized: true,
          admin: {
            description: 'Optional note (e.g., "Starting from", "Per hour")',
          },
        },
      ],
    },
    {
      name: 'duration',
      type: 'text',
      localized: true,
      admin: {
        description: 'Service duration (e.g., "2 hours", "1-2 days")',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main image for the service page',
      },
    },
    {
      name: 'steps',
      type: 'array',
      admin: {
        description: 'How the service works (process steps)',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
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
      admin: {
        description: 'What client gets from this service',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show on homepage featured section',
      },
    },
    {
      name: 'bookable',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Allow online booking for this service',
      },
    },
    {
      name: 'seo',
      type: 'group',
      admin: {
        description: 'Search engine optimization settings',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          localized: true,
          admin: {
            description: 'Custom title for search results (defaults to service title)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Description shown in search results (120-160 chars)',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Image for social media sharing',
          },
        },
      ],
    },
  ],
}
