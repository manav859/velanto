import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      // Legacy Shopify storefront URLs → headless equivalents
      { source: '/products/:handle*', destination: '/shop/:handle*', permanent: true },
      { source: '/products', destination: '/shop', permanent: true },
    ]
  },
}

export default nextConfig
