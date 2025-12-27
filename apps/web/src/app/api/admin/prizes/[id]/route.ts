import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { z } from 'zod'

// Validation schema for updating a prize
const updatePrizeSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  rarity: z.enum(['COMMON', 'RARE', 'EPIC', 'SSR', 'LEGENDARY']).optional(),
  type: z.enum(['PHYSICAL', 'DIGITAL', 'EXPERIENCE', 'DISCOUNT', 'EXCLUSIVE']).optional(),
  image: z.string().url().nullable().optional(),
  value: z.number().int().min(0).optional(),
  stock: z.number().int().min(0).nullable().optional(),
  isActive: z.boolean().optional(),
})

/**
 * GET /api/admin/prizes/[id]
 * Get a single prize with detailed information (admin only)
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    const prize = await db.prize.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            userPrizes: true,
            gachaItems: true,
            gachaPulls: true,
            premiumPacks: true,
          },
        },
      },
    })

    if (!prize) {
      return NextResponse.json({ error: 'Prize not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      prize,
    })
  } catch (error) {
    console.error('Get prize error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/prizes/[id]
 * Update a prize (admin only)
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    const body = await request.json()

    // Validate request body
    const validationResult = updatePrizeSchema.safeParse(body)
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

    // Check if prize exists
    const existingPrize = await db.prize.findUnique({
      where: { id: params.id },
    })

    if (!existingPrize) {
      return NextResponse.json({ error: 'Prize not found' }, { status: 404 })
    }

    // Update the prize
    const updatedPrize = await db.prize.update({
      where: { id: params.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.rarity && { rarity: data.rarity }),
        ...(data.type && { type: data.type }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.value !== undefined && { value: data.value }),
        ...(data.stock !== undefined && { stock: data.stock }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    })

    return NextResponse.json({
      success: true,
      prize: updatedPrize,
      message: 'Prize updated successfully',
    })
  } catch (error) {
    console.error('Update prize error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/prizes/[id]
 * Delete a prize (admin only)
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Check if prize exists
    const existingPrize = await db.prize.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            userPrizes: true,
            gachaItems: true,
            gachaPulls: true,
            premiumPacks: true,
          },
        },
      },
    })

    if (!existingPrize) {
      return NextResponse.json({ error: 'Prize not found' }, { status: 404 })
    }

    // Check if prize is in use
    const totalUsage =
      existingPrize._count.userPrizes +
      existingPrize._count.gachaItems +
      existingPrize._count.gachaPulls +
      existingPrize._count.premiumPacks

    if (totalUsage > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete prize that is in use',
          details: `This prize is referenced by ${totalUsage} records. Consider deactivating it instead.`,
        },
        { status: 409 }
      )
    }

    // Delete the prize
    await db.prize.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Prize deleted successfully',
    })
  } catch (error) {
    console.error('Delete prize error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

