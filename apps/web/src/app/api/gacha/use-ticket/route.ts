import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  selectRandomGachaItem,
  selectMultipleGachaItems,
  enforceSSRGuarantee,
  calculateNewPityCounter,
  hasSSROrHigher,
  type GachaItemWithPrize,
} from '@/lib/gacha'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const useTicketSchema = z.object({
  ticketType: z.enum(['SINGLE', 'MULTI_10X']),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { ticketType } = useTicketSchema.parse(body)

    // Check if this is a test account - use mock data
    const allowTestAccounts =
      process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_ACCOUNTS === 'true'

    const isTestAccount =
      allowTestAccounts &&
      (session.user.id?.includes('test-') ||
        session.user.id?.includes('demo-') ||
        session.user.id?.includes('admin-'))

    if (isTestAccount) {
      // Mock response for test accounts using tickets
      return NextResponse.json({
        success: true,
        message: 'Ticket feature not available for test accounts. Use diamond pulls instead.',
        error: 'Test accounts cannot use tickets',
      }, { status: 400 })
    }

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Get user with current balance and pity counter
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
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

    // Find an available ticket of the requested type
    const availableTicket = await db.drawTicket.findFirst({
      where: {
        userId: user.id,
        ticketType: ticketType,
        used: false,
        OR: [
          { expiresAt: null }, // Never expires
          { expiresAt: { gt: new Date() } }, // Not expired yet
        ],
      },
      orderBy: {
        createdAt: 'asc', // Use oldest ticket first
      },
    })

    if (!availableTicket) {
      return NextResponse.json(
        {
          error: `No available ${ticketType === 'SINGLE' ? 'single' : '10x'} draw tickets`,
          ticketType: ticketType,
        },
        { status: 400 }
      )
    }

    // Get all gacha items with their probabilities
    const gachaItems = await db.gachaItem.findMany({
      where: { isActive: true },
      include: {
        prize: true,
        banner: true,
      },
    })

    if (gachaItems.length === 0) {
      return NextResponse.json(
        { error: 'No gacha items available' },
        { status: 400 }
      )
    }

    // Perform pull based on ticket type
    if (ticketType === 'SINGLE') {
      // Single pull
      const selectedItem = selectRandomGachaItem(
        gachaItems as GachaItemWithPrize[]
      )

      const gotSSROrHigher = selectedItem.prize.rarity === 'SSR' || selectedItem.prize.rarity === 'LEGENDARY'
      const newPityCounter = calculateNewPityCounter(
        user.gachaPityCounter,
        gotSSROrHigher
      )

      // Perform transaction
      const result = await db.$transaction(async (tx) => {
        // Mark ticket as used
        await tx.drawTicket.update({
          where: { id: availableTicket.id },
          data: {
            used: true,
            usedAt: new Date(),
          },
        })

        // Update pity counter
        await tx.user.update({
          where: { id: user.id },
          data: {
            gachaPityCounter: newPityCounter,
          },
        })

        // Create gacha pull record
        const gachaPull = await tx.gachaPull.create({
          data: {
            userId: user.id,
            bannerId: selectedItem.bannerId,
            gachaItemId: selectedItem.id,
            prizeId: selectedItem.prizeId,
            currencyUsed: 'TICKETS',
            cost: 0, // Free with ticket
            pullType: 'SINGLE',
            won: true,
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

        return {
          gachaPull,
          userPrize,
          newPityCounter,
        }
      })

      return NextResponse.json({
        success: true,
        pullType: 'single',
        usedTicket: true,
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
        pityCounter: result.newPityCounter,
        totalPulls: user._count.gachaPulls + 1,
      })
    } else {
      // 10x pull
      const PULL_COUNT = 10

      let selectedItems = selectMultipleGachaItems(
        gachaItems as GachaItemWithPrize[],
        PULL_COUNT
      )

      // Enforce SSR guarantee
      const { items: guaranteedItems, guaranteedIndex } = enforceSSRGuarantee(
        selectedItems,
        gachaItems as GachaItemWithPrize[]
      )
      selectedItems = guaranteedItems

      const gotSSROrHigher = hasSSROrHigher(selectedItems)
      const newPityCounter = calculateNewPityCounter(
        user.gachaPityCounter,
        gotSSROrHigher
      )

      const batchId = uuidv4()

      // Perform transaction
      const result = await db.$transaction(async (tx) => {
        // Mark ticket as used
        await tx.drawTicket.update({
          where: { id: availableTicket.id },
          data: {
            used: true,
            usedAt: new Date(),
          },
        })

        // Update pity counter
        await tx.user.update({
          where: { id: user.id },
          data: {
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
              bannerId: selectedItem.bannerId,
              gachaItemId: selectedItem.id,
              prizeId: selectedItem.prizeId,
              currencyUsed: 'TICKETS',
              cost: 0, // Free with ticket
              pullType: 'MULTI_10X',
              batchId: batchId,
              pullIndex: i,
              wasGuaranteed: wasGuaranteed,
              won: true,
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

        return {
          pullResults,
          newPityCounter,
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
        usedTicket: true,
        batchId: batchId,
        prizes: prizes,
        pityCounter: result.newPityCounter,
        totalPulls: user._count.gachaPulls + PULL_COUNT,
        hasSSR: gotSSROrHigher,
        guaranteedIndex: guaranteedIndex,
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Ticket gacha pull error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

