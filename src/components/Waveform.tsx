'use client'

import React, { useEffect, useRef } from 'react'

/**
 * Live waveform trace — the shared motif of the site: an audio wave,
 * a water ripple, and a sonar sweep all at once. Animated on canvas,
 * pauses for prefers-reduced-motion, and pauses when offscreen.
 */
export function Waveform({
  height = 120,
  className = '',
}: {
  height?: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    let raf = 0
    let width = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const accent = '#2ee6c6'
    const neon = '#ff3d81'

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height)
      const mid = height / 2

      const drawTrace = (
        color: string,
        amp: number,
        freq: number,
        speed: number,
        alpha: number,
        lineWidth: number,
      ) => {
        ctx.beginPath()
        for (let x = 0; x <= width; x += 2) {
          // Layered sines + a little jitter = organic wave / sonar noise.
          const phase = (x / width) * Math.PI * freq
          const envelope = Math.sin((x / width) * Math.PI) // taper at edges
          const y =
            mid +
            Math.sin(phase + t * speed) * amp * envelope +
            Math.sin(phase * 2.3 + t * speed * 1.7) * (amp * 0.35) * envelope
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.globalAlpha = alpha
        ctx.strokeStyle = color
        ctx.lineWidth = lineWidth
        ctx.shadowColor = color
        ctx.shadowBlur = 12
        ctx.stroke()
        ctx.globalAlpha = 1
        ctx.shadowBlur = 0
      }

      const time = reduce ? 0 : t / 1000
      drawTrace(neon, height * 0.16, 7, 0.8, 0.5, 1.5)
      drawTrace(accent, height * 0.28, 5, 1.1, 0.95, 2)

      if (!reduce) raf = requestAnimationFrame(draw)
    }

    if (reduce) draw(0)
    else raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [height])

  return (
    <canvas
      ref={canvasRef}
      style={{ height, width: '100%', display: 'block' }}
      className={className}
      aria-hidden="true"
    />
  )
}
