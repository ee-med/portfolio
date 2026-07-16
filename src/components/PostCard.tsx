import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'
import { mediaInfo } from '@/lib/media'
import { formatDate } from '@/lib/format'

export function PostCard({ post }: { post: Post }) {
  const cover = mediaInfo(post.coverImage)
  const date = formatDate(post.publishedAt)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-5 rounded-xl border border-line bg-surface p-4 transition-all hover:border-accent/60 hover:shadow-[0_0_40px_-16px_var(--color-accent)]"
    >
      {cover && (
        <div className="relative hidden aspect-[3/2] w-40 shrink-0 overflow-hidden rounded-lg bg-surface-2 sm:block">
          <Image
            src={cover.url}
            alt={cover.alt || post.title}
            fill
            sizes="160px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-col">
        {date && (
          <span className="font-mono text-xs text-muted">{date}</span>
        )}
        <h3 className="mt-1 font-semibold text-fg">{post.title}</h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-muted">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  )
}
