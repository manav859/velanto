import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import AnnouncementBar from '@/components/AnnouncementBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getGuideByHandle, getHomepageGuides } from '@/lib/shopify'
import { transformGuideDetail, transformGuideArticle } from '@/lib/transformers'

type Props = { params: Promise<{ handle: string }> }

// ─── SEO metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const raw = await getGuideByHandle(handle)
  if (!raw) return { title: 'Guide Not Found' }

  const article = transformGuideDetail(raw)

  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt?.slice(0, 160),
    openGraph: {
      title: article.seoTitle ?? article.title,
      description: article.seoDescription ?? article.excerpt?.slice(0, 160) ?? undefined,
      images: article.image
        ? [{ url: article.image.url, alt: article.image.altText ?? article.title }]
        : [],
    },
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function GuideDetailPage({ params }: Props) {
  const { handle } = await params

  // Fetch article + related guides in parallel
  const [raw, relatedRaw] = await Promise.all([
    getGuideByHandle(handle),
    getHomepageGuides(),
  ])

  if (!raw) notFound()

  const article = transformGuideDetail(raw)
  const related = relatedRaw
    .map(transformGuideArticle)
    .filter((a) => a.handle !== handle)
    .slice(0, 3)

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>

        {/* ── Hero / cover image ───────────────────────────────────────────── */}
        <div className="relative bg-background">
          {article.image && (
            <div className="relative h-72 sm:h-96 overflow-hidden">
              <Image
                src={article.image.url}
                alt={article.image.altText ?? article.title}
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background to-background/30" />
            </div>
          )}

          <div
            className={`mx-auto max-w-3xl px-4 sm:px-6 ${article.image ? '-mt-24 relative z-10' : 'pt-16'} pb-8`}
          >
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/guides" className="hover:text-white transition-colors">Guides</Link>
              <span>/</span>
              <span className="text-white line-clamp-1">{article.title}</span>
            </nav>

            {/* Category tag */}
            {article.category && (
              <p className="text-xs font-bold tracking-widest uppercase text-accent mb-4">
                {article.category}
              </p>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-6">
              {article.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
                  {article.author?.[0] ?? 'V'}
                </div>
                <span className="font-medium text-white">{article.author ?? 'Velanto Team'}</span>
              </div>
              {article.publishedAt && <><span>•</span><span>{article.publishedAt}</span></>}
              {article.readTime && <><span>•</span><span>{article.readTime} read</span></>}
            </div>

            {/* All tags as badges */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold uppercase tracking-wide bg-accent/10 text-accent border border-accent/20 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Content + sidebar ─────────────────────────────────────────────── */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-12">

            {/* Article content */}
            <article className="lg:col-span-2">
              {article.contentHtml ? (
                <div
                  className="prose prose-invert prose-base max-w-none
                    prose-headings:font-black prose-headings:tracking-tight
                    prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                    prose-p:text-zinc-400 prose-p:leading-relaxed
                    prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-white prose-strong:font-bold
                    prose-ul:text-zinc-400 prose-ol:text-zinc-400
                    prose-li:marker:text-accent
                    prose-img:rounded-xl prose-img:border prose-img:border-white/8
                    prose-blockquote:border-l-accent prose-blockquote:text-zinc-400"
                  dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                />
              ) : (
                article.excerpt && (
                  <p className="text-zinc-400 text-base leading-relaxed">{article.excerpt}</p>
                )
              )}
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Shop CTA */}
              <div className="rounded-xl border border-accent/25 bg-accent/5 p-6 space-y-4">
                <p className="text-xs font-bold tracking-widest uppercase text-accent">
                  Shop Velanto Products
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Get professional-grade products designed for Indian roads.
                </p>
                <Link
                  href="/shop"
                  className="flex items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-bold text-white hover:bg-accent-bright transition-colors"
                >
                  Shop Now
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>

              {/* Related guides */}
              {related.length > 0 && (
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-4">
                    Related Guides
                  </p>
                  <div className="flex flex-col divide-y divide-white/8">
                    {related.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/guides/${rel.handle}`}
                        className="group flex gap-3 py-4"
                      >
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-surface-2 shrink-0">
                          {rel.image ? (
                            <Image
                              src={rel.image.url}
                              alt={rel.image.altText ?? rel.title}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20 text-xl">
                              📖
                            </div>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors line-clamp-3 leading-snug pt-0.5">
                          {rel.title}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
