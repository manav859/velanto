'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Exterior', href: '/collections/exterior-care' },
  { label: 'Interior', href: '/collections/interior-care' },
  { label: 'Kits & Bundles', href: '/collections/kits-bundles' },
  { label: 'Guides', href: '/guides' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { openCart, totalItems } = useCart()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/8 bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-8">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
            <span className="text-xl font-black tracking-[0.2em] uppercase text-white group-hover:text-accent transition-colors duration-200">
              Velanto
            </span>
            <span className="hidden sm:block text-[9px] font-bold tracking-[0.25em] uppercase text-accent mt-0.5">
              AUTO CARE
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-150 rounded-md hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <button
              aria-label="Open cart"
              onClick={openCart}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              <span className="text-xs font-bold hidden sm:block">Cart</span>
              {totalItems > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white text-[10px] font-bold leading-none">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              aria-label="Toggle menu"
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full text-zinc-400 hover:text-white hover:bg-white/8 transition-colors duration-150"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.svg
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — slides down */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden overflow-hidden border-t border-white/8 bg-surface"
          >
            <nav className="flex flex-col px-4 py-3 gap-0.5">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.18 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center justify-between px-3 py-3 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-md transition-colors duration-150"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                    <svg className="w-3.5 h-3.5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                </motion.div>
              ))}

              <div className="mt-2 pt-2 border-t border-white/8">
                <button
                  onClick={() => { openCart(); setMenuOpen(false) }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-accent text-white text-sm font-bold"
                >
                  View Cart {totalItems > 0 && `(${totalItems})`}
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
