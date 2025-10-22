import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * GET /api/gacha/tickets
 * Get user's available draw tickets
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if this is a test account - return mock data
    const allowTestAccounts =
      process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_ACCOUNTS === 'true'

    const isTestAccount =
      allowTestAccounts &&
      (session.user.id?.includes('test-') ||
        session.user.id?.includes('demo-') ||
        session.user.id?.includes('admin-'))

    if (isTestAccount) {
      // Return mock tickets for test accounts
      return NextResponse.json({
        success: true,
        tickets: {
          single: {
            count: 2,
            tickets: [
              {
                id: 'ticket-single-1',
                source: 'WELCOME_BONUS',
                createdAt: new Date(),
                expiresAt: null,
              },
              {
                id: 'ticket-single-2',
                source: 'DAILY_LOGIN',
                createdAt: new Date(),
                expiresAt: null,
              },
            ],
          },
          multi10x: {
            count: 1,
            tickets: [
              {
                id: 'ticket-10x-1',
                source: 'PREMIUM_PACK',
                createdAt: new Date(),
                expiresAt: null,
              },
            ],
          },
        },
        totalCount: 3,
      })
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

