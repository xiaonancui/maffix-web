import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth-helpers'
import {
  validateRequest,
  successResponse,
  errorResponse,
  handleDatabaseError,
  logAdminAction,
  HttpStatus,
} from '@/lib/api-helpers'

// Validation schema for creating a gacha item
const createGachaItemSchema = z.object({
  prizeId: z.string().uuid(),
  probability: z.number().min(0).max(100),
  isActive: z.boolean().optional().default(true),
})

// Validation schema for updating a gacha item
const updateGachaItemSchema = z.object({
  probability: z.number().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
})

/**
 * POST /api/admin/gacha/items
 * Create a new gacha item
 */
export async function POST(request: Request) {
  try {
    // Require admin authentication
    const authResult = await requireAdmin()
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { session } = authResult

    // Validate request body
    const validationResult = await validateRequest(request, createGachaItemSchema)
    if (validationResult instanceof NextResponse) {
      return validationResult
    }
    const { data } = validationResult

    // Use mock data (database not connected)
    const gachaItem = {
      id: `gacha-item-${Date.now()}`,
      prizeId: data.prizeId,
      probability: data.probability,
      isActive: data.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
      prize: {
        id: data.prizeId,
        name: 'Mock Prize',
        description: 'This is a mock prize',
        rarity: 'RARE',
        type: 'PHYSICAL',
        image: null,
        value: 100,
        stock: 50,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }

    // Log admin action
    await logAdminAction(
      'CREATE_GACHA_ITEM',
      session.user.id,
      session.user.email,
      {
        gachaItemId: gachaItem.id,
        prizeId: data.prizeId,
        probability: data.probability,
      }
    )

    return successResponse(
      { gachaItem },
      HttpStatus.CREATED,
      'Gacha item created successfully'
    )
  } catch (error) {
    return handleDatabaseError(error, 'create gacha item')
  }
}

/**
 * GET /api/admin/gacha/items
 * List all gacha items with pagination and filtering
 */
export async function GET(request: Request) {
  try {
    // Require admin authentication
    const authResult = await requireAdmin()
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const isActive = searchParams.get('isActive')
    const rarity = searchParams.get('rarity')

    // Use mock data (database not connected)
    const mockGachaItems = [
      {
        id: 'gacha-1',
        prizeId: 'prize-1',
        probability: 0.5,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        prize: {
          id: 'prize-1',
          name: 'VIP Concert Backstage Pass',
          description: 'Exclusive access to backstage area',
          rarity: 'LEGENDARY',
          type: 'EXPERIENCE',
          image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400',
          value: 1000,
          stock: 5,
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        _count: {
          pulls: 23,
        },
      },
      {
        id: 'gacha-2',
        prizeId: 'prize-2',
        probability: 2.0,
        isActive: true,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        prize: {
          id: 'prize-2',
          name: 'Limited Edition Signed Vinyl',
          description: 'Hand-signed vinyl record',
          rarity: 'SSR',
          type: 'PHYSICAL',
          image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400',
          value: 500,
          stock: 25,
          isActive: true,
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02'),
        },
        _count: {
          pulls: 58,
        },
      },
      {
        id: 'gacha-3',
        prizeId: 'prize-4',
        probability: 8.0,
        isActive: true,
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
        prize: {
          id: 'prize-4',
          name: 'Premium Hoodie',
          description: 'Limited edition premium hoodie',
          rarity: 'EPIC',
          type: 'PHYSICAL',
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
          value: 200,
          stock: 50,
          isActive: true,
          createdAt: new Date('2024-01-04'),
          updatedAt: new Date('2024-01-04'),
        },
        _count: {
          pulls: 132,
        },
      },
      {
        id: 'gacha-4',
        prizeId: 'prize-5',
        probability: 15.0,
        isActive: true,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
        prize: {
          id: 'prize-5',
          name: 'Digital Album Bundle',
          description: 'Complete discography in digital format',
          rarity: 'RARE',
          type: 'DIGITAL',
          image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=400',
          value: 100,
          stock: null,
          isActive: true,
          createdAt: new Date('2024-01-05'),
          updatedAt: new Date('2024-01-05'),
        },
        _count: {
          pulls: 178,
        },
      },
      {
        id: 'gacha-5',
        prizeId: 'prize-6',
        probability: 30.0,
        isActive: true,
        createdAt: new Date('2024-01-06'),
        updatedAt: new Date('2024-01-06'),
        prize: {
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
        },
        _count: {
          pulls: 245,
        },
      },
    ]

    // Apply filters
    let filteredItems = mockGachaItems

    if (isActive !== null && isActive !== undefined && isActive !== '') {
      const activeFilter = isActive === 'true'
      filteredItems = filteredItems.filter((item) => item.isActive === activeFilter)
    }

    if (rarity) {
      filteredItems = filteredItems.filter((item) => item.prize.rarity === rarity)
    }

    const total = filteredItems.length
    const start = (page - 1) * limit
    const paginatedItems = filteredItems.slice(start, start + limit)

    return successResponse({
      gachaItems: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return handleDatabaseError(error, 'list gacha items')
  }
}
