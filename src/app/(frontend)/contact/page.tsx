import Link from 'next/link'
import React from 'react'

import { Container } from '@/components/Container'
import { ContactForm } from '@/components/ContactForm'
import { getPayloadClient } from '@/lib/payload'

export const metadata = {
  title: 'Contact',
}

export default async function ContactPage() {
  const payload = await getPayloadClient()
  const [settings, about] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings' }),
    payload.findGlobal({ slug: 'about' }),
  ])

  const socials = about.socialLinks ?? []

  return (
    <Container className="py-16 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            &gt; transmit
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Open a channel
          </h1>
          <p className="mt-3 text-muted">
            Got a project, a gig recommendation, or a good fishing spot? Send a
            signal and I&apos;ll get back to you.
          </p>

          {settings.contactEmail && (
            <p className="mt-6 font-mono text-sm text-muted">
              <span className="text-accent">$</span> mail{' '}
              <a
                href={`mailto:${settings.contactEmail}`}
                className="text-accent transition-colors hover:text-glow hover:underline"
              >
                {settings.contactEmail}
              </a>
            </p>
          )}

          {socials.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {socials.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-accent transition-colors hover:text-glow hover:underline"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          )}

          <div className="mt-8 border-t border-line pt-6">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              prefer a call?
            </p>
            <Link
              href="/book"
              data-umami-event="contact-book"
              className="mt-3 inline-block rounded-lg border border-line px-4 py-2 font-mono text-sm transition-colors hover:border-accent hover:text-accent"
            >
              book a slot &rarr;
            </Link>
          </div>
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </Container>
  )
}
