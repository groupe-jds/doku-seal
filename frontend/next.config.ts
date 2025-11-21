import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  experimental: {
    typedRoutes: true,
    // swcPlugins disabled due to Turbopack incompatibility
    // swcPlugins: [
    //   ['@lingui/swc-plugin', {}]
    // ],
  },

  // Transpile shared packages
  transpilePackages: ['@doku-seal/ui', '@doku-seal/validators', '@doku-seal/shared'],

  // Webpack config for ~ alias
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '~': path.resolve(__dirname),
    };
    return config;
  },

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
  headers() {
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
  redirects() {
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
