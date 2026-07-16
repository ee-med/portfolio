import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

/**
 * Demo/placeholder content seed. Safe to publish — contains no personal data.
 * Real content should be managed in the Payload admin (stored in the DB, which
 * is gitignored). Run with: pnpm seed
 *
 * WARNING: this overwrites the About/Site Settings globals and replaces the
 * demo projects/posts. Do not run it against a database that holds real content.
 */

// ── Lexical rich-text helpers ────────────────────────────────────────────
const text = (t: string) => ({
  type: 'text',
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text: t,
  version: 1,
})
const p = (t: string) => ({
  type: 'paragraph',
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  version: 1,
  children: [text(t)],
})
const h = (t: string, tag: 'h2' | 'h3' = 'h2') => ({
  type: 'heading',
  tag,
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  version: 1,
  children: [text(t)],
})
const doc = (children: object[]) => ({
  root: {
    type: 'root',
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children,
  },
})

async function seed() {
  const payload = await getPayload({ config: await config })

  payload.logger.info('Seeding SiteSettings...')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Your Name',
      tagline: 'Full stack engineer building things for the web.',
      contactEmail: 'hello@example.com',
    },
  })

  payload.logger.info('Seeding About...')
  await payload.updateGlobal({
    slug: 'about',
    data: {
      fullName: 'Your Name',
      headline: 'Full Stack Engineer',
      bio: doc([
        p(
          'This is placeholder bio text. Write a couple of paragraphs about who you are, what you build, and what you care about. Edit it in the admin or in the seed.',
        ),
        p(
          'Mention your focus areas, the kind of problems you like to solve, and anything that makes your work distinctive.',
        ),
      ]),
      skills: [
        { name: 'TypeScript' },
        { name: 'JavaScript' },
        { name: 'React' },
        { name: 'Next.js' },
        { name: 'Node.js' },
        { name: 'PostgreSQL' },
        { name: 'Docker' },
      ],
      workHistory: [
        {
          role: 'Senior Engineer',
          company: 'Company',
          period: '2022 - Present',
          summary: 'What you do here, and a highlight or two.',
        },
        {
          role: 'Engineer',
          company: 'Previous Company',
          period: '2020 - 2022',
          summary: 'What you built and the impact it had.',
        },
      ],
      socialLinks: [
        { platform: 'Email', url: 'mailto:hello@example.com' },
        { platform: 'GitHub', url: 'https://github.com/your-username' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/your-username' },
      ],
    },
  })

  payload.logger.info('Seeding Projects...')
  const projectSlugs = ['project-one', 'project-two', 'project-three']
  await payload.delete({
    collection: 'projects',
    where: { slug: { in: projectSlugs } },
  })

  const projects = [
    {
      title: 'Project One',
      slug: 'project-one',
      summary: 'A short, one-line description of what this project does.',
      techStack: ['Next.js', 'TypeScript', 'PostgreSQL'],
      featured: true,
      order: 0,
    },
    {
      title: 'Project Two',
      slug: 'project-two',
      summary: 'Another project summary. Keep it punchy and outcome-focused.',
      techStack: ['Node.js', 'TypeScript', 'Docker'],
      featured: true,
      order: 1,
    },
    {
      title: 'Project Three',
      slug: 'project-three',
      summary: 'A third project to fill out the grid.',
      techStack: ['React', 'Tailwind'],
      featured: false,
      order: 2,
    },
  ]

  for (const project of projects) {
    await payload.create({
      collection: 'projects',
      data: {
        ...project,
        techStack: project.techStack.map((name) => ({ name })),
        description: doc([
          h('The problem'),
          p('Describe the problem this project solves.'),
          h('What I built'),
          p('Describe your approach and what you shipped.'),
          h('Outcome'),
          p('Describe the results and impact.'),
        ]),
        publishedAt: '2026-01-01T00:00:00.000Z',
        _status: 'published',
      },
    })
  }

  payload.logger.info('Seeding Posts...')
  await payload.delete({
    collection: 'posts',
    where: { slug: { in: ['hello-world'] } },
  })
  await payload.create({
    collection: 'posts',
    data: {
      title: 'Hello world',
      slug: 'hello-world',
      excerpt: 'An example post to show the blog layout.',
      tags: [{ name: 'meta' }],
      publishedAt: '2026-01-01T00:00:00.000Z',
      content: doc([
        p('This is a sample blog post. Replace it with your own writing.'),
      ]),
      _status: 'published',
    },
  })

  payload.logger.info('Seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
