import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Validation schema
const initiatePaymentSchema = z.object({
  orderId: z.string().uuid(),
})

/**
 * POST /api/payment/merchandise/initiate
 * Initiate Klarna payment for merchandise order
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
    const validationResult = initiatePaymentSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const { orderId } = validationResult.data

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Get order with items
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        user: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if order is already paid
    if (order.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Order is not pending payment' },
        { status: 400 }
      )
    }

    // Check if Klarna is configured
    const klarnaUsername = process.env.KLARNA_USERNAME
    const klarnaPassword = process.env.KLARNA_PASSWORD

    if (!klarnaUsername || !klarnaPassword) {
      // Return mock data for development
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          success: true,
          clientToken: 'mock_client_token_' + Date.now(),
          sessionId: 'mock_session_' + orderId,
          paymentMethodCategories: ['pay_later', 'pay_now', 'pay_over_time'],
          message: 'Mock payment session created (Klarna not configured)',
        })
      }

      return NextResponse.json(
        { error: 'Payment provider not configured' },
        { status: 500 }
      )
    }

    // Import Klarna client
    const { KlarnaClient } = await import('@/lib/klarna')
    const klarnaClient = new KlarnaClient(klarnaUsername, klarnaPassword)

    // Prepare order lines for Klarna
    const orderLines = order.items.map((item) => ({
      type: 'physical' as const,
      reference: item.id,
      name: item.name,
      quantity: item.quantity,
      unit_price: Math.round(item.price * 100), // Convert to cents
      tax_rate: 0,
      total_amount: Math.round(item.price * item.quantity * 100),
      total_tax_amount: 0,
    }))

    // Create Klarna payment session
    const klarnaSession = await klarnaClient.createPaymentSession({
      purchase_country: order.shippingCountry || 'US',
      purchase_currency: order.currency,
      locale: 'en-US',
      order_amount: Math.round(order.totalAmount * 100),
      order_tax_amount: 0,
      order_lines: orderLines,
      merchant_urls: {
        confirmation: `${process.env.NEXTAUTH_URL}/orders/${order.id}?payment=success`,
        push: `${process.env.NEXTAUTH_URL}/api/payment/webhook`,
      },
      merchant_reference1: order.orderNumber,
      merchant_reference2: order.id,
    })

    // Update order with payment session ID
    await db.order.update({
      where: { id: orderId },
      data: {
        paymentId: klarnaSession.session_id,
        paymentMethod: 'KLARNA',
      },
    })

    return NextResponse.json({
      success: true,
      clientToken: klarnaSession.client_token,
      sessionId: klarnaSession.session_id,
      paymentMethodCategories: klarnaSession.payment_method_categories,
    })
  } catch (error: any) {
    console.error('Error initiating payment:', error)
    return NextResponse.json(
      {
        error: 'Failed to initiate payment',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
