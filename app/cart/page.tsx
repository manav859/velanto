import type { Metadata } from 'next'
import PageShell from '@/components/PageShell'
import CartPageContent from './CartPageContent'

export const metadata: Metadata = {
  title: 'Your Cart',
  description: 'Review your Velanto cart and proceed to checkout.',
}

export default function CartPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-8">
          Your Cart
        </h1>
        <CartPageContent />
      </div>
    </PageShell>
  )
}
