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

// Validation schema for updating a release
const updateReleaseSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  artist: z.string().min(1).max(200).optional(),
  description: z.string().nullable().optional(),
  videoUrl: z.string().url().optional(),
  videoId: z.string().nullable().optional(),
  thumbnailUrl: z.string().url().nullable().optional(),
  duration: z.string().nullable().optional(),
  views: z.string().nullable().optional(),
  releaseDate: z.string().datetime().optional(),
  genre: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  spotifyUrl: z.string().url().nullable().optional(),
  appleMusicUrl: z.string().url().nullable().optional(),
  tidalUrl: z.string().url().nullable().optional(),
  soundcloudUrl: z.string().url().nullable().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

/**
 * GET /api/admin/releases/[id]
 * Get a single release with details
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    const { session } = auth
    const { id } = params

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    const release = await db.release.findUnique({
      where: { id },
    })

    if (!release) {
      return errorResponse('Release not found', HttpStatus.NOT_FOUND)
    }

    return successResponse({ release })
  } catch (error: any) {
    console.error('Error getting release:', error)
    return handleDatabaseError(error)
  }
}

/**
 * PATCH /api/admin/releases/[id]
 * Update a release
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth
    const { session } = auth

    const { id } = params

    // Validate request body
    const validation = await validateRequest(request, updateReleaseSchema)
    if (validation instanceof NextResponse) return validation

    const { data } = validation

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Check if release exists
    const existingRelease = await db.release.findUnique({
      where: { id },
    })

    if (!existingRelease) {
      return errorResponse('Release not found', HttpStatus.NOT_FOUND)
    }

    // Update release
    const updateData: any = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.artist !== undefined) updateData.artist = data.artist
    if (data.description !== undefined) updateData.description = data.description
    if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl
    if (data.videoId !== undefined) updateData.videoId = data.videoId
    if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl
    if (data.duration !== undefined) updateData.duration = data.duration
    if (data.views !== undefined) updateData.views = data.views
    if (data.releaseDate !== undefined) updateData.releaseDate = new Date(data.releaseDate)
    if (data.genre !== undefined) updateData.genre = data.genre
    if (data.tags !== undefined) updateData.tags = data.tags
    if (data.spotifyUrl !== undefined) updateData.spotifyUrl = data.spotifyUrl
    if (data.appleMusicUrl !== undefined) updateData.appleMusicUrl = data.appleMusicUrl
    if (data.tidalUrl !== undefined) updateData.tidalUrl = data.tidalUrl
    if (data.soundcloudUrl !== undefined) updateData.soundcloudUrl = data.soundcloudUrl
    if (data.featured !== undefined) updateData.featured = data.featured
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder
    if (data.isActive !== undefined) updateData.isActive = data.isActive

    const release = await db.release.update({
      where: { id },
      data: updateData,
    })

    await logAdminAction(
      'UPDATE_RELEASE',
      session.user.id,
      session.user.email,
      { releaseId: id }
    )

    return successResponse({ release })
  } catch (error: any) {
    console.error('Error updating release:', error)
    return handleDatabaseError(error)
  }
}

/**
 * DELETE /api/admin/releases/[id]
 * Delete a release (hard delete)
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    const { session } = auth
    const { id } = params

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Check if release exists
    const existingRelease = await db.release.findUnique({
      where: { id },
    })

    if (!existingRelease) {
      return errorResponse('Release not found', HttpStatus.NOT_FOUND)
    }

    // Hard delete the release
    await db.release.delete({
      where: { id },
    })

    await logAdminAction(
      'DELETE_RELEASE',
      session.user.id,
      session.user.email,
      { releaseId: id }
    )

    return successResponse({ message: 'Release deleted successfully' }, HttpStatus.OK)
  } catch (error: any) {
    console.error('Error deleting release:', error)
    return handleDatabaseError(error)
  }
}
