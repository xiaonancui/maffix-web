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

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (rarity) {
      where.rarity = rarity
    }

    if (type) {
      where.type = type
    }

    if (isActive !== null && isActive !== undefined && isActive !== '') {
      where.isActive = isActive === 'true'
    }

    // Get total count
    const total = await db.prize.count({ where })

    // Get prizes with statistics
    const prizes = await db.prize.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        rarity: true,
        type: true,
        image: true,
        value: true,
        stock: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            userPrizes: true,
            gachaItems: true,
            gachaPulls: true,
            premiumPacks: true,
          },
        },
      },
      orderBy: [
        { rarity: 'desc' },
        { name: 'asc' },
      ],
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      success: true,
      prizes,
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

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Create the prize
    const prize = await db.prize.create({
      data: {
        name: data.name,
        description: data.description,
        rarity: data.rarity,
        type: data.type,
        image: data.image || null,
        value: data.value,
        stock: data.stock || null,
        isActive: data.isActive,
      },
    })

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

