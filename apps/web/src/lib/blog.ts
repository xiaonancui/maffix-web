import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  date: string
  readTime: string
  image?: string
  tags?: string[]
}

export interface BlogPostMetadata {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime: string
  image?: string
  tags?: string[]
}

/**
 * Get all blog post slugs
 */
export function getAllPostSlugs(): string[] {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return []
    }
    const fileNames = fs.readdirSync(postsDirectory)
    return fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.md$/, ''))
  } catch (error) {
    console.error('Error reading blog posts directory:', error)
    return []
  }
}

/**
 * Get blog post data by slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    // Convert markdown to HTML
    const processedContent = await remark().use(html).process(content)
    const contentHtml = processedContent.toString()

    return {
      slug,
      title: data.title || '',
      excerpt: data.excerpt || '',
      content: contentHtml,
      category: data.category || 'Uncategorized',
      author: data.author || 'Anonymous',
      date: data.date || new Date().toISOString(),
      readTime: data.readTime || '5 min read',
      image: data.image,
      tags: data.tags || [],
    }
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error)
    return null
  }
}

/**
 * Get all blog posts metadata (without content)
 */
export function getAllPosts(): BlogPostMetadata[] {
  try {
    const slugs = getAllPostSlugs()
    const posts = slugs
      .map((slug): BlogPostMetadata | null => {
        try {
          const fullPath = path.join(postsDirectory, `${slug}.md`)
          const fileContents = fs.readFileSync(fullPath, 'utf8')
          const { data } = matter(fileContents)

          return {
            slug,
            title: data.title || '',
            excerpt: data.excerpt || '',
            category: data.category || 'Uncategorized',
            author: data.author || 'Anonymous',
            date: data.date || new Date().toISOString(),
            readTime: data.readTime || '5 min read',
            image: data.image,
            tags: data.tags || [],
          }
        } catch (error) {
          console.error(`Error reading post ${slug}:`, error)
          return null
        }
      })
      .filter((post): post is BlogPostMetadata => post !== null)
      .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()))

    return posts
  } catch (error) {
    console.error('Error getting all posts:', error)
    return []
  }
}

/**
 * Get posts by category
 */
export function getPostsByCategory(category: string): BlogPostMetadata[] {
  const allPosts = getAllPosts()
  return allPosts.filter((post) => post.category === category)
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  const allPosts = getAllPosts()
  const categories = new Set(allPosts.map((post) => post.category))
  return Array.from(categories).sort()
}

/**
 * Search posts by query
 */
export function searchPosts(query: string): BlogPostMetadata[] {
  const allPosts = getAllPosts()
  const lowerQuery = query.toLowerCase()
  
  return allPosts.filter((post) => {
    return (
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    )
  })
}

/**
 * Get related posts based on category and tags
 */
export function getRelatedPosts(slug: string, limit: number = 3): BlogPostMetadata[] {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return []
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)
    
    const allPosts = getAllPosts().filter((post) => post.slug !== slug)
    
    // Score posts based on matching category and tags
    const scoredPosts = allPosts.map((post) => {
      let score = 0
      if (post.category === data.category) score += 2
      if (data.tags && post.tags) {
        const matchingTags = post.tags.filter((tag: string) => data.tags.includes(tag))
        score += matchingTags.length
      }
      return { post, score }
    })
    
    // Sort by score and return top results
    return scoredPosts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.post)
  } catch (error) {
    console.error(`Error getting related posts for ${slug}:`, error)
    return []
  }
}

