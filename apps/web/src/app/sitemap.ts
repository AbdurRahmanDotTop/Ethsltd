import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'http://localhost:3000'
  
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
