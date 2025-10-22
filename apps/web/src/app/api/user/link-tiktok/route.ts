import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const linkTikTokSchema = z.object({
  tiktokUsername: z.string().min(1, 'TikTok username is required'),
  tiktokUserId: z.string().optional(),
})

/**
 * POST /api/user/link-tiktok
 * 
 * This endpoint is for manual TikTok account linking (without OAuth).
 * For OAuth-based linking, users should use the TikTok OAuth provider directly.
 * 
 * This is useful for:
 * - Linking TikTok username for mission verification
 * - Manual account association when OAuth is not available
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const validatedData = linkTikTokSchema.parse(body)

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

    // Check if TikTok username is already linked to another user
    const existingLink = await db.user.findFirst({
      where: {
        tiktokUsername: validatedData.tiktokUsername,
        id: { not: session.user.id },
      },
    })

    if (existingLink) {
      return NextResponse.json(
        { error: 'This TikTok username is already linked to another account' },
        { status: 400 }
      )
    }

    // Update user with TikTok data
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        tiktokUsername: validatedData.tiktokUsername,
        tiktokUserId: validatedData.tiktokUserId || validatedData.tiktokUsername,
        tiktokLinkedAt: new Date(),
      },
      select: {
        id: true,
        tiktokUsername: true,
        tiktokUserId: true,
        tiktokLinkedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'TikTok account linked successfully',
      user: updatedUser,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('TikTok link error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

