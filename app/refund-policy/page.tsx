import type { Metadata } from 'next'
import PolicyPage from '@/components/PolicyPage'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Velanto refund and return policy for car care products.',
}

// NOTE: Review with a legal professional before production launch.
export default function RefundPolicyPage() {
  return (
    <PolicyPage
      title="Refund Policy"
      lastUpdated="May 2025"
      intro="We want you to be completely satisfied with every Velanto product. If you are not, we are here to make it right."
      sections={[
        {
          heading: '1. Return Eligibility',
          body: [
            'Returns are accepted within 7 days of delivery.',
            'Products must be unused, in their original sealed packaging.',
            'Partially used products are not eligible for return.',
            'Items damaged due to improper use are not eligible.',
          ],
        },
        {
          heading: '2. How to Initiate a Return',
          body: 'Contact our support team through the Contact page with your order number, the item(s) you wish to return, and the reason for return. Return instructions are shared through the configured support channel.',
        },
        {
          heading: '3. Refund Processing',
          body: 'Once your return is received and inspected (usually within 2 business days), we will notify you of the approval or rejection. Approved refunds are processed to the original payment method within 5–7 business days.',
        },
        {
          heading: '4. Damaged or Defective Products',
          body: 'If you receive a damaged or defective product, please contact us within 48 hours of delivery with a photo. We will arrange a replacement or full refund at no extra charge.',
        },
        {
          heading: '5. Non-Returnable Items',
          body: [
            'Products that have been used or opened.',
            'Products damaged due to incorrect storage or application.',
            'Free gift items included with orders.',
          ],
        },
        {
          heading: '6. Return Shipping',
          body: 'Customers are responsible for return shipping costs unless the product is defective or we made an error. We recommend using a trackable courier service.',
        },
        {
          heading: '7. Contact',
          body: 'For all return and refund queries, use the Contact page.',
        },
      ]}
    />
  )
}
