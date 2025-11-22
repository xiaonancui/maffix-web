import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth-helpers'
import {
  validateRequest,
  successResponse,
  errorResponse,
  handleDatabaseError,
  logAdminAction,
  HttpStatus,
} from '@/lib/api-helpers'

// Validation schema for creating a release
const createReleaseSchema = z.object({
  title: z.string().min(1).max(200),
  artist: z.string().min(1).max(200),
  description: z.string().optional(),
  videoUrl: z.string().url(),
  videoId: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  duration: z.string().optional(),
  views: z.string().optional(),
  releaseDate: z.string().datetime(),
  genre: z.string().optional(),
  tags: z.array(z.string()).optional(),
  spotifyUrl: z.string().url().optional(),
  appleMusicUrl: z.string().url().optional(),
  tidalUrl: z.string().url().optional(),
  soundcloudUrl: z.string().url().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

/**
 * POST /api/admin/releases
 * Create a new release
 */
export async function POST(request: Request) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth
    const { session } = auth

    // Validate request body
    const validation = await validateRequest(request, createReleaseSchema)
    if (validation instanceof NextResponse) return validation

    const { data } = validation

    // Use mock data (database not connected)
    const release = {
      id: `release-${Date.now()}`,
      title: data.title,
      artist: data.artist,
      description: data.description,
      videoUrl: data.videoUrl,
      videoId: data.videoId,
      thumbnailUrl: data.thumbnailUrl,
      duration: data.duration,
      views: data.views,
      releaseDate: new Date(data.releaseDate),
      genre: data.genre,
      tags: data.tags || [],
      spotifyUrl: data.spotifyUrl,
      appleMusicUrl: data.appleMusicUrl,
      tidalUrl: data.tidalUrl,
      soundcloudUrl: data.soundcloudUrl,
      featured: data.featured ?? false,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await logAdminAction(
      'CREATE_RELEASE',
      session.user.id,
      session.user.email,
      { releaseId: release.id }
    )

    return successResponse({ release }, HttpStatus.CREATED)
  } catch (error: any) {
    console.error('Error creating release:', error)
    return handleDatabaseError(error, 'create release')
  }
}

/**
 * GET /api/admin/releases
 * List all releases with filtering
 */
export async function GET(request: Request) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth
    const { session } = auth

    const { searchParams } = new URL(request.url)
    const artist = searchParams.get('artist')
    const genre = searchParams.get('genre')
    const featured = searchParams.get('featured')
    const isActive = searchParams.get('isActive')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Use mock data (database not connected)
    const mockReleases = [
      {
        id: 'release-1',
        title: 'Midnight Dreams',
        artist: 'Maffix',
        description: 'The latest single from Maffix featuring dreamy synths and powerful vocals',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoId: 'dQw4w9WgXcQ',
        thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: '3:45',
        views: '1.2M',
        releaseDate: new Date('2024-01-15'),
        genre: 'Pop',
        tags: ['pop', 'synth', 'dreamy'],
        spotifyUrl: 'https://open.spotify.com/track/example1',
        appleMusicUrl: 'https://music.apple.com/track/example1',
        tidalUrl: null,
        soundcloudUrl: null,
        featured: true,
        sortOrder: 1,
        isActive: true,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      },
      {
        id: 'release-2',
        title: 'Electric Hearts',
        artist: 'Maffix',
        description: 'An electrifying dance track that will get you moving',
        videoUrl: 'https://www.youtube.com/watch?v=example2',
        videoId: 'example2',
        thumbnailUrl: 'https://i.ytimg.com/vi/example2/maxresdefault.jpg',
        duration: '4:12',
        views: '850K',
        releaseDate: new Date('2024-01-08'),
        genre: 'Electronic',
        tags: ['electronic', 'dance', 'edm'],
        spotifyUrl: 'https://open.spotify.com/track/example2',
        appleMusicUrl: 'https://music.apple.com/track/example2',
        tidalUrl: 'https://tidal.com/track/example2',
        soundcloudUrl: null,
        featured: true,
        sortOrder: 2,
        isActive: true,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      },
      {
        id: 'release-3',
        title: 'Summer Vibes',
        artist: 'Maffix',
        description: 'Feel-good summer anthem perfect for beach days',
        videoUrl: 'https://www.youtube.com/watch?v=example3',
        videoId: 'example3',
        thumbnailUrl: 'https://i.ytimg.com/vi/example3/maxresdefault.jpg',
        duration: '3:28',
        views: '2.5M',
        releaseDate: new Date('2023-12-20'),
        genre: 'Pop',
        tags: ['pop', 'summer', 'upbeat'],
        spotifyUrl: 'https://open.spotify.com/track/example3',
        appleMusicUrl: 'https://music.apple.com/track/example3',
        tidalUrl: null,
        soundcloudUrl: 'https://soundcloud.com/track/example3',
        featured: false,
        sortOrder: 3,
        isActive: true,
        createdAt: new Date('2023-12-15'),
        updatedAt: new Date('2023-12-15'),
      },
      {
        id: 'release-4',
        title: 'Neon Lights',
        artist: 'Maffix',
        description: 'A synthwave journey through the city at night',
        videoUrl: 'https://www.youtube.com/watch?v=example4',
        videoId: 'example4',
        thumbnailUrl: 'https://i.ytimg.com/vi/example4/maxresdefault.jpg',
        duration: '5:03',
        views: '650K',
        releaseDate: new Date('2023-12-01'),
        genre: 'Synthwave',
        tags: ['synthwave', 'retro', 'electronic'],
        spotifyUrl: 'https://open.spotify.com/track/example4',
        appleMusicUrl: null,
        tidalUrl: null,
        soundcloudUrl: null,
        featured: false,
        sortOrder: 4,
        isActive: true,
        createdAt: new Date('2023-11-25'),
        updatedAt: new Date('2023-11-25'),
      },
    ]

    // Apply filters
    let filteredReleases = mockReleases

    if (artist) {
      const artistLower = artist.toLowerCase()
      filteredReleases = filteredReleases.filter((r) =>
        r.artist.toLowerCase().includes(artistLower)
      )
    }

    if (genre) {
      filteredReleases = filteredReleases.filter((r) => r.genre === genre)
    }

    if (featured !== null && featured !== undefined) {
      const featuredFilter = featured === 'true'
      filteredReleases = filteredReleases.filter((r) => r.featured === featuredFilter)
    }

    if (isActive !== null && isActive !== undefined) {
      const activeFilter = isActive === 'true'
      filteredReleases = filteredReleases.filter((r) => r.isActive === activeFilter)
    }

    const total = filteredReleases.length
    const start = (page - 1) * limit
    const paginatedReleases = filteredReleases.slice(start, start + limit)

    return successResponse({
      releases: paginatedReleases,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error listing releases:', error)
    return handleDatabaseError(error, 'list releases')
  }
}
