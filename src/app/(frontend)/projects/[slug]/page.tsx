import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { Container } from '@/components/Container'
import { RichText } from '@/components/RichText'
import { getPayloadClient } from '@/lib/payload'
import { mediaInfo } from '@/lib/media'

async function getProject(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
    limit: 1,
  })
  return docs[0] ?? null
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    where: { _status: { equals: 'published' } },
    limit: 100,
    select: { slug: true },
  })
  return docs.map((doc) => ({ slug: doc.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.summary || undefined,
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  const hero = mediaInfo(project.featuredImage)
  const gallery = (project.gallery ?? [])
    .map((item) => mediaInfo(item.image))
    .filter((m): m is { url: string; alt: string } => m !== null)

  return (
    <Container className="py-16 sm:py-24">
      <Link
        href="/projects"
        className="font-mono text-sm text-muted transition-colors hover:text-accent"
      >
        <span className="text-accent">$</span> cd ../projects
      </Link>

      <header className="mt-8 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          {project.title}
        </h1>
        {project.summary && (
          <p className="mt-4 text-lg text-muted">{project.summary}</p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
            >
              visit live site
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-line px-4 py-2 font-mono text-sm font-medium transition-colors hover:border-accent hover:text-accent"
            >
              view code
            </a>
          )}
        </div>

        {project.techStack && project.techStack.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-1.5">
            {project.techStack.map((t, i) => (
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

      {hero && (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-xl border border-line">
          <Image
            src={hero.url}
            alt={hero.alt || project.title}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {project.description && (
        <div className="mt-10 max-w-3xl">
          <RichText data={project.description} />
        </div>
      )}

      {gallery.length > 0 && (
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {gallery.map((img, i) => (
            <div
              key={i}
              className="relative aspect-[3/2] overflow-hidden rounded-xl border border-line"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}
