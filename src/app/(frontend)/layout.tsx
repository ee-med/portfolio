import type { Metadata } from 'next'
import Script from 'next/script'
import React from 'react'

import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { getPayloadClient } from '@/lib/payload'
import { mediaInfo } from '@/lib/media'
import { display, mono } from './fonts'
import './styles.css'

// Payload content lives in the runtime SQLite volume, which does not exist in
// the build image. Render public pages at request time instead of querying the
// CMS while the Docker image is being built.
export const dynamic = 'force-dynamic'

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID

async function getSiteSettings() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings' })
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteName = settings.siteName || 'Portfolio'
  const description = settings.tagline || 'Full stack engineer portfolio.'
  const og = mediaInfo(settings.ogImage)

  return {
    metadataBase: new URL(serverUrl),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    openGraph: {
      type: 'website',
      siteName,
      title: siteName,
      description,
      url: serverUrl,
      images: og ? [{ url: og.url }] : undefined,
    },
    twitter: {
      card: og ? 'summary_large_image' : 'summary',
      title: siteName,
      description,
      images: og ? [og.url] : undefined,
    },
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const settings = await getSiteSettings()
  const siteName = settings.siteName || 'Portfolio'

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${mono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <Nav siteName={siteName} />
        <main className="flex-1">{children}</main>
        <Footer siteName={siteName} />
        {umamiSrc && umamiWebsiteId && (
          <Script
            src={umamiSrc}
            data-website-id={umamiWebsiteId}
            strategy="afterInteractive"
            defer
          />
        )}
      </body>
    </html>
  )
}
