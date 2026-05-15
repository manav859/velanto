import type { Metadata } from 'next'
import PolicyPage from '@/components/PolicyPage'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions governing use of the Velanto website and purchase of products.',
}

// NOTE: Review with a legal professional before production launch.
export default function TermsOfServicePage() {
  return (
    <PolicyPage
      title="Terms of Service"
      lastUpdated="May 2025"
      intro="By accessing or purchasing from Velanto Auto Care, you agree to the following terms. Please read them carefully."
      sections={[
        {
          heading: '1. Acceptance of Terms',
          body: 'These Terms of Service govern your use of the Velanto website and your purchase of any products. By placing an order, you confirm that you are at least 18 years old and legally capable of entering a contract.',
        },
        {
          heading: '2. Products and Pricing',
          body: [
            'Product descriptions and images are provided for informational purposes. We aim for accuracy but cannot guarantee that colours displayed on screen exactly match the physical product.',
            'Prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise.',
            'We reserve the right to modify prices at any time. Orders placed before a price change will be honoured at the original price.',
          ],
        },
        {
          heading: '3. Orders and Payment',
          body: 'All orders are subject to availability and confirmation. We reserve the right to refuse or cancel any order. Payment must be received in full before goods are dispatched. We use secure third-party payment processors.',
        },
        {
          heading: '4. Product Use',
          body: 'Velanto products are intended for automotive care use as described. Always follow the instructions on the label. We are not liable for damage resulting from incorrect application or use on unsuitable surfaces.',
        },
        {
          heading: '5. Intellectual Property',
          body: 'All content on this website — including text, images, logos, product names, and design — is the property of Velanto Auto Care and may not be reproduced without written permission.',
        },
        {
          heading: '6. Limitation of Liability',
          body: 'To the maximum extent permitted by law, Velanto Auto Care shall not be liable for indirect, incidental, or consequential damages arising from the use of our products or website. Our liability is limited to the value of the relevant order.',
        },
        {
          heading: '7. Governing Law',
          body: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.',
        },
        {
          heading: '8. Changes to Terms',
          body: 'We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with an updated date. Continued use of the website after changes constitutes acceptance.',
        },
        {
          heading: '9. Contact',
          body: 'For questions about these terms, use the Contact page.',
        },
      ]}
    />
  )
}
