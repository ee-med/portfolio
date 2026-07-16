'use client'

import React, { useRef } from 'react'

/**
 * Skill chip with a "water" hover: a droplet ripple expands from the cursor
 * on enter, and a wet sheen follows the pointer while hovering.
 */
export function SkillChip({ name }: { name: string }) {
  const ref = useRef<HTMLLIElement>(null)

  const setSheen = (e: React.PointerEvent<HTMLLIElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  const spawnRipple = (e: React.PointerEvent<HTMLLIElement>) => {
    const el = ref.current
    if (!el) return
    setSheen(e)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    const ripple = document.createElement('span')
    ripple.className = 'water-ripple'
    ripple.style.left = `${e.clientX - rect.left}px`
    ripple.style.top = `${e.clientY - rect.top}px`
    el.appendChild(ripple)
    ripple.addEventListener('animationend', () => ripple.remove())
  }

  return (
    <li
      ref={ref}
      onPointerEnter={spawnRipple}
      onPointerMove={setSheen}
      className="water-chip relative overflow-hidden rounded-full border border-line bg-surface px-3 py-1 text-sm text-fg transition-colors hover:border-accent/60"
    >
      <span className="relative z-10">{name}</span>
    </li>
  )
}
