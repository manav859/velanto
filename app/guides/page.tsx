import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import AnnouncementBar from '@/components/AnnouncementBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getBlogArticles } from '@/lib/shopify'
import { transformGuideArticle } from '@/lib/transformers'

export const metadata: Metadata = {
  title: 'Car Care Guides',
  description: 'Expert car detailing tips, how-to guides, and product advice for Indian car owners.',
}

export default async function GuidesPage() {
  const { articles: rawArticles } = await getBlogArticles('guides', 24, 'PUBLISHED_AT', true)
  const articles = rawArticles.map(transformGuideArticle)
  const [featured, ...rest] = articles

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content">
        <section className="border-b border-white/8 bg-background px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">Guides &amp; Tips</p>
          <h1 className="mb-3 text-4xl font-black tracking-tight text-white sm:text-5xl">The Velanto Garage</h1>
          <p className="mx-auto max-w-md text-sm text-zinc-400">
            Expert car care tips, how-to guides, and product advice for Indian car owners.
          </p>
        </section>

        <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 sm:px-6 lg:px-8">
          {featured && (
            <section>
              <Link
                href={`/guides/${featured.handle}`}
                className="group grid gap-0 overflow-hidden rounded-2xl border border-white/8 transition-colors hover:border-accent/25 lg:grid-cols-2"
              >
                <div className="relative h-64 overflow-hidden bg-surface-2 lg:h-auto">
                  {featured.image ? (
                    <Image
                      src={featured.image.url}
                      alt={featured.image.altText ?? featured.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(39,174,96,0.05)_0%,transparent_70%)]" />
                  )}
                  <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                    Latest
                  </span>
                </div>

                <div className="flex flex-col justify-center gap-4 bg-surface p-8 lg:p-10">
                  {featured.category && (
                    <p className="text-xs font-bold uppercase tracking-widest text-accent">{featured.category}</p>
                  )}
                  <h2 className="text-2xl font-black leading-snug text-white transition-colors group-hover:text-accent-bright sm:text-3xl">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="line-clamp-3 text-sm leading-relaxed text-zinc-400">{featured.excerpt}</p>
                  )}
                  <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500">
                    {featured.publishedAt && <span>{featured.publishedAt}</span>}
                    {featured.readTime && (
                      <>
                        <span>•</span>
                        <span>{featured.readTime} read</span>
                      </>
                    )}
                  </div>
                  <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                    Read Article
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            </section>
          )}

          {rest.length > 0 && (
            <section>
              <h2 className="mb-8 text-xl font-black text-white">All Articles</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article) => (
                  <Link
                    key={article.id}
                    href={`/guides/${article.handle}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-white/8 bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/25"
                  >
                    <div className="relative h-48 overflow-hidden bg-surface-2">
                      {article.image ? (
                        <Image
                          src={article.image.url}
                          alt={article.image.altText ?? article.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(39,174,96,0.05)_0%,transparent_70%)]" />
                      )}
                      {article.category && (
                        <span className="absolute left-3 top-3 rounded-full bg-accent/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                          {article.category}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white transition-colors group-hover:text-accent-bright">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-zinc-500">{article.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-600">
                          {[article.publishedAt, article.readTime && `${article.readTime} read`].filter(Boolean).join(' · ')}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-accent">
                          Read
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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

          {articles.length === 0 && (
            <div className="rounded-2xl border border-white/8 bg-surface p-12 text-center">
              <p className="mb-2 text-lg font-semibold text-white">No guides published yet</p>
              <p className="text-sm text-zinc-500">
                Publish articles to the Shopify blog with the handle <span className="text-zinc-300">guides</span> and they will appear here automatically.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
