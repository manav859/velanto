import Link from 'next/link'
import PageShell from '@/components/PageShell'

export default function RootNotFound() {
  return (
    <PageShell>
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">Page Not Found</p>
          <h1 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            The page you requested does not exist
          </h1>
          <p className="mx-auto max-w-md text-base leading-relaxed text-zinc-400">
            The link may be outdated or the page may have moved. You can continue shopping or return to the homepage.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-bright"
            >
              Browse Products
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
