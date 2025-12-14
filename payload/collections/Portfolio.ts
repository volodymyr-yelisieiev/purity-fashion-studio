import type { CollectionConfig } from 'payload'
import { slugify } from '@/lib/utils'

export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'updatedAt'],
    group: 'Content',
    description: 'Before/after transformations and client work',
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
        description: 'Project title (can include client first name)',
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
            if (!value && data?.title) {
              return slugify(data.title)
            }
            return value
          },
        ],
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Personal Styling', value: 'styling' },
        { label: 'Wardrobe Audit', value: 'wardrobe-audit' },
        { label: 'Style Transformation', value: 'transformation' },
        { label: 'Event Look', value: 'event' },
        { label: 'Shopping Result', value: 'shopping' },
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
        description: 'Story behind the transformation',
      },
    },
    {
      name: 'beforeImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Before photo',
      },
    },
    {
      name: 'afterImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'After photo',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      admin: {
        description: 'Additional photos from the project',
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
      name: 'servicesUsed',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        description: 'Which services were used for this project',
      },
    },
    {
      name: 'testimonial',
      type: 'group',
      admin: {
        description: 'Optional client testimonial',
      },
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'clientName',
          type: 'text',
          admin: {
            description: 'First name only for privacy',
          },
        },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
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
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Date to display for this project',
      },
    },
  ],
}
