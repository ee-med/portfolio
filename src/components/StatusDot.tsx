import React from 'react'

/** Home-lab style "live" indicator: a pulsing signal dot with a label. */
export function StatusDot({
  label = 'online',
  className = '',
}: {
  label?: string
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted ${className}`}
    >
      <span className="animate-signal inline-block h-2 w-2 rounded-full bg-accent" />
      {label}
    </span>
  )
}
