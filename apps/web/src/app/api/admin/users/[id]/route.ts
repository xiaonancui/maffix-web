import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { z } from 'zod'

// Validation schema for updating a user
const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(['USER', 'ADMIN', 'ARTIST']).optional(),
  diamonds: z.number().int().min(0).optional(),
  points: z.number().int().min(0).optional(),
  level: z.number().int().min(1).optional(),
})

/**
 * GET /api/admin/users/[id]
 * Get a single user with detailed information (admin only)
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    const user = await db.user.findUnique({
      where: { id: params.id },
      include: {
        completedTasks: {
          include: {
            task: {
              select: {
                id: true,
                title: true,
                type: true,
                difficulty: true,
                points: true,
                diamonds: true,
              },
            },
          },
          orderBy: {
            submittedAt: 'desc',
          },
          take: 20,
        },
        prizes: {
          include: {
            prize: {
              select: {
                id: true,
                name: true,
                rarity: true,
                type: true,
                image: true,
                value: true,
              },
            },
          },
          orderBy: {
            acquiredAt: 'desc',
          },
          take: 20,
        },
        gachaPulls: {
          include: {
            prize: {
              select: {
                id: true,
                name: true,
                rarity: true,
                image: true,
              },
            },
          },
          orderBy: {
            pulledAt: 'desc',
          },
          take: 20,
        },
        purchases: {
          include: {
            pack: {
              select: {
                id: true,
                name: true,
                price: true,
                currency: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 20,
        },
        transactions: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 20,
        },
        orders: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        _count: {
          select: {
            completedTasks: true,
            prizes: true,
            gachaPulls: true,
            purchases: true,
            transactions: true,
            orders: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/users/[id]
 * Update a user (admin only)
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    const body = await request.json()

    // Validate request body
    const validationResult = updateUserSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: params.id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update the user
    const updatedUser = await db.user.update({
      where: { id: params.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.role && { role: data.role }),
        ...(data.diamonds !== undefined && { diamonds: data.diamonds }),
        ...(data.points !== undefined && { points: data.points }),
        ...(data.level !== undefined && { level: data.level }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        diamonds: true,
        points: true,
        level: true,
      },
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'User updated successfully',
    })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

