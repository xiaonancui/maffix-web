import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Validation schema for updating cart item
const updateCartItemSchema = z.object({
  itemId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
})

/**
 * PATCH /api/cart/update
 * Update cart item quantity
 */
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validationResult = updateCartItemSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const { itemId, quantity } = validationResult.data

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Get cart item and verify ownership
    const cartItem = await db.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        merchandise: true,
        variant: true,
      },
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    if (cartItem.cart.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check stock availability
    if (cartItem.variant) {
      if (cartItem.variant.stockQuantity < quantity) {
        return NextResponse.json(
          { error: 'Insufficient stock' },
          { status: 400 }
        )
      }
    }

    // Update quantity
    const updatedItem = await db.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        merchandise: true,
        variant: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Cart item updated',
      cartItem: updatedItem,
    })
  } catch (error: any) {
    console.error('Error updating cart item:', error)
    return NextResponse.json(
      {
        error: 'Failed to update cart item',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

