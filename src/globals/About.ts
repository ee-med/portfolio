import type { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'About / Bio',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      defaultValue: 'Your Name',
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Headline',
      admin: {
        description: 'Short tagline shown under your name on the home hero.',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'richText',
      label: 'Bio',
      admin: {
        description: 'Longer intro rendered on the About page.',
      },
    },
    {
      name: 'skills',
      type: 'array',
      labels: { singular: 'Skill', plural: 'Skills' },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'workHistory',
      type: 'array',
      label: 'Work history',
      labels: { singular: 'Role', plural: 'Roles' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'role', type: 'text', required: true },
            { name: 'company', type: 'text', required: true },
          ],
        },
        {
          name: 'period',
          type: 'text',
          admin: { description: 'e.g. "2022 - Present"' },
        },
        {
          name: 'summary',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social links',
      labels: { singular: 'Link', plural: 'Links' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'text',
              required: true,
              admin: { description: 'e.g. GitHub, LinkedIn, X, Email' },
            },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'resumeFile',
      type: 'upload',
      relationTo: 'media',
      label: 'Resume / CV',
      admin: {
        description: 'Optional downloadable resume.',
      },
    },
  ],
}
