'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { HomepageHero } from '@/lib/shopify'

type Props = { hero: HomepageHero | null }

const FALLBACK: HomepageHero = {
  eyebrowText: 'Professional Grade',
  headline: 'Premium Car Care',
  highlightText: 'Built For A Showroom',
  subtext:
    'Professional-grade shampoos, ceramic sprays, tyre cleaners, microfibre towels, detailing kits and accessories.',
  primaryButton: 'Shop Products',
  primaryLink: '/shop',
  secondaryButton: 'Explore Kits',
  secondaryLink: '/collections/kits-bundles',
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as number[] },
})

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -36 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as number[] },
})

const fadeRight = (delay = 0) => ({
  initial: { opacity: 0, x: 36 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as number[] },
})

export default function HeroSection({ hero }: Props) {
  const h = hero ?? FALLBACK

  return (
    <section className="relative w-full overflow-hidden bg-background">
      {/* Background layers */}
      <div className="absolute inset-0 z-0">
        {h.backgroundImage ? (
          <Image
            src={h.backgroundImage.url}
            alt={h.backgroundImage.altText ?? ''}
            fill priority sizes="100vw"
            className="object-cover opacity-15"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_65%_40%,rgba(39,174,96,0.07)_0%,transparent_70%)]" />
        )}
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/85 to-background/25" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content grid */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 items-center gap-8 lg:gap-12 min-h-180 lg:min-h-[calc(100vh-96px)] py-24 lg:py-16">

          {/* Left: text */}
          <div className="flex flex-col justify-center">
            <motion.div {...fadeLeft(0.05)} className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 mb-7">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-semibold tracking-widest uppercase text-accent">{h.eyebrowText}</span>
            </motion.div>

            <motion.h1 {...fadeLeft(0.15)} className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-black leading-[1.05] tracking-tight text-white mb-5">
              {h.headline}
              {h.highlightText && (
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-bright mt-1">
                  {h.highlightText}
                </span>
              )}
            </motion.h1>

            <motion.p {...fadeLeft(0.25)} className="text-base sm:text-lg text-zinc-400 leading-relaxed mb-9 max-w-lg">
              {h.subtext}
            </motion.p>

            <motion.div {...fadeUp(0.35)} className="flex flex-wrap gap-3">
              <Link href={h.primaryLink} className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-white hover:bg-accent-bright transition-colors duration-200">
                {h.primaryButton}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link href={h.secondaryLink} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-bold text-white hover:border-accent/50 hover:bg-white/5 transition-colors duration-200">
                {h.secondaryButton}
              </Link>
            </motion.div>

            <motion.div {...fadeUp(0.45)} className="mt-12 flex flex-wrap gap-8 border-t border-white/8 pt-8">
              {[
                { value: '500+', label: 'Products' },
                { value: '4.9★', label: 'Avg Rating' },
                { value: '50K+', label: 'Happy Cars' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-xs text-zinc-500 font-medium tracking-wider uppercase mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: hero image */}
          <motion.div {...fadeRight(0.2)} className="relative h-75 sm:h-100 lg:h-140 xl:h-160">
            {h.heroImage ? (
              <>
                <div className="absolute inset-y-0 left-0 w-16 z-10 bg-linear-to-r from-background to-transparent lg:w-24" />
                <Image
                  src={h.heroImage.url}
                  alt={h.heroImage.altText ?? h.headline}
                  fill priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain object-center lg:object-right drop-shadow-2xl"
                />
              </>
            ) : (
              <div className="hidden lg:flex items-center justify-center w-full h-full opacity-[0.04]">
                <svg viewBox="0 0 800 350" fill="white" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-140">
                  <path d="M740 240H60C45 240 32 228 32 213v-10c0-8 5-15 12-18l80-32c15-6 28-16 38-29l60-78c12-16 31-25 51-25h300c22 0 43 10 57 27l55 72c8 10 19 17 32 19l80 16c12 2 21 13 21 25v33c0 12-10 22-22 22zM220 240c0 33-27 60-60 60s-60-27-60-60 27-60 60-60 60 27 60 60zm440 0c0 33-27 60-60 60s-60-27-60-60 27-60 60-60 60 27 60 60z" />
                </svg>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-28 bg-linear-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  )
}
