import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Validation schema for creating a mission
const createMissionSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  type: z.enum(['SOCIAL', 'CONTENT', 'DAILY', 'PROFILE', 'REFERRAL', 'PURCHASE', 'EVENT']),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  missionType: z.enum(['FOLLOW', 'LIKE', 'REPOST', 'USE_AUDIO']).optional(),
  targetTikTokAccount: z.string().optional(),
  targetVideoUrl: z.string().url().optional(),
  targetAudioId: z.string().optional(),
  autoVerify: z.boolean().optional(),
  points: z.number().int().min(0).optional(),
  diamonds: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  maxCompletions: z.number().int().min(1).optional(),
})

/**
 * POST /api/admin/missions
 * Create a new mission
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validationResult = createMissionSchema.safeParse(body)

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

    // Validate mission type requirements
    if (data.missionType) {
      switch (data.missionType) {
        case 'FOLLOW':
          if (!data.targetTikTokAccount) {
            return NextResponse.json(
              { error: 'targetTikTokAccount is required for FOLLOW missions' },
              { status: 400 }
            )
          }
          break
        case 'LIKE':
        case 'REPOST':
          if (!data.targetVideoUrl) {
            return NextResponse.json(
              { error: 'targetVideoUrl is required for LIKE/REPOST missions' },
              { status: 400 }
            )
          }
          break
        case 'USE_AUDIO':
          if (!data.targetAudioId) {
            return NextResponse.json(
              { error: 'targetAudioId is required for USE_AUDIO missions' },
              { status: 400 }
            )
          }
          break
      }
    }

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    const mission = await db.task.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        difficulty: data.difficulty || 'EASY',
        missionType: data.missionType,
        targetTikTokAccount: data.targetTikTokAccount,
        targetVideoUrl: data.targetVideoUrl,
        targetAudioId: data.targetAudioId,
        autoVerify: data.autoVerify ?? true,
        points: data.points || 0,
        diamonds: data.diamonds || 0,
        isActive: data.isActive ?? true,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        maxCompletions: data.maxCompletions,
      },
    })

    return NextResponse.json({
      success: true,
      mission,
    })
  } catch (error: any) {
    console.error('Error creating mission:', error)
    return NextResponse.json(
      {
        error: 'Failed to create mission',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/missions
 * List all missions with statistics
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const missionType = searchParams.get('missionType')
    const isActive = searchParams.get('isActive')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Build where clause
    const where: any = {}
    if (type) where.type = type
    if (missionType) where.missionType = missionType
    if (isActive !== null) where.isActive = isActive === 'true'

    // Get missions with completion statistics
    const [missions, total] = await Promise.all([
      db.task.findMany({
        where,
        include: {
          _count: {
            select: {
              completions: true,
            },
          },
        },
        orderBy: [
          { isActive: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.task.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      missions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error listing missions:', error)
    return NextResponse.json(
      {
        error: 'Failed to list missions',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

