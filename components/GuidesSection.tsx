'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { GuideCardData } from '@/lib/transformers'

type Props = {
  guides: GuideCardData[]
}

export default function GuidesSection({ guides }: Props) {
  return (
    <section className="bg-surface/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-end justify-between"
        >
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Learn</p>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Detailing Guides</h2>
          </div>
          <Link
            href="/guides"
            className="hidden items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-white sm:inline-flex"
          >
            All guides
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </motion.div>

        {guides.length === 0 ? (
          <div className="rounded-2xl border border-white/8 bg-surface p-10 text-center">
            <p className="mb-2 text-lg font-semibold text-white">Guides are on the way</p>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-zinc-500">
              Publish articles to the Shopify blog with the handle <span className="text-zinc-300">guides</span> and they will appear here automatically.
            </p>
            <Link
              href="/guides"
              className="mt-6 inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              View Guides Hub
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {guides.map((guide, index) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
              >
                <Link
                  href={`/guides/${guide.handle}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-white/8 bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/25"
                >
                  <div className="relative h-44 overflow-hidden bg-surface-2">
                    {guide.image ? (
                      <Image
                        src={guide.image.url}
                        alt={guide.image.altText ?? guide.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(39,174,96,0.05)_0%,transparent_70%)]" />
                    )}

                    {guide.category && (
                      <span className="absolute left-3 top-3 rounded-full bg-accent/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                        {guide.category}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug text-white transition-colors duration-200 group-hover:text-accent-bright">
                      {guide.title}
                    </h3>
                    {guide.excerpt && (
                      <p className="mb-4 flex-1 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                        {guide.excerpt}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xs text-zinc-600">
                        {[guide.publishedAt, guide.readTime && `${guide.readTime} read`].filter(Boolean).join(' · ')}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium text-accent">
                        Read
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
