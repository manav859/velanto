import Link from 'next/link'
import { getProducts } from '@/lib/shopify'
import { transformProduct } from '@/lib/transformers'
import type { TransformedFeaturedProductsSection } from '@/lib/transformers'
import ProductCard from './ProductCard'

type Props = {
  /**
   * Pre-fetched metaobject data from homepage_featured_products.
   * When null the component falls back to the 8 most recent products.
   */
  cms: TransformedFeaturedProductsSection | null
}

export default async function FeaturedProducts({ cms }: Props) {
  // ── Data resolution ────────────────────────────────────────────────────────
  // Priority 1: merchant-curated products from Shopify metaobject
  // Priority 2: fallback — 8 most recent store products (generic)
  let products = cms?.products ?? []
  const isFallback = products.length === 0

  if (isFallback) {
    const raw = await getProducts(8)
    products = raw.map(transformProduct)
  }

  const eyebrow   = cms?.eyebrow   ?? 'Hand-Picked'
  const heading   = cms?.heading   ?? 'Featured Products'
  const linkLabel = cms?.linkLabel ?? 'View all'
  const linkUrl   = cms?.linkUrl   ?? '/shop'

  return (
    <section className="py-20 bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">
              {eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {heading}
            </h2>
          </div>
          <Link
            href={linkUrl}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            {linkLabel}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Product grid */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-white/8 bg-surface">
            <p className="text-zinc-500 text-base">No products found.</p>
            <p className="text-zinc-600 text-sm mt-1">
              Connect your Shopify store or set up the homepage_featured_products metaobject.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* Mobile "view all" */}
        <div className="mt-10 text-center sm:hidden">
          <Link
            href={linkUrl}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-bold text-white hover:bg-white/5 transition-colors"
          >
            {linkLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
