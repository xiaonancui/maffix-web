import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'

/**
 * GET /api/admin/analytics/overview
 * Get comprehensive platform analytics overview (admin only)
 */
export async function GET(request: Request) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    // Calculate date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Use mock data (database not connected)
    const totalUsers = 1247
    const newUsers = 89
    const activeUsers = 456
    const usersByRole = [
      { role: 'USER', _count: 1200 },
      { role: 'ARTIST', _count: 42 },
      { role: 'ADMIN', _count: 5 },
    ]
    const tiktokLinkedUsers = 892

    const totalTasks = 45
    const completedTasks = 3245
    const recentCompletedTasks = 234
    const totalPrizes = 156
    const prizesAwarded = 1823

    const totalGachaPulls = 3892
    const recentGachaPulls = 234
    const gachaRevenue = 254300
    const recentGachaRevenue = 18900

    const totalPurchases = 779
    const recentPurchases = 56
    const totalRevenue = 23456.78
    const recentRevenue = 1789.45

    const totalOrders = 234
    const recentOrders = 18
    const orderRevenue = 8934.56
    const recentOrderRevenue = 678.90

    return NextResponse.json({
      success: true,
      period: {
        days,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
      },
      users: {
        total: totalUsers,
        new: newUsers,
        active: activeUsers,
        byRole: usersByRole.map((r) => ({ role: r.role, count: r._count })),
        tiktokLinked: tiktokLinkedUsers,
      },
      engagement: {
        totalTasks,
        completedTasks,
        recentCompletedTasks,
        totalPrizes,
        prizesAwarded,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      },
      gacha: {
        totalPulls: totalGachaPulls,
        recentPulls: recentGachaPulls,
        totalRevenue: gachaRevenue,
        recentRevenue: recentGachaRevenue,
      },
      revenue: {
        packs: {
          total: totalPurchases,
          recent: recentPurchases,
          totalRevenue: totalRevenue,
          recentRevenue: recentRevenue,
        },
        merchandise: {
          total: totalOrders,
          recent: recentOrders,
          totalRevenue: orderRevenue,
          recentRevenue: recentOrderRevenue,
        },
        combined: {
          totalRevenue: totalRevenue + orderRevenue,
          recentRevenue: recentRevenue + recentOrderRevenue,
        },
      },
    })
  } catch (error) {
    console.error('Get analytics overview error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

