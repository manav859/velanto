import AnnouncementBar from '@/components/AnnouncementBar'
import Header from '@/components/Header'

export default function ProductLoading() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content">
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            {/* Breadcrumb skeleton */}
            <div className="mb-8 flex items-center gap-2">
              <div className="h-3 w-10 animate-pulse rounded bg-white/8" />
              <span className="text-zinc-700">/</span>
              <div className="h-3 w-10 animate-pulse rounded bg-white/8" />
              <span className="text-zinc-700">/</span>
              <div className="h-3 w-28 animate-pulse rounded bg-white/8" />
            </div>

            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              {/* Image skeleton */}
              <div className="space-y-4">
                <div className="aspect-square animate-pulse rounded-2xl bg-surface-2" />
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 w-16 shrink-0 animate-pulse rounded-lg bg-surface-2 sm:h-20 sm:w-20" />
                  ))}
                </div>
              </div>

              {/* Info skeleton */}
              <div className="space-y-6">
                <div className="h-3 w-32 animate-pulse rounded bg-accent/20" />
                <div className="h-10 w-3/4 animate-pulse rounded bg-white/8" />
                <div className="h-8 w-24 animate-pulse rounded bg-white/8" />
                <div className="h-3 w-20 animate-pulse rounded bg-white/8" />
                <div className="h-12 w-full animate-pulse rounded-md bg-accent/20" />
                <div className="space-y-3 border-t border-white/8 pt-6">
                  <div className="h-3 w-20 animate-pulse rounded bg-white/8" />
                  <div className="h-4 w-full animate-pulse rounded bg-white/5" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-white/5" />
                  <div className="h-4 w-4/6 animate-pulse rounded bg-white/5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
