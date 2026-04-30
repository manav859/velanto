import { GraphQLClient, gql } from 'graphql-request'
import { cacheLife, cacheTag } from 'next/cache'

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!
const API_VERSION = '2025-01'
const endpoint = `https://${domain}/api/${API_VERSION}/graphql.json`

const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    'X-Shopify-Storefront-Access-Token': token,
    'Content-Type': 'application/json',
  },
})

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
  image?: { url: string; altText: string | null } | null
  author?: { name: string }
  tags?: string[]
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
export type ShopifyMetaobjectField = {
  key: string
  value: string | null
  reference: ShopifyMediaImageReference | null
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

const BLOG_ARTICLES_QUERY = gql`
  query GetBlogArticles($blogHandle: String!, $first: Int!) {
    blog(handle: $blogHandle) {
      id title handle
      articles(first: $first) {
        edges {
          node {
            id title handle excerpt contentHtml publishedAt
            image { url altText }
            author { name }
            tags
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
        id title handle excerpt contentHtml publishedAt
        image { url altText }
        author { name }
        tags
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
  const data = await shopifyClient.request<{
    products: { edges: { node: ShopifyProduct }[] }
  }>(PRODUCTS_QUERY, { first })
  return data.products.edges.map((e) => e.node)
}

export async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  'use cache'
  cacheLife('minutes')
  cacheTag(`product-${handle}`)
  const data = await shopifyClient.request<{ product: ShopifyProduct | null }>(
    PRODUCT_BY_HANDLE_QUERY,
    { handle }
  )
  return data.product
}

export async function getCollectionByHandle(
  handle: string,
  first = 24
): Promise<ShopifyCollection | null> {
  'use cache'
  cacheLife('minutes')
  cacheTag(`collection-${handle}`)
  const data = await shopifyClient.request<{
    collection: ShopifyCollection | null
  }>(COLLECTION_BY_HANDLE_QUERY, { handle, first })
  return data.collection
}

export async function getCollections(first = 12): Promise<ShopifyCollection[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('collections')
  const data = await shopifyClient.request<{
    collections: { edges: { node: ShopifyCollection }[] }
  }>(COLLECTIONS_QUERY, { first })
  return data.collections.edges.map((e) => e.node)
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
    const message = err instanceof Error ? err.message : String(err)
    if (message.includes('ACCESS_DENIED') || message.includes('unauthenticated_read_metaobjects')) {
      console.error('[getHomepageHero] ACCESS_DENIED — enable unauthenticated_read_metaobjects scope')
    } else {
      console.error('[getHomepageHero] unexpected API error:', message)
    }
    return null
  }

  if (!data.metaobject) return null
  return transformHeroFields(data.metaobject.fields)
}

export async function getBlogArticles(
  blogHandle = 'guides',
  first = 12
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
    })
    return {
      blog: data.blog ? { id: data.blog.id, title: data.blog.title, handle: data.blog.handle } : null,
      articles: data.blog?.articles.edges.map((e) => e.node) ?? [],
    }
  } catch {
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
