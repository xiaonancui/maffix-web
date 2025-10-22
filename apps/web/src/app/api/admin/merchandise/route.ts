import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Validation schema for creating merchandise
const createMerchandiseSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  price: z.number().positive(),
  category: z.enum(['CLOTHING', 'ACCESSORIES', 'MUSIC', 'COLLECTIBLES', 'OTHER']),
  material: z.string().optional(),
  features: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().url(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  variants: z.array(z.object({
    size: z.string().optional(),
    color: z.string().optional(),
    sku: z.string(),
    priceModifier: z.number().optional(),
    stockQuantity: z.number().int().min(0),
    inStock: z.boolean().optional(),
  })).optional(),
  images: z.array(z.object({
    url: z.string().url(),
    altText: z.string().optional(),
    sortOrder: z.number().int().optional(),
    isPrimary: z.boolean().optional(),
  })).optional(),
})

/**
 * POST /api/admin/merchandise
 * Create a new merchandise product
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validationResult = createMerchandiseSchema.safeParse(body)

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

    // Create merchandise with variants and images in a transaction
    const merchandise = await db.merchandise.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        material: data.material,
        features: data.features || [],
        tags: data.tags || [],
        imageUrl: data.imageUrl,
        inStock: data.inStock ?? true,
        featured: data.featured ?? false,
        sortOrder: data.sortOrder ?? 0,
        variants: data.variants ? {
          create: data.variants.map((variant) => ({
            size: variant.size,
            color: variant.color,
            sku: variant.sku,
            priceModifier: variant.priceModifier ?? 0,
            stockQuantity: variant.stockQuantity,
            inStock: variant.inStock ?? true,
          })),
        } : undefined,
        images: data.images ? {
          create: data.images.map((image) => ({
            url: image.url,
            altText: image.altText,
            sortOrder: image.sortOrder ?? 0,
            isPrimary: image.isPrimary ?? false,
          })),
        } : undefined,
      },
      include: {
        variants: true,
        images: true,
      },
    })

    return NextResponse.json({
      success: true,
      merchandise,
    })
  } catch (error: any) {
    console.error('Error creating merchandise:', error)
    return NextResponse.json(
      {
        error: 'Failed to create merchandise',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/merchandise
 * List all merchandise products with filtering
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const inStock = searchParams.get('inStock')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Build where clause
    const where: any = {}
    if (category) {
      where.category = category
    }
    if (featured !== null && featured !== undefined) {
      where.featured = featured === 'true'
    }
    if (inStock !== null && inStock !== undefined) {
      where.inStock = inStock === 'true'
    }

    // Get merchandise with pagination
    const [merchandise, total] = await Promise.all([
      db.merchandise.findMany({
        where,
        include: {
          variants: true,
          images: true,
          _count: {
            select: {
              cartItems: true,
              orderItems: true,
            },
          },
        },
        orderBy: [
          { featured: 'desc' },
          { sortOrder: 'asc' },
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.merchandise.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      merchandise,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error listing merchandise:', error)
    return NextResponse.json(
      {
        error: 'Failed to list merchandise',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

