# Velanto — Order Flow Architecture

## ⚠️ Checkout → `/password` Redirect Diagnosis

### Root Cause

When checkout opens `https://velanto-test.myshopify.com/password` instead of completing, this is **not a headless code bug**. It means the Shopify storefront has password protection enabled.

**Confirmed via Shopify CLI and Storefront API:**
- `shopify theme list --store velanto-test.myshopify.com` → Live theme: **Horizon** (#148561592456)
- `cartCreate` mutation returns a valid `checkoutUrl` (`https://velanto-test.myshopify.com/cart/c/<token>?key=<key>`)
- The `checkoutUrl` passes `isSafeCheckoutUrl()` validation
- The store's Storefront API responds correctly to product/cart queries

The password redirect happens because Shopify intercepts any browser request to the storefront (including checkout) when password protection is enabled and the user's browser session hasn't been authenticated.

### Fix (Required Before Production)

```
Shopify Admin
  → Online Store
  → Preferences
  → Password protection section
  → Remove password / disable protection
  → Save
```

### Development Workaround (Without Disabling Password)

1. Open `https://velanto-test.myshopify.com` in the **same browser** as your local dev server
2. Enter the storefront password when prompted → the browser receives a Shopify session cookie
3. Return to `localhost:3000` and retry checkout — it will now proceed to the Shopify checkout page

This works because the browser reuses the session cookie set in step 2.

### Dev Warning Banner

Set `NEXT_PUBLIC_SHOPIFY_STORE_PASSWORD_PROTECTED=true` in `.env.local` to show a warning banner in the cart page during local development.

### Shopify CLI Commands Used

```bash
shopify version
# → 3.94.3

shopify theme list --store velanto-test.myshopify.com
# → Horizon [live] #148561592456

# Storefront API confirmation:
curl -X POST "https://velanto-test.myshopify.com/api/2025-01/graphql.json" \
  -H "X-Shopify-Storefront-Access-Token: <token>" \
  -d '{"query":"{ shop { name primaryDomain { host } } }"}'
# → {"data":{"shop":{"name":"velanto-test","primaryDomain":{"host":"velanto-test.myshopify.com"}}}}

# CLI cannot manage storefront password — must be done in Shopify Admin
```

---

## v1 Design Decision: No Login Required

Customers do **not** need to create an account to check out.  
Shopify Checkout handles email, shipping address, and payment collection directly.

## Order Flow (Production v1)

```
Browse products  →  Add to Cart (Storefront API)  →  Cart page
        →  Shopify checkoutUrl  →  Shopify Checkout (hosted)
        →  Customer enters email + shipping + payment
        →  Shopify creates order  →  Customer receives confirmation email
```

### Step-by-step

| Step | Where | How |
|------|-------|-----|
| 1. Browse | `/shop`, `/products/[handle]`, `/collections/[handle]` | Storefront API products |
| 2. Add to Cart | Any product page/card | `cartCreate` or `cartLinesAdd` mutation |
| 3. Cart state | localStorage `velanto_cart_id` | Shopify cart ID — persists across refresh |
| 4. View cart | `/cart` or cart drawer | `getCart(cartId)` |
| 5. Checkout | Button in `/cart` or CartDrawer | Navigate to `cart.checkoutUrl` |
| 6. Payment | Shopify-hosted checkout (`*.myshopify.com/checkouts/...`) | Shopify handles payment + order creation |
| 7. Confirmation | Email from Shopify | Shopify sends order confirmation automatically |

## Cart Persistence Strategy

- Cart ID stored in `localStorage` under key `velanto_cart_id`
- On app mount: `getCart(savedId)` restores the cart
- If cart ID is expired/invalid: stale ID is removed, new cart created on next add
- Sensitive data (payment, personal info) is **never** stored in localStorage
- Only the Shopify-issued cart ID (opaque token) is stored

## Storefront API Mutations Used

| Function | Mutation | Purpose |
|----------|----------|---------|
| `cartCreate` | `cartCreate` | First item — creates new cart |
| `cartLinesAdd` | `cartLinesAdd` | Subsequent items or existing cart |
| `cartLinesUpdate` | `cartLinesUpdate` | Quantity change |
| `cartLinesRemove` | `cartLinesRemove` | Remove item |
| `getCart` | `cart(id: $id)` | Restore cart from ID on page load |

All mutations use `merchandiseId` (product variant ID).  
All mutations return `checkoutUrl` for seamless checkout handoff.

## Checkout URL Safety

The `checkoutUrl` from Shopify is validated before use:
- Must start with `https://`
- Hostname must end with `.myshopify.com` or `.shopify.com`
- If validation fails, checkout button is disabled (not hidden)

## Security Notes

| Concern | Decision |
|---------|----------|
| Storefront API token | `NEXT_PUBLIC_*` — intentionally public. Storefront tokens are read-only for browsing/cart only. |
| Admin API token | **Never exposed to frontend.** Admin API is only for server-side order lookup (future). |
| Payment data | Handled entirely by Shopify Checkout. Never touches our frontend. |
| Customer data | Collected by Shopify Checkout. Not stored in localStorage. |

## Future: Customer Accounts

v1 ships without custom authentication. Options for v2:

**Option A — Shopify Customer Accounts (recommended)**
- Use Shopify Customer Account API (new, headless-compatible)
- Customers log in via Shopify-hosted login flow
- Order history accessible via customer access token

**Option B — Custom Auth (complex)**
- Build own login/signup with Shopify `customerCreate` + `customerAccessTokenCreate`
- Store `customerAccessToken` in httpOnly cookie
- Associate cart with customer via `cartBuyerIdentityUpdate`

## Future: Order Tracking

`/track-order` currently posts to a server-side placeholder route that validates input and returns `501 Not Implemented`. Options for completing it:

**Option A — Shopify Admin API (server-side only)**
```ts
// Server route: /api/track-order
// Uses: Shopify Admin API → orders.json?email=...&name=...
// NEVER expose Admin API token client-side
```

**Option B — Customer Accounts Order History**
- Requires customer to be logged in
- Accessible via Customer Account API

Both options require backend work outside the current Storefront API scope.  
The Admin API token must live in server environment variables (no `NEXT_PUBLIC_` prefix).
