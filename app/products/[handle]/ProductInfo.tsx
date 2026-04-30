'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import AddToCartButton from '@/components/AddToCartButton'
import type { TransformedProduct, TransformedVariant } from '@/lib/transformers'

type Props = { product: TransformedProduct }

const TRUST = [
  { icon: '🚚', title: 'Free Delivery', sub: 'Orders above ₹999' },
  { icon: '🔄', title: '7-Day Returns', sub: 'Hassle-free policy' },
  { icon: '✅', title: '100% Genuine', sub: 'Verified products' },
]

export default function ProductInfo({ product }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<TransformedVariant>(
    product.variants[0]
  )
  const [openTab, setOpenTab] = useState<'description' | 'howto' | 'shipping'>('description')

  const variantsByOption = product.variants.reduce<Record<string, string[]>>(
    (acc, v) => {
      v.selectedOptions.forEach(({ name, value }) => {
        if (!acc[name]) acc[name] = []
        if (!acc[name].includes(value)) acc[name].push(value)
      })
      return acc
    },
    {}
  )

  const selectVariantByOption = (optionName: string, value: string) => {
    const match = product.variants.find((v) =>
      v.selectedOptions.some((o) => o.name === optionName && o.value === value) &&
      selectedVariant.selectedOptions.every(
        (o) => o.name === optionName || v.selectedOptions.some((vo) => vo.name === o.name && vo.value === o.value)
      )
    )
    if (match) setSelectedVariant(match)
  }

  const showVariants = Object.keys(variantsByOption).length > 0 &&
    !(Object.keys(variantsByOption).length === 1 && variantsByOption['Title']?.includes('Default Title'))

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-6"
    >
      {/* Category tag */}
      {product.productType && (
        <p className="text-xs font-bold tracking-widest uppercase text-accent">{product.productType}</p>
      )}

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">{product.title}</h1>

      {/* Rating stub */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-zinc-400">4.9 <span className="text-zinc-600">(reviews)</span></span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-black text-white">{selectedVariant?.price ?? product.price}</span>
        {product.compareAtPrice && (
          <span className="text-lg text-zinc-500 line-through">{product.compareAtPrice}</span>
        )}
        {product.onSale && (
          <span className="bg-accent/15 text-accent text-xs font-bold px-2.5 py-1 rounded-full">SALE</span>
        )}
      </div>

      <div className="h-px bg-white/8" />

      {/* Variant selectors */}
      {showVariants && Object.entries(variantsByOption).map(([optionName, values]) => (
        <div key={optionName}>
          <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-3">{optionName}</p>
          <div className="flex flex-wrap gap-2">
            {values.map((value) => {
              const isSelected = selectedVariant?.selectedOptions.some(
                (o) => o.name === optionName && o.value === value
              )
              return (
                <button
                  key={value}
                  onClick={() => selectVariantByOption(optionName, value)}
                  className={`px-4 py-2 rounded-md border text-sm font-semibold transition-all duration-200 ${isSelected ? 'border-accent bg-accent text-white' : 'border-white/15 text-zinc-300 hover:border-white/30'}`}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Add to cart */}
      <AddToCartButton
        variantId={selectedVariant?.id ?? product.variants[0]?.id ?? ''}
        availableForSale={selectedVariant?.availableForSale ?? product.availableForSale}
      />

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/8 overflow-hidden">
        {TRUST.map((t) => (
          <div key={t.title} className="flex flex-col items-center gap-1 py-4 bg-surface text-center">
            <span className="text-2xl">{t.icon}</span>
            <p className="text-xs font-bold text-white">{t.title}</p>
            <p className="text-[10px] text-zinc-500">{t.sub}</p>
          </div>
        ))}
      </div>

      <div className="h-px bg-white/8" />

      {/* Accordion tabs */}
      <div className="space-y-2">
        {[
          { id: 'description', label: 'Description', content: product.descriptionHtml || product.description },
          { id: 'howto', label: 'How to Use', content: '<p>Apply a small amount to a clean microfibre cloth or applicator pad. Work into the surface in circular motions. Buff off with a clean, dry microfibre cloth. For best results, work in sections and out of direct sunlight.</p>' },
          { id: 'shipping', label: 'Shipping & Returns', content: '<p>Free shipping on orders above ₹999. Standard delivery in 3–5 business days across India. Express options available at checkout. 7-day hassle-free returns — just contact our support team.</p>' },
        ].map((tab) => (
          <div key={tab.id} className="rounded-xl border border-white/8 overflow-hidden">
            <button
              onClick={() => setOpenTab(openTab === tab.id as typeof openTab ? 'description' : tab.id as typeof openTab)}
              className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-white hover:bg-white/3 transition-colors"
            >
              {tab.label}
              <svg className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${openTab === tab.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {openTab === tab.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div
                  className="px-5 pb-4 text-sm text-zinc-400 leading-relaxed prose prose-invert prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: tab.content }}
                />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
