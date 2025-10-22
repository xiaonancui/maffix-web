import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { klarnaClient, dollarsToCents, type KlarnaSessionRequest } from '@/lib/klarna'
import { z } from 'zod'

// Validation schema
const initiatePaymentSchema = z.object({
  packId: z.string().uuid('Invalid pack ID'),
})

/**
 * POST /api/payment/initiate
 * Initiate a Klarna payment session for a premium pack purchase
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate request body
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

    const { packId } = validationResult.data

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Get the premium pack
    const pack = await db.premiumPack.findUnique({
      where: { id: packId },
      include: {
        guaranteedPrize: true,
      },
    })

    if (!pack) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 })
    }

    if (!pack.isActive) {
      return NextResponse.json({ error: 'Pack is not available' }, { status: 400 })
    }

    // Get user details
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Convert price to cents (minor units)
    const amountInCents = dollarsToCents(pack.price)

    // Build order lines for Klarna
    const orderLines = [
      {
        type: 'digital' as const,
        reference: pack.id,
        name: pack.name,
        quantity: 1,
        unit_price: amountInCents,
        total_amount: amountInCents,
      },
    ]

    // Add guaranteed prize to description if exists
    let description = pack.description
    if (pack.guaranteedPrize) {
      description += `\n\nIncludes: ${pack.guaranteedPrize.name}`
    }
    if (pack.bonusTickets > 0) {
      description += `\n+ ${pack.bonusTickets} Bonus Draw Tickets`
    }
    if (pack.bonusDiamonds > 0) {
      description += `\n+ ${pack.bonusDiamonds} Bonus Diamonds`
    }

    // Prepare Klarna session request
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const klarnaSessionData: KlarnaSessionRequest = {
      purchase_country: 'US',
      purchase_currency: pack.currency,
      locale: 'en-US',
      order_amount: amountInCents,
      order_lines: orderLines,
      merchant_urls: {
        terms: `${appUrl}/terms`,
        checkout: `${appUrl}/store`,
        confirmation: `${appUrl}/payment/confirmation?pack_id=${packId}`,
        push: `${appUrl}/api/payment/webhook`, // Webhook URL
      },
      customer: {
        email: user.email,
        given_name: user.name?.split(' ')[0],
        family_name: user.name?.split(' ').slice(1).join(' ') || '',
      },
      merchant_reference1: user.id, // User ID
      merchant_reference2: packId,  // Pack ID
    }

    // Create Klarna payment session
    const klarnaSession = await klarnaClient.createSession(klarnaSessionData)

    // Create pending purchase record in database
    const purchase = await db.purchase.create({
      data: {
        userId: user.id,
        packId: pack.id,
        amount: pack.price,
        currency: pack.currency,
        status: 'PENDING',
        paymentMethod: 'KLARNA',
        // We'll update with klarnaOrderId after order is created
      },
    })

    return NextResponse.json({
      success: true,
      session: {
        session_id: klarnaSession.session_id,
        client_token: klarnaSession.client_token,
        payment_method_categories: klarnaSession.payment_method_categories,
      },
      purchase: {
        id: purchase.id,
        amount: purchase.amount,
        currency: purchase.currency,
        status: purchase.status,
      },
      pack: {
        id: pack.id,
        name: pack.name,
        description: description,
        price: pack.price,
        currency: pack.currency,
        imageUrl: pack.imageUrl,
        guaranteedPrize: pack.guaranteedPrize ? {
          id: pack.guaranteedPrize.id,
          name: pack.guaranteedPrize.name,
          rarity: pack.guaranteedPrize.rarity,
          image: pack.guaranteedPrize.image,
        } : null,
        bonusTickets: pack.bonusTickets,
        bonusDiamonds: pack.bonusDiamonds,
      },
    })
  } catch (error: any) {
    console.error('Payment initiation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to initiate payment',
        message: error.message || 'Internal server error',
      },
      { status: 500 }
    )
  }
}

