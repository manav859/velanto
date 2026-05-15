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
      // Product detail pages are disabled — every /products/* request routes to /shop.
      // 308 permanent redirect preserves SEO equity for any bookmarked or indexed URLs.
      { source: '/products', destination: '/shop', permanent: true },
      { source: '/products/:handle*', destination: '/shop', permanent: true },
    ]
  },
}

export default nextConfig
