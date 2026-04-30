'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import AnnouncementBar from '@/components/AnnouncementBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as number[] },
})

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    await new Promise((r) => setTimeout(r, 1200))
    setStatus('sent')
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-background border-b border-white/8 py-16 px-4 sm:px-6 lg:px-8 text-center">
          <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-widest uppercase text-accent mb-3">Get In Touch</motion.p>
          <motion.h1 {...fadeUp(0.08)} className="text-4xl sm:text-5xl font-black text-white mb-3">We&apos;re Here to Help</motion.h1>
          <motion.p {...fadeUp(0.16)} className="text-zinc-400 text-sm">Usually responds within 2 hours on weekdays</motion.p>
        </section>

        {/* Body */}
        <section className="bg-background py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl grid lg:grid-cols-5 gap-12">

            {/* Info column */}
            <motion.div {...fadeUp(0)} className="lg:col-span-2 flex flex-col gap-8">
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Contact Details</h2>
                <div className="flex flex-col gap-5">
                  {[
                    { icon: '✉️', label: 'Email Us', value: 'support@velantoautocare.in' },
                    { icon: '📞', label: 'Call / WhatsApp', value: '+91 98765 43210' },
                    { icon: '📍', label: 'Location', value: 'Mumbai, Maharashtra, India' },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-lg shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-widest uppercase text-accent mb-0.5">{item.label}</p>
                        <p className="text-sm text-white">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-lg bg-[#25D366] px-5 py-3 text-sm font-bold text-white hover:bg-[#22c55e] transition-colors w-fit"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>

              {/* Social links */}
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-4">Follow Us</p>
                <div className="flex gap-3">
                  {['Instagram', 'YouTube', 'Facebook'].map((s) => (
                    <a key={s} href="#" aria-label={s} className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/25 transition-colors text-xs font-bold">
                      {s[0]}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div {...fadeUp(0.1)} className="lg:col-span-3">
              <div className="rounded-2xl border border-white/8 bg-surface p-8">
                <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>

                {status === 'sent' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center gap-4"
                  >
                    <span className="text-5xl">✅</span>
                    <p className="text-xl font-bold text-white">Message Sent!</p>
                    <p className="text-zinc-400 text-sm">We&apos;ll get back to you within 2 hours.</p>
                    <button onClick={() => setStatus('idle')} className="mt-2 text-accent text-sm font-medium hover:underline">
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      {[
                        { key: 'name', label: 'NAME', placeholder: 'Your full name', type: 'text' },
                        { key: 'phone', label: 'PHONE', placeholder: '+91 98765 43210', type: 'tel' },
                      ].map((f) => (
                        <div key={f.key}>
                          <label className="block text-xs font-bold tracking-widest uppercase text-zinc-500 mb-2">{f.label}</label>
                          <input
                            type={f.type}
                            placeholder={f.placeholder}
                            value={form[f.key as keyof typeof form]}
                            onChange={(e) => setForm((v) => ({ ...v, [f.key]: e.target.value }))}
                            className="w-full bg-background border border-white/8 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent/40 transition-colors"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-zinc-500 mb-2">EMAIL</label>
                      <input
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))}
                        className="w-full bg-background border border-white/8 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent/40 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-zinc-500 mb-2">SUBJECT</label>
                      <input
                        type="text"
                        placeholder="Order issue / Product query / Other"
                        value={form.subject}
                        onChange={(e) => setForm((v) => ({ ...v, subject: e.target.value }))}
                        className="w-full bg-background border border-white/8 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent/40 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-zinc-500 mb-2">MESSAGE</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Tell us how we can help…"
                        value={form.message}
                        onChange={(e) => setForm((v) => ({ ...v, message: e.target.value }))}
                        className="w-full bg-background border border-white/8 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent/40 transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3.5 text-sm font-bold text-white hover:bg-accent-bright transition-colors disabled:opacity-70"
                    >
                      {status === 'sending' ? (
                        <>
                          <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                          </svg>
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
