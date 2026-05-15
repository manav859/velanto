'use client'

import { motion } from 'framer-motion'

const FEATURES = [
  { title: 'Made for India', body: 'Every formula is positioned for Indian roads, dust levels, humidity, and hard water conditions.' },
  { title: 'Pro-Grade Formula', body: 'pH-balanced, non-abrasive formulas designed to clean effectively while respecting modern paint and trim.' },
  { title: 'Secure Checkout', body: 'Checkout is handled on Shopify so customers complete payment on a trusted hosted flow.' },
  { title: 'Beginner Friendly', body: 'Starter kits and straightforward product pages make it easier to build a safe detailing routine.' },
]

export default function WhyChooseUs() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Why Velanto</p>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Built Different. By Detailers.</h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="group rounded-xl border border-white/8 bg-surface p-6 transition-all duration-300 hover:border-accent/25 hover:bg-surface-2"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-sm font-bold text-accent transition-colors duration-300 group-hover:bg-accent/20">
                0{index + 1}
              </div>
              <h3 className="mb-2 text-base font-bold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-500">{feature.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
