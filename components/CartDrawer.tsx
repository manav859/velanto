'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'

export default function CartDrawer() {
  const { cart, isOpen, isLoading, closeCart, updateQuantity, removeFromCart } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 38 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-[420px] flex-col bg-[#141414] border-l border-white/8 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-white">Your Cart</span>
                {(cart?.totalItems ?? 0) > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white text-[10px] font-bold">
                    {cart!.totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="flex items-center justify-center w-8 h-8 rounded-full text-zinc-400 hover:text-white hover:bg-white/8 transition-colors"
                aria-label="Close cart"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
                <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
              </div>
            )}

            {/* Empty state */}
            {(!cart || cart.lines.length === 0) ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                  <svg className="w-7 h-7 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-white">Your cart is empty</p>
                <p className="text-xs text-zinc-500 text-center">Add some premium car care products to get started.</p>
                <button
                  onClick={closeCart}
                  className="mt-2 rounded-md bg-accent px-6 py-2.5 text-sm font-bold text-white hover:bg-accent-bright transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Cart lines */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {cart.lines.map((line) => (
                    <motion.div
                      key={line.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="flex gap-4"
                    >
                      {/* Image */}
                      <div className="relative h-18 w-18 flex-shrink-0 overflow-hidden rounded-md bg-[#1e1e1e] border border-white/8">
                        {line.image ? (
                          <Image src={line.image.url} alt={line.image.altText} fill sizes="72px" className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex flex-1 flex-col gap-1 min-w-0">
                        <Link
                          href={`/products/${line.productHandle}`}
                          onClick={closeCart}
                          className="text-sm font-semibold text-white hover:text-accent transition-colors line-clamp-2 leading-snug"
                        >
                          {line.productTitle}
                        </Link>
                        {line.variantTitle && (
                          <p className="text-xs text-zinc-500">{line.variantTitle}</p>
                        )}
                        <div className="mt-auto flex items-center justify-between">
                          {/* Qty controls */}
                          <div className="flex items-center gap-0 border border-white/10 rounded-md overflow-hidden">
                            <button
                              onClick={() => line.quantity > 1 ? updateQuantity(line.id, line.quantity - 1) : removeFromCart(line.id)}
                              className="flex w-7 h-7 items-center justify-center text-zinc-400 hover:text-white hover:bg-white/8 transition-colors"
                              aria-label="Decrease"
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                              </svg>
                            </button>
                            <span className="w-7 h-7 flex items-center justify-center text-xs font-bold text-white">
                              {line.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(line.id, line.quantity + 1)}
                              className="flex w-7 h-7 items-center justify-center text-zinc-400 hover:text-white hover:bg-white/8 transition-colors"
                              aria-label="Increase"
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                              </svg>
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{line.linePrice}</span>
                            <button
                              onClick={() => removeFromCart(line.id)}
                              className="text-zinc-600 hover:text-red-400 transition-colors"
                              aria-label="Remove"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer / Summary */}
                <div className="border-t border-white/8 px-6 py-5 space-y-4">
                  {/* Free shipping banner */}
                  <div className="flex items-center gap-2 rounded-md bg-accent/10 border border-accent/20 px-3 py-2">
                    <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                    <p className="text-xs text-accent font-medium">Free shipping on orders above ₹999</p>
                  </div>

                  {/* Totals */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Subtotal</span>
                      <span className="text-white font-medium">{cart.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Shipping</span>
                      <span className="text-accent font-medium">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="flex justify-between border-t border-white/8 pt-3">
                    <span className="text-base font-bold text-white">Total</span>
                    <span className="text-xl font-black text-white">{cart.total}</span>
                  </div>

                  {/* Checkout CTA */}
                  <a
                    href={cart.checkoutUrl}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-accent py-3.5 text-sm font-bold text-white hover:bg-accent-bright transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    Secure Checkout
                  </a>

                  <button
                    onClick={closeCart}
                    className="w-full text-center text-xs text-zinc-500 hover:text-white transition-colors py-1"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
