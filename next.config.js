/** @type {import('next').NextConfig} */
const nextConfig = {
  // Güvenlik headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'X-RateLimit-Limit',
            value: '5'
          },
          {
            key: 'X-RateLimit-Window',
            value: '15m'
          }
        ]
      }
    ]
  },

  // Görsel optimizasyonu
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['github.com', 'codepen.io', 'vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache süresi optimizasyonu
    minimumCacheTTL: 60,
  },

  // Performance optimizasyonları
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,

  // Bundle analyzer (sadece gerektiğinde)
  webpack: (config, { isServer }) => {
    // Bundle analyzer (development) - sadece dependency varsa
    if (!isServer && process.env.ANALYZE === 'true') {
      try {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
          })
        );
      } catch (err) {
        console.warn('webpack-bundle-analyzer not found. Install it for bundle analysis.');
      }
    }

    return config;
  },

  // Output konfigürasyonu (sadece production için)
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
}

module.exports = nextConfig