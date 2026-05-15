import AnnouncementBar from '@/components/AnnouncementBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function GuidesLoading() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="bg-background">
        <div className="border-b border-white/8 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-3 h-3 w-28 animate-pulse rounded bg-white/8" />
            <div className="mx-auto mb-3 h-12 w-80 animate-pulse rounded bg-white/8" />
            <div className="mx-auto h-4 w-64 animate-pulse rounded bg-white/8" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
