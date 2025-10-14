import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const submitSchema = z.object({
  proof: z.string().optional(), // URL or text proof of completion
  notes: z.string().optional(),
})

export async function POST(
  request: Request,
  { params }: { params: { taskId: string } }
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

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = submitSchema.parse(body)

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Check if task exists and is active
    const task = await db.task.findUnique({
      where: { id: params.taskId },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    if (!task.isActive) {
      return NextResponse.json({ error: 'Task is not active' }, { status: 400 })
    }

    // Check if user has already completed this task
    const existingCompletion = await db.userTask.findUnique({
      where: {
        userId_taskId: {
          userId: session.user.id,
          taskId: params.taskId,
        },
      },
    })

    if (existingCompletion) {
      return NextResponse.json(
        { error: 'Task already completed' },
        { status: 400 }
      )
    }

    // Check if task has reached max completions
    if (task.maxCompletions && task.completionCount >= task.maxCompletions) {
      return NextResponse.json(
        { error: 'Task has reached maximum completions' },
        { status: 400 }
      )
    }

    // Create task completion record (pending verification)
    const userTask = await db.userTask.create({
      data: {
        userId: session.user.id,
        taskId: params.taskId,
        pointsEarned: task.points,
        diamondsEarned: task.diamonds,
        verified: false, // Requires admin verification
      },
    })

    // Increment task completion count
    await db.task.update({
      where: { id: params.taskId },
      data: {
        completionCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json(
      {
        message: 'Task submitted successfully. Awaiting verification.',
        userTask: {
          id: userTask.id,
          verified: userTask.verified,
          completedAt: userTask.completedAt,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Task submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

