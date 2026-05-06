import { GraphQLClient, gql } from 'graphql-request'
import { cacheLife, cacheTag } from 'next/cache'

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

// ── Startup validation ────────────────────────────────────────────────────────
// Fail loudly in development so missing env vars are obvious immediately.
if (!domain || !token) {
  const missing = [
    !domain && 'NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN',
    !token && 'NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN',
  ].filter(Boolean).join(', ')
  if (process.env.NODE_ENV === 'development') {
    console.error(
      `\n[Velanto] ❌ Missing required environment variables: ${missing}\n` +
      `Add them to .env.local:\n` +
      `  NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com\n` +
      `  NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token\n`
    )
  }
}

const API_VERSION = '2025-01'
const endpoint = `https://${domain ?? ''}/api/${API_VERSION}/graphql.json`

const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    'X-Shopify-Storefront-Access-Token': token ?? '',
    'Content-Type': 'application/json',
  },
})

// ── Error classifier ──────────────────────────────────────────────────────────
// Shopify returns UNAUTHORIZED (401) for bad/missing tokens and
// ACCESS_DENIED for valid tokens that lack a specific scope.
function classifyShopifyError(err: unknown): 'UNAUTHORIZED' | 'ACCESS_DENIED' | 'OTHER' {
  const msg = err instanceof Error ? err.message : String(err)
  if (msg.includes('"status":401') || msg.includes('Code: 401') || msg.includes('UNAUTHORIZED')) {
    return 'UNAUTHORIZED'
  }
  if (msg.includes('ACCESS_DENIED') || msg.includes('access_denied')) {
    return 'ACCESS_DENIED'
  }
  return 'OTHER'
}

// ─── Shared types ─────────────────────────────────────────────────────────────

export type Money = { amount: string; currencyCode: string }
export type FeaturedImage = { url: string; altText: string | null }

// ─── Product types ────────────────────────────────────────────────────────────

export type Product = {
  id: string
  title: string
  handle: string
  description: string
  featuredImage: FeaturedImage | null
  priceRange: { minVariantPrice: Money }
}

export type ShopifyProduct = {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml?: string
  vendor?: string
  productType?: string
  tags?: string[]
  availableForSale?: boolean
  featuredImage: { url: string; altText: string | null } | null
  images?: { edges: { node: { url: string; altText: string | null } }[] }
  priceRange: { minVariantPrice: Money; maxVariantPrice?: Money }
  compareAtPriceRange?: { minVariantPrice: Money }
  variants?: {
    edges: {
      node: {
        id: string
        title: string
        price: Money
        compareAtPrice: Money | null
        availableForSale: boolean
        selectedOptions: { name: string; value: string }[]
      }
    }[]
  }
}

export type ShopifyCollection = {
  id: string
  title: string
  handle: string
  description?: string
  image?: { url: string; altText: string | null } | null
  products?: { edges: { node: ShopifyProduct }[] }
}

export type ShopifyArticle = {
  id: string
  title: string
  handle: string
  excerpt?: string
  content?: string
  contentHtml?: string
  publishedAt: string
  image?: { url: string; altText: string | null; width?: number | null; height?: number | null } | null
  author?: { name: string }
  tags?: string[]
  seo?: { title?: string | null; description?: string | null }
}

export type CartLine = {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    price: Money
    product: {
      title: string
      handle: string
      featuredImage: { url: string; altText: string | null } | null
    }
  }
}

export type ShopifyCart = {
  id: string
  checkoutUrl: string
  lines: { edges: { node: CartLine }[] }
  cost: {
    subtotalAmount: Money
    totalAmount: Money
  }
}

// ─── Metaobject / hero types ──────────────────────────────────────────────────

export type HeroImage = { url: string; altText: string | null; width: number | null; height: number | null }
type ShopifyMediaImageReference = { image: HeroImage }

// ShopifyMetaobjectField supports both single reference (image) and list references (products)
export type ShopifyMetaobjectField = {
  key: string
  value: string | null
  reference: ShopifyMediaImageReference | null
  // For list-of-product-reference fields (homepage_featured_products → products)
  references: { edges: { node: ShopifyProduct | null }[] } | null
}

// ─── Homepage Featured Products metaobject ────────────────────────────────────

export type HomepageFeaturedProductsRaw = {
  id: string
  type: string
  fields: ShopifyMetaobjectField[]
}

