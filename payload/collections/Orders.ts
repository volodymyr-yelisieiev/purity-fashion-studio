import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Order',
    plural: 'Orders',
  },
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'status', 'total', 'createdAt'],
    group: 'Commerce',
  },
  access: {
    // Only admins can read/update orders in admin panel
    // Orders are created via API (webhooks) so create must allow unauthenticated
    read: ({ req: { user } }) => {
      // Admins can read all orders
      if (user?.role === 'admin') return true
      // No public access to orders
      return false
    },
    create: () => true, // Created via API/webhooks
    update: ({ req: { user } }) => {
      // Only admins can update orders
      return user?.role === 'admin'
    },
    delete: () => false, // Never delete orders
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Completed', value: 'completed' },
        { label: 'Refunded', value: 'refunded' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Order Details',
          fields: [
            {
              name: 'items',
              type: 'array',
              required: true,
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Service', value: 'service' },
                    { label: 'Product', value: 'product' },
                  ],
                },
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'price',
                  type: 'number',
                  required: true,
                },
                {
                  name: 'quantity',
                  type: 'number',
                  required: true,
                  min: 1,
                },
                {
                  name: 'bookingDate',
                  type: 'text',
                },
                {
                  name: 'bookingTime',
                  type: 'text',
                },
              ],
            },
            {
              name: 'subtotal',
              type: 'number',
              required: true,
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'total',
              type: 'number',
              required: true,
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'currency',
              type: 'select',
              required: true,
              defaultValue: 'UAH',
              options: [
                { label: 'Ukrainian Hryvnia (UAH)', value: 'UAH' },
                { label: 'Euro (EUR)', value: 'EUR' },
              ],
            },
          ],
        },
        {
          label: 'Customer',
          fields: [
            {
              name: 'customer',
              type: 'group',
              fields: [
                {
                  name: 'firstName',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'lastName',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'email',
                  type: 'email',
                  required: true,
                },
                {
                  name: 'phone',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'address',
                  type: 'text',
                },
                {
                  name: 'city',
                  type: 'text',
                },
                {
                  name: 'country',
                  type: 'text',
                  defaultValue: 'Ukraine',
                },
                {
                  name: 'postalCode',
                  type: 'text',
                },
              ],
            },
            {
              name: 'notes',
              type: 'textarea',
            },
          ],
        },
        {
          label: 'Payment',
          fields: [
            {
              name: 'paymentProvider',
              type: 'select',
              required: true,
              options: [
                { label: 'Stripe', value: 'stripe' },
                { label: 'LiqPay', value: 'liqpay' },
              ],
            },
            {
              name: 'paymentIntentId',
              type: 'text',
              admin: {
                description: 'Stripe PaymentIntent ID or LiqPay order ID',
              },
            },
            {
              name: 'paymentStatus',
              type: 'text',
              admin: {
                description: 'Raw status from payment provider',
              },
            },
            {
              name: 'paidAt',
              type: 'date',
              admin: {
                date: {
                  displayFormat: 'MMMM d, yyyy HH:mm',
                },
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Generate order number for new orders
        if (operation === 'create' && !data.orderNumber) {
          const timestamp = Date.now().toString(36).toUpperCase()
          const random = Math.random().toString(36).substring(2, 6).toUpperCase()
          data.orderNumber = `PUR-${timestamp}-${random}`
        }
        return data
      },
    ],
  },
}
