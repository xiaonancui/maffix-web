import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, tiktokUsername: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.tiktokUsername) {
      return NextResponse.json(
        { error: 'TikTok account not linked' },
        { status: 400 }
      )
    }

    // Remove TikTok data from user
    await db.user.update({
      where: { id: session.user.id },
      data: {
        tiktokUsername: null,
        tiktokUserId: null,
        tiktokAccessToken: null,
        tiktokRefreshToken: null,
        tiktokTokenExpiry: null,
        tiktokLinkedAt: null,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'TikTok account unlinked successfully',
    })
  } catch (error) {
    console.error('TikTok unlink error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

