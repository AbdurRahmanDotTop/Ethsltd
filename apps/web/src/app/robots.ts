import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || process.env.CF_PAGES_URL || '';
  const baseUrl = appUrl ? (appUrl.startsWith('http') ? appUrl : `https://${appUrl}`) : '';

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
    sitemap: baseUrl ? `${baseUrl}/sitemap.xml` : '/sitemap.xml',
  }
}
