import Link from 'next/link'
import React from 'react'

import { Container } from './Container'
import { StatusDot } from './StatusDot'
import { WaveDivider } from './WaveDivider'

export function Footer({ siteName = 'Portfolio' }: { siteName?: string }) {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-line py-10">
      <Container>
        <WaveDivider className="mb-8 text-line/60" />
        <div className="flex flex-col items-start justify-between gap-4 font-mono text-sm text-muted sm:flex-row sm:items-center">
          <div className="flex flex-col gap-2">
            <StatusDot label="all systems nominal" />
            <p className="text-xs text-muted">
              &copy; {year} {siteName} · built &amp; self-hosted from the home lab
            </p>
          </div>
          <nav className="flex items-center gap-5">
            <Link href="/projects" className="transition-colors hover:text-accent">
              /projects
            </Link>
            <Link href="/blog" className="transition-colors hover:text-accent">
              /blog
            </Link>
            <Link href="/contact" className="transition-colors hover:text-accent">
              /contact
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  )
}
