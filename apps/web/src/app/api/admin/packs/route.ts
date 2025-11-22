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

    // Use mock data (database not connected)
    const packs = [
      {
        id: 'pack-1',
        name: 'Starter Pack',
        description: 'Perfect for new fans! Includes guaranteed SSR prize and bonus tickets',
        price: 19.99,
        currency: 'USD',
        guaranteedPrizeId: 'prize-2',
        bonusTickets: 5,
        bonusDiamonds: 1000,
        imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400',
        featured: true,
        sortOrder: 1,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        guaranteedPrize: {
          id: 'prize-2',
          name: 'Limited Edition Signed Vinyl',
          description: 'Hand-signed vinyl record',
          rarity: 'SSR',
          type: 'PHYSICAL',
          image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400',
          value: 500,
        },
        _count: {
          purchases: 234,
        },
      },
      {
        id: 'pack-2',
        name: 'Premium Pack',
        description: 'Best value! Guaranteed LEGENDARY prize plus massive bonuses',
        price: 49.99,
        currency: 'USD',
        guaranteedPrizeId: 'prize-1',
        bonusTickets: 15,
        bonusDiamonds: 3000,
        imageUrl: 'https://images.unsplash.com/photo-1607083206325-caf1edba7a0f?w=400',
        featured: true,
        sortOrder: 2,
        isActive: true,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        guaranteedPrize: {
          id: 'prize-1',
          name: 'VIP Concert Backstage Pass',
          description: 'Exclusive access to backstage area',
          rarity: 'LEGENDARY',
          type: 'EXPERIENCE',
          image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400',
          value: 1000,
        },
        _count: {
          purchases: 89,
        },
      },
      {
        id: 'pack-3',
        name: 'Diamond Pack',
        description: 'Pure diamonds for gacha pulls - no guaranteed prize',
        price: 9.99,
        currency: 'USD',
        guaranteedPrizeId: null,
        bonusTickets: 0,
        bonusDiamonds: 500,
        imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
        featured: false,
        sortOrder: 3,
        isActive: true,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
        guaranteedPrize: null,
        _count: {
          purchases: 456,
        },
      },
    ]

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

    // Use mock data (database not connected)
    const pack = {
      id: `pack-${Date.now()}`,
      name: data.name,
      description: data.description,
      price: data.price,
      currency: data.currency,
      guaranteedPrizeId: data.guaranteedPrizeId || null,
      bonusTickets: data.bonusTickets,
      bonusDiamonds: data.bonusDiamonds,
      imageUrl: data.imageUrl || null,
      featured: data.featured,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
      guaranteedPrize: data.guaranteedPrizeId ? {
        id: data.guaranteedPrizeId,
        name: 'Mock Prize',
        description: 'This is a mock guaranteed prize',
        rarity: 'SSR',
        type: 'PHYSICAL',
        image: null,
        value: 500,
      } : null,
    }

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

