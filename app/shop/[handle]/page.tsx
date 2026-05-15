import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AnnouncementBar from '@/components/AnnouncementBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getProductByHandle, getProducts } from '@/lib/shopify'
import { transformProduct } from '@/lib/transformers'
import ProductDetailClient from './ProductDetailClient'
import ProductCard from '@/components/ProductCard'

type Props = { params: Promise<{ handle: string }> }

// ─── SEO metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const raw = await getProductByHandle(handle)
  if (!raw) return { title: 'Product Not Found' }

  const product = transformProduct(raw)

  return {
    title: `${product.title} | Velanto Auto Care`,
    description: product.description?.slice(0, 160) || `Shop ${product.title} — premium car care by Velanto.`,
    openGraph: {
      title: `${product.title} | Velanto`,
      description: product.description?.slice(0, 160) || undefined,
      images: product.featuredImage
        ? [{ url: product.featuredImage.url, alt: product.featuredImage.altText ?? product.title }]
        : [],
    },
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function ProductPage({ params }: Props) {
  const { handle } = await params

  const [raw, allRaw] = await Promise.all([
    getProductByHandle(handle),
    getProducts(12),
  ])

  if (!raw) notFound()

  const product = transformProduct(raw)

  // Build a small "related products" section from the store catalog,
  // excluding the current product.
  const related = allRaw
    .map(transformProduct)
    .filter((p) => p.handle !== handle)
    .slice(0, 4)

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content">
        <ProductDetailClient product={product} />

        {/* ── Related Products ────────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="border-t border-white/8 bg-surface/50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">
                You May Also Like
              </p>
              <h2 className="mb-8 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Related Products
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
                {related.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
