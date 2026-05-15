import type { Metadata } from 'next'
import PageShell from '@/components/PageShell'
import FAQsClient from './FAQsClient'

export const metadata: Metadata = {
  title: 'FAQs',
  description: 'Frequently asked questions about Velanto products, shipping, returns, and more.',
}

export default function FAQsPage() {
  return (
    <PageShell>
      <FAQsClient />
    </PageShell>
  )
}
