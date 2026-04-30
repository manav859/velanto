'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import type { TransformedProduct } from '@/lib/transformers'

type Collection = { id: string; title: string; handle: string }

type Props = {
  products: TransformedProduct[]
  collections: Collection[]
}

const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'On Sale', value: 'sale' },
]

export default function ShopClient({ products, collections }: Props) {
  const [search, setSearch] = useState('')
  const [activeCollection, setActiveCollection] = useState<string | null>(null)
  const [sort, setSort] = useState('popular')
  const [showSale, setShowSale] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const filtered = useMemo(() => {
    let out = [...products]

    if (search.trim()) {
      const q = search.toLowerCase()
      out = out.filter((p) => p.title.toLowerCase().includes(q) || p.productType.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)))
    }

    if (showSale) out = out.filter((p) => p.onSale)

    switch (sort) {
      case 'price-asc':
        out.sort((a, b) => parseFloat(a.price.replace(/[^\d.]/g, '')) - parseFloat(b.price.replace(/[^\d.]/g, '')))
        break
      case 'price-desc':
        out.sort((a, b) => parseFloat(b.price.replace(/[^\d.]/g, '')) - parseFloat(a.price.replace(/[^\d.]/g, '')))
        break
      case 'sale':
        out = out.filter((p) => p.onSale)
        break
    }

    return out
  }, [products, search, sort, showSale])

  return (
    <>
      {/* Hero */}
      <div className="bg-background border-b border-white/8 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Shop</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
            {activeCollection
              ? collections.find((c) => c.handle === activeCollection)?.title ?? 'Shop'
              : 'All Products'}
          </h1>
          <p className="text-zinc-400 text-sm">{filtered.length} products</p>
        </div>
      </div>

      {/* Category tabs */}
      <div className="border-b border-white/8 bg-surface/50 sticky top-16 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-hide">
            <button
              onClick={() => setActiveCollection(null)}
              className={`shrink-0 px-4 py-2.5 text-sm font-semibold rounded-md transition-colors ${!activeCollection ? 'bg-accent text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
            >
              All
            </button>
            {collections.map((col) => (
              <button
                key={col.handle}
                onClick={() => setActiveCollection(col.handle === activeCollection ? null : col.handle)}
                className={`shrink-0 px-4 py-2.5 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${activeCollection === col.handle ? 'bg-accent text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              >
                {col.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="search"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-white/8 rounded-md pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>

          {/* Sale filter */}
          <button
            onClick={() => setShowSale((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-md border text-sm font-semibold transition-colors ${showSale ? 'bg-accent border-accent text-white' : 'border-white/8 text-zinc-400 hover:text-white hover:border-white/20'}`}
          >
            Sale Only
          </button>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-white/8 text-sm font-semibold text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
            >
              {SORT_OPTIONS.find((o) => o.value === sort)?.label}
              <svg className={`w-4 h-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 rounded-md border border-white/8 bg-surface shadow-xl z-20">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setSortOpen(false) }}
                    className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors ${sort === opt.value ? 'text-accent font-semibold' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-sm text-zinc-500 ml-auto hidden sm:block">{filtered.length} results</span>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <p className="text-zinc-400 text-lg font-semibold mb-2">No products found</p>
            <p className="text-zinc-600 text-sm">Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(''); setShowSale(false); setActiveCollection(null) }} className="mt-6 text-accent text-sm font-medium hover:underline">
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
