import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

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

    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

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
      // Approve and award rewards
      await db.$transaction([
        // Update user task as verified
        db.userTask.update({
          where: { id: params.userTaskId },
          data: {
            verified: true,
            verifiedAt: new Date(),
            verifiedBy: session.user.id,
          },
        }),
        // Update user balance
        db.user.update({
          where: { id: userTask.userId },
          data: {
            diamondBalance: {
              increment: userTask.diamondsEarned,
            },
            points: {
              increment: userTask.pointsEarned,
            },
          },
        }),
        // Create transaction record for diamonds
        db.transaction.create({
          data: {
            userId: userTask.userId,
            type: 'EARN',
            amount: userTask.diamondsEarned,
            currency: 'DIAMONDS',
            description: `Earned from completing task: ${userTask.task.title}`,
            reference: userTask.taskId,
            status: 'COMPLETED',
          },
        }),
        // Create transaction record for points
        db.transaction.create({
          data: {
            userId: userTask.userId,
            type: 'EARN',
            amount: userTask.pointsEarned,
            currency: 'POINTS',
            description: `Earned from completing task: ${userTask.task.title}`,
            reference: userTask.taskId,
            status: 'COMPLETED',
          },
        }),
      ])

      return NextResponse.json({
        message: 'Task approved and rewards granted',
        rewards: {
          diamonds: userTask.diamondsEarned,
          points: userTask.pointsEarned,
        },
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

