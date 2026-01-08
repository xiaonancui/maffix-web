import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { z } from 'zod'

// Validation schema for updating a banner
const updateBannerSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with dashes').optional(),
  description: z.string().nullable().optional(),
  backgroundVideoUrl: z.string().min(1).optional(),
  currencyType: z.enum(['DIAMONDS', 'TICKETS']).optional(),
  costPerPull: z.number().int().positive().optional(),
  startDate: z.string().transform((val) => new Date(val)).optional(),
  endDate: z.string().transform((val) => new Date(val)).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

/**
 * GET /api/admin/gacha/banners/[id]
 * Get a single banner by ID
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
    const { db } = await import('@/lib/db')

    const banner = await db.gachaBanner.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            gachaItems: true,
            gachaPulls: true,
          },
        },
      },
    })

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      banner,
    })
  } catch (error: any) {
    console.error('Error fetching banner:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch banner',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/gacha/banners/[id]
 * Update a banner
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
    const validationResult = updateBannerSchema.safeParse(body)

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
    const { db } = await import('@/lib/db')

    // Check if banner exists
    const existingBanner = await db.gachaBanner.findUnique({
      where: { id },
    })

    if (!existingBanner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    // If slug is being changed, check for conflicts
    if (data.slug && data.slug !== existingBanner.slug) {
      const slugConflict = await db.gachaBanner.findUnique({
        where: { slug: data.slug },
      })
      if (slugConflict) {
        return NextResponse.json(
          { error: 'A banner with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Validate dates if both are provided
    const startDate = data.startDate || existingBanner.startDate
    const endDate = data.endDate || existingBanner.endDate
    if (startDate >= endDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // Update banner
    const banner = await db.gachaBanner.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.backgroundVideoUrl !== undefined && { backgroundVideoUrl: data.backgroundVideoUrl }),
        ...(data.currencyType !== undefined && { currencyType: data.currencyType }),
        ...(data.costPerPull !== undefined && { costPerPull: data.costPerPull }),
        ...(data.startDate !== undefined && { startDate: data.startDate }),
        ...(data.endDate !== undefined && { endDate: data.endDate }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
    })

    return NextResponse.json({
      success: true,
      banner,
    })
  } catch (error: any) {
    console.error('Error updating banner:', error)
    return NextResponse.json(
      {
        error: 'Failed to update banner',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/gacha/banners/[id]
 * Delete a banner (or deactivate if it has pulls)
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
    const { db } = await import('@/lib/db')

    // Check if banner exists and has pulls
    const banner = await db.gachaBanner.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            gachaPulls: true,
          },
        },
      },
    })

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    // If banner has pulls, deactivate instead of deleting
    if (banner._count.gachaPulls > 0) {
      await db.gachaBanner.update({
        where: { id },
        data: { isActive: false },
      })

      return NextResponse.json({
        success: true,
        message: 'Banner deactivated (has associated pulls)',
        deactivated: true,
      })
    }

    // Delete banner
    await db.gachaBanner.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Banner deleted',
      deleted: true,
    })
  } catch (error: any) {
    console.error('Error deleting banner:', error)
    return NextResponse.json(
      {
        error: 'Failed to delete banner',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
