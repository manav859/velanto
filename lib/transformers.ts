import type {
  Product,
  ShopifyProduct,
  ShopifyCollection,
  ShopifyArticle,
  ShopifyCart,
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
  description: string
  descriptionHtml: string
  vendor: string
  productType: string
  tags: string[]
  price: string
  compareAtPrice: string | null
  onSale: boolean
  featuredImage: { url: string; altText: string } | null
  images: { url: string; altText: string }[]
  variants: TransformedVariant[]
  availableForSale: boolean
}

export type TransformedVariant = {
  id: string
  title: string
  price: string
  compareAtPrice: string | null
  availableForSale: boolean
  selectedOptions: { name: string; value: string }[]
}

export function transformProduct(product: ShopifyProduct): TransformedProduct {
  const { amount, currencyCode } = product.priceRange.minVariantPrice
  const compareAt = product.compareAtPriceRange?.minVariantPrice

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    descriptionHtml: product.descriptionHtml ?? '',
    vendor: product.vendor ?? '',
    productType: product.productType ?? '',
    tags: product.tags ?? [],
    price: formatPrice(amount, currencyCode),
    compareAtPrice:
      compareAt && parseFloat(compareAt.amount) > parseFloat(amount)
        ? formatPrice(compareAt.amount, compareAt.currencyCode)
        : null,
    onSale:
      !!compareAt && parseFloat(compareAt.amount) > parseFloat(amount),
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
      compareAtPrice: e.node.compareAtPrice
        ? formatPrice(
            e.node.compareAtPrice.amount,
            e.node.compareAtPrice.currencyCode
          )
        : null,
      availableForSale: e.node.availableForSale,
      selectedOptions: e.node.selectedOptions,
    })),
    availableForSale: product.availableForSale ?? true,
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
