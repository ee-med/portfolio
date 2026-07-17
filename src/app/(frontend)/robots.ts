import type { MetadataRoute } from 'next'

const siteUrl =
  process.env.NEXT_PUBLIC_SERVER_URL || 'https://melhachimi.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/users/',
        '/api/contact-messages/',
        '/api/graphql',
      ],
    },
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
    host: siteUrl,
  }
}
