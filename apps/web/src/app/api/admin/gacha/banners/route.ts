import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { z } from 'zod'

// Validation schema for creating a banner
const createBannerSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with dashes'),
  description: z.string().optional(),
  backgroundVideoUrl: z.string().min(1),
  currencyType: z.enum(['DIAMONDS', 'TICKETS']),
  costPerPull: z.number().int().positive(),
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val)),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
})

/**
 * POST /api/admin/gacha/banners
 * Create a new gacha banner
 */
export async function POST(request: Request) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    const body = await request.json()
    const validationResult = createBannerSchema.safeParse(body)

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

    // Validate dates
    if (data.startDate >= data.endDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    const { db } = await import('@/lib/db')

    // Check if slug already exists
    const existingBanner = await db.gachaBanner.findUnique({
      where: { slug: data.slug },
    })

    if (existingBanner) {
      return NextResponse.json(
        { error: 'A banner with this slug already exists' },
        { status: 400 }
      )
    }

    // Create banner
    const banner = await db.gachaBanner.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        backgroundVideoUrl: data.backgroundVideoUrl,
        currencyType: data.currencyType,
        costPerPull: data.costPerPull,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      },
    })

    return NextResponse.json({
      success: true,
      banner,
    })
  } catch (error: any) {
    console.error('Error creating banner:', error)
    return NextResponse.json(
      {
        error: 'Failed to create banner',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/gacha/banners
 * List all gacha banners with filtering
 */
export async function GET(request: Request) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const { db } = await import('@/lib/db')

    // Build filter
    const where: any = {}
    if (isActive !== null && isActive !== undefined && isActive !== '') {
      where.isActive = isActive === 'true'
    }

    // Get total count
    const total = await db.gachaBanner.count({ where })

    // Get banners with pagination
    const banners = await db.gachaBanner.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: {
          select: {
            gachaItems: true,
            gachaPulls: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      banners,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error listing banners:', error)
    return NextResponse.json(
      {
        error: 'Failed to list banners',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
