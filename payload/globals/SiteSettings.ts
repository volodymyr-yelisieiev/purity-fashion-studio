import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              defaultValue: 'PURITY Fashion Studio',
              admin: {
                description: 'Site name used in meta tags and branding',
              },
            },
            {
              name: 'tagline',
              type: 'text',
              localized: true,
              admin: {
                description: 'Short tagline for the site',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
              admin: {
                description: 'Default meta description for SEO',
              },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Site logo',
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Site favicon (32x32 recommended)',
              },
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'contact',
              type: 'group',
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  required: true,
                  admin: {
                    description: 'Primary contact email',
                  },
                },
                {
                  name: 'phone',
                  type: 'text',
                  admin: {
                    description: 'Contact phone number',
                  },
                },
                {
                  name: 'whatsapp',
                  type: 'text',
                  admin: {
                    description: 'WhatsApp number (with country code)',
                  },
                },
                {
                  name: 'telegram',
                  type: 'text',
                  admin: {
                    description: 'Telegram username or link',
                  },
                },
                {
                  name: 'address',
                  type: 'textarea',
                  localized: true,
                  admin: {
                    description: 'Physical address',
                  },
                },
                {
                  name: 'workingHours',
                  type: 'textarea',
                  localized: true,
                  admin: {
                    description: 'Working hours information',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Social Media',
          fields: [
            {
              name: 'social',
              type: 'group',
              fields: [
                {
                  name: 'instagram',
                  type: 'text',
                  admin: {
                    description: 'Instagram profile URL',
                  },
                },
                {
                  name: 'facebook',
                  type: 'text',
                  admin: {
                    description: 'Facebook page URL',
                  },
                },
                {
                  name: 'linkedin',
                  type: 'text',
                  admin: {
                    description: 'LinkedIn profile URL',
                  },
                },
                {
                  name: 'pinterest',
                  type: 'text',
                  admin: {
                    description: 'Pinterest profile URL',
                  },
                },
                {
                  name: 'youtube',
                  type: 'text',
                  admin: {
                    description: 'YouTube channel URL',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Currency & Payments',
          fields: [
            {
              name: 'currency',
              type: 'group',
              fields: [
                {
                  name: 'default',
                  type: 'select',
                  options: [
                    { label: 'UAH (₴)', value: 'UAH' },
                    { label: 'EUR (€)', value: 'EUR' },
                    { label: 'USD ($)', value: 'USD' },
                  ],
                  defaultValue: 'UAH',
                  admin: {
                    description: 'Default currency for pricing display',
                  },
                },
                {
                  name: 'exchangeRateEUR',
                  type: 'number',
                  label: 'Exchange Rate (1 EUR = X UAH)',
                  admin: {
                    description: 'For automatic currency conversion',
                  },
                },
                {
                  name: 'exchangeRateUSD',
                  type: 'number',
                  label: 'Exchange Rate (1 USD = X UAH)',
                },
              ],
            },
            {
              name: 'payments',
              type: 'group',
              fields: [
                {
                  name: 'enableLiqPay',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Enable LiqPay payment method',
                  },
                },
                {
                  name: 'enableStripe',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Enable Stripe payment method',
                  },
                },
                {
                  name: 'enableBankTransfer',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Enable bank transfer payment method',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Booking',
          fields: [
            {
              name: 'booking',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Enable online booking',
                  },
                },
                {
                  name: 'leadTime',
                  type: 'number',
                  defaultValue: 24,
                  admin: {
                    description: 'Minimum hours before appointment can be booked',
                  },
                },
                {
                  name: 'maxAdvanceBooking',
                  type: 'number',
                  defaultValue: 30,
                  admin: {
                    description: 'Maximum days in advance for booking',
                  },
                },
                {
                  name: 'confirmationEmail',
                  type: 'textarea',
                  localized: true,
                  admin: {
                    description: 'Custom message for booking confirmation email',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO & Analytics',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Default Open Graph image for social sharing',
                  },
                },
                {
                  name: 'googleSiteVerification',
                  type: 'text',
                  admin: {
                    description: 'Google Search Console verification code',
                  },
                },
              ],
            },
            {
              name: 'analytics',
              type: 'group',
              fields: [
                {
                  name: 'googleAnalyticsId',
                  type: 'text',
                  admin: {
                    description: 'Google Analytics 4 Measurement ID (G-XXXXXXX)',
                  },
                },
                {
                  name: 'facebookPixelId',
                  type: 'text',
                  admin: {
                    description: 'Facebook Pixel ID',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
