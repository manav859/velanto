'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import type { TransformedProduct } from '@/lib/transformers'

type Collection = { id: string; title: string; handle: string }

const EXCLUDED_HANDLES = new Set([
  'frontpage',
  'home',
  'homepage',
  'home-page',
  'automated-collection',
])

const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'On Sale', value: 'sale' },
]

type Props = {
  products: TransformedProduct[]
  collections: Collection[]
}

export default function ShopClient({ products, collections }: Props) {
  const [search, setSearch] = useState('')
  const [activeCollection, setActiveCollection] = useState<string | null>(null)
  const [sort, setSort] = useState('popular')
  const [showSale, setShowSale] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const visibleCollections = useMemo(
    () => collections.filter((collection) => !EXCLUDED_HANDLES.has(collection.handle.toLowerCase())),
    [collections]
  )

  const activeCollectionTitle = useMemo(
    () => visibleCollections.find((collection) => collection.handle === activeCollection)?.title ?? null,
    [activeCollection, visibleCollections]
  )

  const filtered = useMemo(() => {
    let output = [...products]

    if (activeCollection) {
      output = output.filter((product) => product.collectionHandles.includes(activeCollection))
    }

    if (search.trim()) {
      const query = search.toLowerCase()
      output = output.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.productType.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    if (showSale) {
      output = output.filter((product) => product.onSale)
    }

    switch (sort) {
      case 'price-asc':
        output.sort((a, b) => a.priceAmount - b.priceAmount)
        break
      case 'price-desc':
        output.sort((a, b) => b.priceAmount - a.priceAmount)
        break
      case 'newest':
        output.sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return bTime - aTime
        })
        break
      case 'sale':
        output = output.filter((product) => product.onSale)
        break
      default:
        break
    }

    return output
  }, [activeCollection, products, search, showSale, sort])

  const hasActiveFilters = !!search.trim() || showSale || !!activeCollection

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-white/8 bg-background px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">
            Premium Car Care Store
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {activeCollectionTitle ?? 'All Products'}
              </h1>
              <p className="mt-2 text-sm text-zinc-400">
                Professional-grade car detailing products made for Indian cars.
              </p>
            </div>
            <p className="shrink-0 text-sm text-zinc-500">
              <span className="font-semibold text-white">{filtered.length}</span>{' '}
              {filtered.length === 1 ? 'product' : 'products'} available
            </p>
          </div>
        </div>
      </div>

      {visibleCollections.length > 0 && (
        <div className="sticky top-16 z-30 border-b border-white/8 bg-surface/60 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="scrollbar-hide flex items-center gap-0.5 overflow-x-auto py-1">
              <button
                type="button"
                onClick={() => setActiveCollection(null)}
                aria-pressed={!activeCollection}
                className={`shrink-0 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
                  !activeCollection
                    ? 'bg-accent text-white'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                All
              </button>
              {visibleCollections.map((collection) => (
                <button
                  key={collection.handle}
                  type="button"
                  onClick={() => setActiveCollection(collection.handle === activeCollection ? null : collection.handle)}
                  aria-pressed={activeCollection === collection.handle}
                  className={`shrink-0 whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
                    activeCollection === collection.handle
                      ? 'bg-accent text-white'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {collection.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 pb-2 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search products"
              className="w-full rounded-lg border border-white/10 bg-surface py-2.5 pl-9 pr-4 text-sm text-white transition-colors placeholder:text-zinc-600 focus:border-accent/50 focus:outline-none"
            />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSale((value) => !value)}
              aria-pressed={showSale}
              className={`flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all ${
                showSale
                  ? 'border-accent bg-accent text-white'
                  : 'border-white/10 bg-surface text-zinc-400 hover:border-white/25 hover:text-white'
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
              Sale
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setSortOpen((value) => !value)}
                aria-expanded={sortOpen}
                aria-haspopup="menu"
                aria-controls="shop-sort-menu"
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-sm font-semibold text-zinc-400 transition-colors hover:border-white/25 hover:text-white"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                </svg>
                <span className="hidden sm:inline">{SORT_OPTIONS.find((option) => option.value === sort)?.label}</span>
                <span className="sm:hidden">Sort</span>
                <svg
                  className={`h-3.5 w-3.5 transition-transform ${sortOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    id="shop-sort-menu"
                    role="menu"
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-full z-20 mt-1.5 w-52 overflow-hidden rounded-xl border border-white/10 bg-surface-2 shadow-2xl"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        role="menuitemradio"
                        aria-checked={sort === option.value}
                        onClick={() => {
                          setSort(option.value)
                          setSortOpen(false)
                        }}
                        className={`flex w-full items-center justify-between px-4 py-3 text-sm transition-colors ${
                          sort === option.value
                            ? 'bg-accent/5 font-semibold text-accent'
                            : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {option.label}
                        {sort === option.value && (
                          <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {search.trim() && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1 text-xs font-medium text-zinc-300">
                &ldquo;{search}&rdquo;
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label={`Clear search for ${search}`}
                  className="ml-0.5 text-zinc-500 hover:text-white"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {showSale && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
                On Sale
                <button
                  type="button"
                  onClick={() => setShowSale(false)}
                  aria-label="Clear sale filter"
                  className="ml-0.5 hover:text-white"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setShowSale(false)
                setActiveCollection(null)
              }}
              className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center py-28 text-center"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface">
                <svg className="h-6 w-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <p className="mb-1 text-lg font-semibold text-white">No products found</p>
              <p className="mb-6 text-sm text-zinc-500">Try clearing filters or search again.</p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setShowSale(false)
                    setActiveCollection(null)
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-bright"
                >
                  Clear all filters
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4"
            >
              {filtered.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
