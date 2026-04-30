'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const GUIDES = [
  { slug: 'how-to-wash-your-car-safely', tag: 'Exterior', title: 'How To Wash Your Car Without Swirl Marks', excerpt: 'Learn the two-bucket method, correct shampoo dilution, and drying techniques for a scratch-free finish.', readTime: '5 min', tagColor: 'bg-blue-500/15 text-blue-300' },
  { slug: 'ceramic-spray-vs-wax', tag: 'Protection', title: 'Ceramic Spray vs Wax: Which Is Right For You?', excerpt: 'A no-nonsense breakdown of durability, ease of application, and protection to help you choose correctly.', readTime: '7 min', tagColor: 'bg-violet-500/15 text-violet-300' },
  { slug: 'interior-detailing-checklist', tag: 'Interior', title: 'The Complete Interior Detailing Checklist', excerpt: 'From dashboard dressing to fabric deep-cleaning — detail your cabin like a pro with this guide.', readTime: '6 min', tagColor: 'bg-accent/15 text-accent' },
]

export default function GuidesSection() {
  return (
    <section className="py-20 bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">Learn</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Detailing Guides</h2>
          </div>
          <Link href="/guides" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            All guides
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {GUIDES.map((guide, i) => (
            <motion.div
              key={guide.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <Link
                href={`/guides/${guide.slug}`}
                className="group flex flex-col rounded-xl border border-white/8 bg-surface overflow-hidden hover:border-accent/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="relative h-44 bg-surface-2 overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(39,174,96,0.05)_0%,transparent_70%)]" />
                  <svg className="w-16 h-16 text-white/5 group-hover:text-white/8 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${guide.tagColor}`}>
                    {guide.tag}
                  </span>
                </div>
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="text-sm font-bold text-white leading-snug mb-2 group-hover:text-accent-bright transition-colors duration-200">{guide.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed flex-1 mb-4">{guide.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-600">{guide.readTime} read</span>
                    <span className="text-xs font-medium text-accent flex items-center gap-1">
                      Read
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
