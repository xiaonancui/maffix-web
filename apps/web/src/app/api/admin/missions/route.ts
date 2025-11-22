import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import {
  validateRequest,
  successResponse,
  errorResponse,
  handleDatabaseError,
  logAdminAction,
  HttpStatus
} from '@/lib/api-helpers'
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
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    // Validate request body
    const validation = await validateRequest(request, createMissionSchema)
    if (validation instanceof NextResponse) return validation

    const { data } = validation

    // Validate mission type requirements
    if (data.missionType) {
      switch (data.missionType) {
        case 'FOLLOW':
          if (!data.targetTikTokAccount) {
            return errorResponse(
              'targetTikTokAccount is required for FOLLOW missions',
              HttpStatus.BAD_REQUEST
            )
          }
          break
        case 'LIKE':
        case 'REPOST':
          if (!data.targetVideoUrl) {
            return errorResponse(
              'targetVideoUrl is required for LIKE/REPOST missions',
              HttpStatus.BAD_REQUEST
            )
          }
          break
        case 'USE_AUDIO':
          if (!data.targetAudioId) {
            return errorResponse(
              'targetAudioId is required for USE_AUDIO missions',
              HttpStatus.BAD_REQUEST
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

    // Log admin action
    logAdminAction('CREATE_MISSION', auth.session.user.id, auth.session.user.email, {
      missionId: mission.id,
      title: mission.title,
      type: mission.type,
    })

    return successResponse({ mission }, HttpStatus.CREATED)
  } catch (error: any) {
    return handleDatabaseError(error)
  }
}

/**
 * GET /api/admin/missions
 * List all missions with statistics
 */
export async function GET(request: Request) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

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

    return successResponse({
      missions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    return handleDatabaseError(error)
  }
}

