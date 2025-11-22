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
import { db } from '@/lib/db'

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

    // Check if prize exists
    const prize = await db.prize.findUnique({
      where: { id: data.prizeId },
    })

    if (!prize) {
      return errorResponse('Prize not found', HttpStatus.NOT_FOUND)
    }

    // Check if gacha item already exists for this prize
    const existingItem = await db.gachaItem.findFirst({
      where: { prizeId: data.prizeId },
    })

    if (existingItem) {
      return errorResponse('Gacha item already exists for this prize', HttpStatus.CONFLICT)
    }

    // Create gacha item
    const gachaItem = await db.gachaItem.create({
      data: {
        prizeId: data.prizeId,
        probability: data.probability,
        isActive: data.isActive,
      },
      include: {
        prize: true,
      },
    })

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

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (isActive !== null && isActive !== undefined && isActive !== '') {
      where.isActive = isActive === 'true'
    }

    if (rarity) {
      where.prize = {
        rarity: rarity,
      }
    }

    // Get total count
    const total = await db.gachaItem.count({ where })

    // Get gacha items
    const gachaItems = await db.gachaItem.findMany({
      where,
      include: {
        prize: true,
        _count: {
          select: {
            pulls: true,
          },
        },
      },
      orderBy: [
        { isActive: 'desc' },
        { probability: 'desc' },
      ],
      skip,
      take: limit,
    })

    return successResponse({
      gachaItems,
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
