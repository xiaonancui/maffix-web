import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { processPendingJobs, getJobStatistics } from '@/lib/mission-worker'

/**
 * POST /api/cron/process-missions
 * 
 * Cron job endpoint to process pending mission verification jobs
 * 
 * This endpoint should be called by Vercel Cron Jobs every 5-10 minutes
 * to process pending verification jobs.
 * 
 * Security: Verify the request is from Vercel Cron using the Authorization header
 * 
 * Vercel Cron configuration (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/process-missions",
 *     "schedule": "*\/5 * * * *"
 *   }]
 * }
 */
export async function POST(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const headersList = headers()
    const authHeader = headersList.get('authorization')
    
    // In production, verify the cron secret
    // For development, allow requests without auth
    if (process.env.NODE_ENV === 'production') {
      const cronSecret = process.env.CRON_SECRET
      
      if (!cronSecret) {
        console.error('CRON_SECRET not configured')
        return NextResponse.json(
          { error: 'Cron secret not configured' },
          { status: 500 }
        )
      }
      
      if (authHeader !== `Bearer ${cronSecret}`) {
        console.error('Invalid cron secret')
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    console.log('[Cron] Starting mission verification job processing...')

    // Get statistics before processing
    const statsBefore = await getJobStatistics()
    console.log('[Cron] Job statistics before:', statsBefore)

    // Process pending jobs (limit to 20 per run to avoid timeout)
    await processPendingJobs(20)

    // Get statistics after processing
    const statsAfter = await getJobStatistics()
    console.log('[Cron] Job statistics after:', statsAfter)

    return NextResponse.json({
      success: true,
      message: 'Mission verification jobs processed',
      before: statsBefore,
      after: statsAfter,
      processed: statsBefore.pending - statsAfter.pending,
    })
  } catch (error: any) {
    console.error('[Cron] Error processing mission verification jobs:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/cron/process-missions
 * 
 * Get job statistics (for monitoring)
 */
export async function GET(request: Request) {
  try {
    const stats = await getJobStatistics()
    
    return NextResponse.json({
      success: true,
      statistics: stats,
    })
  } catch (error: any) {
    console.error('[Cron] Error getting job statistics:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}
