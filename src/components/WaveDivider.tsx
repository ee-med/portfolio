import React from 'react'

/** Static sonar/water trace used as a section divider. */
export function WaveDivider({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      className={`h-6 w-full ${className}`}
      aria-hidden="true"
    >
      <path
        d="M0 20 Q 30 4 60 20 T 120 20 T 180 20 T 240 20 T 300 20 T 360 20 T 420 20 T 480 20 T 540 20 T 600 20 T 660 20 T 720 20 T 780 20 T 840 20 T 900 20 T 960 20 T 1020 20 T 1080 20 T 1140 20 T 1200 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-line"
      />
    </svg>
  )
}
