import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasAdminAccess } from '@/lib/rbac'

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
      // Update user task as verified
      await db.userTask.update({
        where: { id: userTaskId },
        data: {
          verified: true,
          verifiedAt: new Date(),
          verifiedBy: session.user.id,
          verificationStatus: 'APPROVED',
        },
      })

      // Update user balance
      await db.user.update({
        where: { id: userTask.user.id },
        data: {
          diamonds: { increment: userTask.diamondsEarned },
          points: { increment: userTask.pointsEarned },
        },
      })

      // Create transaction record for diamonds
      if (userTask.diamondsEarned > 0) {
        await db.transaction.create({
          data: {
            userId: userTask.user.id,
            type: 'EARN',
            amount: userTask.diamondsEarned,
            currency: 'DIAMONDS',
            description: `Mission: ${userTask.task.title}`,
            status: 'COMPLETED',
            reference: userTask.taskId,
          },
        })
      }

      // Create transaction record for points
      if (userTask.pointsEarned > 0) {
        await db.transaction.create({
          data: {
            userId: userTask.user.id,
            type: 'EARN',
            amount: userTask.pointsEarned,
            currency: 'POINTS',
            description: `Mission: ${userTask.task.title}`,
            status: 'COMPLETED',
            reference: userTask.taskId,
          },
        })
      }

      return NextResponse.json({
        success: true,
        message: 'Task approved and rewards granted',
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
