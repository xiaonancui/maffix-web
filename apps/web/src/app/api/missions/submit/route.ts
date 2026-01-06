import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * POST /api/missions/submit
 *
 * Legacy endpoint for backward compatibility.
 * Redirects to the new /api/mission/verify endpoint.
 *
 * @deprecated Use /api/mission/verify instead
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { missionId, screenshotUrl } = body

    if (!missionId) {
      return NextResponse.json({ error: 'Mission ID is required' }, { status: 400 })
    }

    // Forward to the new mission verify endpoint
    const verifyUrl = new URL('/api/mission/verify', request.url)
    const verifyRequest = new Request(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: request.headers.get('cookie') || '',
      },
      body: JSON.stringify({
        missionId,
        evidence: screenshotUrl, // Map screenshotUrl to evidence
      }),
    })

    // Make internal API call
    const verifyResponse = await fetch(verifyRequest)
    const verifyData = await verifyResponse.json()

    // Return the response from the verify endpoint
    return NextResponse.json(verifyData, { status: verifyResponse.status })
  } catch (error) {
    console.error('Mission submit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
