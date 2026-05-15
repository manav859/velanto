'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import {
  cartCreate,
  cartLinesAdd,
  cartLinesUpdate,
  cartLinesRemove,
  getCart,
} from '@/lib/shopify-cart'
import { transformCart, type TransformedCart } from '@/lib/transformers'

// ─── Types ────────────────────────────────────────────────────────────────────

type CartContextValue = {
  cart: TransformedCart | null
  isOpen: boolean
  /** True while any Shopify cart mutation is in-flight */
  isLoading: boolean
  /** Non-null when the last addToCart call failed */
  addError: string | null
  totalItems: number
  openCart: () => void
  closeCart: () => void
  /** Returns true on success, false on failure */
  addToCart: (variantId: string, quantity?: number) => Promise<boolean>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
  removeFromCart: (lineId: string) => Promise<void>
  clearAddError: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const CART_ID_KEY = 'velanto_cart_id'

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<TransformedCart | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  // Restore cart from localStorage on mount — handles refresh/back-forward
  useEffect(() => {
    const savedId = localStorage.getItem(CART_ID_KEY)
    if (!savedId) return
    getCart(savedId).then((raw) => {
      if (raw) {
        setCart(transformCart(raw))
      } else {
        // Cart expired or invalid — remove stale ID so the next add creates a fresh one
        localStorage.removeItem(CART_ID_KEY)
      }
    })
  }, [])

  const persist = useCallback((id: string) => {
    localStorage.setItem(CART_ID_KEY, id)
  }, [])

  const openCart  = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const clearAddError = useCallback(() => setAddError(null), [])

  /**
   * Adds a variant to the Shopify cart.
   * Returns true on success, false on any API failure.
   * Opens the cart drawer automatically on success.
   */
  const addToCart = useCallback(async (variantId: string, quantity = 1): Promise<boolean> => {
    setIsLoading(true)
    setAddError(null)
    try {
      const cartId = localStorage.getItem(CART_ID_KEY)

      // Try to add to existing cart; fall back to creating a new one
      let raw = cartId ? await cartLinesAdd(cartId, variantId, quantity) : null

      if (!raw) {
        // Either no cart yet, or the existing cart was expired/invalid
        if (cartId) localStorage.removeItem(CART_ID_KEY)
        raw = await cartCreate(variantId, quantity)
      }

      if (raw) {
        persist(raw.id)
        setCart(transformCart(raw))
        setIsOpen(true)
        return true
      }

      setAddError('Could not add to cart. Please try again.')
      return false
    } catch {
      setAddError('Something went wrong. Please try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [persist])

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    const cartId = localStorage.getItem(CART_ID_KEY)
    if (!cartId) return
    setIsLoading(true)
    try {
      const raw = await cartLinesUpdate(cartId, lineId, quantity)
      if (raw) setCart(transformCart(raw))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const removeFromCart = useCallback(async (lineId: string) => {
    const cartId = localStorage.getItem(CART_ID_KEY)
    if (!cartId) return
    setIsLoading(true)
    try {
      const raw = await cartLinesRemove(cartId, lineId)
      if (raw) setCart(transformCart(raw))
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <CartContext.Provider value={{
      cart,
      isOpen,
      isLoading,
      addError,
      totalItems: cart?.totalItems ?? 0,
      openCart,
      closeCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearAddError,
    }}>
      {children}
    </CartContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
