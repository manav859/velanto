import { getNavigationCollections } from '@/lib/shopify'
import HeaderClient from './HeaderClient'

/**
 * Server component — fetches dynamic collection nav links from Shopify,
 * then delegates all interactivity to HeaderClient.
 *
 * All page files continue to `import Header from '@/components/Header'`
 * without any changes.
 */
export default async function Header() {
  // Never throws — returns [] on API failure so header always renders
  const navCollections = await getNavigationCollections()

  return <HeaderClient navCollections={navCollections} />
}
