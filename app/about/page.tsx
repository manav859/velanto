import type { Metadata } from 'next'
import Link from 'next/link'
import PageShell from '@/components/PageShell'
import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'About Velanto',
  description: 'Learn about Velanto Auto Care and the product principles behind the headless storefront.',
}

const HIGHLIGHTS = [
  { value: 'India', label: 'Built For Local Conditions' },
  { value: 'Shopify', label: 'Hosted Checkout & Orders' },
  { value: 'Headless', label: 'Modern Next.js Storefront' },
  { value: 'Focused', label: 'Car Care Essentials' },
]

const PRINCIPLES = [
  {
    num: '01',
    title: 'India First',
    body: 'Product positioning, content, and bundle logic are focused on Indian roads, climate, and maintenance habits.',
    accent: false,
  },
  {
    num: '02',
    title: 'No Compromises',
    body: 'The storefront keeps checkout on Shopify, preserves accurate pricing, and avoids fake account or payment flows.',
    accent: false,
  },
  {
    num: '03',
    title: 'Results Matter',
    body: 'The site is designed to help customers choose the right products quickly with clear product information and reliable cart behavior.',
    accent: true,
  },
]

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Our Story"
        title="Built For A Showroom Finish"
        description="Velanto is a premium car care brand concept paired with a production-focused headless Shopify storefront. The experience is designed to stay fast, polished, and honest about what is live today."
      />

      <section className="bg-accent px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 sm:grid-cols-4">
          {HIGHLIGHTS.map((item) => (
            <div key={item.label} className="text-center">
              <p className="mb-1 text-3xl font-black text-white sm:text-4xl">{item.value}</p>
              <p className="text-sm font-medium text-white/70">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">What We Stand For</p>
            <h2 className="text-3xl font-black text-white sm:text-4xl">Our Principles</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <div
                key={principle.title}
                className={`rounded-xl border p-8 ${principle.accent ? 'border-accent bg-accent' : 'border-white/8 bg-surface'}`}
              >
                <p className={`mb-4 text-4xl font-black ${principle.accent ? 'text-white/20' : 'text-white/10'}`}>{principle.num}</p>
                <h3 className="mb-2 text-lg font-bold text-white">{principle.title}</h3>
                <div className={`mb-4 h-1 w-10 rounded-full ${principle.accent ? 'bg-white/40' : 'bg-accent'}`} />
                <p className={`text-sm leading-relaxed ${principle.accent ? 'text-white/80' : 'text-zinc-500'}`}>{principle.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/8 bg-surface/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div className="aspect-video rounded-2xl border border-white/8 bg-surface">
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-accent">Production Focus</p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
                Fast pages, Shopify-hosted checkout, graceful empty states, and honest platform constraints come before flashy claims.
              </p>
            </div>
          </div>
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">The Velanto Mission</p>
            <h2 className="mb-6 text-3xl font-black text-white sm:text-4xl">Premium Feel, Practical Architecture</h2>
            <p className="mb-4 text-base leading-relaxed text-zinc-400">
              This storefront combines Shopify product data with a custom Next.js frontend so merchandising, cart state, content, and policy pages can evolve independently of the hosted checkout flow.
            </p>
            <p className="mb-8 text-base leading-relaxed text-zinc-400">
              The result is a storefront that stays easier to maintain, deploy, and scale while preserving the reliability of Shopify for orders and payment.
            </p>
            <Link href="/shop" className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-accent-bright">
              Shop Our Products
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
