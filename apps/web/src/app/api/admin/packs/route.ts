import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { z } from 'zod'

// Validation schema for creating a premium pack
const createPackSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  currency: z.string().default('USD'),
  guaranteedPrizeId: z.string().optional(),
  bonusTickets: z.number().int().min(0).default(0),
  bonusDiamonds: z.number().int().min(0).default(0),
  imageUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

/**
 * GET /api/admin/packs
 * List all premium packs (admin only)
 */
export async function GET(request: Request) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Get all packs with guaranteed prize details
    const packs = await db.premiumPack.findMany({
      include: {
        guaranteedPrize: {
          select: {
            id: true,
            name: true,
            description: true,
            rarity: true,
            type: true,
            image: true,
            value: true,
          },
        },
        _count: {
          select: {
            purchases: true,
          },
        },
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({
      success: true,
      packs,
      total: packs.length,
    })
  } catch (error) {
    console.error('Get packs error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/packs
 * Create a new premium pack (admin only)
 */
export async function POST(request: Request) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    const body = await request.json()

    // Validate request body
    const validationResult = createPackSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // If guaranteedPrizeId is provided, verify it exists
    if (data.guaranteedPrizeId) {
      const prize = await db.prize.findUnique({
        where: { id: data.guaranteedPrizeId },
      })

      if (!prize) {
        return NextResponse.json(
          { error: 'Guaranteed prize not found' },
          { status: 404 }
        )
      }

      if (!prize.isActive) {
        return NextResponse.json(
          { error: 'Guaranteed prize is not active' },
          { status: 400 }
        )
      }
    }

    // Create the premium pack
    const pack = await db.premiumPack.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency,
        guaranteedPrizeId: data.guaranteedPrizeId,
        bonusTickets: data.bonusTickets,
        bonusDiamonds: data.bonusDiamonds,
        imageUrl: data.imageUrl,
        featured: data.featured,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
      include: {
        guaranteedPrize: {
          select: {
            id: true,
            name: true,
            description: true,
            rarity: true,
            type: true,
            image: true,
            value: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      pack,
      message: 'Premium pack created successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('Create pack error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

