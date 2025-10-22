import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

/**
 * POST /api/missions/[missionId]/submit
 * 
 * Submit a mission for verification
 * 
 * This endpoint:
 * 1. Validates user has TikTok account linked
 * 2. Validates mission exists and is active
 * 3. Checks if user already completed this mission
 * 4. Creates a pending UserTask record
 * 5. Creates a MissionVerificationJob for async processing
 * 6. Returns submission confirmation
 */
export async function POST(
  request: Request,
  { params }: { params: { missionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { missionId } = params

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Check if this is a test account
    const isTestAccount =
      process.env.NODE_ENV === 'development' &&
      (session.user.id?.includes('test-') ||
        session.user.id?.includes('demo-') ||
        session.user.id?.includes('admin-'))

    // Get user with TikTok info
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        tiktokUsername: true,
        tiktokAccessToken: true,
        tiktokTokenExpiry: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Validate user has TikTok linked (skip for test accounts)
    if (!isTestAccount) {
      if (!user.tiktokUsername || !user.tiktokAccessToken) {
        return NextResponse.json(
          {
            error: 'TikTok account not linked',
            message: 'Please link your TikTok account before submitting missions',
            requiresLink: true,
          },
          { status: 400 }
        )
      }

      // Check if token is expired
      if (user.tiktokTokenExpiry && new Date(user.tiktokTokenExpiry) < new Date()) {
        return NextResponse.json(
          {
            error: 'TikTok token expired',
            message: 'Your TikTok access token has expired. Please re-link your account',
            requiresLink: true,
          },
          { status: 400 }
        )
      }
    }

    // Get mission/task details
    const task = await db.task.findUnique({
      where: { id: missionId },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        missionType: true,
        targetTikTokAccount: true,
        targetVideoUrl: true,
        targetAudioId: true,
        autoVerify: true,
        diamonds: true,
        points: true,
        isActive: true,
        maxCompletions: true,
        completionCount: true,
      },
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Mission not found' },
        { status: 404 }
      )
    }

    if (!task.isActive) {
      return NextResponse.json(
        { error: 'Mission is not active' },
        { status: 400 }
      )
    }

    // Check if mission has reached max completions
    if (task.maxCompletions && task.completionCount >= task.maxCompletions) {
      return NextResponse.json(
        { error: 'Mission has reached maximum completions' },
        { status: 400 }
      )
    }

    // Check if user already completed this mission
    const existingCompletion = await db.userTask.findUnique({
      where: {
        userId_taskId: {
          userId: user.id,
          taskId: task.id,
        },
      },
    })

    if (existingCompletion) {
      return NextResponse.json(
        {
          error: 'Mission already submitted',
          message: 'You have already submitted this mission',
          status: existingCompletion.verificationStatus,
        },
        { status: 400 }
      )
    }

    // Validate mission has required target data
    if (task.missionType) {
      switch (task.missionType) {
        case 'FOLLOW':
          if (!task.targetTikTokAccount) {
            return NextResponse.json(
              { error: 'Mission configuration error: missing target account' },
              { status: 500 }
            )
          }
          break
        case 'LIKE':
        case 'REPOST':
          if (!task.targetVideoUrl) {
            return NextResponse.json(
              { error: 'Mission configuration error: missing target video' },
              { status: 500 }
            )
          }
          break
        case 'USE_AUDIO':
          if (!task.targetAudioId) {
            return NextResponse.json(
              { error: 'Mission configuration error: missing target audio' },
              { status: 500 }
            )
          }
          break
      }
    }

    // Create UserTask and MissionVerificationJob in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create UserTask record
      const userTask = await tx.userTask.create({
        data: {
          userId: user.id,
          taskId: task.id,
          pointsEarned: task.points,
          diamondsEarned: task.diamonds,
          verificationStatus: 'PENDING',
        },
      })

      // Create MissionVerificationJob if this is a TikTok mission
      let verificationJob = null
      if (task.missionType && task.autoVerify) {
        const targetData = JSON.stringify({
          targetTikTokAccount: task.targetTikTokAccount,
          targetVideoUrl: task.targetVideoUrl,
          targetAudioId: task.targetAudioId,
        })

        verificationJob = await tx.missionVerificationJob.create({
          data: {
            userId: user.id,
            taskId: task.id,
            userTaskId: userTask.id,
            missionType: task.missionType,
            tiktokUsername: user.tiktokUsername || 'test-user',
            targetData,
            status: 'PENDING',
          },
        })
      }

      return { userTask, verificationJob }
    })

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Mission submitted successfully',
      submission: {
        id: result.userTask.id,
        taskId: task.id,
        taskTitle: task.title,
        status: result.userTask.verificationStatus,
        submittedAt: result.userTask.submittedAt,
        autoVerify: task.autoVerify,
        estimatedVerificationTime: task.autoVerify ? '5-15 minutes' : 'Manual review required',
      },
      verificationJob: result.verificationJob
        ? {
            id: result.verificationJob.id,
            status: result.verificationJob.status,
          }
        : null,
    })
  } catch (error: any) {
    console.error('Error submitting mission:', error)
    return NextResponse.json(
      {
        error: 'Failed to submit mission',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/missions/[missionId]/submit
 * 
 * Get submission status for a mission
 */
export async function GET(
  request: Request,
  { params }: { params: { missionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { missionId } = params

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Get user's submission for this mission
    const userTask = await db.userTask.findUnique({
      where: {
        userId_taskId: {
          userId: session.user.id,
          taskId: missionId,
        },
      },
      include: {
        task: {
          select: {
            title: true,
            diamonds: true,
            points: true,
          },
        },
        verificationJob: {
          select: {
            id: true,
            status: true,
            attempts: true,
            errorMessage: true,
            nextRetryAt: true,
          },
        },
      },
    })

    if (!userTask) {
      return NextResponse.json(
        { error: 'No submission found for this mission' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      submission: {
        id: userTask.id,
        taskId: userTask.taskId,
        taskTitle: userTask.task.title,
        status: userTask.verificationStatus,
        submittedAt: userTask.submittedAt,
        completedAt: userTask.completedAt,
        verified: userTask.verified,
        pointsEarned: userTask.pointsEarned,
        diamondsEarned: userTask.diamondsEarned,
      },
      verificationJob: userTask.verificationJob,
    })
  } catch (error: any) {
    console.error('Error getting submission status:', error)
    return NextResponse.json(
      {
        error: 'Failed to get submission status',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

