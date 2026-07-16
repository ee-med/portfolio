import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Project', plural: 'Projects' },
  access: {
    // Only published projects are readable by the public; authenticated
    // admins can read drafts too.
    read: ({ req }) => {
      if (req.user) return true
      return {
        _status: { equals: 'published' },
      }
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'featured', 'publishedAt', '_status'],
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL segment, e.g. "my-cool-app". Lowercase, no spaces.',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      admin: {
        description: 'Short one-liner shown on project cards.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Full write-up shown on the project detail page.',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      type: 'array',
      labels: { singular: 'Image', plural: 'Gallery' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'techStack',
      type: 'array',
      label: 'Tech stack',
      labels: { singular: 'Tech', plural: 'Tech' },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    {
      type: 'row',
      fields: [
        { name: 'repoUrl', type: 'text', label: 'Repository URL' },
        { name: 'liveUrl', type: 'text', label: 'Live URL' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Highlight on the home page.' },
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Manual sort order (lower shows first).',
          },
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
  ],
}
