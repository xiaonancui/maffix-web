import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { resetInactiveStreaks } from '@/lib/streak'

/**
 * POST /api/cron/daily-reset
 *
 * Daily reset cron job (runs at 00:00 UTC)
 *
 * This endpoint handles:
 * 1. Reset all DAILY type missions (UserTask records)
 * 2. Check and reset inactive login streaks
 *
 * Security: Verify the request is from Vercel Cron using the Authorization header
 *
 * Vercel Cron configuration (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/daily-reset",
 *     "schedule": "0 0 * * *"
 *   }]
 * }
 */
export async function POST(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const headersList = headers()
    const authHeader = headersList.get('authorization')

    // In production, verify the cron secret
    if (process.env.NODE_ENV === 'production') {
      const cronSecret = process.env.CRON_SECRET

      if (!cronSecret) {
        console.error('[DailyReset] CRON_SECRET not configured')
        return NextResponse.json({ error: 'Cron secret not configured' }, { status: 500 })
      }

      if (authHeader !== `Bearer ${cronSecret}`) {
        console.error('[DailyReset] Invalid cron secret')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    console.log('[DailyReset] Starting daily reset job...')

    const resetStats = {
      dailyMissionsReset: 0,
      streaksReset: 0,
      errors: [] as string[],
    }

    // 1. Reset all daily missions
    try {
      console.log('[DailyReset] Resetting daily missions...')

      // Delete all UserTask records for DAILY type missions that were completed yesterday or earlier
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(23, 59, 59, 999) // End of yesterday

      // Find all daily missions
      const dailyMissions = await db.task.findMany({
        where: {
          recurrence: 'DAILY',
          isActive: true,
        },
        select: {
          id: true,
        },
      })

      const dailyMissionIds = dailyMissions.map((m) => m.id)

      if (dailyMissionIds.length > 0) {
        // Delete completed daily mission records from yesterday or earlier
        const deleteResult = await db.userTask.deleteMany({
          where: {
            taskId: {
              in: dailyMissionIds,
            },
            completedAt: {
              lte: yesterday,
            },
          },
        })

        resetStats.dailyMissionsReset = deleteResult.count
        console.log(`[DailyReset] Reset ${deleteResult.count} daily mission completions`)
      } else {
        console.log('[DailyReset] No daily missions found')
      }
    } catch (error) {
      const errorMsg = `Error resetting daily missions: ${error instanceof Error ? error.message : 'Unknown error'}`
      console.error('[DailyReset]', errorMsg)
      resetStats.errors.push(errorMsg)
    }

    // 2. Reset inactive streaks
    try {
      console.log('[DailyReset] Resetting inactive streaks...')

      const streaksReset = await resetInactiveStreaks()
      resetStats.streaksReset = streaksReset

      console.log(`[DailyReset] Reset ${streaksReset} inactive streaks`)
    } catch (error) {
      const errorMsg = `Error resetting streaks: ${error instanceof Error ? error.message : 'Unknown error'}`
      console.error('[DailyReset]', errorMsg)
      resetStats.errors.push(errorMsg)
    }

    console.log('[DailyReset] Daily reset job completed', resetStats)

    return NextResponse.json({
      success: true,
      message: 'Daily reset completed',
      stats: resetStats,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('[DailyReset] Fatal error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/cron/daily-reset
 *
 * Get daily reset statistics (for monitoring/debugging)
 * This endpoint is not protected - add auth if exposing publicly
 */
export async function GET(request: Request) {
  try {
    // Get counts for monitoring
    const [dailyMissions, totalUsers, activeStreaks] = await Promise.all([
      db.task.count({
        where: {
          recurrence: 'DAILY',
          isActive: true,
        },
      }),
      db.user.count(),
      db.user.count({
        where: {
          streakCount: {
            gt: 0,
          },
        },
      }),
    ])

    // Get recent completions for daily missions
    const recentCompletions = await db.userTask.count({
      where: {
        completedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
        task: {
          recurrence: 'DAILY',
        },
      },
    })

    return NextResponse.json({
      success: true,
      statistics: {
        dailyMissions,
        totalUsers,
        activeStreaks,
        recentCompletions,
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error('[DailyReset] Error getting statistics:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}
