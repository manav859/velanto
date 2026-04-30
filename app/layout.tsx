import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/CartDrawer'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: {
    default: 'Velanto — Premium Car Detailing Products',
    template: '%s | Velanto',
  },
  description:
    'Professional-grade car care products. Shampoos, ceramic sprays, tyre cleaners, microfibre towels, detailing kits and accessories for a showroom finish.',
  keywords: ['car detailing', 'car care', 'ceramic spray', 'car wash', 'microfibre', 'tyre cleaner'],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <CartProvider>
          {/* Suspense boundary is required for client components using framer-motion (Math.random) */}
          <Suspense>
            {children}
          </Suspense>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
