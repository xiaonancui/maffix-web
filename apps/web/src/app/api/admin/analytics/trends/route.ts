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

    // Calculate date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Use mock data (database not connected)
    // Generate mock trend data for the requested period
    const generateTrendData = (baseValue: number, variance: number) => {
      const data = []
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)
        const dateStr = date.toISOString().split('T')[0]
        const value = Math.max(0, baseValue + Math.floor(Math.random() * variance * 2 - variance))
        data.push({ date: dateStr, value })
      }
      return data
    }

    return NextResponse.json({
      success: true,
      period: {
        days,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
      },
      trends: {
        userRegistrations: generateTrendData(3, 2),
        taskCompletions: generateTrendData(8, 4),
        gachaPulls: {
          count: generateTrendData(12, 6),
          revenue: generateTrendData(800, 400),
        },
        purchases: {
          count: generateTrendData(2, 1),
          revenue: generateTrendData(60, 30),
        },
        orders: {
          count: generateTrendData(1, 1),
          revenue: generateTrendData(35, 20),
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

