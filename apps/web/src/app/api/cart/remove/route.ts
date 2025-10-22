import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Validation schema for removing cart item
const removeCartItemSchema = z.object({
  itemId: z.string().uuid(),
})

/**
 * DELETE /api/cart/remove
 * Remove item from shopping cart
 */
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validationResult = removeCartItemSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const { itemId } = validationResult.data

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Get cart item and verify ownership
    const cartItem = await db.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
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

    // Delete cart item
    await db.cartItem.delete({
      where: { id: itemId },
    })

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
    })
  } catch (error: any) {
    console.error('Error removing cart item:', error)
    return NextResponse.json(
      {
        error: 'Failed to remove cart item',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

