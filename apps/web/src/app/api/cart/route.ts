import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * GET /api/cart
 * Get user's shopping cart with items
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Get or create cart for user
    let cart = await db.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            merchandise: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
            variant: true,
          },
        },
      },
    })

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await db.cart.create({
        data: {
          userId: session.user.id,
        },
        include: {
          items: {
            include: {
              merchandise: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                },
              },
              variant: true,
            },
          },
        },
      })
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      const basePrice = item.merchandise.price
      const variantPrice = item.variant?.priceModifier || 0
      const itemTotal = (basePrice + variantPrice) * item.quantity
      return sum + itemTotal
    }, 0)

    return NextResponse.json({
      success: true,
      cart: {
        ...cart,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
      },
    })
  } catch (error: any) {
    console.error('Error getting cart:', error)
    return NextResponse.json(
      {
        error: 'Failed to get cart',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

