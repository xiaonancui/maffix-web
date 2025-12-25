import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Simple in-memory OTP store (in production, use Redis or database)
const otpStore = new Map<string, { code: string; expiresAt: number; email: string }>()

// Clean up expired OTPs every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of otpStore.entries()) {
    if (value.expiresAt < now) {
      otpStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * Generate a 6-digit OTP code
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Hash email for storage (privacy)
 */
function hashEmail(email: string): string {
  return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex')
}

/**
 * Send OTP email
 * In production, integrate with SendGrid, Resend, or similar service
 */
async function sendOTPEmail(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  // For development/testing, log the OTP to console
  if (process.env.NODE_ENV === 'development') {
    console.log(`[OTP] Email: ${email}, Code: ${code}`)
    return { success: true }
  }

  // In production, integrate with your email service
  // Example with Resend:
  // try {
  //   const resend = new Resend(process.env.RESEND_API_KEY)
  //   await resend.emails.send({
  //     from: 'Maffix <noreply@maffix.io>',
  //     to: email,
  //     subject: 'Your Maffix Verification Code',
  //     html: `<p>Your verification code is: <strong>${code}</strong></p><p>This code will expire in 10 minutes.</p>`,
  //   })
  //   return { success: true }
  // } catch (error) {
  //   console.error('Email send error:', error)
  //   return { success: false, error: 'Failed to send email' }
  // }

  return { success: true } // Placeholder
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Generate OTP
    const code = generateOTP()
    const hashedEmail = hashEmail(email)
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

    // Store OTP
    otpStore.set(hashedEmail, { code, expiresAt, email })

    // Send email
    const emailResult = await sendOTPEmail(email, code)

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
  } catch (error) {
    console.error('OTP send error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Get OTP store (for testing/verification endpoint)
 */
export function getOTPStore() {
  return otpStore
}
