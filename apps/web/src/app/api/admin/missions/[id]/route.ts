import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Validation schema for updating a mission
const updateMissionSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  type: z.enum(['SOCIAL', 'CONTENT', 'DAILY', 'PROFILE', 'REFERRAL', 'PURCHASE', 'EVENT']).optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  missionType: z.enum(['FOLLOW', 'LIKE', 'REPOST', 'USE_AUDIO']).nullable().optional(),
  targetTikTokAccount: z.string().nullable().optional(),
  targetVideoUrl: z.string().url().nullable().optional(),
  targetAudioId: z.string().nullable().optional(),
  autoVerify: z.boolean().optional(),
  points: z.number().int().min(0).optional(),
  diamonds: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
  maxCompletions: z.number().int().min(1).nullable().optional(),
})

/**
 * GET /api/admin/missions/[id]
 * Get a single mission with details
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    const mission = await db.task.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            completions: true,
            verificationJobs: true,
          },
        },
      },
    })

    if (!mission) {
      return NextResponse.json(
        { error: 'Mission not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      mission,
    })
  } catch (error: any) {
    console.error('Error getting mission:', error)
    return NextResponse.json(
      {
        error: 'Failed to get mission',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/missions/[id]
 * Update a mission
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()
    const validationResult = updateMissionSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Check if mission exists
    const existingMission = await db.task.findUnique({
      where: { id },
    })

    if (!existingMission) {
      return NextResponse.json(
        { error: 'Mission not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.type !== undefined) updateData.type = data.type
    if (data.difficulty !== undefined) updateData.difficulty = data.difficulty
    if (data.missionType !== undefined) updateData.missionType = data.missionType
    if (data.targetTikTokAccount !== undefined) updateData.targetTikTokAccount = data.targetTikTokAccount
    if (data.targetVideoUrl !== undefined) updateData.targetVideoUrl = data.targetVideoUrl
    if (data.targetAudioId !== undefined) updateData.targetAudioId = data.targetAudioId
    if (data.autoVerify !== undefined) updateData.autoVerify = data.autoVerify
    if (data.points !== undefined) updateData.points = data.points
    if (data.diamonds !== undefined) updateData.diamonds = data.diamonds
    if (data.isActive !== undefined) updateData.isActive = data.isActive
    if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null
    if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null
    if (data.maxCompletions !== undefined) updateData.maxCompletions = data.maxCompletions

    const mission = await db.task.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      mission,
    })
  } catch (error: any) {
    console.error('Error updating mission:', error)
    return NextResponse.json(
      {
        error: 'Failed to update mission',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/missions/[id]
 * Deactivate a mission (soft delete)
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Check if mission exists
    const existingMission = await db.task.findUnique({
      where: { id },
    })

    if (!existingMission) {
      return NextResponse.json(
        { error: 'Mission not found' },
        { status: 404 }
      )
    }

    // Soft delete by setting isActive to false
    const mission = await db.task.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({
      success: true,
      message: 'Mission deactivated successfully',
      mission,
    })
  } catch (error: any) {
    console.error('Error deactivating mission:', error)
    return NextResponse.json(
      {
        error: 'Failed to deactivate mission',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

