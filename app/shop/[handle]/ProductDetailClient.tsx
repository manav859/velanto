'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { TransformedProduct, TransformedVariant } from '@/lib/transformers'
import AddToCartButton from '@/components/AddToCartButton'

type Props = { product: TransformedProduct }

export default function ProductDetailClient({ product }: Props) {
  const {
    title,
    descriptionHtml,
    description,
    vendor,
    productType,
    tags,
    price,
    compareAtPrice,
    onSale,
    images,
    featuredImage,
    variants,
    availableForSale,
  } = product

  // ── Gallery state ────────────────────────────────────────────────────────────
  const galleryImages = images.length > 0
    ? images
    : featuredImage
      ? [featuredImage]
      : []

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const activeImage = galleryImages[activeImageIndex] ?? null

  // ── Variant state ────────────────────────────────────────────────────────────
  const hasVariants = variants.length > 1 || (variants.length === 1 && variants[0].title !== 'Default Title')

  // Build option names and their possible values
  const optionNames = useMemo(() => {
    if (!hasVariants) return []
    const names: string[] = []
    for (const v of variants) {
      for (const opt of v.selectedOptions) {
        if (!names.includes(opt.name)) names.push(opt.name)
      }
    }
    return names
  }, [variants, hasVariants])

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    if (!hasVariants || variants.length === 0) return {}
    const defaults: Record<string, string> = {}
    for (const opt of variants[0].selectedOptions) {
      defaults[opt.name] = opt.value
    }
    return defaults
  })

  const selectedVariant: TransformedVariant | undefined = useMemo(() => {
    if (!hasVariants) return variants[0]
    return variants.find((v) =>
      v.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value)
    )
  }, [variants, selectedOptions, hasVariants])

  const activePrice = selectedVariant?.price ?? price
  const activeCompareAtPrice = selectedVariant?.compareAtPrice ?? compareAtPrice
  const activeAvailable = selectedVariant?.availableForSale ?? availableForSale

  const optionValues = useMemo(() => {
    const map: Record<string, string[]> = {}
    for (const name of optionNames) {
      const values = new Set<string>()
      for (const v of variants) {
        const opt = v.selectedOptions.find((o) => o.name === name)
        if (opt) values.add(opt.value)
      }
      map[name] = Array.from(values)
    }
    return map
  }, [optionNames, variants])

  // ── Quantity state ───────────────────────────────────────────────────────────
  const [qty, setQty] = useState(1)

  // ── Discount percentage ──────────────────────────────────────────────────────
  const discountPct = useMemo(() => {
    const cp = selectedVariant?.compareAtPriceAmount ?? product.compareAtPriceAmount
    const p = selectedVariant?.priceAmount ?? product.priceAmount
    if (!cp || cp <= p) return null
    return Math.round(((cp - p) / cp) * 100)
  }, [selectedVariant, product])

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/" className="transition-colors hover:text-white">Home</Link>
          <span>/</span>
          <Link href="/shop" className="transition-colors hover:text-white">Shop</Link>
          <span>/</span>
          <span className="line-clamp-1 text-white">{title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ── Image Gallery ──────────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Main image */}
            <motion.div
              className="relative aspect-square overflow-hidden rounded-2xl border border-white/8 bg-surface-2"
              layoutId="product-main-image"
            >
              <AnimatePresence mode="wait">
                {activeImage ? (
                  <motion.div
                    key={activeImage.url}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={activeImage.url}
                      alt={activeImage.altText ?? title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </motion.div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <svg className="h-16 w-16 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
                    </svg>
                  </div>
                )}
              </AnimatePresence>

              {/* Sale badge */}
              {onSale && (
                <div className="absolute left-3 top-3 z-10 rounded-md bg-accent px-2.5 py-1 text-[11px] font-bold tracking-wide text-white">
                  {discountPct ? `${discountPct}% OFF` : 'SALE'}
                </div>
              )}

              {!activeAvailable && (
                <div className="absolute right-3 top-3 z-10 rounded-md bg-black/70 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white">
                  SOLD OUT
                </div>
              )}
            </motion.div>

            {/* Thumbnail strip */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {galleryImages.map((img, idx) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:h-20 sm:w-20 ${
                      idx === activeImageIndex
                        ? 'border-accent shadow-md shadow-accent/20'
                        : 'border-white/8 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText ?? `${title} thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ───────────────────────────────────────────────── */}
          <div className="flex flex-col">
            {/* Vendor / type */}
            {(vendor || productType) && (
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">
                {vendor}{vendor && productType ? ' · ' : ''}{productType}
              </p>
            )}

            <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
              {title}
            </h1>

            {/* Price */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-black text-white sm:text-3xl">{activePrice}</span>
              {activeCompareAtPrice && (
                <span className="text-lg text-zinc-500 line-through">{activeCompareAtPrice}</span>
              )}
              {discountPct && (
                <span className="rounded-md bg-accent/15 px-2.5 py-1 text-xs font-bold text-accent">
                  Save {discountPct}%
                </span>
              )}
            </div>

            {/* Availability */}
            <div className="mt-3 flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${activeAvailable ? 'bg-accent' : 'bg-red-500'}`} />
              <span className={`text-xs font-semibold ${activeAvailable ? 'text-accent' : 'text-red-400'}`}>
                {activeAvailable ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Variant selectors */}
            {hasVariants && optionNames.length > 0 && (
              <div className="mt-6 space-y-4">
                {optionNames.map((name) => (
                  <div key={name}>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">
                      {name}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(optionValues[name] ?? []).map((value) => {
                        const isSelected = selectedOptions[name] === value
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() =>
                              setSelectedOptions((prev) => ({ ...prev, [name]: value }))
                            }
                            className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all ${
                              isSelected
                                ? 'border-accent bg-accent/15 text-accent'
                                : 'border-white/10 bg-surface text-zinc-400 hover:border-white/25 hover:text-white'
                            }`}
                          >
                            {value}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Quantity
                </label>
                <div className="flex items-center overflow-hidden rounded-lg border border-white/10 bg-surface">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="px-3.5 py-2.5 text-zinc-400 transition-colors hover:text-white"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                    </svg>
                  </button>
                  <span className="min-w-[3rem] text-center text-sm font-bold text-white">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="px-3.5 py-2.5 text-zinc-400 transition-colors hover:text-white"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1">
                {selectedVariant && (
                  <AddToCartButton
                    variantId={selectedVariant.id}
                    availableForSale={activeAvailable}
                  />
                )}
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {(descriptionHtml || description) && (
              <div className="mt-8 border-t border-white/8 pt-8">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-400">
                  Description
                </h2>
                {descriptionHtml ? (
                  <div
                    className="prose prose-invert prose-sm max-w-none prose-p:text-zinc-400 prose-p:leading-relaxed prose-strong:text-white prose-a:text-accent prose-ul:text-zinc-400 prose-ol:text-zinc-400 prose-li:marker:text-accent"
                    dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                  />
                ) : (
                  <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
