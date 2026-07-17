import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'

const siteUrl =
  process.env.NEXT_PUBLIC_SERVER_URL || 'https://melhachimi.com'

// Published CMS content lives in the runtime SQLite volume, not the build image.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()

  const [{ docs: projects }, { docs: posts }] = await Promise.all([
    payload.find({
      collection: 'projects',
      where: { _status: { equals: 'published' } },
      limit: 1000,
    }),
    payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      limit: 1000,
    }),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    '/',
    '/about',
    '/projects',
    '/blog',
    '/contact',
    '/book',
  ].map((path) => ({
    url: new URL(path, siteUrl).toString(),
  }))

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: new URL(`/projects/${project.slug}`, siteUrl).toString(),
    lastModified: new Date(project.updatedAt),
  }))

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: new URL(`/blog/${post.slug}`, siteUrl).toString(),
    lastModified: new Date(post.updatedAt),
  }))

  return [...staticPages, ...projectPages, ...blogPages]
}
