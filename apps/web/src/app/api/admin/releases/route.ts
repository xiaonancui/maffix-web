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

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    const release = await db.release.create({
      data: {
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
      },
    })

    await logAdminAction(
      'CREATE_RELEASE',
      session.user.id,
      session.user.email,
      { releaseId: release.id }
    )

    return successResponse({ release }, HttpStatus.CREATED)
  } catch (error: any) {
    console.error('Error creating release:', error)
    return handleDatabaseError(error)
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

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Build where clause
    const where: any = {}
    if (artist) {
      where.artist = { contains: artist, mode: 'insensitive' }
    }
    if (genre) {
      where.genre = genre
    }
    if (featured !== null && featured !== undefined) {
      where.featured = featured === 'true'
    }
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true'
    }

    // Get total count
    const total = await db.release.count({ where })

    // Get paginated releases
    const releases = await db.release.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { sortOrder: 'asc' },
        { releaseDate: 'desc' },
      ],
      skip: (page - 1) * limit,
      take: limit,
    })

    return successResponse({
      releases,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error listing releases:', error)
    return handleDatabaseError(error)
  }
}
