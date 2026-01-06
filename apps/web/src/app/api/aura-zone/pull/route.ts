import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { performTenPull, getRarityConfig } from '@/lib/aura-zone'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { paymentMethod = 'diamonds', bannerId = 'beat-like-dat' } = body

    const { db } = await import('@/lib/db')

    // Fetch user data
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        diamonds: true,
        points: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const TENX_DIAMOND_COST = 3000
    const TENX_POINTS_COST = 10

    // Check if user can afford the pull
    if (paymentMethod === 'diamonds' && user.diamonds < TENX_DIAMOND_COST) {
      return NextResponse.json({ error: 'Insufficient diamonds' }, { status: 400 })
    }

    if (paymentMethod === 'points' && user.points < TENX_POINTS_COST) {
      return NextResponse.json({ error: 'Insufficient points' }, { status: 400 })
    }

    // Fetch active gacha items
    const gachaItems = await db.gachaItem.findMany({
      where: { isActive: true },
      include: {
        prize: true,
        banner: true,
      },
    })

    if (gachaItems.length === 0) {
      return NextResponse.json({ error: 'No prizes available' }, { status: 400 })
    }

    // Transform to AuraZoneItem format
    const auraZoneItems = gachaItems.map((item) => ({
      id: item.id,
      prizeId: item.prizeId,
      probability: item.probability,
      prize: {
        id: item.prize.id,
        name: item.prize.name,
        description: item.prize.description,
        rarity: item.prize.rarity,
        image: item.prize.image,
        type: item.prize.type,
      },
    }))

    // Perform the 10x pull
    const result = performTenPull(auraZoneItems, paymentMethod)

    // Calculate cost and update user balance
    const cost = paymentMethod === 'diamonds' ? -TENX_DIAMOND_COST : -TENX_POINTS_COST
    const balanceField = paymentMethod === 'diamonds' ? 'diamonds' : 'points'

    // Create transaction record
    await db.transaction.create({
      data: {
        userId: user.id,
        type: 'SPEND',
        amount: Math.abs(cost),
        currency: paymentMethod === 'diamonds' ? 'DIAMONDS' : 'POINTS',
        description: `Aura Zone 10x Draw (${bannerId})`,
        status: 'COMPLETED',
      },
    })

    // Update user balance
    await db.user.update({
      where: { id: user.id },
      data: {
        [balanceField]: {
          increment: cost,
        },
      },
    })

    // Create gacha pull records
    const batchId = result.batchId

    for (let i = 0; i < result.pulls.length; i++) {
      const pull = result.pulls[i]

      // Create gacha pull record
      await db.gachaPull.create({
        data: {
          userId: user.id,
          bannerId: gachaItems[0].bannerId, // Using first item's banner as placeholder
          gachaItemId: auraZoneItems[0].id, // Placeholder
          prizeId: pull.prizeId,
          currencyUsed: paymentMethod === 'diamonds' ? 'DIAMONDS' : 'POINTS',
          pulledAt: new Date(),
          cost: paymentMethod === 'diamonds' ? TENX_DIAMOND_COST / 10 : 0,
          pullType: 'MULTI_10X',
          batchId,
          pullIndex: i,
          won: true,
        },
      })

      // If user won a prize, create user prize record
      if (pull.prizeId) {
        const existingPrize = await db.userPrize.findFirst({
          where: {
            userId: user.id,
            prizeId: pull.prizeId,
          },
        })

        if (!existingPrize) {
          await db.userPrize.create({
            data: {
              userId: user.id,
              prizeId: pull.prizeId,
              source: 'GACHA',
              acquiredAt: new Date(),
            },
          })
        }
      }
    }

    // Format pull results for response
    const formattedPulls = result.pulls.map((pull) => {
      const rarityConfig = getRarityConfig(pull.rarity)

      return {
        prizeId: pull.prizeId,
        prizeName: pull.prizeName,
        rarity: pull.rarity,
        rarityDisplay: rarityConfig.shortName,
        rarityColor: rarityConfig.color,
        rarityBorder: rarityConfig.borderColor,
      }
    })

    return NextResponse.json({
      success: true,
      pulls: formattedPulls,
      batchId: result.batchId,
      newBalance: paymentMethod === 'diamonds'
        ? user.diamonds + cost
        : user.points + cost,
    })
  } catch (error) {
    console.error('Aura Zone pull error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
