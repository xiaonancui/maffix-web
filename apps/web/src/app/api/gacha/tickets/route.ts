import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * GET /api/gacha/tickets
 * Get user's available draw tickets
 */
export async function GET() {
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

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Get all available tickets for the user
    const tickets = await db.drawTicket.findMany({
      where: {
        userId: session.user.id,
        used: false,
        OR: [
          { expiresAt: null }, // Never expires
          { expiresAt: { gt: new Date() } }, // Not expired yet
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Count tickets by type
    const singleTickets = tickets.filter((t) => t.ticketType === 'SINGLE')
    const multi10xTickets = tickets.filter((t) => t.ticketType === 'MULTI_10X')

    return NextResponse.json({
      success: true,
      tickets: {
        single: {
          count: singleTickets.length,
          tickets: singleTickets.map((t) => ({
            id: t.id,
            source: t.source,
            createdAt: t.createdAt,
            expiresAt: t.expiresAt,
          })),
        },
        multi10x: {
          count: multi10xTickets.length,
          tickets: multi10xTickets.map((t) => ({
            id: t.id,
            source: t.source,
            createdAt: t.createdAt,
            expiresAt: t.expiresAt,
          })),
        },
      },
      totalCount: tickets.length,
    })
  } catch (error) {
    console.error('Get tickets error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

