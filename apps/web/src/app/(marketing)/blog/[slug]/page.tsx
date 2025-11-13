import Link from 'next/link'
import { notFound } from 'next/navigation'
import AnimatedSection from '@/components/marketing/AnimatedSection'
import CTA from '@/components/marketing/CTA'

// Mock blog post data - will be replaced with actual CMS data
const blogPosts: Record<string, any> = {
  'welcome-to-maffix': {
    slug: 'welcome-to-maffix',
    title: 'Welcome to Maffix: Revolutionizing Fan Engagement',
    excerpt: 'Discover how Maffix is changing the way fans support their favorite independent artists through gamification and rewards.',
    category: 'Platform Updates',
    author: 'Maffix Team',
    date: '2024-01-15',
    readTime: '5 min read',
    content: `
# Welcome to Maffix

We're thrilled to introduce **Maffix**, a revolutionary platform that's changing how fans engage with and support independent musicians.

## The Problem We're Solving

Independent artists work incredibly hard to build their fanbase on social media, but struggle to convert that engagement into sustainable income. Traditional platforms take large cuts, and fans have limited ways to support their favorite artists beyond streaming and occasional merch purchases.

## Our Solution

Maffix gamifies fan engagement by rewarding both artists and fans. Here's how it works:

### For Fans
- **Complete TikTok Missions**: Engage with your favorite artists' content and earn diamonds
- **Gacha System**: Use diamonds to draw exclusive prizes and merchandise
- **Community**: Connect with other fans and participate in exclusive events
- **Direct Support**: Your engagement directly supports the artists you love

### For Artists
- **Direct Revenue**: Keep more of what you earn
- **Engaged Fanbase**: Incentivize fans to actively support your content
- **Analytics**: Understand your audience better
- **Exclusive Merchandise**: Offer unique prizes through our gacha system

## What Makes Us Different

1. **Fair Rewards**: Both fans and artists benefit from engagement
2. **Gamification**: Make supporting artists fun and rewarding
3. **Community-Driven**: Build real connections between artists and fans
4. **Transparent**: Clear pricing and fair revenue sharing

## Join Us Today

Whether you're an artist looking to grow your career or a fan wanting to support your favorite musicians, Maffix has something for you.

[Get Started Now](/register)
    `,
  },
  'how-gacha-works': {
    slug: 'how-gacha-works',
    title: 'How the Gacha System Works: Your Guide to Winning Prizes',
    excerpt: 'Learn everything about our gacha system, from rarity tiers to SSR guarantees, and maximize your chances of winning exclusive prizes.',
    category: 'Tutorials',
    author: 'Sarah Chen',
    date: '2024-01-12',
    readTime: '8 min read',
    content: `
# How the Gacha System Works

The gacha system is at the heart of Maffix's reward mechanism. Here's everything you need to know to maximize your chances of winning amazing prizes.

## Understanding Rarity Tiers

Our gacha system features 5 rarity tiers:

- **C (Common)**: 50% chance - Basic items and small rewards
- **R (Rare)**: 30% chance - Quality merchandise and bonus diamonds
- **SR (Super Rare)**: 15% chance - Exclusive items and artist signatures
- **SSR (Super Super Rare)**: 4% chance - Limited edition merchandise and experiences
- **UR (Ultra Rare)**: 1% chance - One-of-a-kind items and VIP experiences

## The SSR Guarantee

One of our most popular features is the **SSR Guarantee**:
- Every 10x draw guarantees at least one SSR or higher item
- Your pity counter resets after pulling an SSR
- This ensures you always get value from your diamonds

## Tips for Maximizing Your Draws

1. **Save for 10x Draws**: Always better value than single draws
2. **Check Artist Pools**: Different artists have different prize pools
3. **Participate in Events**: Special events often have increased rates
4. **Premium Membership**: Get 2x diamonds on all missions

## Prize Types

- **Physical Merchandise**: T-shirts, posters, vinyl records
- **Digital Content**: Exclusive tracks, behind-the-scenes videos
- **Experiences**: Meet & greets, virtual concerts, studio visits
- **Collectibles**: Signed items, limited edition artwork

Start drawing today and win amazing prizes!
    `,
  },
}

const relatedPosts = [
  {
    slug: 'tiktok-missions-guide',
    title: 'Mastering TikTok Missions',
    category: 'Tutorials',
  },
  {
    slug: 'premium-membership-worth-it',
    title: 'Is Premium Worth It?',
    category: 'Guides',
  },
  {
    slug: 'artist-spotlight-luna-rivers',
    title: 'Artist Spotlight: Luna Rivers',
    category: 'Artist Stories',
  },
]

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug]
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | Maffix Blog`,
    description: post.excerpt,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug]

  if (!post) {
    notFound()
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-purple-100 hover:text-white mb-6">
            ← Back to Blog
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-sm text-purple-100">{post.readTime}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-6">{post.title}</h1>

          <div className="flex items-center gap-4 text-purple-100">
            <span>By {post.author}</span>
            <span>•</span>
            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <AnimatedSection>
            <div className="prose prose-lg max-w-none">
              {/* Simple markdown-like rendering */}
              {post.content.split('\n').map((line: string, index: number) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-4xl font-bold mt-8 mb-4">{line.slice(2)}</h1>
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-3xl font-bold mt-6 mb-3">{line.slice(3)}</h2>
                } else if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-2xl font-bold mt-4 mb-2">{line.slice(4)}</h3>
                } else if (line.startsWith('- ')) {
                  return <li key={index} className="ml-6">{line.slice(2)}</li>
                } else if (line.trim() === '') {
                  return <br key={index} />
                } else {
                  return <p key={index} className="mb-4 text-gray-700 leading-relaxed">{line}</p>
                }
              })}
            </div>
          </AnimatedSection>
        </div>
      </article>

      {/* Related Posts */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
          
          <div className="grid gap-6 sm:grid-cols-3">
            {relatedPosts.map((relatedPost, index) => (
              <AnimatedSection key={relatedPost.slug} delay={index * 0.1}>
                <Link
                  href={`/blog/${relatedPost.slug}`}
                  className="block rounded-xl bg-white p-6 shadow-sm hover:shadow-lg transition-all"
                >
                  <span className="text-xs font-semibold text-[#FF5656] bg-purple-50 px-3 py-1 rounded-full">
                    {relatedPost.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 mt-3 hover:text-[#FF5656] transition-colors">
                    {relatedPost.title}
                  </h3>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTA
        title="Ready to Start Your Journey?"
        description="Join thousands of fans supporting their favorite artists on Maffix."
        primaryButton={{ text: 'Get Started', href: '/register' }}
        secondaryButton={{ text: 'Learn More', href: '/how-it-works' }}
      />
    </div>
  )
}

