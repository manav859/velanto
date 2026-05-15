import type { Metadata } from 'next'
import Link from 'next/link'
import PageShell from '@/components/PageShell'
import PageHero from '@/components/PageHero'
import TrackOrderForm from './TrackOrderForm'

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Check the status of your Velanto order once the Shopify Admin tracking integration is enabled.',
}

export default function TrackOrderPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Order Status"
        title="Track Your Order"
        description="Enter your order number and email address to query the server-side tracking endpoint."
      />

      <div className="mx-auto max-w-xl space-y-6 px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-xs leading-relaxed text-amber-300/80">
            <strong className="text-amber-300">Order tracking is not live yet.</strong> This page is connected to a safe server-side placeholder route that validates input and returns a not-implemented response until Admin API access is configured.
          </p>
        </div>

        <TrackOrderForm />

        <div className="flex gap-4 rounded-xl border border-white/8 bg-surface/50 p-6">
          <div className="shrink-0 text-2xl">?</div>
          <div>
            <p className="mb-1 text-sm font-semibold text-white">Need help with an order?</p>
            <p className="text-xs leading-relaxed text-zinc-500">
              Reach out to support if you need a manual order status update before automated tracking is launched.
            </p>
            <Link href="/contact" className="mt-3 inline-block text-xs font-semibold text-accent hover:underline">
              Contact Support -&gt;
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
