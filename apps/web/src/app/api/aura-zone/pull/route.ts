import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { performTenPull, getRarityConfig, AURA_ZONE_COSTS } from '@/lib/aura-zone'
import { deductCurrency, InsufficientFundsError } from '@/lib/transaction'
import { Currency, TransactionType } from '@prisma/client'

// Fixed costs for 10x pulls
const TENX_DIAMOND_COST = AURA_ZONE_COSTS.TENX_DIAMONDS // 3000
const TENX_TICKET_COST = AURA_ZONE_COSTS.TENX_TICKETS // 10

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { paymentMethod = 'diamonds', bannerId } = body

    // Validate payment method
    if (paymentMethod !== 'diamonds' && paymentMethod !== 'tickets') {
      return NextResponse.json(
        { error: 'Invalid payment method. Must be "diamonds" or "tickets"' },
        { status: 400 }
      )
    }

    if (!bannerId) {
      return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 })
    }

    const { db } = await import('@/lib/db')

    // Step 1: Validate Banner is Active (search by id first, then slug for backwards compatibility)
    let banner = await db.gachaBanner.findUnique({
      where: { id: bannerId },
    })

    // Fallback to slug search for backwards compatibility
    if (!banner) {
      banner = await db.gachaBanner.findUnique({
        where: { slug: bannerId },
      })
    }

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    const now = new Date()
    if (!banner.isActive || now < banner.startDate || now > banner.endDate) {
      return NextResponse.json(
        { error: 'This banner is not currently active' },
        { status: 400 }
      )
    }

    // Fetch user data
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        diamonds: true,
        tickets: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Step 2: Determine cost based on payment method (strict 10x pull only)
    let costAmount: number
    let currency: Currency

    if (paymentMethod === 'diamonds') {
      costAmount = TENX_DIAMOND_COST
      currency = Currency.DIAMONDS

      // Validate user has enough diamonds
      if (user.diamonds < costAmount) {
        return NextResponse.json(
          {
            error: `Insufficient diamonds. Need ${costAmount}, have ${user.diamonds}`,
            required: costAmount,
            available: user.diamonds,
          },
          { status: 400 }
        )
      }
    } else {
      // tickets
      costAmount = TENX_TICKET_COST
      currency = Currency.TICKETS

      // Validate user has enough tickets
      if (user.tickets < costAmount) {
        return NextResponse.json(
          {
            error: `Insufficient tickets. Need ${costAmount}, have ${user.tickets}`,
            required: costAmount,
            available: user.tickets,
          },
          { status: 400 }
        )
      }
    }

    // Step 3: Deduct currency atomically
    try {
      await deductCurrency(
        user.id,
        costAmount,
        currency,
        TransactionType.GACHA_SPEND,
        `banner_${banner.id}`
      )
    } catch (error) {
      if (error instanceof InsufficientFundsError) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      throw error
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

    // Step 3: RNG Logic (Weighted Random) - Perform the 10x pull
    const result = performTenPull(auraZoneItems, paymentMethod)

    // Step 4: Save Results to UserItem (wrap in transaction for atomicity)
    const batchId = result.batchId

    // Create a map from prizeId to gachaItemId for efficient lookup
    const prizeToGachaItemMap = new Map<string, string>()
    for (const item of gachaItems) {
      prizeToGachaItemMap.set(item.prizeId, item.id)
    }

    await db.$transaction(async (tx) => {
      for (let i = 0; i < result.pulls.length; i++) {
        const pull = result.pulls[i]
        const gachaItemId = prizeToGachaItemMap.get(pull.prizeId) || gachaItems[0]?.id

        // Create gacha pull record
        await tx.gachaPull.create({
          data: {
            userId: user.id,
            bannerId: banner.id,
            gachaItemId: gachaItemId, // Now properly mapped from prize
            prizeId: pull.prizeId,
            currencyUsed: currency,
            pulledAt: new Date(),
            cost: costAmount / 10, // Per-pull cost
            pullType: 'MULTI_10X',
            batchId,
            pullIndex: i,
            won: true,
          },
        })

        // Award prize to user (create UserPrize record)
        if (pull.prizeId) {
          // Check if user already has this prize (don't duplicate)
          const existingPrize = await tx.userPrize.findFirst({
            where: {
              userId: user.id,
              prizeId: pull.prizeId,
            },
          })

          if (!existingPrize) {
            await tx.userPrize.create({
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
    })

    // Step 5: Return list to frontend for animation
    // Fetch updated user balance
    const updatedUser = await db.user.findUnique({
      where: { id: user.id },
      select: {
        diamonds: true,
        tickets: true,
      },
    })

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
        imageUrl: pull.imageUrl,
      }
    })

    return NextResponse.json({
      success: true,
      pulls: formattedPulls,
      batchId: result.batchId,
      newBalance:
        paymentMethod === 'diamonds'
          ? updatedUser?.diamonds || 0
          : updatedUser?.tickets || 0,
      costAmount,
      currency: paymentMethod,
    })
  } catch (error) {
    console.error('Aura Zone pull error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
