import { Suspense } from 'react'
import type { Metadata } from 'next'
import AnnouncementBar from '@/components/AnnouncementBar'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import CategoryTiles from '@/components/CategoryTiles'
import FeaturedProducts from '@/components/FeaturedProducts'
import StarterGuideSection from '@/components/StarterGuideSection'
import WhyChooseUs from '@/components/WhyChooseUs'
import GuidesSection from '@/components/GuidesSection'
import Footer from '@/components/Footer'
import ProductGridSkeleton from '@/components/ProductGridSkeleton'
import {
  getHomepageHero,
  getHomepageFeaturedProducts,
  getHomepageGuides,
} from '@/lib/shopify'
import {
  transformHomepageFeaturedProducts,
  transformGuideArticle,
} from '@/lib/transformers'

export const metadata: Metadata = {
  title: 'Velanto — Premium Car Detailing Products',
  description:
    'Professional-grade car care products for a showroom finish. Shop shampoos, ceramic sprays, tyre cleaners, microfibre towels and detailing kits.',
  openGraph: {
    title: 'Velanto — Premium Car Detailing Products',
    description: 'Professional-grade car care products engineered for Indian roads. Showroom finish, every time.',
    type: 'website',
  },
}

export default async function HomePage() {
  // All three fetches run in parallel — zero waterfall
  const [hero, rawFeatured, rawGuides] = await Promise.all([
    getHomepageHero(),
    getHomepageFeaturedProducts(),
    getHomepageGuides(),
  ])

  const featuredCms = rawFeatured ? transformHomepageFeaturedProducts(rawFeatured) : null
  const guides = rawGuides.map(transformGuideArticle)

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content">
        <HeroSection hero={hero} />
        <CategoryTiles />
        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <FeaturedProducts cms={featuredCms} />
        </Suspense>
        <StarterGuideSection />
        <WhyChooseUs />
        {/* guides: empty array → GuidesSection renders static fallback cards */}
        <GuidesSection guides={guides} />
      </main>
      <Footer />
    </>
  )
}

function FeaturedProductsSkeleton() {
  return (
    <section className="py-20 bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="h-3 w-24 bg-white/8 rounded animate-pulse mb-3" />
          <div className="h-9 w-56 bg-white/8 rounded animate-pulse" />
        </div>
        <ProductGridSkeleton />
      </div>
    </section>
  )
}
