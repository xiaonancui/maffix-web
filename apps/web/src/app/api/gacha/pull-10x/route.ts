import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  selectMultipleGachaItems,
  enforceSSRGuarantee,
  calculateNewPityCounter,
  hasSSROrHigher,
  type GachaItemWithPrize,
} from '@/lib/gacha'
import { v4 as uuidv4 } from 'uuid'

const GACHA_COST_SINGLE = 100 // Cost in diamonds per single pull
const GACHA_COST_10X = 900 // Cost in diamonds for 10x pull (10% discount)
const PULL_COUNT = 10

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

    // Check if this is a test account - use mock data
    const isTestAccount = process.env.NODE_ENV === 'development' &&
      (session.user.id?.includes('test-') || session.user.id?.includes('demo-') || session.user.id?.includes('admin-'))

    if (isTestAccount) {
      // Mock prizes with different rarities
      const mockPrizes = [
        {
          id: 'prize-legendary-1',
          name: '🎤 VIP Concert Backstage Pass',
          description: 'Meet & greet with the artist + front row seat',
          type: 'EXPERIENCE',
          rarity: 'LEGENDARY',
          value: 1000,
          imageUrl: null,
        },
        {
          id: 'prize-ssr-1',
          name: '⭐ Limited Edition Signed Vinyl',
          description: 'Rare signed vinyl record with certificate of authenticity',
          type: 'PHYSICAL',
          rarity: 'SSR',
          value: 500,
          imageUrl: null,
        },
        {
          id: 'prize-ssr-2',
          name: '⭐ Exclusive Photo Book',
          description: 'Limited edition photo book with personal message',
          type: 'PHYSICAL',
          rarity: 'SSR',
          value: 450,
          imageUrl: null,
        },
        {
          id: 'prize-epic-1',
          name: '💜 Exclusive Merchandise Bundle',
          description: 'Premium T-shirt, poster, and holographic sticker pack',
          type: 'PHYSICAL',
          rarity: 'EPIC',
          value: 200,
          imageUrl: null,
        },
        {
          id: 'prize-rare-1',
          name: '💙 Digital Album + Bonus Tracks',
          description: 'Full album with 3 unreleased songs',
          type: 'DIGITAL',
          rarity: 'RARE',
          value: 100,
          imageUrl: null,
        },
        {
          id: 'prize-common-1',
          name: '⚪ Fan Club Sticker',
          description: 'Official fan club holographic sticker',
          type: 'PHYSICAL',
          rarity: 'COMMON',
          value: 20,
          imageUrl: null,
        },
      ]

      // Perform 10 pulls with weighted random selection
      const selectedPrizes = []
      let hasSSR = false

      for (let i = 0; i < PULL_COUNT; i++) {
        const random = Math.random() * 100
        let prize
        if (random < 1) {
          prize = mockPrizes[0] // LEGENDARY 1%
          hasSSR = true
        } else if (random < 5) {
          prize = Math.random() < 0.5 ? mockPrizes[1] : mockPrizes[2] // SSR 4%
          hasSSR = true
        } else if (random < 15) {
          prize = mockPrizes[3] // EPIC 10%
        } else if (random < 40) {
          prize = mockPrizes[4] // RARE 25%
        } else {
          prize = mockPrizes[5] // COMMON 60%
        }
        selectedPrizes.push(prize)
      }

      // Enforce SSR guarantee - if no SSR in 10 pulls, replace one COMMON with SSR
      if (!hasSSR) {
        const commonIndex = selectedPrizes.findIndex(p => p.rarity === 'COMMON')
        if (commonIndex !== -1) {
          selectedPrizes[commonIndex] = mockPrizes[1] // Replace with SSR
        }
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500))

      return NextResponse.json({
        success: true,
        prizes: selectedPrizes,
        userPrizes: selectedPrizes.map((_, index) => ({
          id: `user-prize-${Date.now()}-${index}`,
          wonAt: new Date(),
        })),
        cost: GACHA_COST_10X,
        newBalance: 10000 - GACHA_COST_10X,
        totalPulls: Math.floor(Math.random() * 50) + 10,
        guaranteedSSR: !hasSSR, // True if we had to force an SSR
      })
    }

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Get user with current balance and pity counter
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        diamondBalance: true,
        gachaPityCounter: true,
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
    if (user.diamondBalance < GACHA_COST_10X) {
      return NextResponse.json(
        {
          error: 'Insufficient diamonds',
          required: GACHA_COST_10X,
          current: user.diamondBalance,
        },
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

    // Perform 10 pulls
    let selectedItems = selectMultipleGachaItems(
      gachaItems as GachaItemWithPrize[],
      PULL_COUNT
    )

    // Enforce SSR guarantee (at least 1 SSR+ in every 10x pull)
    const { items: guaranteedItems, guaranteedIndex } = enforceSSRGuarantee(
      selectedItems,
      gachaItems as GachaItemWithPrize[]
    )
    selectedItems = guaranteedItems

    // Check if this 10x pull contains SSR+
    const gotSSROrHigher = hasSSROrHigher(selectedItems)

    // Calculate new pity counter
    const newPityCounter = calculateNewPityCounter(
      user.gachaPityCounter,
      gotSSROrHigher
    )

    // Generate batch ID for this 10x pull
    const batchId = uuidv4()

    // Perform transaction: deduct diamonds, create pull records, award prizes
    const result = await db.$transaction(async (tx) => {
      // Deduct diamonds and update pity counter
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          diamondBalance: {
            decrement: GACHA_COST_10X,
          },
          gachaPityCounter: newPityCounter,
        },
      })

      // Create gacha pull records and award prizes
      const pullResults = []

      for (let i = 0; i < selectedItems.length; i++) {
        const selectedItem = selectedItems[i]
        const wasGuaranteed = guaranteedIndex === i

        // Create gacha pull record
        const gachaPull = await tx.gachaPull.create({
          data: {
            userId: user.id,
            gachaItemId: selectedItem.id,
            prizeId: selectedItem.prizeId,
            cost: GACHA_COST_SINGLE, // Individual cost per pull
            pullType: 'MULTI_10X',
            batchId: batchId,
            pullIndex: i,
            wasGuaranteed: wasGuaranteed,
            won: true,
          },
          include: {
            gachaItem: {
              include: {
                prize: true,
              },
            },
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

        // Decrement stock if limited
        if (selectedItem.prize.stock !== null) {
          await tx.prize.update({
            where: { id: selectedItem.prizeId },
            data: {
              stock: {
                decrement: 1,
              },
            },
          })
        }

        pullResults.push({
          gachaPull,
          userPrize,
          wasGuaranteed,
        })
      }

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: user.id,
          type: 'SPEND',
          amount: GACHA_COST_10X,
          currency: 'DIAMONDS',
          description: `10x Gacha pull - ${selectedItems.length} prizes won`,
          reference: batchId,
          status: 'COMPLETED',
        },
      })

      return {
        pullResults,
        newBalance: updatedUser.diamondBalance,
        newPityCounter: updatedUser.gachaPityCounter,
      }
    })

    // Format response
    const prizes = result.pullResults.map((pullResult, index) => ({
      id: pullResult.userPrize.prize.id,
      name: pullResult.userPrize.prize.name,
      description: pullResult.userPrize.prize.description,
      rarity: pullResult.userPrize.prize.rarity,
      type: pullResult.userPrize.prize.type,
      imageUrl: pullResult.userPrize.prize.image,
      value: pullResult.userPrize.prize.value,
      userPrizeId: pullResult.userPrize.id,
      wonAt: pullResult.userPrize.acquiredAt,
      wasGuaranteed: pullResult.wasGuaranteed,
      pullIndex: index,
    }))

    return NextResponse.json({
      success: true,
      pullType: '10x',
      batchId: batchId,
      prizes: prizes,
      cost: GACHA_COST_10X,
      newBalance: result.newBalance,
      pityCounter: result.newPityCounter,
      totalPulls: user._count.gachaPulls + PULL_COUNT,
      hasSSR: gotSSROrHigher,
      guaranteedIndex: guaranteedIndex,
    })
  } catch (error) {
    console.error('10x Gacha pull error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

