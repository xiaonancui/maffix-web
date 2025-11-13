import type { Metadata } from 'next'

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
}

const defaultSEO = {
  siteName: 'Maffix',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  twitterHandle: '@maffix',
  defaultImage: '/og-image.png',
  defaultDescription:
    'Connect with your favorite independent musicians through gamified missions, exclusive prizes, and community engagement. Earn diamonds, draw prizes, and support artists on TikTok.',
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image = defaultSEO.defaultImage,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
}: SEOProps): Metadata {
  const fullTitle = title.includes('Maffix') ? title : `${title} | Maffix`
  const fullUrl = url ? `${defaultSEO.siteUrl}${url}` : defaultSEO.siteUrl
  const fullImage = image.startsWith('http') ? image : `${defaultSEO.siteUrl}${image}`

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: [
      'independent musicians',
      'fan engagement',
      'TikTok missions',
      'gacha system',
      'music community',
      ...keywords,
    ],
    authors: authors ? authors.map((name) => ({ name })) : [{ name: 'Maffix' }],
    creator: 'Maffix',
    publisher: 'Maffix',
    openGraph: {
      type,
      locale: 'en_US',
      url: fullUrl,
      siteName: defaultSEO.siteName,
      title: fullTitle,
      description,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
      creator: defaultSEO.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }

  // Add article-specific metadata
  if (type === 'article' && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: authors,
    }
  }

  return metadata
}

// Structured Data helpers
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Maffix',
    url: defaultSEO.siteUrl,
    logo: `${defaultSEO.siteUrl}/logo.png`,
    description: defaultSEO.defaultDescription,
    sameAs: [
      'https://twitter.com/maffix',
      'https://instagram.com/maffix',
      'https://tiktok.com/@maffix',
      'https://discord.gg/maffix',
    ],
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Maffix',
    url: defaultSEO.siteUrl,
    description: defaultSEO.defaultDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${defaultSEO.siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateArticleSchema({
  title,
  description,
  image,
  publishedTime,
  modifiedTime,
  authors,
  url,
}: {
  title: string
  description: string
  image: string
  publishedTime: string
  modifiedTime?: string
  authors: string[]
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image.startsWith('http') ? image : `${defaultSEO.siteUrl}${image}`,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: authors.map((name) => ({
      '@type': 'Person',
      name,
    })),
    publisher: {
      '@type': 'Organization',
      name: 'Maffix',
      logo: {
        '@type': 'ImageObject',
        url: `${defaultSEO.siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${defaultSEO.siteUrl}${url}`,
    },
  }
}

