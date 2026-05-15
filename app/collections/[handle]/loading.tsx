import AnnouncementBar from '@/components/AnnouncementBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductGridSkeleton from '@/components/ProductGridSkeleton'

export default function CollectionLoading() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="bg-background">
        <div className="border-b border-white/8 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-4 h-3 w-40 animate-pulse rounded bg-white/8" />
            <div className="mb-3 h-12 w-72 animate-pulse rounded bg-white/8" />
            <div className="h-4 w-48 animate-pulse rounded bg-white/8" />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <ProductGridSkeleton />
        </div>
      </main>
      <Footer />
    </>
  )
}
