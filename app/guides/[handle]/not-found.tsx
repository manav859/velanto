import Link from 'next/link'
import AnnouncementBar from '@/components/AnnouncementBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function GuideNotFound() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-surface border border-white/8 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <p className="text-xs font-bold tracking-widest uppercase text-accent mb-3">Guide Not Found</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            This guide doesn&apos;t exist
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed mb-8 max-w-md mx-auto">
            The guide you&apos;re looking for may have been removed or the link may be incorrect.
            Browse all available detailing guides below.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/guides" className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-bright text-white font-bold px-7 py-3 rounded-lg transition-colors text-sm">
              Browse All Guides
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link href="/shop" className="inline-flex items-center justify-center border border-white/15 text-white font-semibold px-7 py-3 rounded-lg hover:bg-white/5 transition-colors text-sm">
              Shop Products
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
