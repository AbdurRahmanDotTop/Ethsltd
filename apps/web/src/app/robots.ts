import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/account/*',
        '/wallet/*',
        '/admin/*',
        '/notifications',
        '/developer/api-keys',
        '/developer/usage',
      ],
    },
    sitemap: 'http://localhost:3000/sitemap.xml',
  }
}
