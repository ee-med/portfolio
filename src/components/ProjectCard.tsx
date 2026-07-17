import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import type { Project } from '@/payload-types'
import { mediaInfo } from '@/lib/media'
import { SkillChip } from '@/components/SkillChip'

export function ProjectCard({ project }: { project: Project }) {
  const image = mediaInfo(project.featuredImage)
  const tech = project.techStack?.slice(0, 4) ?? []

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-all hover:border-accent/60 hover:shadow-[0_0_40px_-16px_var(--color-accent)]"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-surface-2">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt || project.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-sm text-muted">
            {project.title}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold text-fg">{project.title}</h3>
        {project.summary && (
          <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">
            {project.summary}
          </p>
        )}
        {tech.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {tech.map((t, i) => (
              <SkillChip key={i} name={t.name} compact />
            ))}
          </ul>
        )}
      </div>
    </Link>
  )
}
