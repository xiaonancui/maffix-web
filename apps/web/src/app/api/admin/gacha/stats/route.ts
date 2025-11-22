import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import {
  successResponse,
  errorResponse,
  handleDatabaseError,
  HttpStatus,
} from '@/lib/api-helpers'
import { db } from '@/lib/db'

/**
 * GET /api/admin/gacha/stats
 * Get gacha system statistics
 */
export async function GET() {
  try {
    // Require admin authentication
    const authResult = await requireAdmin()
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Get total pulls count
    const totalPulls = await db.gachaPull.count()

    // Get pulls by type
    const pullsByType = await db.gachaPull.groupBy({
      by: ['pullType'],
      _count: true,
    })

    // Get total revenue (diamonds spent)
    const revenueResult = await db.gachaPull.aggregate({
      _sum: {
        cost: true,
      },
    })
    const totalRevenue = revenueResult._sum.cost || 0

    // Get prize distribution by rarity
    const prizeDistribution = await db.gachaPull.findMany({
      where: {
        prizeId: { not: null },
      },
      include: {
        prize: {
          select: {
            rarity: true,
          },
        },
      },
    })

    const rarityCount: Record<string, number> = {}
    prizeDistribution.forEach((pull) => {
      if (pull.prize) {
        const rarity = pull.prize.rarity
        rarityCount[rarity] = (rarityCount[rarity] || 0) + 1
      }
    })

    // Calculate SSR rate
    const ssrPulls = (rarityCount['SSR'] || 0) + (rarityCount['LEGENDARY'] || 0)
    const ssrRate = totalPulls > 0 ? (ssrPulls / totalPulls) * 100 : 0

    // Get guaranteed SSR count
    const guaranteedSSRCount = await db.gachaPull.count({
      where: {
        wasGuaranteed: true,
      },
    })

    // Get recent pulls (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const recentPulls = await db.gachaPull.count({
      where: {
        pulledAt: {
          gte: oneDayAgo,
        },
      },
    })

    // Get active gacha items count
    const activeItemsCount = await db.gachaItem.count({
      where: {
        isActive: true,
      },
    })

    // Get total unique users who pulled
    const uniqueUsers = await db.gachaPull.groupBy({
      by: ['userId'],
      _count: true,
    })

    // Get top prizes by pull count
    const topPrizes = await db.gachaPull.groupBy({
      by: ['prizeId'],
      _count: true,
      orderBy: {
        _count: {
          prizeId: 'desc',
        },
      },
      take: 5,
      where: {
        prizeId: { not: null },
      },
    })

    // Fetch prize details for top prizes
    const topPrizeDetails = await Promise.all(
      topPrizes.map(async (item) => {
        if (!item.prizeId) return null
        const prize = await db.prize.findUnique({
          where: { id: item.prizeId },
          select: {
            id: true,
            name: true,
            rarity: true,
            image: true,
          },
        })
        return {
          ...prize,
          pullCount: item._count,
        }
      })
    )

    return NextResponse.json(
      successResponse({
        totalPulls,
        pullsByType: pullsByType.map((item) => ({
          type: item.pullType,
          count: item._count,
        })),
        totalRevenue,
        prizeDistribution: Object.entries(rarityCount).map(([rarity, count]) => ({
          rarity,
          count,
          percentage: totalPulls > 0 ? (count / totalPulls) * 100 : 0,
        })),
        ssrRate: parseFloat(ssrRate.toFixed(2)),
        guaranteedSSRCount,
        recentPulls24h: recentPulls,
        activeItemsCount,
        uniqueUsersCount: uniqueUsers.length,
        topPrizes: topPrizeDetails.filter(Boolean),
      })
    )
  } catch (error) {
    console.error('Error fetching gacha stats:', error)
    return NextResponse.json(
      errorResponse('Failed to fetch gacha statistics', HttpStatus.INTERNAL_SERVER_ERROR),
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    )
  }
}

