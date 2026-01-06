import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'

/**
 * POST /api/payment/webhook
 * Handle Klarna payment webhook notifications
 * 
 * This endpoint is called by Klarna when a payment status changes
 * (e.g., authorized, captured, cancelled, refunded)
 */
export async function POST(request: Request) {
  try {
    // Get the raw body for signature verification
    const body = await request.text()
    const headersList = headers()
    
    // Klarna sends a signature in the header for verification
    const klarnaSignature = headersList.get('klarna-signature')
    
    // Verify Klarna signature (if configured)
    // Note: In production, you should verify the webhook signature
    // to ensure it's actually from Klarna
    if (process.env.KLARNA_WEBHOOK_SECRET && klarnaSignature) {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.KLARNA_WEBHOOK_SECRET)
        .update(body)
        .digest('base64')
      
      if (klarnaSignature !== expectedSignature) {
        console.error('Invalid Klarna webhook signature')
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    // Parse the webhook payload
    const payload = JSON.parse(body)
    
    console.log('Klarna webhook received:', {
      event_type: payload.event_type,
      order_id: payload.order_id,
    })

    // Handle different event types
    switch (payload.event_type) {
      case 'ORDER_AUTHORIZED':
        await handleOrderAuthorized(payload)
        break
      
      case 'ORDER_CAPTURED':
        await handleOrderCaptured(payload)
        break
      
      case 'ORDER_CANCELLED':
        await handleOrderCancelled(payload)
        break
      
      case 'ORDER_REFUNDED':
        await handleOrderRefunded(payload)
        break
      
      default:
        console.log('Unhandled Klarna event type:', payload.event_type)
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    // Still return 200 to prevent Klarna from retrying
    return NextResponse.json({ received: true, error: 'Processing failed' })
  }
}

/**
 * Handle ORDER_AUTHORIZED event
 * This is called when a customer completes the payment authorization
 */
async function handleOrderAuthorized(payload: any) {
  const { db } = await import('@/lib/db')

  const orderId = payload.order_id
  const merchantReference1 = payload.merchant_reference1 // Order number or User ID
  const merchantReference2 = payload.merchant_reference2 // Order ID or Pack ID

  try {
    // Check if this is a merchandise order (starts with ORD-)
    if (merchantReference1 && merchantReference1.startsWith('ORD-')) {
      // Handle merchandise order
      const order = await db.order.findUnique({
        where: { id: merchantReference2 },
      })

      if (!order) {
        console.error('Merchandise order not found:', merchantReference2)
        return
      }

      // Update order status
      await db.order.update({
        where: { id: order.id },
        data: {
          paymentId: orderId,
          status: 'PAID',
        },
      })

      console.log('Merchandise order authorized:', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        klarnaOrderId: orderId,
      })
    } else {
      // Handle Premium Pack purchase
      const purchase = await db.purchase.findFirst({
        where: {
          userId: merchantReference1,
          packId: merchantReference2,
          status: 'PENDING',
        },
        include: {
          pack: {
            include: {
              guaranteedPrize: true,
            },
          },
          user: true,
        },
      })

      if (!purchase) {
        console.error('Purchase not found for order:', orderId)
        return
      }

      // Update purchase with Klarna order ID and status
      await db.purchase.update({
        where: { id: purchase.id },
        data: {
          klarnaOrderId: orderId,
          status: 'PROCESSING',
        },
      })

      console.log('Premium pack order authorized:', {
        purchaseId: purchase.id,
        orderId,
        userId: merchantReference1,
        packId: merchantReference2,
      })
    }

    // Note: We'll grant items in ORDER_CAPTURED event
    // ORDER_AUTHORIZED just means the payment is approved but not yet captured
  } catch (error) {
    console.error('Error handling ORDER_AUTHORIZED:', error)
    throw error
  }
}

/**
 * Handle ORDER_CAPTURED event
 * This is called when the payment is actually captured (money taken)
 * This is when we should grant the items to the user
 */
async function handleOrderCaptured(payload: any) {
  const { db } = await import('@/lib/db')

  const orderId = payload.order_id

  try {
    // Check if this is a merchandise order
    const merchandiseOrder = await db.order.findFirst({
      where: { paymentId: orderId },
    })

    if (merchandiseOrder) {
      // Handle merchandise order completion
      if (merchandiseOrder.status === 'PAID') {
        await db.order.update({
          where: { id: merchandiseOrder.id },
          data: {
            status: 'PROCESSING',
            paidAt: new Date(),
          },
        })

        console.log('Merchandise order captured:', {
          orderId: merchandiseOrder.id,
          orderNumber: merchandiseOrder.orderNumber,
          amount: merchandiseOrder.totalAmount,
        })
      }
      return
    }

    // Handle Premium Pack purchase
    const purchase = await db.purchase.findUnique({
      where: { klarnaOrderId: orderId },
      include: {
        pack: {
          include: {
            guaranteedPrize: true,
          },
        },
        user: true,
      },
    })

    if (!purchase) {
      console.error('Purchase not found for captured order:', orderId)
      return
    }

    if (purchase.status === 'COMPLETED') {
      console.log('Purchase already completed:', purchase.id)
      return
    }

    // Grant items in a transaction to ensure atomicity
    await db.$transaction(async (tx) => {
      // 1. Grant guaranteed prize if exists
      if (purchase.pack.guaranteedPrizeId && !purchase.itemsGranted) {
        await tx.userPrize.create({
          data: {
            userId: purchase.userId,
            prizeId: purchase.pack.guaranteedPrizeId,
            source: 'PURCHASE',
          },
        })
      }

      // 2. Grant bonus draw tickets if any
      if (purchase.pack.bonusTickets > 0 && !purchase.ticketsGranted) {
        await tx.drawTicket.create({
          data: {
            userId: purchase.userId,
            ticketType: 'SINGLE',
            quantity: purchase.pack.bonusTickets,
            source: 'PURCHASE',
            sourceRef: purchase.id,
          },
        })
      }

      // 3. Grant bonus diamonds if any
      if (purchase.pack.bonusDiamonds > 0 && !purchase.diamondsGranted) {
        await tx.user.update({
          where: { id: purchase.userId },
          data: {
            diamonds: {
              increment: purchase.pack.bonusDiamonds,
            },
          },
        })

        // Create transaction record for diamonds
        await tx.transaction.create({
          data: {
            userId: purchase.userId,
            type: 'PURCHASE',
            amount: purchase.pack.bonusDiamonds,
            currency: 'DIAMONDS',
            description: `Bonus diamonds from ${purchase.pack.name}`,
            reference: purchase.id,
            status: 'COMPLETED',
          },
        })
      }

      // 4. Update purchase status
      await tx.purchase.update({
        where: { id: purchase.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          itemsGranted: true,
          ticketsGranted: true,
          diamondsGranted: true,
        },
      })

      // 5. Create transaction record for the purchase
      await tx.transaction.create({
        data: {
          userId: purchase.userId,
          type: 'PURCHASE',
          amount: Math.round(purchase.amount * 100), // Convert to cents
          currency: 'DIAMONDS', // Using DIAMONDS as currency type
          description: `Purchased ${purchase.pack.name}`,
          reference: purchase.id,
          status: 'COMPLETED',
        },
      })
    })

    console.log('Order captured and items granted:', {
      purchaseId: purchase.id,
      orderId,
      userId: purchase.userId,
      packName: purchase.pack.name,
      guaranteedPrize: purchase.pack.guaranteedPrize?.name,
      bonusTickets: purchase.pack.bonusTickets,
      bonusDiamonds: purchase.pack.bonusDiamonds,
    })

    // TODO: Send confirmation email to user
    // await sendPurchaseConfirmationEmail(purchase.user.email, purchase)
  } catch (error) {
    console.error('Error handling ORDER_CAPTURED:', error)
    throw error
  }
}

/**
 * Handle ORDER_CANCELLED event
 */
async function handleOrderCancelled(payload: any) {
  const { db } = await import('@/lib/db')
  
  const orderId = payload.order_id
  
  try {
    const purchase = await db.purchase.findUnique({
      where: { klarnaOrderId: orderId },
    })

    if (!purchase) {
      console.error('Purchase not found for cancelled order:', orderId)
      return
    }

    await db.purchase.update({
      where: { id: purchase.id },
      data: {
        status: 'CANCELLED',
      },
    })

    console.log('Order cancelled:', {
      purchaseId: purchase.id,
      orderId,
    })
  } catch (error) {
    console.error('Error handling ORDER_CANCELLED:', error)
    throw error
  }
}

/**
 * Handle ORDER_REFUNDED event
 */
async function handleOrderRefunded(payload: any) {
  const { db } = await import('@/lib/db')
  
  const orderId = payload.order_id
  
  try {
    const purchase = await db.purchase.findUnique({
      where: { klarnaOrderId: orderId },
    })

    if (!purchase) {
      console.error('Purchase not found for refunded order:', orderId)
      return
    }

    await db.purchase.update({
      where: { id: purchase.id },
      data: {
        status: 'REFUNDED',
      },
    })

    console.log('Order refunded:', {
      purchaseId: purchase.id,
      orderId,
    })

    // TODO: Revoke items if needed
    // This is complex and depends on your business logic
  } catch (error) {
    console.error('Error handling ORDER_REFUNDED:', error)
    throw error
  }
}

