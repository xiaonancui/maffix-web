import { NextRequest, NextResponse } from 'next/server'
import { encode } from 'next-auth/jwt'

/**
 * POST /api/homepage-otp/verify
 * Verify OTP and auto-login/register user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = body

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Dynamic import to avoid build-time database connection
    const { db } = await import('@/lib/db')

    // Find email subscription with OTP
    const subscription = await db.emailSubscription.findUnique({
      where: { email: normalizedEmail },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      )
    }

    // Check if OTP is expired
    if (!subscription.otpExpiry || new Date() > subscription.otpExpiry) {
      return NextResponse.json(
        { error: 'Verification code has expired' },
        { status: 400 }
      )
    }

    // Check if OTP matches
    if (subscription.otpCode !== code) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Mark subscription as verified and clear OTP
    await db.emailSubscription.update({
      where: { email: normalizedEmail },
      data: {
        verified: true,
        verifiedAt: new Date(),
        otpCode: null,
        otpExpiry: null,
      },
    })

    // Check if user already exists
    let user = await db.user.findUnique({
      where: { email: normalizedEmail },
    })

    // If user doesn't exist, create one
    if (!user) {
      // Extract username from email (part before @)
      const emailPrefix = normalizedEmail.split('@')[0]
      // Clean up username (remove special characters, keep alphanumeric)
      let username = emailPrefix.replace(/[^a-zA-Z0-9]/g, '')

      // Ensure username is not empty
      if (!username) {
        username = 'user'
      }

      // Check if username already exists, if so add random suffix
      const existingUser = await db.user.findFirst({
        where: { name: username },
      })

      if (existingUser) {
        username = `${username}${Math.floor(Math.random() * 10000)}`
      }

      user = await db.user.create({
        data: {
          email: normalizedEmail,
          name: username,
          role: 'USER',
          diamonds: 0,
          points: 0,
          level: 1,
          provider: 'email',
        },
      })

      console.log(`[AUTH] New user created: ${user.email}`)
    }

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // Create JWT token for NextAuth session
    const secret = process.env.NEXTAUTH_SECRET
    if (!secret) {
      throw new Error('NEXTAUTH_SECRET is not configured')
    }

    const token = await encode({
      token: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      secret,
    })

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      redirectTo: '/dashboard',
    })

    // Set the NextAuth session cookie
    const isProduction = process.env.NODE_ENV === 'production'
    const cookieName = isProduction
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token'

    response.cookies.set(cookieName, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    return response
  } catch (error: any) {
    console.error('OTP verify error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/homepage-otp/verify
 * Check if user is already authenticated
 */
export async function GET(request: NextRequest) {
  try {
    // Check for session cookie
    const isProduction = process.env.NODE_ENV === 'production'
    const cookieName = isProduction
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token'

    const sessionToken = request.cookies.get(cookieName)

    if (sessionToken) {
      return NextResponse.json({ verified: true })
    }

    return NextResponse.json({ verified: false })
  } catch (error: any) {
    console.error('OTP check error:', error)
    return NextResponse.json({ verified: false }, { status: 500 })
  }
}
