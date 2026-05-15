# Order Tracking Plan

## Current State

- `/api/track-order` exists as a server-only scaffold.
- The route validates `orderNumber` and `email`.
- The route returns `501 Not Implemented` intentionally.
- No Shopify Admin API credentials are exposed client-side.

## Required Future Setup

1. Add a private server environment variable:
   - `SHOPIFY_ADMIN_ACCESS_TOKEN`
2. Grant the Shopify custom app the minimum Admin API scopes required for order lookup.
3. Keep the token server-only. Never use `NEXT_PUBLIC_` for Admin API credentials.

## Recommended Implementation

1. Accept `orderNumber` and `email` in `/api/track-order`.
2. Query Shopify Admin API on the server for the matching order.
3. Verify the submitted email matches the order email before returning any data.
4. Return only sanitized fields:
   - order name/number
   - financial status
   - fulfillment status
   - tracking company
   - tracking numbers / tracking URLs
   - updated timestamp
5. Return `404` when no matching order is found.
6. Return `429` if rate limiting is needed.

## Security Rules

- Never expose Admin API tokens, order IDs, or raw Admin API responses to the browser.
- Never return customer addresses, payment details, or internal order notes.
- Log only operational errors on the server.

## Suggested Next Step

- Implement a server-side Shopify Admin client in a dedicated module such as `lib/shopify-admin.ts`.
