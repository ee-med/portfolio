import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { Container } from '@/components/Container'
import { RichText } from '@/components/RichText'
import { getPayloadClient } from '@/lib/payload'
import { mediaInfo } from '@/lib/media'
import { formatDate } from '@/lib/format'

async function getPost(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
    limit: 1,
  })
  return docs[0] ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt || undefined,
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const cover = mediaInfo(post.coverImage)
  const date = formatDate(post.publishedAt)

  return (
    <Container className="py-16 sm:py-24">
      <Link
        href="/blog"
        className="font-mono text-sm text-muted transition-colors hover:text-accent"
      >
        <span className="text-accent">$</span> cd ../blog
      </Link>

      <article className="mt-8">
        <header className="max-w-3xl">
          {date && (
            <span className="font-mono text-sm text-muted">{date}</span>
          )}
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          {post.tags && post.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {post.tags.map((t, i) => (
                <li
                  key={i}
                  className="rounded-full border border-line px-2.5 py-0.5 font-mono text-xs text-muted"
                >
                  {t.name}
                </li>
              ))}
            </ul>
          )}
        </header>

        {cover && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl border border-line">
            <Image
              src={cover.url}
              alt={cover.alt || post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {post.content && (
          <div className="mt-10 max-w-3xl">
            <RichText data={post.content} />
          </div>
        )}
      </article>
    </Container>
  )
}