export type HomepageFeaturedProducts = {
  eyebrow: string
  heading: string
  linkLabel: string
  linkUrl: string
  products: ShopifyProduct[]
}

export type HomepageHero = {
  eyebrowText: string
  headline: string
  highlightText: string
  subtext: string
  primaryButton: string
  primaryLink: string
  secondaryButton: string
  secondaryLink: string
  heroImage?: HeroImage
  backgroundImage?: HeroImage
}

// ─── Queries ──────────────────────────────────────────────────────────────────

const PRODUCT_FIELDS = gql`
  fragment ProductFields on Product {
    id
    title
    handle
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
    featuredImage { url altText width height }
    images(first: 8) { edges { node { url altText width height } } }
    priceRange { minVariantPrice { amount currencyCode } }
    compareAtPriceRange { minVariantPrice { amount currencyCode } }
    variants(first: 100) {
      edges {
        node {
          id title availableForSale
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          selectedOptions { name value }
        }
      }
    }
  }
`

const PRODUCTS_QUERY = gql`
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges { node { ...ProductFields } }
    }
  }
  ${PRODUCT_FIELDS}
`

const PRODUCT_BY_HANDLE_QUERY = gql`
  query GetProduct($handle: String!) {
    product(handle: $handle) { ...ProductFields }
  }
  ${PRODUCT_FIELDS}
`

const COLLECTION_BY_HANDLE_QUERY = gql`
  query GetCollection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id title handle description
      image { url altText }
      products(first: $first) {
        edges { node { ...ProductFields } }
      }
    }
  }
  ${PRODUCT_FIELDS}
`

const COLLECTIONS_QUERY = gql`
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id title handle description
          image { url altText }
        }
      }
    }
  }
`

// ─── Featured Products: lightweight product fields for metaobject references ───
const PRODUCT_REF_FIELDS = gql`
  fragment ProductRefFields on Product {
    id title handle description availableForSale
    featuredImage { url altText }
    priceRange { minVariantPrice { amount currencyCode } }
    compareAtPriceRange { minVariantPrice { amount currencyCode } }
  }
`

const HOMEPAGE_FEATURED_PRODUCTS_QUERY = gql`
  query GetHomepageFeaturedProducts {
    metaobject(handle: {
      type: "homepage_featured_products",
      handle: "homepage-featured-products"
    }) {
      id
      type
      fields {
        key
        value
        references(first: 10) {
          edges {
            node {
              ... on Product { ...ProductRefFields }
            }
          }
        }
      }
    }
  }
  ${PRODUCT_REF_FIELDS}
`

const HOMEPAGE_HERO_QUERY = gql`
  query GetHomepageHero {
    metaobject(handle: { type: "homepage_hero", handle: "professional-grade" }) {
      id type
      fields {
        key value
        reference {
          ... on MediaImage {
            image { url altText width height }
          }
        }
      }
    }
  }
`

// sortKey values: PUBLISHED_AT | TITLE | AUTHOR | UPDATED_AT | ID | RELEVANCE (default: ID)
const BLOG_ARTICLES_QUERY = gql`
  query GetBlogArticles(
    $blogHandle: String!
    $first: Int!
    $sortKey: ArticleSortKeys
    $reverse: Boolean
  ) {
    blog(handle: $blogHandle) {
      id title handle
      articles(first: $first, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            id title handle excerpt contentHtml publishedAt tags
            image { url altText width height }
            author { name }
          }
        }
      }
    }
  }
`

const ARTICLE_BY_HANDLE_QUERY = gql`
  query GetArticle($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      id title handle
      articleByHandle(handle: $articleHandle) {
        id title handle excerpt contentHtml publishedAt tags
        image { url altText width height }
        author { name }
        seo { title description }
      }
    }
  }
`

// ─── Cart mutations ───────────────────────────────────────────────────────────

const CART_FIELDS = gql`
  fragment CartFields on Cart {
    id checkoutUrl
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 100) {
      edges {
        node {
          id quantity
          merchandise {
            ... on ProductVariant {
              id title
              price { amount currencyCode }
              product {
                title handle
                featuredImage { url altText }
              }
            }
          }
        }
      }
    }
  }
`

export const CART_CREATE_MUTATION = gql`
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
  ${CART_FIELDS}
`

