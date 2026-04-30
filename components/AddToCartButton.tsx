'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'

type Props = {
  variantId: string
  availableForSale?: boolean
  className?: string
}

export default function AddToCartButton({ variantId, availableForSale = true, className }: Props) {
  const { addToCart, isLoading } = useCart()
  const [added, setAdded] = useState(false)

  if (!availableForSale) {
    return (
      <button disabled className={`flex w-full items-center justify-center gap-2 rounded-md bg-surface border border-white/8 py-3.5 text-sm font-bold text-zinc-500 cursor-not-allowed ${className ?? ''}`}>
        Out of Stock
      </button>
    )
  }

  const handleAdd = async () => {
    await addToCart(variantId)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.button
      onClick={handleAdd}
      disabled={isLoading}
      whileTap={{ scale: 0.97 }}
      className={`relative flex w-full items-center justify-center gap-2 rounded-md bg-accent py-3.5 text-sm font-bold text-white hover:bg-accent-bright transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden ${className ?? ''}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {added ? (
          <motion.span
            key="added"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Added to Cart!
          </motion.span>
        ) : isLoading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            Adding…
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            Add to Cart
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
