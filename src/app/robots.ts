import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/auth/'],
      },
    ],
    sitemap: 'https://arkegu.com.tr/sitemap.xml',
    host: 'https://arkegu.com.tr',
  }
}

