import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import AnnouncementBar from '@/components/AnnouncementBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import ProductGallery from './ProductGallery'
import ProductInfo from './ProductInfo'
import { getProductByHandle, getProducts } from '@/lib/shopify'
import { transformProduct } from '@/lib/transformers'

type Props = { params: Promise<{ handle: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const raw = await getProductByHandle(handle)
  if (!raw) return { title: 'Product Not Found' }
  const product = transformProduct(raw)
  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: { images: product.featuredImage ? [{ url: product.featuredImage.url }] : [] },
  }
}


export default async function ProductPage({ params }: Props) {
  const { handle } = await params
  const raw = await getProductByHandle(handle)
  if (!raw) notFound()

  const product = transformProduct(raw)
  const relatedRaw = await getProducts(8)
  const related = relatedRaw.map(transformProduct).filter((p) => p.handle !== handle).slice(0, 4)

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        {/* Breadcrumb */}
        <div className="bg-background border-b border-white/8 px-4 sm:px-6 lg:px-8 py-3">
          <div className="mx-auto max-w-7xl flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-white line-clamp-1">{product.title}</span>
          </div>
        </div>

        {/* Hero */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <ProductGallery images={product.images} title={product.title} />
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="border-t border-white/8 py-16 bg-surface/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">Complete Your Kit</p>
                <h2 className="text-2xl font-black text-white">You Might Also Like</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
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
