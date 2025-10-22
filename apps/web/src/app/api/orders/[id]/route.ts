import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * GET /api/orders/[id]
 * Get order details
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    const order = await db.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            merchandise: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                category: true,
              },
            },
            variant: {
              select: {
                id: true,
                size: true,
                color: true,
                sku: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Verify ownership (unless admin)
    if (order.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error: any) {
    console.error('Error getting order:', error)
    return NextResponse.json(
      {
        error: 'Failed to get order',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

