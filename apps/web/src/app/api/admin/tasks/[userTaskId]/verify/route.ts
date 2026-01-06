import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { z } from 'zod'
import { Currency, TransactionType } from '@prisma/client'

const verifySchema = z.object({
  approved: z.boolean(),
  notes: z.string().optional(),
})

export async function POST(
  request: Request,
  { params }: { params: { userTaskId: string } }
) {
  try {
    // Check if we're in build time - return early if so
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth
    const { session } = auth

    const body = await request.json()
    const { approved } = verifySchema.parse(body)

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Get user task with related data
    const userTask = await db.userTask.findUnique({
      where: { id: params.userTaskId },
      include: {
        user: true,
        task: true,
      },
    })

    if (!userTask) {
      return NextResponse.json({ error: 'Task completion not found' }, { status: 404 })
    }

    if (userTask.verified) {
      return NextResponse.json(
        { error: 'Task already verified' },
        { status: 400 }
      )
    }

    if (approved) {
      // Dynamic imports to avoid build-time database connection
      const { addCurrency } = await import('@/lib/transaction')
      const { grantMissionXp } = await import('@/lib/leveling')

      // Update user task as verified (within transaction)
      await db.userTask.update({
        where: { id: params.userTaskId },
        data: {
          verified: true,
          verifiedAt: new Date(),
          verifiedBy: session.user.id,
          completedAt: new Date(),
          verificationStatus: 'APPROVED',
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
          userTask.userId,
          userTask.diamondsEarned,
          Currency.DIAMONDS,
          TransactionType.MISSION_REWARD,
          userTask.taskId
        )
      }

      // Grant points if applicable
      if (userTask.pointsEarned > 0) {
        await addCurrency(
          userTask.userId,
          userTask.pointsEarned,
          Currency.POINTS,
          TransactionType.MISSION_REWARD,
          userTask.taskId
        )
      }

      // Grant XP and trigger level-ups
      if (userTask.task.difficulty) {
        const xpResult = await grantMissionXp(
          userTask.userId,
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
        message: 'Task approved and rewards granted',
        rewards: {
          diamonds: userTask.diamondsEarned,
          points: userTask.pointsEarned,
        },
        levelUp: levelUpInfo,
      })
    } else {
      // Reject - delete the user task record
      await db.userTask.delete({
        where: { id: params.userTaskId },
      })

      // Decrement task completion count
      await db.task.update({
        where: { id: userTask.taskId },
        data: {
          completionCount: {
            decrement: 1,
          },
        },
      })

      return NextResponse.json({
        message: 'Task rejected',
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Task verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

