import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * GET /api/admin/missions/[id]/submissions
 * Get all submissions for a specific mission
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Check if mission exists
    const mission = await db.task.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
      },
    })

    if (!mission) {
      return NextResponse.json(
        { error: 'Mission not found' },
        { status: 404 }
      )
    }

    // Build where clause
    const where: any = { taskId: id }
    if (status) {
      where.verificationStatus = status
    }

    // Get submissions
    const [submissions, total] = await Promise.all([
      db.userTask.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              tiktokUsername: true,
            },
          },
          verificationJob: {
            select: {
              id: true,
              status: true,
              attempts: true,
              verificationResult: true,
              errorMessage: true,
              createdAt: true,
              completedAt: true,
            },
          },
        },
        orderBy: {
          submittedAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.userTask.count({ where }),
    ])

    // Get statistics
    const stats = await db.userTask.groupBy({
      by: ['verificationStatus'],
      where: { taskId: id },
      _count: true,
    })

    const statistics = {
      total: total,
      pending: stats.find((s) => s.verificationStatus === 'PENDING')?._count || 0,
      approved: stats.find((s) => s.verificationStatus === 'APPROVED')?._count || 0,
      failed: stats.find((s) => s.verificationStatus === 'FAILED')?._count || 0,
    }

    return NextResponse.json({
      success: true,
      mission: {
        id: mission.id,
        title: mission.title,
      },
      submissions,
      statistics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error getting mission submissions:', error)
    return NextResponse.json(
      {
        error: 'Failed to get mission submissions',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

