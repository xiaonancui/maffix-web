import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { z } from 'zod'

// Validation schema for updating merchandise
const updateMerchandiseSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  category: z.enum(['CLOTHING', 'ACCESSORIES', 'MUSIC', 'COLLECTIBLES', 'OTHER']).optional(),
  material: z.string().nullable().optional(),
  features: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

/**
 * GET /api/admin/merchandise/[id]
 * Get a single merchandise product with details
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    const { id } = params

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    const merchandise = await db.merchandise.findUnique({
      where: { id },
      include: {
        variants: true,
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
        _count: {
          select: {
            cartItems: true,
            orderItems: true,
          },
        },
      },
    })

    if (!merchandise) {
      return NextResponse.json(
        { error: 'Merchandise not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      merchandise,
    })
  } catch (error: any) {
    console.error('Error getting merchandise:', error)
    return NextResponse.json(
      {
        error: 'Failed to get merchandise',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/merchandise/[id]
 * Update a merchandise product
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    const { id } = params
    const body = await request.json()
    const validationResult = updateMerchandiseSchema.safeParse(body)

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
    const existingMerchandise = await db.merchandise.findUnique({
      where: { id },
    })

    if (!existingMerchandise) {
      return NextResponse.json(
        { error: 'Merchandise not found' },
        { status: 404 }
      )
    }

    // Update merchandise
    const merchandise = await db.merchandise.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.category && { category: data.category }),
        ...(data.material !== undefined && { material: data.material }),
        ...(data.features && { features: data.features }),
        ...(data.tags && { tags: data.tags }),
        ...(data.imageUrl && { imageUrl: data.imageUrl }),
        ...(data.inStock !== undefined && { inStock: data.inStock }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
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
    console.error('Error updating merchandise:', error)
    return NextResponse.json(
      {
        error: 'Failed to update merchandise',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/merchandise/[id]
 * Delete a merchandise product
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    const { id } = params

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Check if merchandise exists
    const existingMerchandise = await db.merchandise.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    })

    if (!existingMerchandise) {
      return NextResponse.json(
        { error: 'Merchandise not found' },
        { status: 404 }
      )
    }

    // Check if merchandise has been ordered
    if (existingMerchandise._count.orderItems > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete merchandise that has been ordered',
          message: 'This product has existing orders. Consider marking it as out of stock instead.',
        },
        { status: 400 }
      )
    }

    // Delete merchandise (cascades to variants and images)
    await db.merchandise.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Merchandise deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting merchandise:', error)
    return NextResponse.json(
      {
        error: 'Failed to delete merchandise',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

