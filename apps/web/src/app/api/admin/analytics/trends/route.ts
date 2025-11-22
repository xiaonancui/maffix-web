import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'

/**
 * GET /api/admin/analytics/trends
 * Get time-series analytics data for charts (admin only)
 */
export async function GET(request: Request) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Calculate date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get daily user registrations
    const userRegistrations = await db.user.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Get daily task completions
    const taskCompletions = await db.userTask.findMany({
      where: {
        submittedAt: { gte: startDate },
      },
      select: {
        submittedAt: true,
      },
      orderBy: {
        submittedAt: 'asc',
      },
    })

    // Get daily gacha pulls
    const gachaPulls = await db.gachaPull.findMany({
      where: {
        pulledAt: { gte: startDate },
      },
      select: {
        pulledAt: true,
        cost: true,
      },
      orderBy: {
        pulledAt: 'asc',
      },
    })

    // Get daily purchases
    const purchases = await db.purchase.findMany({
      where: {
        createdAt: { gte: startDate },
        status: 'COMPLETED',
      },
      select: {
        createdAt: true,
        amount: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Get daily orders
    const orders = await db.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Helper function to group data by date
    const groupByDate = (data: any[], dateField: string, valueField?: string) => {
      const grouped: Record<string, any> = {}

      data.forEach((item) => {
        const date = new Date(item[dateField]).toISOString().split('T')[0]
        if (!grouped[date]) {
          grouped[date] = valueField ? 0 : 0
        }
        if (valueField) {
          grouped[date] += item[valueField] || 0
        } else {
          grouped[date] += 1
        }
      })

      return Object.entries(grouped)
        .map(([date, value]) => ({ date, value }))
        .sort((a, b) => a.date.localeCompare(b.date))
    }

    return NextResponse.json({
      success: true,
      period: {
        days,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
      },
      trends: {
        userRegistrations: groupByDate(userRegistrations, 'createdAt'),
        taskCompletions: groupByDate(taskCompletions, 'submittedAt'),
        gachaPulls: {
          count: groupByDate(gachaPulls, 'pulledAt'),
          revenue: groupByDate(gachaPulls, 'pulledAt', 'cost'),
        },
        purchases: {
          count: groupByDate(purchases, 'createdAt'),
          revenue: groupByDate(purchases, 'createdAt', 'amount'),
        },
        orders: {
          count: groupByDate(orders, 'createdAt'),
          revenue: groupByDate(orders, 'createdAt', 'totalAmount'),
        },
      },
    })
  } catch (error) {
    console.error('Get analytics trends error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

