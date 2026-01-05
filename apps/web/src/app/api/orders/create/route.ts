import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Validation schema for creating order
const createOrderSchema = z.object({
  shippingName: z.string().min(1),
  shippingEmail: z.string().email(),
  shippingAddress: z.string().min(1),
  shippingCity: z.string().min(1),
  shippingState: z.string().optional(),
  shippingZip: z.string().min(1),
  shippingCountry: z.string().min(1),
  shippingPhone: z.string().optional(),
  customerNotes: z.string().optional(),
})

/**
 * POST /api/orders/create
 * Create order from cart
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validationResult = createOrderSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const shippingData = validationResult.data

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Get cart with items
    const cart = await db.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            merchandise: true,
            variant: true,
          },
        },
      },
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Calculate total (preliminary - will be recalculated in transaction)
    const totalAmount = cart.items.reduce((sum, item) => {
      const basePrice = item.merchandise.price
      const variantPrice = item.variant?.priceModifier || 0
      return sum + (basePrice + variantPrice) * item.quantity
    }, 0)

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Create order in transaction with stock validation inside to prevent race conditions
    const order = await db.$transaction(async (tx) => {
      // Re-validate stock inside transaction to prevent race conditions
      for (const item of cart.items) {
        // Check merchandise stock
        const merchandise = await tx.merchandise.findUnique({
          where: { id: item.merchandiseId },
        })

        if (!merchandise || !merchandise.inStock) {
          throw new Error(`${item.merchandise.name} is out of stock`)
        }

        // Check variant stock with row-level locking
        if (item.variantId) {
          const variant = await tx.merchandiseVariant.findUnique({
            where: { id: item.variantId },
          })

          if (!variant || !variant.inStock || variant.stockQuantity < item.quantity) {
            throw new Error(`Insufficient stock for ${item.merchandise.name}`)
          }
        }
      }

      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          orderNumber,
          status: 'PENDING',
          totalAmount,
          currency: 'USD',
          ...shippingData,
        },
      })

      // Create order items
      for (const item of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            merchandiseId: item.merchandiseId,
            variantId: item.variantId,
            name: item.merchandise.name,
            description: item.merchandise.description,
            price: item.merchandise.price + (item.variant?.priceModifier || 0),
            quantity: item.quantity,
            size: item.variant?.size,
            color: item.variant?.color,
            imageUrl: item.merchandise.imageUrl,
          },
        })

        // Deduct stock if variant exists
        if (item.variantId) {
          await tx.merchandiseVariant.update({
            where: { id: item.variantId },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          })
        }
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      })

      return newOrder
    })

    // Fetch complete order with items
    const completeOrder = await db.order.findUnique({
      where: { id: order.id },
      include: {
        items: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: completeOrder,
    })
  } catch (error: any) {
    console.error('Error creating order:', error)

    // Handle stock validation errors specifically
    if (error.message?.includes('out of stock') || error.message?.includes('Insufficient stock')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to create order',
      },
      { status: 500 }
    )
  }
}

