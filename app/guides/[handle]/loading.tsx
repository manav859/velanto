import AnnouncementBar from '@/components/AnnouncementBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function GuideLoading() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-4 h-3 w-32 animate-pulse rounded bg-white/8" />
          <div className="mb-4 h-12 w-full animate-pulse rounded bg-white/8" />
          <div className="h-4 w-56 animate-pulse rounded bg-white/8" />
        </div>
      </main>
      <Footer />
    </>
  )
}
