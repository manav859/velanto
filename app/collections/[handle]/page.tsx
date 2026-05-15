import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import AnnouncementBar from '@/components/AnnouncementBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { getCollectionByHandle } from '@/lib/shopify'
import { transformCollection } from '@/lib/transformers'

type Props = { params: Promise<{ handle: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const raw = await getCollectionByHandle(handle)
  if (!raw) return { title: 'Collection Not Found' }
  return {
    title: raw.title,
    description: raw.description ?? `Shop ${raw.title} — premium car care products by Velanto`,
  }
}


export default async function CollectionPage({ params }: Props) {
  const { handle } = await params
  const raw = await getCollectionByHandle(handle, 48)
  if (!raw) notFound()

  const collection = transformCollection(raw)

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content">
        {/* Hero */}
        <div className="relative bg-background border-b border-white/8 overflow-hidden">
          {collection.image && (
            <div className="absolute inset-0">
              <Image
                src={collection.image.url}
                alt={collection.image.altText}
                fill
                sizes="100vw"
                className="object-cover opacity-15"
              />
              <div className="absolute inset-0 bg-linear-to-b from-background/60 to-background" />
            </div>
          )}
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
              <span>/</span>
              <span className="text-white">{collection.title}</span>
            </nav>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">{collection.title}</h1>
            {collection.description && (
              <p className="text-zinc-400 text-base max-w-xl">{collection.description}</p>
            )}
            <p className="text-zinc-500 text-sm mt-3">{collection.products.length} products</p>
          </div>
        </div>

        {/* Products */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {collection.products.length === 0 ? (
            <div className="rounded-2xl border border-white/8 bg-surface py-20 text-center">
              <p className="text-zinc-200 text-lg font-semibold mb-2">No products in this collection yet</p>
              <p className="mx-auto mb-5 max-w-md text-sm text-zinc-500">
                Publish products to this Shopify collection and they will appear here automatically.
              </p>
              <Link href="/shop" className="inline-flex rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5">Browse all products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {collection.products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
