import type { Media } from '@/payload-types'

type MediaRef = number | Media | null | undefined

/** Safely pull the URL and alt from an upload field (populated or not). */
export function mediaInfo(ref: MediaRef): { url: string; alt: string } | null {
  if (!ref || typeof ref === 'number') return null
  if (!ref.url) return null
  return { url: ref.url, alt: ref.alt || '' }
}
