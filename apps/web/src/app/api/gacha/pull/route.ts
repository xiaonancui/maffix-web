import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const GACHA_COST = 100 // Cost in diamonds per pull

export async function POST(request: Request) {
  try {
    // Check if we're in build time - return early if so
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Get user with current balance
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        diamondBalance: true,
        _count: {
          select: {
            gachaPulls: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has enough diamonds
    if (user.diamondBalance < GACHA_COST) {
      return NextResponse.json(
        { error: 'Insufficient diamonds', required: GACHA_COST, current: user.diamondBalance },
        { status: 400 }
      )
    }

    // Get all gacha items with their probabilities
    const gachaItems = await db.gachaItem.findMany({
      where: { isActive: true },
      include: {
        prize: true,
      },
    })

    if (gachaItems.length === 0) {
      return NextResponse.json(
        { error: 'No gacha items available' },
        { status: 400 }
      )
    }

    // Calculate total probability (should be 100)
    const totalProbability = gachaItems.reduce(
      (sum, item) => sum + item.probability,
      0
    )

    // Generate random number between 0 and total probability
    const random = Math.random() * totalProbability
    let cumulativeProbability = 0
    let selectedItem = gachaItems[0]

    // Select item based on probability
    for (const item of gachaItems) {
      cumulativeProbability += item.probability
      if (random <= cumulativeProbability) {
        selectedItem = item
        break
      }
    }

    // Perform transaction: deduct diamonds, create pull record, award prize
    const result = await db.$transaction(async (tx) => {
      // Deduct diamonds
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          diamondBalance: {
            decrement: GACHA_COST,
          },
        },
      })

      // Create gacha pull record
      const gachaPull = await tx.gachaPull.create({
        data: {
          userId: user.id,
          gachaItemId: selectedItem.id,
          cost: GACHA_COST,
          won: true,
        },
        include: {
          gachaItem: true,
        },
      })

      // Award prize to user
      const userPrize = await tx.userPrize.create({
        data: {
          userId: user.id,
          prizeId: selectedItem.prizeId,
          source: 'GACHA',
          redeemed: false,
        },
        include: {
          prize: true,
        },
      })

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: user.id,
          type: 'SPEND',
          amount: GACHA_COST,
          currency: 'DIAMONDS',
          description: `Gacha pull - Won: ${selectedItem.prize.name}`,
          reference: gachaPull.id,
          status: 'COMPLETED',
        },
      })

      return {
        gachaPull,
        userPrize,
        newBalance: updatedUser.diamondBalance,
      }
    })

    return NextResponse.json({
      success: true,
      prize: {
        id: result.userPrize.prize.id,
        name: result.userPrize.prize.name,
        description: result.userPrize.prize.description,
        rarity: result.userPrize.prize.rarity,
        type: result.userPrize.prize.type,
        imageUrl: result.userPrize.prize.image,
        value: result.userPrize.prize.value,
      },
      userPrize: {
        id: result.userPrize.id,
        wonAt: result.userPrize.acquiredAt,
      },
      cost: GACHA_COST,
      newBalance: result.newBalance,
      totalPulls: user._count.gachaPulls + 1,
    })
  } catch (error) {
    console.error('Gacha pull error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

