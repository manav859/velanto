'use client'

import { motion } from 'framer-motion'

const FEATURES = [
  { icon: '🇮🇳', title: 'Made for India', body: 'Every formula tested on Indian roads — designed for our dust, humidity, and hard water conditions.' },
  { icon: '🧪', title: 'Pro-Grade Formula', body: 'pH-balanced, non-abrasive formulas that protect your clear coat while delivering a deep clean.' },
  { icon: '🚚', title: 'Fast Shipping', body: 'Orders dispatched same day. Free shipping above ₹999. Pan-India delivery in 3–5 days.' },
  { icon: '🎓', title: 'Beginner Friendly', body: 'Starter kits and step-by-step guides make professional detailing accessible to everyone.' },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">Why Velanto</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Built Different. By Detailers.</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group rounded-xl border border-white/8 bg-surface p-6 hover:border-accent/25 hover:bg-surface-2 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-2xl mb-5 group-hover:bg-accent/20 transition-colors duration-300">
                {feat.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{feat.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
