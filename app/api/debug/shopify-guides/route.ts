/**
 * GET /api/debug/shopify-guides
 *
 * Bypasses ALL caching — makes raw GraphQL requests directly so cached
 * null results cannot mask the real Shopify response.
 *
 * Tests handles: guides, detailing-guides, news
 * Returns full GraphQL response body including any errors field.
 */

// API routes are ƒ Dynamic by default in Next.js App Router — no segment
// config needed. Caching is disabled at the fetch level via cache: 'no-store'.
import { NextResponse } from 'next/server'

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
const API_VERSION = '2025-01'
const ENDPOINT = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`

// Raw GraphQL query — no fragment dependencies, no caching
const BLOG_PROBE_QUERY = `
  query ProbeBlog($handle: String!) {
    blog(handle: $handle) {
      id
      title
      handle
      articles(first: 5, sortKey: PUBLISHED_AT, reverse: true) {
        edges {
          node {
            id
            title
            handle
            publishedAt
            onlineStoreUrl
            image { url altText }
            tags
          }
        }
      }
    }
  }
`

type ArticleNode = {
  id: string
  title: string
  handle: string
  publishedAt: string
  onlineStoreUrl: string | null
  image: { url: string; altText: string | null } | null
  tags: string[]
}

type BlogResult = {
  data?: {
    blog: {
      id: string
      title: string
      handle: string
      articles: { edges: { node: ArticleNode }[] }
    } | null
  }
  errors?: { message: string; extensions?: { code?: string } }[]
}

async function probeHandle(handle: string): Promise<{
  rawResponse: BlogResult
  blogFound: boolean
  blogTitle: string | null
  articleCount: number
  articles: { title: string; handle: string; publishedAt: string }[]
  error: string | null
}> {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      cache: 'no-store',   // bypass Next.js fetch cache
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': TOKEN ?? '',
      },
      body: JSON.stringify({ query: BLOG_PROBE_QUERY, variables: { handle } }),
    })

    const raw: BlogResult = await res.json()

    if (raw.errors?.length) {
      return {
        rawResponse: raw,
        blogFound: false,
        blogTitle: null,
        articleCount: 0,
        articles: [],
        error: raw.errors.map((e) => `${e.message} (code: ${e.extensions?.code ?? 'unknown'})`).join('; '),
      }
    }

    const blog = raw.data?.blog ?? null

    return {
      rawResponse: raw,
      blogFound: !!blog,
      blogTitle: blog?.title ?? null,
      articleCount: blog?.articles.edges.length ?? 0,
      articles: (blog?.articles.edges ?? []).map((e) => ({
        title: e.node.title,
        handle: e.node.handle,
        publishedAt: e.node.publishedAt,
      })),
      error: null,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return {
      rawResponse: {},
      blogFound: false,
      blogTitle: null,
      articleCount: 0,
      articles: [],
      error: `fetch failed: ${msg}`,
    }
  }
}

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Debug routes are disabled in production.' },
      { status: 403 }
    )
  }

  if (!DOMAIN || !TOKEN) {
    return NextResponse.json({
      error: 'Missing env vars',
      missing: [
        !DOMAIN && 'NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN',
        !TOKEN && 'NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN',
      ].filter(Boolean),
    }, { status: 500 })
  }

  // Probe all candidate handles in parallel — no sequential waterfall
  const HANDLES_TO_TEST = ['guides', 'detailing-guides', 'news']
  const results = await Promise.all(HANDLES_TO_TEST.map((h) => probeHandle(h)))

  const testedHandles: Record<string, {
    blogFound: boolean
    blogTitle: string | null
    articleCount: number
    articles: { title: string; handle: string; publishedAt: string }[]
    error: string | null
    rawGraphQLResponse: BlogResult
  }> = {}

  HANDLES_TO_TEST.forEach((handle, i) => {
    const r = results[i]
    testedHandles[handle] = {
      blogFound: r.blogFound,
      blogTitle: r.blogTitle,
      articleCount: r.articleCount,
      articles: r.articles,
      error: r.error,
      rawGraphQLResponse: r.rawResponse,
    }
  })

  // Find first working handle
  const workingHandle = HANDLES_TO_TEST.find((h) => testedHandles[h].blogFound) ?? null

  // ── Diagnosis ────────────────────────────────────────────────────────────────
  let nextFix: string | null = null

  const anyAuthError = results.some(
    (r) => r.error?.includes('UNAUTHORIZED') || r.error?.includes('401')
  )
  const anyAccessDenied = results.some(
    (r) => r.error?.includes('ACCESS_DENIED') || r.error?.includes('access_denied')
  )

  if (anyAuthError) {
    nextFix = '401 UNAUTHORIZED — token is invalid or empty. Check NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local'
  } else if (anyAccessDenied) {
    nextFix = 'ACCESS_DENIED — enable scope "unauthenticated_read_content" in Shopify Admin → Apps → [your app] → Storefront API access scopes'
  } else if (!workingHandle) {
    nextFix =
      'No blog found under any tested handle (guides, detailing-guides, news). ' +
      'In Shopify Admin → Online Store → Blog Posts → Manage Blogs: ' +
      'check the exact URL handle shown next to your blog. ' +
      'Then update BLOG_HANDLE in lib/shopify.ts to match.'
  } else if (workingHandle !== 'guides') {
    nextFix =
      `Blog found at handle "${workingHandle}" but frontend queries "guides". ` +
      `Either: (A) rename the blog handle to "guides" in Shopify Admin → Manage Blogs → Edit → Handle, ` +
      `or (B) update the frontend to use "${workingHandle}" instead of "guides".`
  } else if (testedHandles['guides'].articleCount === 0) {
    nextFix =
      'Blog "guides" found but has no published articles. ' +
      'Add an article in Shopify Admin → Blog Posts → Add blog post, set Blog = your guides blog, set Visibility = Visible, and Publish.'
  } else {
    nextFix = null // everything working
  }

  // ── Storefront visibility note ───────────────────────────────────────────────
  // Shopify note: a blog set to "Online Store" visibility is accessible via
  // Storefront API regardless of whether it appears on the theme frontend.
  // The "Blog column" in Admin is the blog the article belongs to — it does NOT
  // control Storefront API access. Only the article's "Visibility" field matters.
  const storefrontNote =
    'A blog article is accessible via Storefront API as long as: ' +
    '(1) article Visibility = Visible (not Hidden), ' +
    '(2) the blog exists (any handle), ' +
    '(3) scope unauthenticated_read_content is enabled. ' +
    'The "Online Store" theme visibility does NOT affect Storefront API access.'

  return NextResponse.json(
    {
      timestamp: new Date().toISOString(),
      endpoint: ENDPOINT,
      tokenPresent: !!TOKEN,
      tokenPrefix: TOKEN ? `${TOKEN.slice(0, 6)}…` : null,
      testedHandles,
      workingHandle,
      nextFix,
      storefrontNote,
    },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    }
  )
}
