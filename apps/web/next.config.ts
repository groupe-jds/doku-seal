import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  experimental: {
    typedRoutes: true,
    ppr: true, // Partial Prerendering
  },

  // Transpile shared packages
  transpilePackages: [
    '@doku-seal/ui',
    '@doku-seal/validators',
    '@doku-seal/shared',
  ],

  // Images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.doku-seal.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
