import React from 'react'

import { Container } from '@/components/Container'
import { PostCard } from '@/components/PostCard'
import { SectionHeader } from '@/components/SectionHeader'
import { getPayloadClient } from '@/lib/payload'

export const metadata = {
  title: 'Blog',
}

export default async function BlogPage() {
  const payload = await getPayloadClient()
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 100,
  })

  return (
    <Container className="py-16 sm:py-24">
      <SectionHeader
        label="log"
        title="Signal log"
        description="Notes on engineering, the home lab, and whatever else is on the workbench."
        size="page"
      />

      {posts.length === 0 ? (
        <p className="mt-12 font-mono text-muted">
          <span className="text-accent">$</span> no posts published yet.
        </p>
      ) : (
        <div className="mt-10 flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </Container>
  )
}
