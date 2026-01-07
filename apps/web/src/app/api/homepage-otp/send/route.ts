import { NextRequest, NextResponse } from 'next/server'
import { sendOTPEmail } from '@/lib/email'

/**
 * Generate a 6-digit OTP code
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Rate limiting: max 3 requests per email per 10 minutes
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(email: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const key = email.toLowerCase()
  const limit = rateLimitMap.get(key)

  // Clean up expired entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [k, v] of rateLimitMap) {
      if (now > v.resetAt) rateLimitMap.delete(k)
    }
  }

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + 10 * 60 * 1000 })
    return { allowed: true }
  }

  if (limit.count >= 3) {
    const retryAfter = Math.ceil((limit.resetAt - now) / 1000)
    return { allowed: false, retryAfter }
  }

  limit.count++
  return { allowed: true }
}

/**
 * POST /api/homepage-otp/send
 * Send OTP verification code to email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check rate limit
    const rateLimit = checkRateLimit(normalizedEmail)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimit.retryAfter
        },
        { status: 429 }
      )
    }

    // Generate OTP
    const code = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Save or update email subscription with OTP
    await db.emailSubscription.upsert({
      where: { email: normalizedEmail },
      create: {
        email: normalizedEmail,
        source: 'homepage_gate',
        otpCode: code,
        otpExpiry,
      },
      update: {
        otpCode: code,
        otpExpiry,
      },
    })

    // Send email
    const emailResult = await sendOTPEmail(normalizedEmail, code)

    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.error || 'Failed to send verification email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      // In development, return the code for testing
      ...(process.env.NODE_ENV === 'development' && { devCode: code }),
    })
  } catch (error: any) {
    console.error('OTP send error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
