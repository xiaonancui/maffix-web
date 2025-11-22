import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/prizes
 * Get all active prizes (public endpoint for forms)
 */
export async function GET() {
  try {
    const prizes = await db.prize.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { rarity: 'asc' },
        { name: 'asc' },
      ],
      select: {
        id: true,
        name: true,
        description: true,
        rarity: true,
        type: true,
        image: true,
        value: true,
        isActive: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        prizes,
      },
    })
  } catch (error) {
    console.error('Error fetching prizes:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch prizes',
      },
      { status: 500 }
    )
  }
}

