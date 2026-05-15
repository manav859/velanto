import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/CartDrawer'
import {
  DEFAULT_OG_TYPE,
  DEFAULT_SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SHORT_NAME,
  getSiteUrl,
} from '@/lib/site'

const metadataBase = getSiteUrl() ?? undefined

export const metadata: Metadata = {
  metadataBase,
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_SHORT_NAME} | Premium Car Detailing Products`,
    template: `%s | ${SITE_SHORT_NAME}`,
  },
  description: DEFAULT_SITE_DESCRIPTION,
  keywords: [
    'car detailing', 'car care', 'ceramic spray', 'car wash',
    'microfibre', 'tyre cleaner', 'snow foam', 'car shampoo', 'India',
  ],
  alternates: metadataBase ? { canonical: '/' } : undefined,
  openGraph: {
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_SITE_DESCRIPTION,
    type: DEFAULT_OG_TYPE,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: DEFAULT_SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
