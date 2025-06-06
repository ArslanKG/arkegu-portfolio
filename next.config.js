/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['github.com', 'codepen.io', 'vercel.app'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/fonts/',
          outputPath: 'static/fonts/',
        },
      },
    });
    return config;
  },
}

module.exports = nextConfig