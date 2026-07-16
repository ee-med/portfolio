'use client'

import React, { useActionState } from 'react'

import { submitContact, type ContactState } from '@/app/(frontend)/contact/actions'

const initialState: ContactState = { status: 'idle' }

const fieldClass =
  'w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-accent'

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState,
  )

  if (state.status === 'success') {
    return (
      <div className="rounded-xl border border-accent/40 bg-surface p-6 shadow-[0_0_40px_-16px_var(--color-accent)]">
        <p className="font-mono text-sm text-accent">
          &gt; signal received
        </p>
        <p className="mt-2 text-sm text-muted">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm text-muted">
          Name
        </label>
        <input id="name" name="name" type="text" required className={fieldClass} />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm text-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm text-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={`${fieldClass} resize-y`}
        />
      </div>

      {/* Honeypot field, visually hidden from humans */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === 'error' && (
        <p className="text-sm text-red-400">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        data-umami-event="contact-submit"
        className="self-start rounded-lg bg-accent px-5 py-2.5 font-mono text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? 'transmitting...' : 'transmit message'}
      </button>
    </form>
  )
}
