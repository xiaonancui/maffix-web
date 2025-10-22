import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Validation schema for creating variant
const createVariantSchema = z.object({
  size: z.string().optional(),
  color: z.string().optional(),
  sku: z.string(),
  priceModifier: z.number().optional(),
  stockQuantity: z.number().int().min(0),
  inStock: z.boolean().optional(),
})

// Validation schema for updating variant
const updateVariantSchema = z.object({
  size: z.string().optional(),
  color: z.string().optional(),
  sku: z.string().optional(),
  priceModifier: z.number().optional(),
  stockQuantity: z.number().int().min(0).optional(),
  inStock: z.boolean().optional(),
})

/**
 * POST /api/admin/merchandise/[id]/variants
 * Create a new variant for a merchandise product
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: merchandiseId } = params
    const body = await request.json()
    const validationResult = createVariantSchema.safeParse(body)

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

    // Check if merchandise exists
    const merchandise = await db.merchandise.findUnique({
      where: { id: merchandiseId },
    })

    if (!merchandise) {
      return NextResponse.json(
        { error: 'Merchandise not found' },
        { status: 404 }
      )
    }

    // Check if SKU already exists
    const existingVariant = await db.merchandiseVariant.findUnique({
      where: { sku: data.sku },
    })

    if (existingVariant) {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 400 }
      )
    }

    // Create variant
    const variant = await db.merchandiseVariant.create({
      data: {
        merchandiseId,
        size: data.size,
        color: data.color,
        sku: data.sku,
        priceModifier: data.priceModifier ?? 0,
        stockQuantity: data.stockQuantity,
        inStock: data.inStock ?? true,
      },
    })

    return NextResponse.json({
      success: true,
      variant,
    })
  } catch (error: any) {
    console.error('Error creating variant:', error)
    return NextResponse.json(
      {
        error: 'Failed to create variant',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/merchandise/[id]/variants
 * List all variants for a merchandise product
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: merchandiseId } = params

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Check if merchandise exists
    const merchandise = await db.merchandise.findUnique({
      where: { id: merchandiseId },
    })

    if (!merchandise) {
      return NextResponse.json(
        { error: 'Merchandise not found' },
        { status: 404 }
      )
    }

    // Get variants
    const variants = await db.merchandiseVariant.findMany({
      where: { merchandiseId },
      orderBy: [
        { size: 'asc' },
        { color: 'asc' },
      ],
    })

    return NextResponse.json({
      success: true,
      variants,
    })
  } catch (error: any) {
    console.error('Error listing variants:', error)
    return NextResponse.json(
      {
        error: 'Failed to list variants',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/merchandise/[id]/variants/[variantId]
 * Update a variant
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; variantId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: merchandiseId, variantId } = params
    const body = await request.json()
    const validationResult = updateVariantSchema.safeParse(body)

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

    // Check if variant exists and belongs to merchandise
    const existingVariant = await db.merchandiseVariant.findFirst({
      where: {
        id: variantId,
        merchandiseId,
      },
    })

    if (!existingVariant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      )
    }

    // If updating SKU, check if new SKU already exists
    if (data.sku && data.sku !== existingVariant.sku) {
      const skuExists = await db.merchandiseVariant.findUnique({
        where: { sku: data.sku },
      })

      if (skuExists) {
        return NextResponse.json(
          { error: 'SKU already exists' },
          { status: 400 }
        )
      }
    }

    // Update variant
    const variant = await db.merchandiseVariant.update({
      where: { id: variantId },
      data: {
        ...(data.size !== undefined && { size: data.size }),
        ...(data.color !== undefined && { color: data.color }),
        ...(data.sku && { sku: data.sku }),
        ...(data.priceModifier !== undefined && { priceModifier: data.priceModifier }),
        ...(data.stockQuantity !== undefined && { stockQuantity: data.stockQuantity }),
        ...(data.inStock !== undefined && { inStock: data.inStock }),
      },
    })

    return NextResponse.json({
      success: true,
      variant,
    })
  } catch (error: any) {
    console.error('Error updating variant:', error)
    return NextResponse.json(
      {
        error: 'Failed to update variant',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

