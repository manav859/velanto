import { Suspense } from 'react'
import Link from 'next/link'
import CopyrightYear from './CopyrightYear'

const SHOP_LINKS = [
  { label: 'All Products', href: '/shop' },
  { label: 'Exterior Wash', href: '/exterior' },
  { label: 'Interior Care', href: '/interior' },
  { label: 'Wheel & Tyre', href: '/wheels' },
  { label: 'Ceramic Protection', href: '/ceramic' },
  { label: 'Kits & Bundles', href: '/kits' },
]

const HELP_LINKS = [
  { label: 'Detailing Guides', href: '/guides' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Track Order', href: '/track' },
  { label: 'FAQs', href: '/faq' },
]

const POLICY_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Refund Policy', href: '/refunds' },
  { label: 'Shipping Policy', href: '/shipping' },
  { label: 'Terms of Service', href: '/terms' },
]

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-14">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-black tracking-[0.2em] uppercase text-white">Velanto</span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mb-6">
              Professional-grade car detailing products for enthusiasts and pros alike. Showroom finish, every time.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                { label: 'YouTube', path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
                { label: 'X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-zinc-500 hover:text-white hover:border-white/25 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-white mb-5">Shop</h4>
            <ul className="space-y-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help links */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-white mb-5">Help</h4>
            <ul className="space-y-3">
              {HELP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-white mb-5">Policies</h4>
            <ul className="space-y-3">
              {POLICY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">
            © <Suspense fallback="2026"><CopyrightYear /></Suspense> Velanto. All rights reserved.
          </p>
          <p className="text-xs text-zinc-700">
            Made with precision in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  )
}
