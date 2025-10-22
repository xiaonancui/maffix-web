import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Validation schema for updating a premium pack
const updatePackSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  currency: z.string().optional(),
  guaranteedPrizeId: z.string().nullable().optional(),
  bonusTickets: z.number().int().min(0).optional(),
  bonusDiamonds: z.number().int().min(0).optional(),
  imageUrl: z.string().url().nullable().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

/**
 * GET /api/admin/packs/[id]
 * Get a single premium pack (admin only)
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    const pack = await db.premiumPack.findUnique({
      where: { id: params.id },
      include: {
        guaranteedPrize: {
          select: {
            id: true,
            name: true,
            description: true,
            rarity: true,
            type: true,
            image: true,
            value: true,
          },
        },
        _count: {
          select: {
            purchases: true,
          },
        },
      },
    })

    if (!pack) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      pack,
    })
  } catch (error) {
    console.error('Get pack error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/packs/[id]
 * Update a premium pack (admin only)
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const body = await request.json()

    // Validate request body
    const validationResult = updatePackSchema.safeParse(body)
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

    // Check if pack exists
    const existingPack = await db.premiumPack.findUnique({
      where: { id: params.id },
    })

    if (!existingPack) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 })
    }

    // If guaranteedPrizeId is being updated, verify it exists
    if (data.guaranteedPrizeId !== undefined && data.guaranteedPrizeId !== null) {
      const prize = await db.prize.findUnique({
        where: { id: data.guaranteedPrizeId },
      })

      if (!prize) {
        return NextResponse.json(
          { error: 'Guaranteed prize not found' },
          { status: 404 }
        )
      }

      if (!prize.isActive) {
        return NextResponse.json(
          { error: 'Guaranteed prize is not active' },
          { status: 400 }
        )
      }
    }

    // Update the pack
    const updatedPack = await db.premiumPack.update({
      where: { id: params.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.currency && { currency: data.currency }),
        ...(data.guaranteedPrizeId !== undefined && { guaranteedPrizeId: data.guaranteedPrizeId }),
        ...(data.bonusTickets !== undefined && { bonusTickets: data.bonusTickets }),
        ...(data.bonusDiamonds !== undefined && { bonusDiamonds: data.bonusDiamonds }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      include: {
        guaranteedPrize: {
          select: {
            id: true,
            name: true,
            description: true,
            rarity: true,
            type: true,
            image: true,
            value: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      pack: updatedPack,
      message: 'Premium pack updated successfully',
    })
  } catch (error) {
    console.error('Update pack error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/packs/[id]
 * Deactivate a premium pack (admin only)
 * Note: We don't actually delete packs, just deactivate them
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Check if pack exists
    const existingPack = await db.premiumPack.findUnique({
      where: { id: params.id },
    })

    if (!existingPack) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 })
    }

    // Deactivate the pack instead of deleting
    const deactivatedPack = await db.premiumPack.update({
      where: { id: params.id },
      data: {
        isActive: false,
      },
    })

    return NextResponse.json({
      success: true,
      pack: deactivatedPack,
      message: 'Premium pack deactivated successfully',
    })
  } catch (error) {
    console.error('Delete pack error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

