import Link from 'next/link'
import { getProducts } from '@/lib/shopify'
import { transformProduct } from '@/lib/transformers'
import ProductCard from './ProductCard'

export default async function FeaturedProducts() {
  const rawProducts = await getProducts(8)
  const products = rawProducts.map(transformProduct)

  return (
    <section className="py-20 bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">Hand-Picked</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Featured Products</h2>
          </div>
          <Link href="/shop" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            View all
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-white/8 bg-surface">
            <p className="text-zinc-500 text-base">No products found.</p>
            <p className="text-zinc-600 text-sm mt-1">Connect your Shopify store to see products here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center sm:hidden">
          <Link href="/shop" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-bold text-white hover:bg-white/5 transition-colors">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}