export const CART_LINES_ADD_MUTATION = gql`
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
  ${CART_FIELDS}
`

export const CART_LINES_UPDATE_MUTATION = gql`
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
  ${CART_FIELDS}
`

export const CART_LINES_REMOVE_MUTATION = gql`
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
  ${CART_FIELDS}
`

export const CART_QUERY = gql`
  query GetCart($cartId: ID!) {
    cart(id: $cartId) { ...CartFields }
  }
  ${CART_FIELDS}
`

// ─── Hero transformer ─────────────────────────────────────────────────────────

const HERO_FALLBACK = {
  eyebrowText: 'Professional Grade',
  headline: 'Premium Car Care',
  highlightText: 'Built For A Showroom',
  subtext:
    'Professional-grade shampoos, ceramic sprays, tyre cleaners, microfibre towels, detailing kits and accessories.',
  primaryButton: 'Shop Products',
  primaryLink: '/shop',
  secondaryButton: 'Explore Kits',
  secondaryLink: '/collections/kits-bundles',
} as const

function transformHeroFields(fields: ShopifyMetaobjectField[]): HomepageHero {
  const text = (key: string, fallback: string): string =>
    fields.find((f) => f.key === key)?.value || fallback
  const image = (key: string): HeroImage | undefined =>
    fields.find((f) => f.key === key)?.reference?.image ?? undefined

  return {
    eyebrowText: text('eyebrow_text', HERO_FALLBACK.eyebrowText),
    headline: text('headline', HERO_FALLBACK.headline),
    highlightText: text('highlight_text', HERO_FALLBACK.highlightText),
    subtext: text('subtext', HERO_FALLBACK.subtext),
    primaryButton: text('primary_button', HERO_FALLBACK.primaryButton),
    primaryLink: text('primary_link', HERO_FALLBACK.primaryLink),
    secondaryButton: text('secondary_button', HERO_FALLBACK.secondaryButton),
    secondaryLink: text('secondary_link', HERO_FALLBACK.secondaryLink),
    heroImage: image('hero_image'),
    backgroundImage: image('background_image'),
  }
}

// ─── Public fetch functions ───────────────────────────────────────────────────

export async function getProducts(first = 12): Promise<ShopifyProduct[]> {
  'use cache'
  cacheLife('minutes')
  cacheTag('products')
  try {
    const data = await shopifyClient.request<{
      products: { edges: { node: ShopifyProduct }[] }
    }>(PRODUCTS_QUERY, { first })
    return data.products.edges.map((e) => e.node)
  } catch (err) {
    const kind = classifyShopifyError(err)
    if (kind === 'UNAUTHORIZED') {
      console.error('[getProducts] 401 UNAUTHORIZED — check NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN')
    } else {
      console.error('[getProducts]', err instanceof Error ? err.message : err)
    }
    return []
  }
}

export async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  'use cache'
  cacheLife('minutes')
  cacheTag(`product-${handle}`)
  try {
    const data = await shopifyClient.request<{ product: ShopifyProduct | null }>(
      PRODUCT_BY_HANDLE_QUERY,
      { handle }
    )
    return data.product
  } catch (err) {
    console.error('[getProductByHandle]', err instanceof Error ? err.message : err)
    return null
  }
}

export async function getCollectionByHandle(
  handle: string,
  first = 24
): Promise<ShopifyCollection | null> {
  'use cache'
  cacheLife('minutes')
  cacheTag(`collection-${handle}`)
  try {
    const data = await shopifyClient.request<{
      collection: ShopifyCollection | null
    }>(COLLECTION_BY_HANDLE_QUERY, { handle, first })
    return data.collection
  } catch (err) {
    console.error('[getCollectionByHandle]', err instanceof Error ? err.message : err)
    return null
  }
}

export async function getCollections(first = 12): Promise<ShopifyCollection[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('collections')
  try {
    const data = await shopifyClient.request<{
      collections: { edges: { node: ShopifyCollection }[] }
    }>(COLLECTIONS_QUERY, { first })
    return data.collections.edges.map((e) => e.node)
  } catch (err) {
    const kind = classifyShopifyError(err)
    if (kind === 'UNAUTHORIZED') {
      console.error('[getCollections] 401 UNAUTHORIZED — check NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN')
    } else {
      console.error('[getCollections]', err instanceof Error ? err.message : err)
    }
    return []
  }
}

