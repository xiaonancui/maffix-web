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

    // Use mock data (database not connected)
    const mission = {
      id: `mission-${Date.now()}`,
      title: data.title,
      description: data.description,
      type: data.type,
      difficulty: data.difficulty || 'EASY',
      missionType: data.missionType || null,
      targetTikTokAccount: data.targetTikTokAccount || null,
      targetVideoUrl: data.targetVideoUrl || null,
      targetAudioId: data.targetAudioId || null,
      autoVerify: data.autoVerify ?? true,
      points: data.points || 0,
      diamonds: data.diamonds || 0,
      isActive: data.isActive ?? true,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      maxCompletions: data.maxCompletions || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

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

    // Use mock data (database not connected)
    const mockMissions = [
      {
        id: 'mission-1',
        title: 'Follow Official TikTok Account',
        description: 'Follow @maffix_official on TikTok to stay updated with latest releases',
        type: 'SOCIAL',
        difficulty: 'EASY',
        missionType: 'FOLLOW',
        targetTikTokAccount: '@maffix_official',
        targetVideoUrl: null,
        targetAudioId: null,
        autoVerify: true,
        points: 50,
        diamonds: 100,
        isActive: true,
        startDate: null,
        endDate: null,
        maxCompletions: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        _count: {
          completions: 245,
        },
      },
      {
        id: 'mission-2',
        title: 'Like New Single Release',
        description: 'Like the latest music video on TikTok',
        type: 'SOCIAL',
        difficulty: 'EASY',
        missionType: 'LIKE',
        targetTikTokAccount: null,
        targetVideoUrl: 'https://www.tiktok.com/@maffix/video/1234567890',
        targetAudioId: null,
        autoVerify: true,
        points: 30,
        diamonds: 60,
        isActive: true,
        startDate: null,
        endDate: null,
        maxCompletions: null,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
        _count: {
          completions: 189,
        },
      },
      {
        id: 'mission-3',
        title: 'Repost New Music Video',
        description: 'Repost the latest music video to your TikTok profile',
        type: 'SOCIAL',
        difficulty: 'MEDIUM',
        missionType: 'REPOST',
        targetTikTokAccount: null,
        targetVideoUrl: 'https://www.tiktok.com/@maffix/video/1234567890',
        targetAudioId: null,
        autoVerify: false,
        points: 100,
        diamonds: 150,
        isActive: true,
        startDate: null,
        endDate: null,
        maxCompletions: null,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08'),
        _count: {
          completions: 87,
        },
      },
      {
        id: 'mission-4',
        title: 'Create Video with "Midnight Dreams"',
        description: 'Create a TikTok video using the song "Midnight Dreams"',
        type: 'CONTENT',
        difficulty: 'HARD',
        missionType: 'USE_AUDIO',
        targetTikTokAccount: null,
        targetVideoUrl: null,
        targetAudioId: 'audio-midnight-dreams-123',
        autoVerify: false,
        points: 200,
        diamonds: 400,
        isActive: true,
        startDate: null,
        endDate: null,
        maxCompletions: null,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        _count: {
          completions: 52,
        },
      },
      {
        id: 'mission-5',
        title: 'Daily Login Bonus',
        description: 'Log in daily to claim your bonus diamonds',
        type: 'DAILY',
        difficulty: 'EASY',
        missionType: null,
        targetTikTokAccount: null,
        targetVideoUrl: null,
        targetAudioId: null,
        autoVerify: true,
        points: 10,
        diamonds: 20,
        isActive: true,
        startDate: null,
        endDate: null,
        maxCompletions: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        _count: {
          completions: 1523,
        },
      },
      {
        id: 'mission-6',
        title: 'Share Profile Link',
        description: 'Share your Maffix profile link on TikTok',
        type: 'PROFILE',
        difficulty: 'MEDIUM',
        missionType: null,
        targetTikTokAccount: null,
        targetVideoUrl: null,
        targetAudioId: null,
        autoVerify: false,
        points: 75,
        diamonds: 120,
        isActive: false,
        startDate: null,
        endDate: null,
        maxCompletions: null,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-15'),
        _count: {
          completions: 34,
        },
      },
    ]

    // Apply filters
    let filteredMissions = mockMissions

    if (type) {
      filteredMissions = filteredMissions.filter((m) => m.type === type)
    }

    if (missionType) {
      filteredMissions = filteredMissions.filter((m) => m.missionType === missionType)
    }

    if (isActive !== null) {
      const activeFilter = isActive === 'true'
      filteredMissions = filteredMissions.filter((m) => m.isActive === activeFilter)
    }

    const total = filteredMissions.length
    const start = (page - 1) * limit
    const paginatedMissions = filteredMissions.slice(start, start + limit)

    return successResponse({
      missions: paginatedMissions,
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

