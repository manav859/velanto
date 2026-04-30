import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import AnnouncementBar from '@/components/AnnouncementBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getBlogArticles } from '@/lib/shopify'
import { transformArticle } from '@/lib/transformers'

export const metadata: Metadata = {
  title: 'Car Care Guides',
  description: 'Expert car detailing tips, how-to guides, and product advice for Indian car owners.',
}

export default async function GuidesPage() {
  const { blog, articles: rawArticles } = await getBlogArticles('guides', 24)
  const articles = rawArticles.map((a) => transformArticle(a, blog?.handle ?? 'guides', blog?.title ?? 'Guides'))

  const [featured, ...rest] = articles

  const TAGS = ['All', 'Exterior', 'Interior', 'Protection', 'Wheels', 'Seasonal']

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-background border-b border-white/8 py-16 px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-accent mb-3">Guides & Tips</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">The Velanto Garage</h1>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">Expert car care tips, how-to guides, and product advice for Indian car owners</p>
        </section>

        {/* Category tabs */}
        <div className="border-b border-white/8 bg-surface/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  className={`shrink-0 px-4 py-2.5 text-sm font-semibold rounded-md transition-colors ${tag === 'All' ? 'bg-accent text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          {/* Featured article */}
          {featured && (
            <section>
              <Link
                href={`/guides/${featured.handle}`}
                className="group grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-white/8 hover:border-accent/25 transition-colors"
              >
                {/* Image */}
                <div className="relative h-64 lg:h-auto bg-surface-2 overflow-hidden">
                  {featured.image ? (
                    <Image
                      src={featured.image.url}
                      alt={featured.image.altText}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface-2">
                      <svg className="w-16 h-16 text-white/10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                  <span className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">Featured</span>
                </div>
                {/* Content */}
                <div className="bg-surface p-8 lg:p-10 flex flex-col justify-center gap-4">
                  <p className="text-xs font-bold tracking-widest uppercase text-accent">{featured.tags[0] ?? 'Guide'}</p>
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug group-hover:text-accent-bright transition-colors">{featured.title}</h2>
                  {featured.excerpt && (
                    <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">{featured.excerpt}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-zinc-500 mt-2">
                    <span>{featured.author}</span>
                    <span>•</span>
                    <span>{featured.publishedAt}</span>
                    <span>•</span>
                    <span>{featured.readTime} min read</span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-accent text-sm font-semibold mt-2">
                    Read Article
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            </section>
          )}

          {/* All articles grid */}
          {rest.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-white">Latest Articles</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((article) => (
                  <Link
                    key={article.id}
                    href={`/guides/${article.handle}`}
                    className="group flex flex-col rounded-xl border border-white/8 bg-surface overflow-hidden hover:border-accent/25 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="relative h-48 bg-surface-2 overflow-hidden">
                      {article.image ? (
                        <Image
                          src={article.image.url}
                          alt={article.image.altText}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-10 h-10 text-white/10" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      )}
                      {article.tags[0] && (
                        <span className="absolute top-3 left-3 bg-accent/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                          {article.tags[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 p-5 gap-3">
                      <h3 className="text-sm font-bold text-white leading-snug group-hover:text-accent-bright transition-colors line-clamp-2">{article.title}</h3>
                      {article.excerpt && (
                        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 flex-1">{article.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-600">{article.publishedAt} · {article.readTime} min</span>
                        <span className="text-xs font-semibold text-accent flex items-center gap-1">
                          Read
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {articles.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-zinc-400 text-lg font-semibold mb-2">No guides yet</p>
              <p className="text-zinc-600 text-sm">Check back soon — we&apos;re writing expert detailing guides for you.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