export async function getHomepageHero(): Promise<HomepageHero | null> {
  'use cache'
  cacheLife('hours')
  cacheTag('homepage-hero')

  type MetaobjectQueryResult = {
    metaobject: { id: string; type: string; fields: ShopifyMetaobjectField[] } | null
  }

  let data: MetaobjectQueryResult
  try {
    data = await shopifyClient.request<MetaobjectQueryResult>(HOMEPAGE_HERO_QUERY)
  } catch (err) {
    const kind = classifyShopifyError(err)
    if (kind === 'UNAUTHORIZED') {
      console.error('[getHomepageHero] 401 UNAUTHORIZED — check NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local')
    } else if (kind === 'ACCESS_DENIED') {
      console.warn('[getHomepageHero] ACCESS_DENIED: enable scope "unauthenticated_read_metaobjects" — hero using fallback text')
    } else {
      console.error('[getHomepageHero]', err instanceof Error ? err.message : err)
    }
    return null
  }

  if (!data.metaobject) return null
  return transformHeroFields(data.metaobject.fields)
}

export async function getHomepageFeaturedProducts(): Promise<HomepageFeaturedProducts | null> {
  'use cache'
  cacheLife('minutes')
  cacheTag('homepage-featured-products')

  type Result = {
    metaobject: HomepageFeaturedProductsRaw | null
  }

  try {
    const data = await shopifyClient.request<Result>(HOMEPAGE_FEATURED_PRODUCTS_QUERY)
    if (!data.metaobject) return null

    const fields = data.metaobject.fields
    const text = (key: string, fallback = '') =>
      fields.find((f) => f.key === key)?.value ?? fallback

    // Extract products from the `references` of the `products` field
    const productsField = fields.find((f) => f.key === 'products')
    const products: ShopifyProduct[] = (productsField?.references?.edges ?? [])
      .map((e) => e.node)
      .filter((n): n is ShopifyProduct => n !== null)

    return {
      eyebrow: text('section_eyebrow', 'Hand-Picked'),
      heading: text('section_heading', 'Featured Products'),
      linkLabel: text('section_link_label', 'View all'),
      linkUrl: text('section_link_url', '/shop'),
      products,
    }
  } catch (err) {
    const kind = classifyShopifyError(err)
    if (kind === 'UNAUTHORIZED') {
      console.error('[getHomepageFeaturedProducts] 401 UNAUTHORIZED — check NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN')
    } else if (kind === 'ACCESS_DENIED') {
      console.warn('[getHomepageFeaturedProducts] ACCESS_DENIED: enable scope "unauthenticated_read_metaobjects" — falling back to getProducts()')
    } else {
      console.error('[getHomepageFeaturedProducts]', err instanceof Error ? err.message : err)
    }
    return null
  }
}

export async function getBlogArticles(
  blogHandle = 'guides',
  first = 12,
  sortKey: 'PUBLISHED_AT' | 'TITLE' | 'AUTHOR' | 'UPDATED_AT' | 'ID' = 'PUBLISHED_AT',
  reverse = true
): Promise<{ blog: { id: string; title: string; handle: string } | null; articles: ShopifyArticle[] }> {
  'use cache'
  cacheLife('minutes')
  cacheTag(`blog-${blogHandle}`)

  type BlogResult = {
    blog: {
      id: string
      title: string
      handle: string
      articles: { edges: { node: ShopifyArticle }[] }
    } | null
  }

  try {
    const data = await shopifyClient.request<BlogResult>(BLOG_ARTICLES_QUERY, {
      blogHandle,
      first,
      sortKey,
      reverse,
    })
    return {
      blog: data.blog ? { id: data.blog.id, title: data.blog.title, handle: data.blog.handle } : null,
      articles: data.blog?.articles.edges.map((e) => e.node) ?? [],
    }
  } catch (err) {
    const kind = classifyShopifyError(err)
    if (kind === 'UNAUTHORIZED') {
      // Hard error — token is wrong/missing, needs .env.local fix
      console.error('[getBlogArticles] 401 UNAUTHORIZED — check NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local')
    } else if (kind === 'ACCESS_DENIED') {
      // Config warning — scope not yet enabled, guides section falls back to static cards
      console.warn(
        '[getBlogArticles] ACCESS_DENIED: unauthenticated_read_content scope is missing.\n' +
        '  → Shopify Admin → Settings → Apps → Develop apps → [app] → Configuration\n' +
        '  → Storefront API access scopes → enable "unauthenticated_read_content" → Save → Install app\n' +
        '  → Guides section is showing static fallback cards until this is fixed.'
      )
    } else {
      console.error('[getBlogArticles]', err instanceof Error ? err.message : err)
    }
    return { blog: null, articles: [] }
  }
}

