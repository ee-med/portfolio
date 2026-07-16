'use server'

import { getPayloadClient } from '@/lib/payload'

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  // Honeypot: bots fill hidden fields; humans leave it empty.
  const honeypot = String(formData.get('company') ?? '').trim()
  if (honeypot) {
    return { status: 'success', message: 'Thanks, your message was sent.' }
  }

  if (!name || !email || !message) {
    return { status: 'error', message: 'All fields are required.' }
  }
  if (!EMAIL_RE.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }
  if (message.length > 5000) {
    return { status: 'error', message: 'Message is too long.' }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'contact-messages',
      data: { name, email, message },
      overrideAccess: true,
    })

    // Notify the n8n automation (auto-reply + owner notification).
    // Best-effort: a webhook failure must not fail the submission.
    await notifyAutomation({ name, email, message })

    return { status: 'success', message: 'Thanks, your message was sent.' }
  } catch {
    return {
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    }
  }
}

async function notifyAutomation(data: {
  name: string
  email: string
  message: string
}) {
  const url = process.env.N8N_CONTACT_WEBHOOK_URL
  if (!url) return
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, submittedAt: new Date().toISOString() }),
      // Don't hang the request if n8n is slow/down.
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) {
      console.error(`n8n webhook responded ${res.status}`)
    }
  } catch (err) {
    console.error('n8n webhook failed:', err)
  }
}
