import Link from 'next/link'
import AnnouncementBar from '@/components/AnnouncementBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

/**
 * Shown when `notFound()` is called for a collection handle that doesn't exist.
 * Provides a polished fallback so the user never sees a raw 404 page.
 */
export default function CollectionNotFound() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-surface border border-white/8 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
            </svg>
          </div>

          <p className="text-xs font-bold tracking-widest uppercase text-accent mb-3">Collection Not Found</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            This collection doesn&apos;t exist yet
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed mb-8 max-w-md mx-auto">
            The product category you are looking for hasn&apos;t been set up in our store yet.
            Browse all available products or explore our shop.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-bright text-white font-bold px-7 py-3 rounded-lg transition-colors text-sm"
            >
              Browse All Products
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border border-white/15 text-white font-semibold px-7 py-3 rounded-lg hover:bg-white/5 transition-colors text-sm"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
