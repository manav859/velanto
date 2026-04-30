'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import AnnouncementBar from '@/components/AnnouncementBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const STATS = [
  { value: '50,000+', label: 'Cars Serviced' },
  { value: '120+', label: 'Products' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '28', label: 'States Delivered' },
]

const PRINCIPLES = [
  { num: '01', title: 'India First', body: 'Every product is tested on Indian roads — our formulas are optimised for local dust, water, and climate conditions.' },
  { num: '02', title: 'No Compromises', body: 'We use the same ingredients as international brands used by professional detailers. Zero compromise on quality.' },
  { num: '03', title: 'Results Matter', body: 'Every formula is obsessively developed until it delivers showroom results. If it doesn\'t work perfectly, it doesn\'t ship.' },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as number[] },
})

export default function AboutPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-background py-20 px-4 sm:px-6 lg:px-8 border-b border-white/8">
          <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-widest uppercase text-accent mb-4">Our Story</motion.p>
              <motion.h1 {...fadeUp(0.08)} className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight mb-6">
                Born on Indian<br />Roads. Built for<br />
                <span className="text-accent">Indian Cars.</span>
              </motion.h1>
              <motion.div {...fadeUp(0.16)} className="w-16 h-1 bg-accent rounded-full mb-6" />
              <motion.p {...fadeUp(0.22)} className="text-base text-zinc-400 leading-relaxed max-w-lg">
                Velanto was founded by car enthusiasts who were frustrated by imported products that didn&apos;t understand Indian road conditions. We built what we wished existed — professional-grade car care made specifically for our dust, our humidity, and our roads.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl bg-surface border border-white/8 aspect-4/3 flex items-center justify-center overflow-hidden"
            >
              <div className="text-center p-8">
                <span className="text-8xl">🚗</span>
                <p className="text-zinc-500 text-sm mt-4">Est. 2022 • Mumbai, India</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-accent py-14 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl grid grid-cols-2 sm:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div key={s.label} {...fadeUp(i * 0.08)} className="text-center">
                <p className="text-3xl sm:text-4xl font-black text-white mb-1">{s.value}</p>
                <p className="text-sm text-white/70 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Principles */}
        <section className="bg-background py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeUp(0)} className="mb-14">
              <p className="text-xs font-bold tracking-widest uppercase text-accent mb-3">What We Stand For</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white">Our Principles</h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {PRINCIPLES.map((p, i) => (
                <motion.div
                  key={p.title}
                  {...fadeUp(i * 0.1)}
                  className={`rounded-xl border p-8 ${i === 2 ? 'bg-accent border-accent' : 'bg-surface border-white/8'}`}
                >
                  <p className={`text-4xl font-black mb-4 ${i === 2 ? 'text-white/20' : 'text-white/10'}`}>{p.num}</p>
                  <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                  <div className={`w-10 h-1 rounded-full mb-4 ${i === 2 ? 'bg-white/40' : 'bg-accent'}`} />
                  <p className={`text-sm leading-relaxed ${i === 2 ? 'text-white/80' : 'text-zinc-500'}`}>{p.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission / Story */}
        <section className="bg-surface/30 py-20 px-4 sm:px-6 lg:px-8 border-t border-white/8">
          <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl bg-surface border border-white/8 aspect-video flex items-center justify-center"
            >
              <div className="text-center p-8">
                <span className="text-7xl">🧪</span>
                <p className="text-zinc-500 text-sm mt-4">18 months of R&D · 200+ formula iterations</p>
              </div>
            </motion.div>
            <div>
              <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-widest uppercase text-accent mb-4">The Velanto Mission</motion.p>
              <motion.h2 {...fadeUp(0.08)} className="text-3xl sm:text-4xl font-black text-white mb-6">Why We Started</motion.h2>
              <motion.p {...fadeUp(0.14)} className="text-zinc-400 text-base leading-relaxed mb-4">
                In 2022, two friends — a mechanical engineer and a car enthusiast — couldn&apos;t find a single Indian brand that matched international quality standards at an honest price.
              </motion.p>
              <motion.p {...fadeUp(0.2)} className="text-zinc-400 text-base leading-relaxed mb-8">
                After 18 months of R&D, 200+ formula iterations, and testing on 500 cars across 8 Indian cities, Velanto was born.
              </motion.p>
              <motion.div {...fadeUp(0.26)}>
                <Link href="/shop" className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-white hover:bg-accent-bright transition-colors">
                  Shop Our Products
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
