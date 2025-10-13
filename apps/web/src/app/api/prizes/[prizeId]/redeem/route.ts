import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: { params: { prizeId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the user's prize
    const userPrize = await db.userPrize.findFirst({
      where: {
        id: params.prizeId,
        userId: session.user.id,
      },
      include: {
        prize: true,
      },
    })

    if (!userPrize) {
      return NextResponse.json({ error: 'Prize not found' }, { status: 404 })
    }

    if (userPrize.redeemed) {
      return NextResponse.json(
        { error: 'Prize already redeemed' },
        { status: 400 }
      )
    }

    // Mark prize as redeemed
    const updatedPrize = await db.userPrize.update({
      where: { id: params.prizeId },
      data: {
        redeemed: true,
        redeemedAt: new Date(),
      },
      include: {
        prize: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Prize redeemed successfully',
      prize: {
        id: updatedPrize.id,
        name: updatedPrize.prize.name,
        redeemedAt: updatedPrize.redeemedAt,
      },
    })
  } catch (error) {
    console.error('Prize redemption error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

