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

// Validation schema for updating a gacha item
const updateGachaItemSchema = z.object({
  probability: z.number().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
})

/**
 * GET /api/admin/gacha/items/[id]
 * Get a single gacha item by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin authentication
    const authResult = await requireAdmin()
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const gachaItem = await db.gachaItem.findUnique({
      where: { id: params.id },
      include: {
        prize: true,
        _count: {
          select: {
            pulls: true,
          },
        },
      },
    })

    if (!gachaItem) {
      return errorResponse('Gacha item not found', HttpStatus.NOT_FOUND)
    }

    return successResponse({ gachaItem })
  } catch (error) {
    return handleDatabaseError(error)
  }
}

/**
 * PATCH /api/admin/gacha/items/[id]
 * Update a gacha item
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin authentication
    const authResult = await requireAdmin()
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { session } = authResult

    // Validate request body
    const validationResult = await validateRequest(request, updateGachaItemSchema)
    if (validationResult instanceof NextResponse) {
      return validationResult
    }
    const { data } = validationResult

    // Check if gacha item exists
    const existingItem = await db.gachaItem.findUnique({
      where: { id: params.id },
    })

    if (!existingItem) {
      return errorResponse('Gacha item not found', HttpStatus.NOT_FOUND)
    }

    // Update gacha item
    const gachaItem = await db.gachaItem.update({
      where: { id: params.id },
      data,
      include: {
        prize: true,
      },
    })

    // Log admin action
    await logAdminAction(
      'UPDATE_GACHA_ITEM',
      session.user.id,
      session.user.email,
      {
        gachaItemId: params.id,
        changes: data,
      }
    )

    return successResponse(
      { gachaItem },
      HttpStatus.OK,
      'Gacha item updated successfully'
    )
  } catch (error) {
    return handleDatabaseError(error)
  }
}

/**
 * DELETE /api/admin/gacha/items/[id]
 * Delete a gacha item
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin authentication
    const authResult = await requireAdmin()
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { session } = authResult

    // Check if gacha item exists
    const existingItem = await db.gachaItem.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            pulls: true,
          },
        },
      },
    })

    if (!existingItem) {
      return errorResponse('Gacha item not found', HttpStatus.NOT_FOUND)
    }

    // Soft delete by deactivating instead of hard delete if there are pulls
    if (existingItem._count.pulls > 0) {
      const gachaItem = await db.gachaItem.update({
        where: { id: params.id },
        data: { isActive: false },
      })

      await logAdminAction(
        'DEACTIVATE_GACHA_ITEM',
        session.user.id,
        session.user.email,
        {
          gachaItemId: params.id,
          reason: 'Has existing pulls',
        }
      )

      return successResponse(
        { gachaItem },
        HttpStatus.OK,
        'Gacha item deactivated (has existing pulls)'
      )
    }

    // Hard delete if no pulls
    await db.gachaItem.delete({
      where: { id: params.id },
    })

    // Log admin action
    await logAdminAction(
      'DELETE_GACHA_ITEM',
      session.user.id,
      session.user.email,
      {
        gachaItemId: params.id,
      }
    )

    return successResponse(null, HttpStatus.NO_CONTENT, 'Gacha item deleted successfully')
  } catch (error) {
    return handleDatabaseError(error)
  }
}
