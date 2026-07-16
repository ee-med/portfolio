import React from 'react'

import { Container } from '@/components/Container'
import { SectionHeader } from '@/components/SectionHeader'
import { BookingEmbed } from '@/components/BookingEmbed'

export const metadata = {
  title: 'Book a call',
}

const calLink = process.env.NEXT_PUBLIC_CAL_LINK
const calOrigin = process.env.NEXT_PUBLIC_CAL_ORIGIN

export default function BookPage() {
  return (
    <Container className="py-16 sm:py-24">
      <SectionHeader
        label="schedule"
        title="Book a call"
        description="Grab a slot that works for you. Runs on my self-hosted cal.com."
        size="page"
      />

      <div className="mt-10">
        {calLink && calOrigin ? (
          <BookingEmbed calLink={calLink} calOrigin={calOrigin} />
        ) : (
          <div className="rounded-xl border border-line bg-surface p-6 font-mono text-sm text-muted">
            <p className="text-accent">&gt; scheduler offline</p>
            <p className="mt-2">
              Booking isn&apos;t wired up yet. Set{' '}
              <code className="text-fg">NEXT_PUBLIC_CAL_LINK</code> (e.g.{' '}
              <code className="text-fg">alex/30min</code>) and{' '}
              <code className="text-fg">NEXT_PUBLIC_CAL_ORIGIN</code> (your
              cal.com URL) in the environment.
            </p>
          </div>
        )}
      </div>
    </Container>
  )
}
