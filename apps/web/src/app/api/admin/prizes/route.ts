import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { z } from 'zod'

// Validation schema for creating a prize
const createPrizeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  rarity: z.enum(['COMMON', 'RARE', 'EPIC', 'SSR', 'LEGENDARY']),
  type: z.enum(['PHYSICAL', 'DIGITAL', 'EXPERIENCE', 'DISCOUNT', 'EXCLUSIVE']),
  image: z.string().url().optional().nullable(),
  value: z.number().int().min(0).default(0),
  stock: z.number().int().min(0).optional().nullable(),
  isActive: z.boolean().default(true),
})

/**
 * GET /api/admin/prizes
 * List all prizes with statistics (admin only)
 */
export async function GET(request: Request) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const rarity = searchParams.get('rarity') || ''
    const type = searchParams.get('type') || ''
    const isActive = searchParams.get('isActive')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Use mock data (database not connected)
    const mockPrizes = [
      {
        id: 'prize-1',
        name: 'VIP Concert Backstage Pass',
        description: 'Exclusive access to backstage area at any concert on the 2024 World Tour',
        rarity: 'LEGENDARY',
        type: 'EXPERIENCE',
        image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400',
        value: 1000,
        stock: 5,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        _count: {
          userPrizes: 3,
          gachaItems: 1,
          gachaPulls: 3,
          premiumPacks: 2,
        },
      },
      {
        id: 'prize-2',
        name: 'Limited Edition Signed Vinyl',
        description: 'Hand-signed vinyl record of the latest album, limited to 100 copies',
        rarity: 'SSR',
        type: 'PHYSICAL',
        image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400',
        value: 500,
        stock: 25,
        isActive: true,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        _count: {
          userPrizes: 18,
          gachaItems: 1,
          gachaPulls: 18,
          premiumPacks: 1,
        },
      },
      {
        id: 'prize-3',
        name: 'Exclusive Meet & Greet',
        description: 'Private meet and greet session with the artist',
        rarity: 'LEGENDARY',
        type: 'EXPERIENCE',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400',
        value: 800,
        stock: 10,
        isActive: true,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
        _count: {
          userPrizes: 5,
          gachaItems: 1,
          gachaPulls: 5,
          premiumPacks: 3,
        },
      },
      {
        id: 'prize-4',
        name: 'Premium Hoodie',
        description: 'Limited edition premium quality hoodie with exclusive design',
        rarity: 'EPIC',
        type: 'PHYSICAL',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
        value: 200,
        stock: 50,
        isActive: true,
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
        _count: {
          userPrizes: 32,
          gachaItems: 1,
          gachaPulls: 32,
          premiumPacks: 0,
        },
      },
      {
        id: 'prize-5',
        name: 'Digital Album Bundle',
        description: 'Complete discography in high-quality digital format',
        rarity: 'RARE',
        type: 'DIGITAL',
        image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=400',
        value: 100,
        stock: null,
        isActive: true,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
        _count: {
          userPrizes: 78,
          gachaItems: 1,
          gachaPulls: 78,
          premiumPacks: 0,
        },
      },
      {
        id: 'prize-6',
        name: 'Fan Club Sticker Pack',
        description: 'Set of 10 holographic stickers',
        rarity: 'COMMON',
        type: 'PHYSICAL',
        image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
        value: 20,
        stock: 500,
        isActive: true,
        createdAt: new Date('2024-01-06'),
        updatedAt: new Date('2024-01-06'),
        _count: {
          userPrizes: 245,
          gachaItems: 1,
          gachaPulls: 245,
          premiumPacks: 0,
        },
      },
    ]

    // Apply filters
    let filteredPrizes = mockPrizes

    if (search) {
      const searchLower = search.toLowerCase()
      filteredPrizes = filteredPrizes.filter(
        (prize) =>
          prize.name.toLowerCase().includes(searchLower) ||
          prize.description.toLowerCase().includes(searchLower)
      )
    }

    if (rarity) {
      filteredPrizes = filteredPrizes.filter((prize) => prize.rarity === rarity)
    }

    if (type) {
      filteredPrizes = filteredPrizes.filter((prize) => prize.type === type)
    }

    if (isActive !== null && isActive !== undefined && isActive !== '') {
      const activeFilter = isActive === 'true'
      filteredPrizes = filteredPrizes.filter((prize) => prize.isActive === activeFilter)
    }

    const total = filteredPrizes.length
    const start = (page - 1) * limit
    const paginatedPrizes = filteredPrizes.slice(start, start + limit)

    return NextResponse.json({
      success: true,
      prizes: paginatedPrizes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get prizes error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/prizes
 * Create a new prize (admin only)
 */
export async function POST(request: Request) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    const body = await request.json()

    // Validate request body
    const validationResult = createPrizeSchema.safeParse(body)
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
    const prize = {
      id: `prize-${Date.now()}`,
      name: data.name,
      description: data.description,
      rarity: data.rarity,
      type: data.type,
      image: data.image || null,
      value: data.value,
      stock: data.stock || null,
      isActive: data.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json({
      success: true,
      prize,
      message: 'Prize created successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('Create prize error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

