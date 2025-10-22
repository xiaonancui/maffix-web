import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        tiktokUsername: true,
        tiktokUserId: true,
        tiktokLinkedAt: true,
        tiktokTokenExpiry: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isLinked = !!(user.tiktokUsername && user.tiktokUserId)
    const isTokenValid = user.tiktokTokenExpiry
      ? new Date(user.tiktokTokenExpiry) > new Date()
      : false

    return NextResponse.json({
      isLinked,
      isTokenValid,
      tiktokUsername: user.tiktokUsername,
      tiktokUserId: user.tiktokUserId,
      linkedAt: user.tiktokLinkedAt,
      tokenExpiry: user.tiktokTokenExpiry,
    })
  } catch (error) {
    console.error('TikTok status check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

