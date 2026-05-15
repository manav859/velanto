import type { Metadata } from 'next'
import PolicyPage from '@/components/PolicyPage'

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Velanto shipping timelines, costs, and delivery information across India.',
}

// NOTE: Review with a legal professional before production launch.
export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      title="Shipping Policy"
      lastUpdated="May 2025"
      intro="We ship Velanto products across India. Here is everything you need to know about delivery timelines and costs."
      sections={[
        {
          heading: '1. Processing Time',
          body: 'All orders are processed within 24 hours on business days (Monday–Saturday, excluding public holidays). Orders placed after 3 PM may be dispatched the following business day.',
        },
        {
          heading: '2. Delivery Timelines',
          body: [
            'Metro cities (Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata): 2–3 business days.',
            'Tier 2 and Tier 3 cities: 3–5 business days.',
            'Remote/rural pin codes: 5–7 business days.',
            'These are estimated timelines and may vary during peak periods or due to courier delays.',
          ],
        },
        {
          heading: '3. Shipping Charges',
          body: [
            'Free shipping on all orders above ₹999.',
            'Orders below ₹999 incur a flat shipping charge (displayed at checkout).',
            'Expedited shipping options will be shown at checkout once available.',
          ],
        },
        {
          heading: '4. Tracking Your Order',
          body: 'A tracking number will be shared via email and SMS once your order is dispatched. You can use our Track Order page to check status. For assistance, contact our support team.',
        },
        {
          heading: '5. Undeliverable Packages',
          body: 'If a delivery attempt fails and the package is returned to us, we will contact you to arrange re-delivery. Additional shipping charges may apply for re-dispatch.',
        },
        {
          heading: '6. Damaged in Transit',
          body: 'If your order arrives damaged, please photograph the package and product and contact us within 48 hours of delivery. We will resolve the issue promptly.',
        },
        {
          heading: '7. Contact',
          body: 'For shipping queries, use our Contact page.',
        },
      ]}
    />
  )
}
