'use client'

import { useState } from 'react'
import Link from 'next/link'

type State = 'idle' | 'searching' | 'result'

type ApiResult = {
  error?: string
  message?: string
  status?: string
}

export default function TrackOrderForm() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  const [resultMessage, setResultMessage] = useState<string | null>(null)
  const [resultTone, setResultTone] = useState<'neutral' | 'error'>('neutral')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!orderNumber.trim() || !email.trim()) return

    setState('searching')
    setResultMessage(null)

    try {
      const response = await fetch('/api/track-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber,
          email,
        }),
      })

      const data = (await response.json()) as ApiResult
      setResultTone(response.ok || response.status === 501 ? 'neutral' : 'error')
      setResultMessage(data.message ?? 'Order tracking is not available yet.')
    } catch {
      setResultTone('error')
      setResultMessage('We could not reach the order tracking service. Please try again later.')
    } finally {
      setState('result')
    }
  }

  const reset = () => {
    setOrderNumber('')
    setEmail('')
    setResultMessage(null)
    setResultTone('neutral')
    setState('idle')
  }

  if (state === 'result') {
    return (
      <div className="space-y-5 rounded-xl border border-white/8 bg-surface p-8 text-center">
        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full border ${resultTone === 'error' ? 'border-amber-500/20 bg-amber-500/10 text-amber-300' : 'border-accent/20 bg-accent/10 text-accent'}`}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zm9-3.758c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
          </svg>
        </div>
        <div>
          <p className="mb-1 text-lg font-bold text-white">Order Tracking Not Live Yet</p>
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-zinc-400">
            {resultMessage ?? 'Order tracking is not available yet for this storefront.'}
          </p>
        </div>
        <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
          <Link href="/contact" className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent-bright">
            Contact Support
          </Link>
          <button onClick={reset} className="rounded-lg border border-white/8 px-5 py-2.5 text-sm text-zinc-500 transition-colors hover:border-white/20 hover:text-white">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-white/8 bg-surface p-8">
      <div className="space-y-2">
        <label htmlFor="order-number" className="block text-xs font-bold uppercase tracking-widest text-zinc-400">
          Order Number
        </label>
        <input
          id="order-number"
          type="text"
          placeholder="e.g. VEL-10042"
          value={orderNumber}
          onChange={(event) => setOrderNumber(event.target.value)}
          required
          className="w-full rounded-lg border border-white/10 bg-background px-4 py-3 text-sm text-white transition-colors placeholder:text-zinc-600 focus:border-accent/50 focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="track-email" className="block text-xs font-bold uppercase tracking-widest text-zinc-400">
          Email Address
        </label>
        <input
          id="track-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full rounded-lg border border-white/10 bg-background px-4 py-3 text-sm text-white transition-colors placeholder:text-zinc-600 focus:border-accent/50 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={state === 'searching'}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-bold text-white transition-colors hover:bg-accent-bright disabled:opacity-70"
      >
        {state === 'searching' ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Checking status...
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            Check Tracking
          </>
        )}
      </button>

      <p className="text-center text-xs leading-relaxed text-zinc-600">
        This form sends your order number and email to a server-side placeholder endpoint only. No tracking data is returned until the Shopify Admin integration is implemented.{' '}
        <Link href="/contact" className="text-accent hover:underline">Contact us</Link> for help in the meantime.
      </p>
    </form>
  )
}
