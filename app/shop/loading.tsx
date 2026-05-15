import AnnouncementBar from '@/components/AnnouncementBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductGridSkeleton from '@/components/ProductGridSkeleton'

export default function ShopLoading() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="min-h-screen bg-background">
        <div className="border-b border-white/8 bg-background px-4 pb-8 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-3 h-3 w-40 animate-pulse rounded bg-white/8" />
            <div className="h-12 w-56 animate-pulse rounded bg-white/8" />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <ProductGridSkeleton />
        </div>
      </main>
      <Footer />
    </>
  )
}
