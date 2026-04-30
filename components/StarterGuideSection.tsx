'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function StarterGuideSection() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative rounded-2xl overflow-hidden border border-white/8 bg-surface"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_50%,rgba(39,174,96,0.06)_0%,transparent_70%)]" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(39,174,96,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(39,174,96,0.8) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative px-8 sm:px-12 lg:px-16 py-14 sm:py-16 flex flex-col lg:flex-row items-start lg:items-center gap-8 justify-between">
            <div className="max-w-lg">
              <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">Just Getting Started?</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">New To Car Detailing?</h2>
              <p className="text-base text-zinc-400 leading-relaxed">
                Start with easy-to-use essentials designed for beginners. Our starter kits come with everything you need and a step-by-step guide.
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4">
              <Link href="/collections/kits-bundles" className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-white hover:bg-accent-bright transition-colors duration-200 whitespace-nowrap">
                Shop Starter Kits
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link href="/guides" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/5 transition-colors duration-200 whitespace-nowrap">
                Read Guides
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
