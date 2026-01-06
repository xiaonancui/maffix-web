import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasAdminAccess } from '@/lib/rbac'
import { Currency, TransactionType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin access
    if (!hasAdminAccess((session.user.role || 'USER') as 'USER' | 'ADMIN' | 'ARTIST')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { userTaskId, action, reason } = body

    if (!userTaskId || !action) {
      return NextResponse.json({ error: 'userTaskId and action are required' }, { status: 400 })
    }

    const { db } = await import('@/lib/db')

    // Fetch the user task with related data
    const userTask = await db.userTask.findUnique({
      where: { id: userTaskId },
      include: {
        user: true,
        task: true,
      },
    })

    if (!userTask) {
      return NextResponse.json({ error: 'Task submission not found' }, { status: 404 })
    }

    if (userTask.verificationStatus !== 'PENDING') {
      return NextResponse.json({ error: 'Task already processed' }, { status: 400 })
    }

    if (action === 'approve') {
      // Dynamic imports to avoid build-time database connection
      const { addCurrency } = await import('@/lib/transaction')
      const { grantMissionXp } = await import('@/lib/leveling')

      // Update user task as verified
      await db.userTask.update({
        where: { id: userTaskId },
        data: {
          verified: true,
          verifiedAt: new Date(),
          verifiedBy: session.user.id,
          verificationStatus: 'APPROVED',
          completedAt: new Date(),
        },
      })

      // Increment task completion count
      await db.task.update({
        where: { id: userTask.taskId },
        data: {
          completionCount: { increment: 1 },
        },
      })

      // Grant rewards using proper transaction system
      let levelUpInfo = null

      // Grant diamonds if applicable
      if (userTask.diamondsEarned > 0) {
        await addCurrency(
          userTask.user.id,
          userTask.diamondsEarned,
          Currency.DIAMONDS,
          TransactionType.MISSION_REWARD,
          userTask.taskId
        )
      }

      // Grant points if applicable
      if (userTask.pointsEarned > 0) {
        await addCurrency(
          userTask.user.id,
          userTask.pointsEarned,
          Currency.POINTS,
          TransactionType.MISSION_REWARD,
          userTask.taskId
        )
      }

      // Grant XP and trigger level-ups
      if (userTask.task.difficulty) {
        const xpResult = await grantMissionXp(
          userTask.user.id,
          userTask.task.difficulty,
          userTask.taskId
        )

        if (xpResult.leveledUp && xpResult.levelUpResult) {
          levelUpInfo = {
            previousLevel: xpResult.levelUpResult.previousLevel,
            newLevel: xpResult.levelUpResult.newLevel,
            levelsGained: xpResult.levelUpResult.levelsGained,
            diamondsAwarded: xpResult.levelUpResult.totalDiamondsAwarded,
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Task approved and rewards granted',
        levelUp: levelUpInfo,
      })
    } else if (action === 'reject') {
      // Update user task as rejected
      await db.userTask.update({
        where: { id: userTaskId },
        data: {
          verified: false,
          verifiedAt: new Date(),
          verifiedBy: session.user.id,
          verificationStatus: 'FAILED',
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Task rejected',
      })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
