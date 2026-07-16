import Link from 'next/link'
import React from 'react'

import { WaveDivider } from './WaveDivider'

/**
 * Deep Signal section header: mono `> label`, a bold title, an optional
 * description and CTA link, capped with a waveform divider.
 */
export function SectionHeader({
  label,
  title,
  description,
  cta,
  size = 'section',
}: {
  label: string
  title: string
  description?: string
  cta?: { href: string; label: string }
  size?: 'section' | 'page'
}) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        &gt; {label}
      </p>
      <div className="mt-1 flex items-baseline justify-between gap-4">
        <h2
          className={
            size === 'page'
              ? 'text-3xl font-bold tracking-tight sm:text-4xl'
              : 'text-2xl font-bold tracking-tight'
          }
        >
          {title}
        </h2>
        {cta && (
          <Link
            href={cta.href}
            className="shrink-0 font-mono text-sm text-muted transition-colors hover:text-accent"
          >
            {cta.label} &rarr;
          </Link>
        )}
      </div>
      {description && <p className="mt-3 max-w-2xl text-muted">{description}</p>}
      <WaveDivider className="mt-5 text-line" />
    </div>
  )
}
