'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import PageHero from '@/components/PageHero'

const FAQS = [
  {
    q: 'How long does shipping take?',
    a: 'Orders are dispatched according to the published shipping policy. Final delivery timelines and courier options are shown during Shopify checkout.',
  },
  {
    q: 'Are Velanto products safe for Indian cars?',
    a: 'The storefront content positions Velanto products for Indian road conditions, including dust, humidity, and hard water exposure.',
  },
  {
    q: 'Do I need professional equipment to use these products?',
    a: 'No. The catalog is organized for both beginners and enthusiasts, with starter kits and guides intended to make routine detailing more approachable.',
  },
  {
    q: 'Can I return a product?',
    a: 'Returns are governed by the Refund Policy. Review that page for eligibility, timelines, and the current return process before launch.',
  },
  {
    q: 'How do I track my order?',
    a: 'A safe tracking placeholder route exists, but live tracking still requires a server-side Shopify Admin integration. Until then, contact support for manual help.',
  },
  {
    q: 'Are products available across all of India?',
    a: 'The storefront is positioned for pan-India shipping, with final delivery availability and charges confirmed during checkout.',
  },
  {
    q: 'How should I store the products?',
    a: 'Store products in a cool, dry place away from direct sunlight and make sure containers are sealed after use.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'Payments are completed on Shopify hosted checkout. Available payment methods are determined there based on the store configuration.',
  },
  {
    q: 'How should I wash a car with ceramic coating or PPF?',
    a: 'Use gentle wash methods, clean microfibre tools, and product instructions that avoid abrasive contact. Guides can expand on this once the blog is fully populated.',
  },
  {
    q: 'How do I contact support?',
    a: 'Use the Contact page for the currently configured support channels. Public phone, email, and WhatsApp links only appear when they have been configured for launch.',
  },
]

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const buttonId = `${id}-button-${index}`
  const panelId = `${id}-panel-${index}`

  return (
    <div className="last:border-0 border-b border-white/8">
      <button
        id={buttonId}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-sm font-semibold leading-snug text-white sm:text-base">{q}</span>
        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/15 text-zinc-400 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </span>
      </button>
      {open && (
        <p id={panelId} role="region" aria-labelledby={buttonId} className="pb-5 pr-9 text-sm leading-relaxed text-zinc-400">
          {a}
        </p>
      )}
    </div>
  )
}

export default function FAQsClient() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Frequently Asked Questions"
        description="Everything you need to know about our products, shipping, checkout, and support."
      />

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-white/8 bg-surface px-6 sm:px-8">
          {FAQS.map((faq, index) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} index={index} />
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-accent/20 bg-accent/5 p-6 text-center">
          <p className="mb-1 font-semibold text-white">Still have questions?</p>
          <p className="mb-4 text-sm text-zinc-400">Reach out through the contact page and review the policy pages before launch.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent-bright"
          >
            Contact Us
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  )
}
