import type { CollectionConfig } from 'payload'
import { slugify } from '@/lib/utils'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'duration', 'price', 'status', 'updatedAt'],
    group: 'Content',
    description: 'Educational courses and workshops on styling and fashion',
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
        description: 'Course title in this language',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      localized: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier (auto-generated)',
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
      name: 'category',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Personal Styling', value: 'personal-styling' },
        { label: 'Color Analysis', value: 'color-analysis' },
        { label: 'Wardrobe Audit', value: 'wardrobe-audit' },
        { label: 'Shopping Skills', value: 'shopping' },
        { label: 'Professional Development', value: 'professional' },
        { label: 'Masterclass', value: 'masterclass' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Course category for filtering',
      },
    },
    {
      name: 'level',
      type: 'select',
      required: true,
      defaultValue: 'beginner',
      index: true,
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
        { label: 'All Levels', value: 'all' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Target audience experience level',
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
        { label: 'Coming Soon', value: 'coming-soon' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Brief description for cards and previews',
      },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'prerequisites',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'What students should know before taking this course',
      },
    },
    {
      name: 'materials',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'What students need to have for this course',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'duration',
      type: 'group',
      fields: [
        {
          name: 'value',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'unit',
          type: 'select',
          required: true,
          defaultValue: 'hours',
          options: [
            { label: 'Hours', value: 'hours' },
            { label: 'Days', value: 'days' },
            { label: 'Weeks', value: 'weeks' },
            { label: 'Months', value: 'months' },
          ],
        },
      ],
    },
    {
      name: 'format',
      type: 'select',
      required: true,
      defaultValue: 'online',
      options: [
        { label: 'Online', value: 'online' },
        { label: 'In-Person', value: 'in-person' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
    },
    {
      name: 'price',
      type: 'group',
      fields: [
        {
          name: 'amount',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'currency',
          type: 'select',
          required: true,
          defaultValue: 'UAH',
          options: [
            { label: 'UAH', value: 'UAH' },
            { label: 'EUR', value: 'EUR' },
          ],
        },
        {
          name: 'earlyBirdAmount',
          type: 'number',
          min: 0,
          admin: {
            description: 'Early bird discount price (optional)',
          },
        },
      ],
    },
    {
      name: 'curriculum',
      type: 'array',
      fields: [
        {
          name: 'module',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'topics',
          type: 'array',
          fields: [
            {
              name: 'topic',
              type: 'text',
              required: true,
              localized: true,
            },
          ],
        },
      ],
    },
    {
      name: 'instructor',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'bio',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'testimonials',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          localized: true,
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'upcomingDates',
      type: 'array',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
        },
        {
          name: 'endDate',
          type: 'date',
        },
        {
          name: 'spotsAvailable',
          type: 'number',
          min: 0,
        },
      ],
    },
    {
      name: 'faq',
      type: 'array',
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
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
      name: 'priceEUR',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Price in EUR (overrides price group if set)',
      },
    },
    {
      name: 'priceUAH',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Price in UAH (overrides price group if set)',
      },
    },
    {
      name: 'bookable',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Allow online booking for this course',
      },
    },
    {
      name: 'paymentEnabled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Enable online payment for this course',
      },
    },
  ],
}
