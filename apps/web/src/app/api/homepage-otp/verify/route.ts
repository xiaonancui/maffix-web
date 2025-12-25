import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * Hash email for storage (privacy)
 */
function hashEmail(email: string): string {
  return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex')
}

/**
 * Get OTP store (imported from send route)
 * Note: In production, use Redis or database instead
 */
// We'll use a shared store via a separate module
const otpStore = new Map<string, { code: string; expiresAt: number; email: string }>()

// Export a function to set the store (called by send route)
export function setOTPStore(store: Map<string, { code: string; expiresAt: number; email: string }>) {
  // Clear existing entries and copy from the provided store
  otpStore.clear()
  for (const [key, value] of store.entries()) {
    otpStore.set(key, value)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = body

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 })
    }

    const hashedEmail = hashEmail(email)
    const otpData = otpStore.get(hashedEmail)

    if (!otpData) {
      return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 400 })
    }

    if (Date.now() > otpData.expiresAt) {
      otpStore.delete(hashedEmail)
      return NextResponse.json({ error: 'Verification code has expired' }, { status: 400 })
    }

    if (otpData.code !== code) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
    }

    // Code is valid - mark as verified
    // If user is logged in, update their record
    const session = await getServerSession(authOptions)

    if (session) {
      try {
        const { db } = await import('@/lib/db')
        await db.user.update({
          where: { id: session.user.id },
          data: {
            isHomepageVerified: true,
            otpSecret: hashedEmail, // Store the hash as proof of verification
          },
        })
      } catch (error) {
        console.error('Failed to update user verification:', error)
      }
    }

    // Clear the used OTP
    otpStore.delete(hashedEmail)

    // Return success with a session token that can be stored
    const verificationToken = Buffer.from(
      JSON.stringify({ email: hashedEmail, verifiedAt: Date.now() })
    ).toString('base64')

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      verificationToken,
    })
  } catch (error) {
    console.error('OTP verify error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET endpoint to check if user is verified
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ verified: false })
    }

    const { db } = await import('@/lib/db')
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { isHomepageVerified: true },
    })

    return NextResponse.json({
      verified: user?.isHomepageVerified || false,
    })
  } catch (error) {
    console.error('OTP check error:', error)
    return NextResponse.json({ verified: false }, { status: 500 })
  }
}
