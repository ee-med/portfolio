import Image from 'next/image'
import React from 'react'

import { Container } from '@/components/Container'
import { RichText } from '@/components/RichText'
import { SkillChip } from '@/components/SkillChip'
import { getPayloadClient } from '@/lib/payload'
import { mediaInfo } from '@/lib/media'

export const metadata = {
  title: 'About',
}

export default async function AboutPage() {
  const payload = await getPayloadClient()
  const about = await payload.findGlobal({ slug: 'about' })

  const avatar = mediaInfo(about.avatar)
  const resume = mediaInfo(about.resumeFile)

  return (
    <Container className="py-16 sm:py-24">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {avatar && (
          <Image
            src={avatar.url}
            alt={avatar.alt || about.fullName}
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            &gt; about
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {about.fullName}
          </h1>
          {about.headline && (
            <p className="mt-2 font-mono text-sm text-muted">
              {about.headline}
            </p>
          )}
        </div>
      </div>

      {about.bio && <RichText data={about.bio} className="mt-10" />}

      {Array.isArray(about.skills) && about.skills.length > 0 && (
        <section className="mt-12">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
            &gt; skills
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {about.skills.map((skill, i) => (
              <SkillChip key={i} name={skill.name} />
            ))}
          </ul>
        </section>
      )}

      {Array.isArray(about.workHistory) && about.workHistory.length > 0 && (
        <section className="mt-12">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
            &gt; experience
          </h2>
          <ol className="mt-4 space-y-6">
            {about.workHistory.map((job, i) => (
              <li
                key={i}
                className="rounded-xl border border-line bg-surface p-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">
                    {job.role}{' '}
                    <span className="text-muted">@ {job.company}</span>
                  </h3>
                  {job.period && (
                    <span className="font-mono text-xs text-muted">
                      {job.period}
                    </span>
                  )}
                </div>
                {job.summary && (
                  <p className="mt-2 text-sm text-muted">{job.summary}</p>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {(Array.isArray(about.socialLinks) && about.socialLinks.length > 0) ||
      resume ? (
        <section className="mt-12 flex flex-wrap items-center gap-4">
          {about.socialLinks?.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-accent transition-colors hover:text-glow hover:underline"
            >
              {link.platform}
            </a>
          ))}
          {resume && (
            <a
              href={resume.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-line px-4 py-2 font-mono text-sm transition-colors hover:border-accent hover:text-accent"
            >
              download resume
            </a>
          )}
        </section>
      ) : null}
    </Container>
  )
}
