'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const CATEGORIES = [
  { title: 'Exterior Wash', description: 'Shampoos, foam cannons & wash mitts', href: '/collections/exterior-care', color: 'group-hover:bg-blue-500/10 group-hover:border-blue-500/30', icon: '🫧' },
  { title: 'Interior Care', description: 'Cleaners, dressings & odour eliminators', href: '/collections/interior-care', color: 'group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30', icon: '🪑' },
  { title: 'Wheel & Tyre', description: 'Rim cleaners, tyre dressings & brushes', href: '/collections/wheel-tyre', color: 'group-hover:bg-orange-500/10 group-hover:border-orange-500/30', icon: '⚙️' },
  { title: 'Ceramic Protection', description: 'Ceramic sprays, coatings & sealants', href: '/collections/ceramic', color: 'group-hover:bg-violet-500/10 group-hover:border-violet-500/30', icon: '💎' },
  { title: 'Microfibre', description: 'Towels, applicators & detailing tools', href: '/collections/microfibre', color: 'group-hover:bg-pink-500/10 group-hover:border-pink-500/30', icon: '🧹' },
  { title: 'Kits & Bundles', description: 'Curated sets for complete detailing', href: '/collections/kits-bundles', color: 'group-hover:bg-accent/10 group-hover:border-accent/30', icon: '📦' },
]

export default function CategoryTiles() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">Browse by Category</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Shop By Need</h2>
          </div>
          <Link href="/shop" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            View all
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                href={cat.href}
                className={`group relative flex flex-col justify-between rounded-xl border border-white/8 bg-surface p-5 min-h-40 hover:-translate-y-0.5 transition-all duration-300 ${cat.color}`}
              >
                <span className="text-3xl mb-2">{cat.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight mb-1">{cat.title}</h3>
                  <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors leading-snug">{cat.description}</p>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
