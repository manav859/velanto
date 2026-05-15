import type {
  Product,
  ShopifyProduct,
  ShopifyCollection,
  ShopifyArticle,
  ShopifyCart,
  HomepageFeaturedProducts,
} from './shopify'

// ─── Price formatter ──────────────────────────────────────────────────────────

export function formatPrice(amount: string, currencyCode: string): string {
  if (currencyCode === 'INR') {
    return `₹${parseFloat(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount))
}

// ─── Product transformer ──────────────────────────────────────────────────────

export type TransformedProduct = {
  id: string
  title: string
  handle: string
  createdAt: string
  description: string
  descriptionHtml: string
  vendor: string
  productType: string
  tags: string[]
  price: string
  priceAmount: number
  compareAtPrice: string | null
  compareAtPriceAmount: number | null
  onSale: boolean
  featuredImage: { url: string; altText: string } | null
  images: { url: string; altText: string }[]
  variants: TransformedVariant[]
  availableForSale: boolean
  collectionHandles: string[]
}

export type TransformedVariant = {
  id: string
  title: string
  price: string
  priceAmount: number
  compareAtPrice: string | null
  compareAtPriceAmount: number | null
  availableForSale: boolean
  selectedOptions: { name: string; value: string }[]
}

export function transformProduct(product: ShopifyProduct): TransformedProduct {
  const { amount, currencyCode } = product.priceRange.minVariantPrice
  const compareAt = product.compareAtPriceRange?.minVariantPrice
  const priceAmount = parseFloat(amount)
  const compareAtPriceAmount = compareAt ? parseFloat(compareAt.amount) : null

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    createdAt: product.createdAt ?? '',
    description: product.description,
    descriptionHtml: product.descriptionHtml ?? '',
    vendor: product.vendor ?? '',
    productType: product.productType ?? '',
    tags: product.tags ?? [],
    price: formatPrice(amount, currencyCode),
    priceAmount,
    compareAtPrice:
      compareAt && compareAtPriceAmount !== null && compareAtPriceAmount > priceAmount
        ? formatPrice(compareAt.amount, compareAt.currencyCode)
        : null,
    compareAtPriceAmount:
      compareAt && compareAtPriceAmount !== null && compareAtPriceAmount > priceAmount
        ? compareAtPriceAmount
        : null,
    onSale:
      !!compareAt && compareAtPriceAmount !== null && compareAtPriceAmount > priceAmount,
    featuredImage: product.featuredImage
      ? {
          url: product.featuredImage.url,
          altText: product.featuredImage.altText ?? product.title,
        }
      : null,
    images: (product.images?.edges ?? []).map((e) => ({
      url: e.node.url,
      altText: e.node.altText ?? product.title,
    })),
    variants: (product.variants?.edges ?? []).map((e) => ({
      id: e.node.id,
      title: e.node.title,
      price: formatPrice(e.node.price.amount, e.node.price.currencyCode),
      priceAmount: parseFloat(e.node.price.amount),
      compareAtPrice: e.node.compareAtPrice
        ? formatPrice(
            e.node.compareAtPrice.amount,
            e.node.compareAtPrice.currencyCode
          )
        : null,
      compareAtPriceAmount: e.node.compareAtPrice
        ? parseFloat(e.node.compareAtPrice.amount)
        : null,
      availableForSale: e.node.availableForSale,
      selectedOptions: e.node.selectedOptions,
    })),
    availableForSale: product.availableForSale ?? true,
    collectionHandles: (product.collections?.edges ?? []).map((edge) => edge.node.handle),
  }
}

// ─── Collection transformer ───────────────────────────────────────────────────

export type TransformedCollection = {
  id: string
  title: string
  handle: string
  description: string
  image: { url: string; altText: string } | null
  products: TransformedProduct[]
}

export function transformCollection(
  collection: ShopifyCollection
): TransformedCollection {
  return {
    id: collection.id,
    title: collection.title,
    handle: collection.handle,
    description: collection.description ?? '',
    image: collection.image
      ? {
          url: collection.image.url,
          altText: collection.image.altText ?? collection.title,
        }
      : null,
    products: (collection.products?.edges ?? []).map((e) =>
      transformProduct(e.node)
    ),
  }
}

// ─── Article transformer ──────────────────────────────────────────────────────

export type TransformedArticle = {
  id: string
  title: string
  handle: string
  excerpt: string
  contentHtml: string
  publishedAt: string
  readTime: number
  image: { url: string; altText: string } | null
  author: string
  tags: string[]
  blog: { handle: string; title: string }
}

export function transformArticle(
  article: ShopifyArticle,
  blogHandle = 'guides',
  blogTitle = 'Guides'
): TransformedArticle {
  const wordCount = article.content
    ? article.content.split(/\s+/).length
    : 200
  const readTime = Math.max(1, Math.round(wordCount / 200))

  return {
    id: article.id,
    title: article.title,
    handle: article.handle,
    excerpt: article.excerpt ?? '',
    contentHtml: article.contentHtml ?? '',
    publishedAt: new Date(article.publishedAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    readTime,
    image: article.image
      ? {
          url: article.image.url,
          altText: article.image.altText ?? article.title,
        }
      : null,
    author: article.author?.name ?? 'Velanto Team',
    tags: article.tags ?? [],
    blog: { handle: blogHandle, title: blogTitle },
  }
}

// ─── Guide transformers ───────────────────────────────────────────────────────
//
// Leaner, purpose-built types for the Guides blog section.
// GuideCardData → used by GuidesSection, /guides listing page cards
// GuideDetailData → used by /guides/[handle] detail page

export type GuideCardData = {
  id: string
  title: string
  handle: string
  excerpt: string
  /** First Shopify tag used as display category */
  category?: string
  /** Estimated read time as formatted string, e.g. "5 min" */
  readTime?: string
  publishedAt?: string
  image?: {
    url: string
    altText?: string | null
    width?: number | null
    height?: number | null
  }
}

export type GuideDetailData = GuideCardData & {
  contentHtml: string
  seoTitle?: string | null
  seoDescription?: string | null
  author: string
  tags: string[]
}

function estimateReadTime(html: string | undefined | null): string {
  if (!html) return '3 min'
  // Strip HTML tags, split on whitespace, count words
  const words = html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 200))} min`
}

function formatPublishedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export function transformGuideArticle(article: ShopifyArticle): GuideCardData {
  return {
    id: article.id,
    title: article.title,
    handle: article.handle,
    excerpt: article.excerpt ?? '',
    category: article.tags?.[0],
    readTime: estimateReadTime(article.contentHtml),
    publishedAt: formatPublishedAt(article.publishedAt),
    image: article.image
      ? {
          url: article.image.url,
          altText: article.image.altText,
          width: article.image.width ?? null,
          height: article.image.height ?? null,
        }
      : undefined,
  }
}

export function transformGuideDetail(article: ShopifyArticle): GuideDetailData {
  return {
    ...transformGuideArticle(article),
    contentHtml: article.contentHtml ?? '',
    seoTitle: article.seo?.title ?? null,
    seoDescription: article.seo?.description ?? null,
    author: article.author?.name ?? 'Velanto Team',
    tags: article.tags ?? [],
  }
}

// ─── Homepage Featured Products transformer ───────────────────────────────────

export type TransformedFeaturedProductsSection = {
  eyebrow: string
  heading: string
  linkLabel: string
  linkUrl: string
  products: TransformedProduct[]
}

/**
 * Transforms the raw HomepageFeaturedProducts metaobject into a
 * frontend-ready shape. Returns null when the metaobject doesn't
 * exist yet in Shopify — callers should fall back gracefully.
 */
export function transformHomepageFeaturedProducts(
  raw: HomepageFeaturedProducts
): TransformedFeaturedProductsSection {
  return {
    eyebrow: raw.eyebrow,
    heading: raw.heading,
    linkLabel: raw.linkLabel,
    linkUrl: raw.linkUrl,
    products: raw.products.map(transformProduct),
  }
}

// ─── Cart transformer ─────────────────────────────────────────────────────────

export type TransformedCartLine = {
  id: string
  quantity: number
  variantId: string
  variantTitle: string
  productTitle: string
  productHandle: string
  price: string
  linePrice: string
  image: { url: string; altText: string } | null
}

export type TransformedCart = {
  id: string
  checkoutUrl: string
  lines: TransformedCartLine[]
  subtotal: string
  total: string
  totalItems: number
}

export function transformCart(cart: ShopifyCart): TransformedCart {
  const lines = (cart.lines?.edges ?? []).map((e) => {
    const line = e.node
    const variant = line.merchandise
    const { amount, currencyCode } = variant.price
    const lineTotal = (parseFloat(amount) * line.quantity).toFixed(2)

    return {
      id: line.id,
      quantity: line.quantity,
      variantId: variant.id,
      variantTitle: variant.title === 'Default Title' ? '' : variant.title,
      productTitle: variant.product.title,
      productHandle: variant.product.handle,
      price: formatPrice(amount, currencyCode),
      linePrice: formatPrice(lineTotal, currencyCode),
      image: variant.product.featuredImage
        ? {
            url: variant.product.featuredImage.url,
            altText:
              variant.product.featuredImage.altText ?? variant.product.title,
          }
        : null,
    }
  })

  const totalItems = lines.reduce((sum, l) => sum + l.quantity, 0)

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    lines,
    subtotal: formatPrice(
      cart.cost.subtotalAmount.amount,
      cart.cost.subtotalAmount.currencyCode
    ),
    total: formatPrice(
      cart.cost.totalAmount.amount,
      cart.cost.totalAmount.currencyCode
    ),
    totalItems,
  }
}

// ─── Simple product list transformer (reuses Product type from shopify.ts) ───

export { type Product }
