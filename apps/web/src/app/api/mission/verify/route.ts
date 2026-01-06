import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { grantMissionXp } from '@/lib/leveling'
import { addCurrency } from '@/lib/transaction'
import { getStreakStatus, grantStreakBonus } from '@/lib/streak'

/**
 * POST /api/mission/verify
 *
 * Unified mission verification endpoint
 *
 * Handles both AUTO and MANUAL verification types:
 * - AUTO: Grants rewards immediately
 * - MANUAL: Creates PENDING UserTask for admin review
 *
 * Request body:
 * {
 *   "missionId": string,
 *   "evidence": string (optional)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { missionId, evidence } = body

    if (!missionId) {
      return NextResponse.json({ error: 'Mission ID is required' }, { status: 400 })
    }

    // Fetch mission details
    const mission = await db.task.findUnique({
      where: { id: missionId },
    })

    if (!mission || !mission.isActive) {
      return NextResponse.json({ error: 'Mission not found or inactive' }, { status: 404 })
    }

    // Check if user already submitted this task
    const existingSubmission = await db.userTask.findUnique({
      where: {
        userId_taskId: {
          userId: session.user.id,
          taskId: missionId,
        },
      },
    })

    if (existingSubmission) {
      // Check verification status
      if (existingSubmission.verificationStatus === 'APPROVED') {
        return NextResponse.json({ error: 'Mission already completed' }, { status: 400 })
      } else if (existingSubmission.verificationStatus === 'PENDING') {
        return NextResponse.json({ error: 'Mission already submitted for verification' }, { status: 400 })
      }
    }

    // Check if mission has max completions limit
    if (mission.maxCompletions && mission.completionCount >= mission.maxCompletions) {
      return NextResponse.json({ error: 'Mission has reached maximum completions' }, { status: 400 })
    }

    // Get user's current streak
    const streakStatus = await getStreakStatus(session.user.id)

    // AUTO VERIFICATION
    if (mission.autoVerify) {
      // Use transaction to ensure atomicity
      const result = await db.$transaction(async (tx) => {
        // Create completed user task
        const userTask = await tx.userTask.create({
          data: {
            userId: session.user.id,
            taskId: missionId,
            submittedAt: new Date(),
            completedAt: new Date(),
            pointsEarned: mission.points,
            diamondsEarned: mission.diamonds,
            verified: true,
            verifiedAt: new Date(),
            verificationStatus: 'APPROVED',
          },
        })

        // Grant diamonds (with streak bonus)
        let totalDiamonds = mission.diamonds
        if (streakStatus.isActive && streakStatus.currentStreak > 0) {
          totalDiamonds = await grantStreakBonus(
            session.user.id,
            streakStatus.currentStreak,
            mission.diamonds
          )
        } else {
          // Grant base diamonds
          await addCurrency(
            session.user.id,
            mission.diamonds,
            'DIAMONDS',
            'MISSION_REWARD',
            `mission_${missionId}_${Date.now()}`
          )
        }

        // Grant points if any
        if (mission.points > 0) {
          await addCurrency(
            session.user.id,
            mission.points,
            'POINTS',
            'MISSION_REWARD',
            `mission_points_${missionId}_${Date.now()}`
          )
        }

        // Grant XP and check for level-up
        const xpResult = await grantMissionXp(session.user.id, mission.difficulty, missionId)

        // Update mission completion count
        await tx.task.update({
          where: { id: missionId },
          data: {
            completionCount: {
              increment: 1,
            },
          },
        })

        return {
          userTask,
          xpResult,
          totalDiamonds,
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Mission completed successfully!',
        rewards: {
          diamonds: result.totalDiamonds,
          points: mission.points,
          xp: result.xpResult.xpGranted,
        },
        levelUp: result.xpResult.leveledUp
          ? {
              newLevel: result.xpResult.newLevel,
              levelsGained: result.xpResult.newLevel - result.xpResult.previousLevel,
              bonusDiamonds: result.xpResult.levelUpResult?.totalDiamondsAwarded || 0,
            }
          : null,
        streak: streakStatus.isActive
          ? {
              currentStreak: streakStatus.currentStreak,
              nextRewardLevel: streakStatus.nextRewardLevel,
            }
          : null,
      })
    }

    // MANUAL VERIFICATION
    else {
      // Create pending user task
      const userTask = await db.userTask.create({
        data: {
          userId: session.user.id,
          taskId: missionId,
          submittedAt: new Date(),
          pointsEarned: mission.points,
          diamondsEarned: mission.diamonds,
          verified: false,
          verificationStatus: 'PENDING',
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Mission submitted for verification. Please upload a screenshot to complete.',
        userTaskId: userTask.id,
        requiresScreenshot: true,
        pendingRewards: {
          diamonds: mission.diamonds,
          points: mission.points,
          xp: 'TBD', // Will be calculated on approval
        },
      })
    }
  } catch (error) {
    console.error('Mission verify error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
