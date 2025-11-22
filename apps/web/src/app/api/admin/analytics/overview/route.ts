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

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Calculate date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // User Metrics
    const [
      totalUsers,
      newUsers,
      activeUsers,
      usersByRole,
      tiktokLinkedUsers,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),
      db.user.count({
        where: {
          lastLoginAt: { gte: startDate },
        },
      }),
      db.user.groupBy({
        by: ['role'],
        _count: true,
      }),
      db.user.count({
        where: {
          tiktokUsername: { not: null },
        },
      }),
    ])

    // Engagement Metrics
    const [
      totalTasks,
      completedTasks,
      recentCompletedTasks,
      totalPrizes,
      prizesAwarded,
    ] = await Promise.all([
      db.task.count(),
      db.userTask.count(),
      db.userTask.count({
        where: {
          submittedAt: { gte: startDate },
        },
      }),
      db.prize.count(),
      db.userPrize.count(),
    ])

    // Gacha Metrics
    const [
      totalGachaPulls,
      recentGachaPulls,
      gachaRevenue,
      recentGachaRevenue,
    ] = await Promise.all([
      db.gachaPull.count(),
      db.gachaPull.count({
        where: {
          pulledAt: { gte: startDate },
        },
      }),
      db.gachaPull.aggregate({
        _sum: { cost: true },
      }),
      db.gachaPull.aggregate({
        where: {
          pulledAt: { gte: startDate },
        },
        _sum: { cost: true },
      }),
    ])

    // Revenue Metrics
    const [
      totalPurchases,
      recentPurchases,
      totalRevenue,
      recentRevenue,
      totalOrders,
      recentOrders,
      orderRevenue,
      recentOrderRevenue,
    ] = await Promise.all([
      db.purchase.count(),
      db.purchase.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),
      db.purchase.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      db.purchase.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: startDate },
        },
        _sum: { amount: true },
      }),
      db.order.count(),
      db.order.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),
      db.order.aggregate({
        where: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
        _sum: { totalAmount: true },
      }),
      db.order.aggregate({
        where: {
          status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
          createdAt: { gte: startDate },
        },
        _sum: { totalAmount: true },
      }),
    ])

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
        totalRevenue: gachaRevenue._sum.cost || 0,
        recentRevenue: recentGachaRevenue._sum.cost || 0,
      },
      revenue: {
        packs: {
          total: totalPurchases,
          recent: recentPurchases,
          totalRevenue: totalRevenue._sum.amount || 0,
          recentRevenue: recentRevenue._sum.amount || 0,
        },
        merchandise: {
          total: totalOrders,
          recent: recentOrders,
          totalRevenue: orderRevenue._sum.totalAmount || 0,
          recentRevenue: recentOrderRevenue._sum.totalAmount || 0,
        },
        combined: {
          totalRevenue: (totalRevenue._sum.amount || 0) + (orderRevenue._sum.totalAmount || 0),
          recentRevenue: (recentRevenue._sum.amount || 0) + (recentOrderRevenue._sum.totalAmount || 0),
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

