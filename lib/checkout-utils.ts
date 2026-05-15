/**
 * Shared checkout utilities — used by CartPageContent and CartDrawer.
 *
 * Checkout diagnosis:
 * If checkout opens `/password`, the Shopify storefront is password-protected.
 * This is NOT a code bug — the checkoutUrl returned by Storefront API is valid.
 *
 * Fix in Shopify Admin:
 *   Online Store → Preferences → Password protection → Remove password
 *
 * Development workaround (without disabling password):
 *   1. Open https://velanto-test.myshopify.com in the same browser
 *   2. Enter the storefront password → browser gets a session cookie
 *   3. Retry checkout from localhost:3000 — it will now work
 *
 * See ORDERING.md for the full flow documentation.
 */

/**
 * Validates that a URL is a legitimate Shopify checkout/cart URL.
 * Prevents navigation to unexpected external URLs.
 *
 * Valid examples returned by Storefront API:
 *   https://velanto-test.myshopify.com/cart/c/<token>?key=<key>
 */
export function isSafeCheckoutUrl(url: string | undefined): url is string {
  if (!url) return false
  try {
    const { protocol, hostname } = new URL(url)
    return (
      protocol === 'https:' &&
      (hostname.endsWith('.myshopify.com') || hostname.endsWith('.shopify.com'))
    )
  } catch {
    return false
  }
}

/**
 * Logs checkout diagnostic info in development only.
 * Never logs tokens, customer data, or cart line details.
 */
export function logCheckoutDebug(url: string | undefined): void {
  if (process.env.NODE_ENV !== 'development') return

  if (!url) {
    console.warn('[checkout] checkoutUrl is empty — cart may not have been created yet')
    return
  }

  try {
    const { protocol, hostname, pathname } = new URL(url)
    const isPasswordProtected =
      typeof process !== 'undefined' &&
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_PASSWORD_PROTECTED === 'true'

    console.info('[checkout] navigating to Shopify checkout', {
      hostname,
      pathname,
      protocol,
      isSafe: isSafeCheckoutUrl(url),
      ...(isPasswordProtected && {
        warning:
          'NEXT_PUBLIC_SHOPIFY_STORE_PASSWORD_PROTECTED=true — checkout may redirect to /password. ' +
          'Disable storefront password in Shopify Admin → Online Store → Preferences.',
      }),
    })
  } catch {
    console.warn('[checkout] could not parse checkoutUrl:', url)
  }
}
