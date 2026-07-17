import Link from 'next/link'
import React from 'react'

import { Container } from '@/components/Container'
import { ProjectCard } from '@/components/ProjectCard'
import { PostCard } from '@/components/PostCard'
import { Waveform } from '@/components/Waveform'
import { StatusDot } from '@/components/StatusDot'
import { SectionHeader } from '@/components/SectionHeader'
import { getPayloadClient } from '@/lib/payload'

export default async function HomePage() {
  const payload = await getPayloadClient()

  const about = await payload.findGlobal({ slug: 'about' })

  const { docs: featured } = await payload.find({
    collection: 'projects',
    where: {
      and: [
        { featured: { equals: true } },
        { _status: { equals: 'published' } },
      ],
    },
    sort: ['order', '-publishedAt'],
    limit: 4,
  })

  const { docs: latestPosts } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 3,
  })

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Sonar glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] max-w-none -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{
            background:
              'radial-gradient(closest-side, rgba(46,230,198,0.18), transparent)',
          }}
        />
        <Container className="relative py-24 sm:py-32">
          <div className="max-w-2xl">
            <StatusDot label="online · casting signals" />
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              {about.fullName ? (
                <>
                  Hi, I&apos;m{' '}
                  <span className="text-accent text-glow">
                    {about.fullName}
                  </span>
                  .
                </>
              ) : (
                'Hi there.'
              )}
            </h1>
            {about.headline && (
              <p className="mt-4 font-mono text-sm text-muted">
                <span className="text-accent">&gt;</span> {about.headline}
              </p>
            )}
            <p className="mt-6 max-w-xl text-lg text-muted">
              {about.heroIntro ||
                'AI & full-stack engineer. I build production-grade RAG systems and real-time voice assistants, run a home lab, chase techno line-ups, and fish when the servers behave.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/projects"
                data-umami-event="hero-projects"
                className="rounded-lg bg-accent px-5 py-2.5 font-mono text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
              >
                view projects
              </Link>
              <Link
                href="/contact"
                data-umami-event="hero-contact"
                className="rounded-lg border border-line px-5 py-2.5 font-mono text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent"
              >
                get in touch
              </Link>
            </div>
          </div>
        </Container>

        {/* Signature waveform */}
        <Container className="relative pb-8">
          <Waveform height={130} />
        </Container>
      </section>

      {featured.length > 0 && (
        <Container className="pb-16">
          <SectionHeader
            label="projects"
            title="Featured work"
            cta={{ href: '/projects', label: 'all projects' }}
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Container>
      )}

      {latestPosts.length > 0 && (
        <Container className="pb-24">
          <SectionHeader
            label="log"
            title="Latest writing"
            cta={{ href: '/blog', label: 'all posts' }}
          />
          <div className="mt-8 flex flex-col gap-4">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </Container>
      )}
    </>
  )
}
