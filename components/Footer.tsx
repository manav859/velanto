import Link from 'next/link'
import { getNavigationCollections } from '@/lib/shopify'
import { SITE_NAME, publicSocialLinks } from '@/lib/site'
import CopyrightYear from './CopyrightYear'

const HELP_LINKS = [
  { label: 'Detailing Guides', href: '/guides' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Track Order', href: '/track-order' },
  { label: 'FAQs', href: '/faqs' },
]

const POLICY_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
]

const SOCIAL_ICONS: Record<string, string> = {
  Instagram:
    'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  YouTube:
    'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  X:
    'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
}

export default async function Footer() {
  const navCollections = await getNavigationCollections()
  const shopLinks = [
    { label: 'All Products', href: '/shop' },
    ...navCollections.map((collection) => ({ label: collection.label, href: collection.href })),
  ]
  const hasAnySocialLink = publicSocialLinks.some((link) => !!link.href)

  return (
    <footer className="border-t border-white/8 bg-[#080808]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 py-16 lg:grid-cols-5 lg:gap-8">
          <div className="col-span-2 space-y-6 lg:col-span-2">
            <div>
              <Link href="/" className="group mb-1 inline-flex items-center gap-2">
                <span className="text-xl font-black uppercase tracking-[0.2em] text-white transition-colors duration-200 group-hover:text-accent">
                  Velanto
                </span>
              </Link>
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-accent">AUTO CARE</p>
            </div>

            <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
              Professional-grade detailing products and secure Shopify checkout for customers across India.
            </p>

            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-zinc-700">Follow Us</p>
              <div className="flex items-center gap-2.5">
                {publicSocialLinks.map((social) => {
                  const icon = SOCIAL_ICONS[social.label]
                  if (!icon) return null

                  return social.href ? (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow ${SITE_NAME} on ${social.label}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-500 transition-colors duration-200 hover:border-white/20 hover:text-zinc-200"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d={icon} />
                      </svg>
                    </a>
                  ) : (
                    <button
                      key={social.label}
                      type="button"
                      aria-label={`${social.label} link not configured`}
                      title={`${social.label} link not configured`}
                      className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full border border-white/10 text-zinc-700"
                      disabled
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d={icon} />
                      </svg>
                    </button>
                  )
                })}
              </div>
              {!hasAnySocialLink && (
                <p className="mt-2 text-[10px] text-zinc-700">
                  Social profiles will appear here once configured.
                </p>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-5 text-xs font-bold uppercase tracking-widest text-white">Shop</h2>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 transition-colors duration-150 hover:text-zinc-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-xs font-bold uppercase tracking-widest text-white">Help</h2>
            <ul className="space-y-3">
              {HELP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 transition-colors duration-150 hover:text-zinc-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-xs font-bold uppercase tracking-widest text-white">Policies</h2>
            <ul className="space-y-3">
              {POLICY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 transition-colors duration-150 hover:text-zinc-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/8 py-6 sm:flex-row">
          <p className="text-xs text-zinc-600">
            &copy; <CopyrightYear /> {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-zinc-700">Built for Indian roads.</p>
        </div>
      </div>
    </footer>
  )
}
