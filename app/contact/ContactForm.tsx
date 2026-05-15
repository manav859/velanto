'use client'

import { useState } from 'react'
import Link from 'next/link'
import { publicContact, publicContactLinks } from '@/lib/site'

type Status = 'idle' | 'opening' | 'ready'

function buildMailtoHref(form: {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}) {
  if (!publicContact.email) return null

  const subject = form.subject.trim() || 'Velanto support enquiry'
  const lines = [
    `Name: ${form.name || 'Not provided'}`,
    `Email: ${form.email}`,
    `Phone: ${form.phone || 'Not provided'}`,
    '',
    form.message,
  ]

  const params = new URLSearchParams({
    subject,
    body: lines.join('\n'),
  })

  return `mailto:${publicContact.email}?${params.toString()}`
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const isConfigured = !!publicContact.email

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!isConfigured) return

    const href = buildMailtoHref(form)
    if (!href) return

    setStatus('opening')
    window.location.href = href
    setStatus('ready')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {[
          { key: 'name', label: 'NAME', placeholder: 'Your full name', type: 'text' },
          { key: 'phone', label: 'PHONE', placeholder: 'Your phone number', type: 'tel' },
        ].map((field) => (
          <div key={field.key}>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">
              {field.label}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.key as keyof typeof form]}
              onChange={(event) => setForm((value) => ({ ...value, [field.key]: event.target.value }))}
              className="w-full rounded-lg border border-white/8 bg-background px-4 py-3 text-sm text-white transition-colors placeholder:text-zinc-600 focus:border-accent/40 focus:outline-none"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">EMAIL</label>
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))}
          className="w-full rounded-lg border border-white/8 bg-background px-4 py-3 text-sm text-white transition-colors placeholder:text-zinc-600 focus:border-accent/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">SUBJECT</label>
        <input
          type="text"
          placeholder="Order issue / Product query / Other"
          value={form.subject}
          onChange={(event) => setForm((value) => ({ ...value, subject: event.target.value }))}
          className="w-full rounded-lg border border-white/8 bg-background px-4 py-3 text-sm text-white transition-colors placeholder:text-zinc-600 focus:border-accent/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">MESSAGE</label>
        <textarea
          required
          rows={5}
          placeholder="Tell us how we can help..."
          value={form.message}
          onChange={(event) => setForm((value) => ({ ...value, message: event.target.value }))}
          className="w-full resize-none rounded-lg border border-white/8 bg-background px-4 py-3 text-sm text-white transition-colors placeholder:text-zinc-600 focus:border-accent/40 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={!isConfigured || status === 'opening'}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3.5 text-sm font-bold text-white transition-colors hover:bg-accent-bright disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'opening' ? 'Opening email app...' : isConfigured ? 'Email Support' : 'Support Email Unavailable'}
      </button>

      <div className="rounded-xl border border-white/8 bg-background/60 px-4 py-3 text-xs leading-relaxed text-zinc-500">
        {isConfigured ? (
          <>
            <p>
              This form opens your default email app and drafts a message to{' '}
              <span className="text-zinc-300">{publicContact.email}</span>.
            </p>
            {status === 'ready' && (
              <p className="mt-2 text-zinc-400">
                If nothing opened, email us directly at{' '}
                <a href={publicContactLinks.email ?? undefined} className="text-accent hover:underline">
                  {publicContact.email}
                </a>.
              </p>
            )}
          </>
        ) : (
          <p>
            A public support email is not configured yet. Publish `NEXT_PUBLIC_SUPPORT_EMAIL` before launch or keep this page hidden.
          </p>
        )}
      </div>

      <p className="text-center text-xs text-zinc-600">
        Need quick answers? <Link href="/faqs" className="text-accent hover:underline">Browse FAQs</Link>
        {publicContactLinks.whatsapp && (
          <>
            {' '}or{' '}
            <a href={publicContactLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              message us on WhatsApp
            </a>
          </>
        )}
        .
      </p>
    </form>
  )
}
