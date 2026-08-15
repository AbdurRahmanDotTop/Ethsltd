import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || process.env.CF_PAGES_URL || '';
  const baseUrl = appUrl ? (appUrl.startsWith('http') ? appUrl : `https://${appUrl}`) : '';
  
  // Public routes only
  const routes = [
    '',
    '/markets',
    '/trade',
    '/p2p',
    '/learn',
    '/learn/crypto-basics',
    '/learn/trading',
    '/learn/demo-trading',
    '/learn/security',
    '/learn/market-insights',
    '/fees',
    '/support',
    '/legal/terms',
    '/legal/privacy',
    '/legal/risk-disclosure',
    '/legal/cookies',
    '/legal/security',
    '/developer',
    '/developer/docs',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
