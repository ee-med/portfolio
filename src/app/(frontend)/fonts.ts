import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'

// Display / body: techno-geometric with personality.
export const display = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
})

// Telemetry / terminal voice.
export const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono-src',
})
