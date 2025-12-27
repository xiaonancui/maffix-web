import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { missionId, screenshotUrl } = body

    if (!missionId || !screenshotUrl) {
      return NextResponse.json({ error: 'Mission ID and screenshot URL are required' }, { status: 400 })
    }

    const { db } = await import('@/lib/db')

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
      return NextResponse.json({ error: 'Task already submitted' }, { status: 400 })
    }

    // Create user task record with PENDING status
    const userTask = await db.userTask.create({
      data: {
        userId: session.user.id,
        taskId: missionId,
        submittedAt: new Date(),
        pointsEarned: mission.points,
        diamondsEarned: mission.diamonds,
        verificationStatus: 'PENDING',
        verified: false,
      },
    })

    // Note: screenshotUrl removed as it doesn't exist in UserTask schema
    // Screenshot handling needs to be implemented separately if needed

    // Note: Rewards will be granted after admin approval
    // This is a manual verification system

    return NextResponse.json({
      success: true,
      userTask,
      message: 'Task submitted for review. You will receive rewards once verified.',
    })
  } catch (error) {
    console.error('Mission submit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
