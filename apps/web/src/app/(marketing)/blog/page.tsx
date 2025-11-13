'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import SectionHeading from '@/components/marketing/SectionHeading'

// Dynamic imports for animated components
const Hero = dynamic(() => import('@/components/marketing/Hero'))
const AnimatedSection = dynamic(() => import('@/components/marketing/AnimatedSection'))

// Mock blog posts data - will be replaced with actual data from CMS
const blogPosts = [
  {
    slug: 'welcome-to-maffix',
    title: 'Welcome to Maffix: Revolutionizing Fan Engagement',
    excerpt: 'Discover how Maffix is changing the way fans support their favorite independent artists through gamification and rewards.',
    category: 'Platform Updates',
    author: 'Maffix Team',
    date: '2024-01-15',
    readTime: '5 min read',
    image: '/blog/welcome.svg',
  },
  {
    slug: 'how-gacha-works',
    title: 'How the Gacha System Works: Your Guide to Winning Prizes',
    excerpt: 'Learn everything about our gacha system, from rarity tiers to SSR guarantees, and maximize your chances of winning exclusive prizes.',
    category: 'Tutorials',
    author: 'Sarah Chen',
    date: '2024-01-12',
    readTime: '8 min read',
    image: '/blog/gacha-guide.svg',
  },
  {
    slug: 'artist-spotlight-luna-rivers',
    title: 'Artist Spotlight: Luna Rivers on Building a Sustainable Music Career',
    excerpt: 'Indie pop artist Luna Rivers shares her journey on Maffix and how the platform helped her connect with fans and grow her income.',
    category: 'Artist Stories',
    author: 'Mike Johnson',
    date: '2024-01-10',
    readTime: '6 min read',
    image: '/blog/luna-rivers.svg',
  },
  {
    slug: 'tiktok-missions-guide',
    title: 'Mastering TikTok Missions: Earn More Diamonds',
    excerpt: 'A comprehensive guide to completing TikTok missions efficiently and maximizing your diamond earnings on Maffix.',
    category: 'Tutorials',
    author: 'Alex Kim',
    date: '2024-01-08',
    readTime: '7 min read',
    image: '/blog/missions-guide.svg',
  },
  {
    slug: 'premium-membership-worth-it',
    title: 'Is Premium Membership Worth It? A Complete Breakdown',
    excerpt: 'We break down all the Premium benefits and help you decide if upgrading is the right choice for your fan experience.',
    category: 'Guides',
    author: 'Emma Davis',
    date: '2024-01-05',
    readTime: '5 min read',
    image: '/blog/premium-guide.svg',
  },
  {
    slug: 'community-features-overview',
    title: 'Building Connections: Exploring Maffix Community Features',
    excerpt: 'Dive into the social side of Maffix and learn how to connect with other fans and engage with your favorite artists.',
    category: 'Platform Updates',
    author: 'Maffix Team',
    date: '2024-01-03',
    readTime: '6 min read',
    image: '/blog/community.svg',
  },
]

const categories = ['All', 'Platform Updates', 'Tutorials', 'Artist Stories', 'Guides']

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <Hero
        badge="📝 Blog"
        title="Stories, Guides & Updates"
        subtitle="Maffix Blog"
        description="Stay updated with the latest news, tutorials, and artist stories from the Maffix community."
        primaryCTA={{ text: 'Subscribe to Newsletter', href: '#newsletter' }}
        secondaryCTA={{ text: 'View All Posts', href: '#posts' }}
      />

      {/* Search and Filter */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section id="posts" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No articles found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                }}
                className="mt-4 text-[#FF5656] hover:text-purple-700 font-semibold"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post, index) => (
                <AnimatedSection key={post.slug} delay={index * 0.1}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all overflow-hidden"
                  >
                    {/* Image Placeholder */}
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                      <span className="text-6xl">📝</span>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-semibold text-[#FF5656] bg-purple-50 px-3 py-1 rounded-full">
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-500">{post.readTime}</span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#FF5656] transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{post.author}</span>
                        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

