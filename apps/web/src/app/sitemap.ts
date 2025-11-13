import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const routes = [
    '',
    '/features',
    '/features/gacha',
    '/features/missions',
    '/features/store',
    '/features/community',
    '/how-it-works',
    '/faq',
    '/about',
    '/artists',
    '/membership',
    '/contact',
    '/blog',
    '/blog/welcome-to-maffix',
    '/blog/how-gacha-works',
    '/blog/tiktok-missions-guide',
    '/blog/premium-membership-worth-it',
    '/terms',
    '/privacy',
    '/login',
    '/register',
  ]

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}

