import type { Metadata } from 'next'
import PolicyPage from '@/components/PolicyPage'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Velanto collects, uses, and protects your personal information.',
}

// NOTE: Review with a legal professional before production launch.
export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      lastUpdated="May 2025"
      intro="Velanto Auto Care is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information when you visit our website or place an order."
      sections={[
        {
          heading: '1. Information We Collect',
          body: [
            'Name, email address, phone number, and delivery address when you place an order.',
            'Payment information processed securely through our payment gateway (we do not store card details).',
            'Browsing behaviour on our website through cookies and analytics tools.',
            'Communications you send to us via email or our contact form.',
          ],
        },
        {
          heading: '2. How We Use Your Information',
          body: [
            'To process and fulfil your orders.',
            'To communicate about your order status, shipping, and delivery.',
            'To respond to support requests and enquiries.',
            'To send marketing emails if you have opted in (you can unsubscribe at any time).',
            'To improve our website and product range based on usage patterns.',
          ],
        },
        {
          heading: '3. Sharing Your Information',
          body: 'We do not sell your personal information to third parties. We share data only with service providers necessary to operate our business (logistics partners, payment processors, email platforms) under confidentiality obligations.',
        },
        {
          heading: '4. Cookies',
          body: 'We use essential cookies to keep your cart and session active. We may also use analytics cookies to understand how visitors use our site. You can disable non-essential cookies through your browser settings.',
        },
        {
          heading: '5. Data Retention',
          body: 'We retain your order and account data for as long as necessary to provide our services and comply with Indian tax and legal regulations. You may request deletion of your data by contacting us.',
        },
        {
          heading: '6. Your Rights',
          body: [
            'Access the personal data we hold about you.',
            'Request correction of inaccurate data.',
            'Request deletion of your data (subject to legal obligations).',
            'Opt out of marketing communications at any time.',
          ],
        },
        {
          heading: '7. Contact',
          body: 'For privacy-related requests, please use the Contact page so we can respond through the configured support channel.',
        },
      ]}
    />
  )
}
