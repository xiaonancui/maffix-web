import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import {
  successResponse,
  errorResponse,
  handleDatabaseError,
  HttpStatus,
} from '@/lib/api-helpers'

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

    // Use mock data (database not connected)
    const totalPulls = 3892
    const pullsByType = [
      { type: 'SINGLE', count: 2543 },
      { type: 'MULTI_10X', count: 1349 },
    ]
    const totalRevenue = 254300 // diamonds spent
    const rarityCount = {
      LEGENDARY: 42,
      SSR: 156,
      EPIC: 623,
      RARE: 1245,
      COMMON: 1826,
    }
    const ssrPulls = rarityCount.LEGENDARY + rarityCount.SSR
    const ssrRate = (ssrPulls / totalPulls) * 100
    const guaranteedSSRCount = 89
    const recentPulls = 234
    const activeItemsCount = 25
    const uniqueUsersCount = 847

    const topPrizeDetails = [
      {
        id: 'prize-6',
        name: 'Fan Club Sticker Pack',
        rarity: 'COMMON',
        image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
        pullCount: 245,
      },
      {
        id: 'prize-5',
        name: 'Digital Album Bundle',
        rarity: 'RARE',
        image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=400',
        pullCount: 178,
      },
      {
        id: 'prize-4',
        name: 'Premium Hoodie',
        rarity: 'EPIC',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
        pullCount: 132,
      },
      {
        id: 'prize-2',
        name: 'Limited Edition Signed Vinyl',
        rarity: 'SSR',
        image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400',
        pullCount: 58,
      },
      {
        id: 'prize-1',
        name: 'VIP Concert Backstage Pass',
        rarity: 'LEGENDARY',
        image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400',
        pullCount: 23,
      },
    ]

    return NextResponse.json(
      successResponse({
        totalPulls,
        pullsByType,
        totalRevenue,
        prizeDistribution: Object.entries(rarityCount).map(([rarity, count]) => ({
          rarity,
          count,
          percentage: (count / totalPulls) * 100,
        })),
        ssrRate: parseFloat(ssrRate.toFixed(2)),
        guaranteedSSRCount,
        recentPulls24h: recentPulls,
        activeItemsCount,
        uniqueUsersCount,
        topPrizes: topPrizeDetails,
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

