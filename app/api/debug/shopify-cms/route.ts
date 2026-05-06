import { NextResponse } from 'next/server'
import {
  getHomepageHero,
  getHomepageFeaturedProducts,
  getBlogArticles,
  type HomepageHero,
  type HomepageFeaturedProducts,
  type ShopifyArticle,
} from '@/lib/shopify'

/**
 * GET /api/debug/shopify-cms
 *
 * Returns the health status of every Shopify CMS source used on the homepage.
 * Only active in non-production environments.
 */
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Debug routes are disabled in production.' }, { status: 403 })
  }

  // Fetch all three sources concurrently; never throw — always return a status
  const results = await Promise.allSettled([
    getHomepageHero(),
    getHomepageFeaturedProducts(),
    getBlogArticles('guides', 12),
  ])

  const hero      = results[0].status === 'fulfilled' ? results[0].value as HomepageHero | null             : null
  const featured  = results[1].status === 'fulfilled' ? results[1].value as HomepageFeaturedProducts | null : null
  const blogResult= results[2].status === 'fulfilled'
    ? results[2].value as { blog: { id: string; title: string; handle: string } | null; articles: ShopifyArticle[] }
    : { blog: null, articles: [] as ShopifyArticle[] }

  const { blog, articles } = blogResult

  const report = {
    timestamp: new Date().toISOString(),
    store: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? 'MISSING',

    // ── Homepage Hero ────────────────────────────────────────────────────────
    hero: {
      status: hero ? 'OK' : 'MISSING',
      metaobjectType: 'homepage_hero',
      handle: 'professional-grade',
      hint: hero
        ? null
        : 'Create a metaobject of type "homepage_hero" with handle "professional-grade" in Shopify Admin → Content → Metaobjects',
      data: hero
        ? { headline: hero.headline, hasHeroImage: !!hero.heroImage, hasBackgroundImage: !!hero.backgroundImage }
        : null,
    },

    // ── Featured Products ────────────────────────────────────────────────────
    featuredProducts: {
      status: !featured ? 'MISSING' : featured.products.length > 0 ? 'OK' : 'EMPTY',
      metaobjectType: 'homepage_featured_products',
      handle: 'homepage-featured-products',
      productsCount: featured?.products.length ?? 0,
      hint: !featured
        ? 'Create the "homepage_featured_products" metaobject — see shopifyAdminSteps below'
        : featured.products.length === 0
          ? 'Metaobject exists but has no products. Edit the "homepage-featured-products" entry and add products to the "products" field.'
          : null,
      products: (featured?.products ?? []).map((p) => ({
        title: p.title,
        handle: p.handle,
        available: p.availableForSale ?? true,
      })),
    },

    // ── Guides Blog ──────────────────────────────────────────────────────────
    guidesBlog: {
      status: !blog ? 'MISSING' : articles.length > 0 ? 'OK' : 'EMPTY',
      blogHandle: 'guides',
      articlesCount: articles.length,
      hint: !blog
        ? 'Create a blog with handle "guides" — Shopify Admin → Online Store → Blog Posts → Manage Blogs'
        : articles.length === 0
          ? 'Blog exists but has no published articles. Add articles to the "guides" blog.'
          : null,
      articles: articles.map((a) => ({
        title: a.title,
        handle: a.handle,
        hasFeaturedImage: !!a.image,
        tags: a.tags ?? [],
      })),
    },

    // ── Overall readiness ────────────────────────────────────────────────────
    summary: {
      homepageFullyCMSPowered:
        !!hero &&
        (featured?.products.length ?? 0) > 0 &&
        articles.length > 0,
      fallbacksActive: {
        featuredProducts: (featured?.products.length ?? 0) === 0,
        guidesSection: articles.length === 0,
      },
    },

    // ── Shopify Admin setup guide ────────────────────────────────────────────
    shopifyAdminSteps: [
      {
        step: 1,
        title: 'Create homepage_featured_products metaobject definition',
        path: 'Shopify Admin → Settings → Custom data → Metaobjects → Add definition',
        name: 'Homepage Featured Products',
        type: 'homepage_featured_products',
        fields: [
          { name: 'section_eyebrow',    type: 'single_line_text_field', example: 'Hand-Picked' },
          { name: 'section_heading',    type: 'single_line_text_field', example: 'Featured Products' },
          { name: 'section_link_label', type: 'single_line_text_field', example: 'View all' },
          { name: 'section_link_url',   type: 'url',                    example: '/shop' },
          { name: 'products',           type: 'list.product_reference', example: 'Select 4–8 products' },
        ],
      },
      {
        step: 2,
        title: 'Create the metaobject entry',
        path: 'Shopify Admin → Content → Metaobjects → Homepage Featured Products → Add entry',
        handle: 'homepage-featured-products',
        note: 'The handle MUST be exactly: homepage-featured-products',
      },
      {
        step: 3,
        title: 'Create Detailing Guides blog',
        path: 'Shopify Admin → Online Store → Blog Posts → Manage Blogs → Add blog',
        blogTitle: 'Detailing Guides',
        blogHandle: 'guides',
        note: 'The handle MUST be exactly: guides',
      },
      {
        step: 4,
        title: 'Publish at least 3 articles in the Guides blog',
        requirements: [
          'Set Blog to "Detailing Guides"',
          'Add a featured image to each article',
          'Add tags: Exterior | Interior | Protection | Wheels | Seasonal',
          'Fill in the SEO excerpt field',
          'Set status to Published',
        ],
      },
      {
        step: 5,
        title: 'Verify',
        check: 'Re-visit /api/debug/shopify-cms — summary.homepageFullyCMSPowered should be true',
      },
    ],
  }

  return NextResponse.json(report, {
    headers: { 'Content-Type': 'application/json' },
  })
}
