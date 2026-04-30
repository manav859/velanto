import type { Metadata } from 'next'
import AnnouncementBar from '@/components/AnnouncementBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ShopClient from './ShopClient'
import { getProducts, getCollections } from '@/lib/shopify'
import { transformProduct } from '@/lib/transformers'

export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse all premium car care products — shampoos, ceramic sprays, tyre dressings, microfibre towels, kits and more.',
}

export default async function ShopPage() {
  const [rawProducts, rawCollections] = await Promise.all([
    getProducts(48),
    getCollections(12),
  ])

  const products = rawProducts.map(transformProduct)
  const collections = rawCollections.map((c) => ({
    id: c.id,
    title: c.title,
    handle: c.handle,
  }))

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <ShopClient products={products} collections={collections} />
      </main>
      <Footer />
    </>
  )
}
