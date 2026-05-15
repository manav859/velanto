import type { Metadata } from 'next'
import AnnouncementBar from '@/components/AnnouncementBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ShopClient from './ShopClient'
import { getProducts, getCollections } from '@/lib/shopify'
import { transformProduct } from '@/lib/transformers'

// Shopify always includes a default "frontpage" collection (titled "Home page")
// used by themes to feature homepage products. It must never appear as a
// product-category filter in the headless shop page.
const EXCLUDED_COLLECTION_HANDLES = new Set([
  'frontpage',
  'home',
  'homepage',
  'home-page',
  'automated-collection',
])

export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse all premium car care products — shampoos, ceramic sprays, tyre dressings, microfibre towels, kits and more.',
  openGraph: {
    title: 'Shop All Products | Velanto',
    description: 'Professional-grade car care products engineered for Indian roads.',
    type: 'website',
  },
}

export default async function ShopPage() {
  const [rawProducts, rawCollections] = await Promise.all([
    getProducts(48),
    getCollections(20),           // fetch more so filtering still leaves enough
  ])

  const products = rawProducts.map(transformProduct)

  const collections = rawCollections
    .filter((c) => !EXCLUDED_COLLECTION_HANDLES.has(c.handle.toLowerCase()))
    .map((c) => ({ id: c.id, title: c.title, handle: c.handle }))

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content">
        <ShopClient products={products} collections={collections} />
      </main>
      <Footer />
    </>
  )
}
