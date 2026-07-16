import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Portfolio',
      admin: {
        description: 'Shown in the nav and footer, and as the browser title.',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'Used as the default meta description.',
      },
    },
    {
      name: 'contactEmail',
      type: 'email',
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Default social share image',
    },
  ],
}
