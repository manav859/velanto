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
  isLoading: boolean
  totalItems: number
  openCart: () => void
  closeCart: () => void
  addToCart: (variantId: string, quantity?: number) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
  removeFromCart: (lineId: string) => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

const CART_ID_KEY = 'velanto_cart_id'

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<TransformedCart | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Restore cart on mount
  useEffect(() => {
    const savedId = localStorage.getItem(CART_ID_KEY)
    if (!savedId) return
    getCart(savedId).then((raw) => {
      if (raw) setCart(transformCart(raw))
      else localStorage.removeItem(CART_ID_KEY)
    })
  }, [])

  const persist = useCallback((id: string) => {
    localStorage.setItem(CART_ID_KEY, id)
  }, [])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const addToCart = useCallback(async (variantId: string, quantity = 1) => {
    setIsLoading(true)
    try {
      const cartId = localStorage.getItem(CART_ID_KEY)
      let raw = cartId ? await cartLinesAdd(cartId, variantId, quantity) : null
      if (!raw) raw = await cartCreate(variantId, quantity)
      if (raw) {
        persist(raw.id)
        setCart(transformCart(raw))
        setIsOpen(true)
      }
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
    <CartContext.Provider value={{ cart, isOpen, isLoading, totalItems: cart?.totalItems ?? 0, openCart, closeCart, addToCart, updateQuantity, removeFromCart }}>
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
