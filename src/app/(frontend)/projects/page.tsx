import React from 'react'

import { Container } from '@/components/Container'
import { ProjectCard } from '@/components/ProjectCard'
import { SectionHeader } from '@/components/SectionHeader'
import { getPayloadClient } from '@/lib/payload'

export const metadata = {
  title: 'Projects',
}

export default async function ProjectsPage() {
  const payload = await getPayloadClient()
  const { docs: projects } = await payload.find({
    collection: 'projects',
    where: { _status: { equals: 'published' } },
    sort: ['order', '-publishedAt'],
    limit: 100,
  })

  return (
    <Container className="py-16 sm:py-24">
      <SectionHeader
        label="projects"
        title="Things I've built"
        description="Side projects, work, and home-lab experiments. Some shipped, some still cooking."
        size="page"
      />

      {projects.length === 0 ? (
        <p className="mt-12 font-mono text-muted">
          <span className="text-accent">$</span> no projects published yet.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </Container>
  )
}
