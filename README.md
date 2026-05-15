# Velanto Headless Shopify Storefront

Production-oriented Next.js storefront for a Shopify catalog. Products, collections, cart, guides, policies, and Shopify hosted checkout are handled in a headless frontend while orders continue to be created in Shopify after payment.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Shopify Storefront API
- Shopify hosted checkout

## Local Development

1. Copy `.env.example` to `.env.local`
2. Set the required Shopify storefront variables
3. Run `npm install`
4. Run `npm run dev`

## Required Environment Variables

- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
- `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `NEXT_PUBLIC_SITE_URL`

## Optional Public Environment Variables

- `NEXT_PUBLIC_SUPPORT_EMAIL`
- `NEXT_PUBLIC_SUPPORT_PHONE`
- `NEXT_PUBLIC_SUPPORT_LOCATION`
- `NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL`
- `NEXT_PUBLIC_SOCIAL_YOUTUBE_URL`
- `NEXT_PUBLIC_SOCIAL_X_URL`
- `NEXT_PUBLIC_SHOPIFY_STORE_PASSWORD_PROTECTED`

## Shopify Requirements

- Enable Storefront API scopes for:
  - `unauthenticated_read_product_listings`
  - `unauthenticated_read_product_inventory`
  - `unauthenticated_read_collection_listings`
  - `unauthenticated_read_metaobjects`
  - `unauthenticated_read_content`
  - cart / checkout write scope required by your current storefront API version
- Remove storefront password protection before production checkout testing
- Create the optional homepage metaobjects if you want merchant-managed hero and featured products
- Create the `guides` blog handle if you want Shopify blog articles to appear in the guides surfaces

## Production Notes

- Only Shopify hosted checkout is used for payment
- No Admin API tokens are exposed to the browser
- Order tracking is scaffolded only; see [ORDER_TRACKING.md](./ORDER_TRACKING.md)
- Public contact and social links stay disabled until real values are configured

## Verification

Run:

```bash
npm run lint
npm run build
```