export async function getArticleByHandle(
  blogHandle: string,
  articleHandle: string
): Promise<ShopifyArticle | null> {
  'use cache'
  cacheLife('minutes')
  cacheTag(`article-${blogHandle}-${articleHandle}`)

  type ArticleResult = {
    blog: { articleByHandle: ShopifyArticle | null } | null
  }

  try {
    const data = await shopifyClient.request<ArticleResult>(
      ARTICLE_BY_HANDLE_QUERY,
      { blogHandle, articleHandle }
    )
    return data.blog?.articleByHandle ?? null
  } catch {
    return null
  }
}

/**
 * Fetch the 3 most-recent articles from the "guides" blog for the homepage.
 * Sorted by PUBLISHED_AT descending — newest first.
 */
export async function getHomepageGuides(): Promise<ShopifyArticle[]> {
  'use cache'
  cacheLife('minutes')
  cacheTag('homepage-guides')
  const { articles } = await getBlogArticles('guides', 3, 'PUBLISHED_AT', true)
  return articles
}

/**
 * Fetch a single guide article from the "guides" blog by handle.
 * This is the canonical function for guide detail pages.
 */
export async function getGuideByHandle(handle: string): Promise<ShopifyArticle | null> {
  return getArticleByHandle('guides', handle)
}

// ─── Client-side cart operations (called from CartContext) ────────────────────

export async function shopifyCartCreate(
  variantId: string,
  quantity: number
): Promise<ShopifyCart | null> {
  type Result = { cartCreate: { cart: ShopifyCart; userErrors: { message: string }[] } }
  try {
    const data = await shopifyClient.request<Result>(CART_CREATE_MUTATION, {
      lines: [{ merchandiseId: variantId, quantity }],
    })
    if (data.cartCreate.userErrors.length) {
      console.error('[cartCreate] errors:', data.cartCreate.userErrors)
      return null
    }
    return data.cartCreate.cart
  } catch (err) {
    console.error('[cartCreate]', err)
    return null
  }
}

export async function shopifyCartLinesAdd(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<ShopifyCart | null> {
  type Result = { cartLinesAdd: { cart: ShopifyCart; userErrors: { message: string }[] } }
  try {
    const data = await shopifyClient.request<Result>(CART_LINES_ADD_MUTATION, {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    })
    if (data.cartLinesAdd.userErrors.length) {
      console.error('[cartLinesAdd] errors:', data.cartLinesAdd.userErrors)
      return null
    }
    return data.cartLinesAdd.cart
  } catch (err) {
    console.error('[cartLinesAdd]', err)
    return null
  }
}

export async function shopifyCartLinesUpdate(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart | null> {
  type Result = { cartLinesUpdate: { cart: ShopifyCart; userErrors: { message: string }[] } }
  try {
    const data = await shopifyClient.request<Result>(CART_LINES_UPDATE_MUTATION, {
      cartId,
      lines: [{ id: lineId, quantity }],
    })
    return data.cartLinesUpdate.cart
  } catch (err) {
    console.error('[cartLinesUpdate]', err)
    return null
  }
}

export async function shopifyCartLinesRemove(
  cartId: string,
  lineId: string
): Promise<ShopifyCart | null> {
  type Result = { cartLinesRemove: { cart: ShopifyCart; userErrors: { message: string }[] } }
  try {
    const data = await shopifyClient.request<Result>(CART_LINES_REMOVE_MUTATION, {
      cartId,
      lineIds: [lineId],
    })
    return data.cartLinesRemove.cart
  } catch (err) {
    console.error('[cartLinesRemove]', err)
    return null
  }
}

export async function shopifyGetCart(cartId: string): Promise<ShopifyCart | null> {
  type Result = { cart: ShopifyCart | null }
  try {
    const data = await shopifyClient.request<Result>(CART_QUERY, { cartId })
    return data.cart
  } catch {
    return null
  }
}
