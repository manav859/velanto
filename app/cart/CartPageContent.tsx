'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { isSafeCheckoutUrl, logCheckoutDebug } from '@/lib/checkout-utils'

// Show a warning banner when the store is password-protected.
// Set NEXT_PUBLIC_SHOPIFY_STORE_PASSWORD_PROTECTED=true in .env.local during dev.
const IS_STORE_PASSWORD_PROTECTED =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_PASSWORD_PROTECTED === 'true'

export default function CartPageContent() {
  const { cart, isLoading, updateQuantity, removeFromCart } = useCart()

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!cart || cart.lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center border border-white/8 rounded-2xl bg-surface">
        <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
          </svg>
        </div>
        <p className="text-white font-semibold text-lg mb-2">Your cart is empty</p>
        <p className="text-zinc-500 text-sm mb-6">Browse our range of professional car care products.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-bright text-white text-sm font-bold px-6 py-3 rounded-lg transition-colors">
          Shop Products
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    )
  }

  const checkoutUrl = isSafeCheckoutUrl(cart.checkoutUrl) ? cart.checkoutUrl : null

  const handleCheckout = () => {
    logCheckoutDebug(cart.checkoutUrl)
  }

  // ── Cart with items ───────────────────────────────────────────────────────
  return (
    <div className="relative grid lg:grid-cols-3 gap-8">

      {/* Password-protection dev warning — only shown when env flag is set */}
      {IS_STORE_PASSWORD_PROTECTED && (
        <div className="lg:col-span-3 flex items-start gap-3 rounded-lg border border-amber-500/25 bg-amber-500/5 px-4 py-3">
          <svg className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <div className="min-w-0">
            <p className="text-xs font-bold text-amber-300 mb-0.5">Store password protection is enabled</p>
            <p className="text-xs text-amber-300/70 leading-relaxed">
              Checkout may redirect to the Shopify password page during testing.{' '}
              <strong className="text-amber-300">To fix:</strong>{' '}
              Shopify Admin → Online Store → Preferences → Password protection → Remove password.{' '}
              <span className="text-amber-300/50">
                Workaround: open{' '}
                <a
                  href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-amber-300"
                >
                  the storefront
                </a>
                {' '}in this browser, enter the password, then retry.
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/30 backdrop-blur-[1px]">
          <div className="flex items-center gap-3 bg-surface border border-white/8 rounded-lg px-5 py-3 shadow-xl">
            <span className="h-4 w-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            <span className="text-sm text-zinc-300">Updating cart…</span>
          </div>
        </div>
      )}

      {/* Cart lines */}
      <div className="lg:col-span-2 space-y-4">
        {cart.lines.map((line) => (
          <div key={line.id} className="flex gap-4 rounded-xl border border-white/8 bg-surface p-4">
            <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-surface-2">
              {line.image ? (
                <Image src={line.image.url} alt={line.image.altText} fill sizes="80px" className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xl">📦</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white leading-snug mb-1 line-clamp-2">
                {line.productTitle}
              </p>
              {line.variantTitle && <p className="text-xs text-zinc-500 mb-2">{line.variantTitle}</p>}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center border border-white/10 rounded-md overflow-hidden" role="group" aria-label="Quantity">
                  <button onClick={() => line.quantity > 1 ? updateQuantity(line.id, line.quantity - 1) : removeFromCart(line.id)} disabled={isLoading} aria-label="Decrease quantity" className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/8 transition-colors disabled:opacity-40">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" /></svg>
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-white select-none">{line.quantity}</span>
                  <button onClick={() => updateQuantity(line.id, line.quantity + 1)} disabled={isLoading} aria-label="Increase quantity" className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/8 transition-colors disabled:opacity-40">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" /></svg>
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white">{line.linePrice}</span>
                  <button onClick={() => removeFromCart(line.id)} disabled={isLoading} aria-label={`Remove ${line.productTitle}`} className="text-zinc-600 hover:text-red-400 transition-colors disabled:opacity-40">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order summary */}
      <div>
        <div className="rounded-xl border border-white/8 bg-surface p-6 space-y-4 lg:sticky lg:top-24">
          <h2 className="text-base font-bold text-white">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Subtotal ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})</span>
              <span className="text-white font-medium">{cart.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Shipping</span>
              <span className="text-accent font-medium text-xs">Calculated at checkout</span>
            </div>
          </div>
          <div className="border-t border-white/8 pt-3 flex justify-between items-baseline">
            <span className="font-bold text-white">Total</span>
            <span className="text-xl font-black text-white">{cart.total}</span>
          </div>

          {checkoutUrl ? (
            <a
              href={checkoutUrl}
              onClick={handleCheckout}
              aria-label="Proceed to secure Shopify checkout"
              className="flex w-full items-center justify-center gap-2 bg-accent hover:bg-accent-bright text-white font-bold py-3.5 rounded-lg transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Proceed to Secure Checkout
            </a>
          ) : (
            <div className="flex w-full items-center justify-center gap-2 bg-zinc-800 text-zinc-500 font-bold py-3.5 rounded-lg text-sm cursor-not-allowed">
              Checkout Unavailable
            </div>
          )}

          <p className="text-[10px] text-zinc-600 text-center leading-relaxed">
            You will be taken to Shopify&apos;s secure checkout. No account required.
          </p>
          <Link href="/shop" className="block text-center text-xs text-zinc-500 hover:text-white transition-colors py-1">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
