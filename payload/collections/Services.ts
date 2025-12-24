import type { CollectionConfig } from 'payload'
import { slugify } from '@/lib/utils'
import { revalidateContent } from '../hooks/revalidate'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'updatedAt'],
    group: 'Content',
    description: 'Styling and atelier services offered by PURITY',
  },
  hooks: {
    afterChange: [revalidateContent('services')],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'published' } }
    },
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
      localized: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier (auto-generated from title)',
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

            const title = pickLocalizedText(data?.title) || pickLocalizedText(originalDoc?.title)
            return title ? slugify(title) : value
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
        { label: 'Research', value: 'research' },
        { label: 'Realisation', value: 'realisation' },
        { label: 'Transformation', value: 'transformation' },
        { label: 'Personal Styling', value: 'styling' },
        { label: 'Atelier & Tailoring', value: 'atelier' },
        { label: 'Consulting', value: 'consulting' },
        { label: 'Shopping', value: 'shopping' },
        { label: 'Events', value: 'events' },
      ],
      required: true,
      index: true,
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
          name: 'uah',
          type: 'number',
          label: 'UAH',
          min: 0,
          admin: {
            description: 'Price in Ukrainian Hryvnia',
          },
        },
        {
          name: 'eur',
          type: 'number',
          label: 'EUR',
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
      name: 'includes',
      type: 'array',
      localized: true,
      admin: {
        description: 'What is included in this service',
      },
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
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
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      index: true,
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
      name: 'paymentEnabled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Enable online payment for this service',
      },
    },
  ],
}
