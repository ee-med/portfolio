'use client'

import { getCalApi } from '@calcom/embed-react'
import React, { useEffect, useRef } from 'react'

/**
 * Inline cal.com booking widget pointing at the self-hosted instance.
 * Uses the imperative `cal("inline")` API loaded from the instance's own
 * embed.js so no script is fetched from app.cal.com. `calLink` is like
 * "username/30min"; `calOrigin` is the instance URL.
 */
export function BookingEmbed({
  calLink,
  calOrigin,
}: {
  calLink: string
  calOrigin: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      // Load embed.js from the self-hosted instance only.
      const cal = await getCalApi({ embedJsUrl: `${calOrigin}/embed/embed.js` })
      if (cancelled || !ref.current) return
      // Configure UI before creating the iframe so branding applies cleanly.
      cal('ui', {
        theme: 'dark',
        cssVarsPerTheme: {
          light: { 'cal-brand': '#2ee6c6' },
          dark: { 'cal-brand': '#2ee6c6' },
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
      })
      cal('inline', {
        elementOrSelector: ref.current,
        calLink,
        config: { theme: 'dark' },
      })
    })()
    return () => {
      cancelled = true
    }
  }, [calLink, calOrigin])

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-xl border border-line"
      style={{ minHeight: '640px', width: '100%' }}
    />
  )
}
