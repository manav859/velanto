/**
 * Client-safe cart operations — no 'use cache', no server-only APIs.
 * Safe to import from CartContext (client component).
 */
import { GraphQLClient, gql } from 'graphql-request'
import type { ShopifyCart } from './shopify'

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!
const API_VERSION = '2025-01'
const endpoint = `https://${domain}/api/${API_VERSION}/graphql.json`

const client = new GraphQLClient(endpoint, {
  headers: {
    'X-Shopify-Storefront-Access-Token': token,
    'Content-Type': 'application/json',
  },
})

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

const CART_CREATE = gql`
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
  ${CART_FIELDS}
`

const CART_LINES_ADD = gql`
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
  ${CART_FIELDS}
`

const CART_LINES_UPDATE = gql`
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
    }
  }
  ${CART_FIELDS}
`

const CART_LINES_REMOVE = gql`
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
    }
  }
  ${CART_FIELDS}
`

const CART_QUERY = gql`
  query GetCart($cartId: ID!) {
    cart(id: $cartId) { ...CartFields }
  }
  ${CART_FIELDS}
`

async function req<T>(query: string, variables?: Record<string, unknown>): Promise<T | null> {
  try {
    return await client.request<T>(query, variables ?? {})
  } catch (err) {
    console.error('[shopify-cart]', err)
    return null
  }
}

export async function cartCreate(variantId: string, quantity: number): Promise<ShopifyCart | null> {
  type R = { cartCreate: { cart: ShopifyCart; userErrors: { message: string }[] } }
  const data = await req<R>(CART_CREATE, { lines: [{ merchandiseId: variantId, quantity }] })
  if (!data || data.cartCreate.userErrors.length) return null
  return data.cartCreate.cart
}

export async function cartLinesAdd(cartId: string, variantId: string, quantity: number): Promise<ShopifyCart | null> {
  type R = { cartLinesAdd: { cart: ShopifyCart; userErrors: { message: string }[] } }
  const data = await req<R>(CART_LINES_ADD, { cartId, lines: [{ merchandiseId: variantId, quantity }] })
  if (!data || data.cartLinesAdd.userErrors.length) return null
  return data.cartLinesAdd.cart
}

export async function cartLinesUpdate(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart | null> {
  type R = { cartLinesUpdate: { cart: ShopifyCart } }
  const data = await req<R>(CART_LINES_UPDATE, { cartId, lines: [{ id: lineId, quantity }] })
  return data?.cartLinesUpdate.cart ?? null
}

export async function cartLinesRemove(cartId: string, lineId: string): Promise<ShopifyCart | null> {
  type R = { cartLinesRemove: { cart: ShopifyCart } }
  const data = await req<R>(CART_LINES_REMOVE, { cartId, lineIds: [lineId] })
  return data?.cartLinesRemove.cart ?? null
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  type R = { cart: ShopifyCart | null }
  const data = await req<R>(CART_QUERY, { cartId })
  return data?.cart ?? null
}
