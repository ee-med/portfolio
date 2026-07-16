'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

import { Container } from './Container'

const links = [
  { href: '/', label: 'home' },
  { href: '/projects', label: 'projects' },
  { href: '/about', label: 'about' },
  { href: '/blog', label: 'blog' },
  { href: '/contact', label: 'contact' },
  { href: '/book', label: 'book' },
]

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Nav({ siteName = 'Portfolio' }: { siteName?: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-mono text-sm font-semibold tracking-tight text-fg"
          onClick={() => setOpen(false)}
        >
          <span className="text-accent">~/</span>
          <span>{siteName}</span>
          <span className="animate-signal ml-0.5 hidden h-1.5 w-1.5 rounded-full bg-accent sm:inline-block" />
        </Link>

        <nav className="hidden items-center gap-1 font-mono sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm transition-colors hover:text-accent ${
                isActive(pathname, link.href)
                  ? 'text-accent'
                  : 'text-muted'
              }`}
            >
              <span className="text-line">/</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-muted hover:text-fg sm:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </Container>

      {open && (
        <nav className="border-t border-line font-mono sm:hidden">
          <Container className="flex flex-col py-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 text-sm transition-colors hover:text-accent ${
                  isActive(pathname, link.href) ? 'text-accent' : 'text-muted'
                }`}
              >
                <span className="text-line">/</span>
                {link.label}
              </Link>
            ))}
          </Container>
        </nav>
      )}
    </header>
  )
}
