import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock site settings (in production, this would be stored in database)
let siteSettings = {
  siteName: 'Maffix',
  siteDescription: 'TikTok-focused MVP platform for musician-fan engagement',
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  logoUrl: '/logo.png',
  faviconUrl: '/favicon.ico',
  emailEnabled: true,
  smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtpPort: parseInt(process.env.SMTP_PORT || '587'),
  smtpUser: process.env.SMTP_USER || '',
  smtpPassword: process.env.SMTP_PASSWORD || '',
  emailFrom: process.env.EMAIL_FROM || 'noreply@maffix.com',
  emailFromName: 'Maffix',
  tiktokApiKey: process.env.TIKTOK_API_KEY || '',
  tiktokApiSecret: process.env.TIKTOK_API_SECRET || '',
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || '',
  facebookPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID || '',
  enableGacha: true,
  enableStore: true,
  enableMissions: true,
  enablePrizes: true,
  enableReleases: true,
  maintenanceMode: false,
  maintenanceMessage: 'We are currently performing maintenance. Please check back soon.',
  maintenanceAllowedIPs: [],
  tiktokUrl: '',
  instagramUrl: '',
  twitterUrl: '',
  youtubeUrl: '',
  debugMode: process.env.NODE_ENV === 'development',
  logLevel: 'info',
  maxUploadSize: 10,
}

// GET /api/admin/settings - Get site settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      settings: siteSettings,
    })
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch site settings' },
      { status: 500 }
    )
  }
}

// POST /api/admin/settings - Update site settings
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.siteName || !body.siteUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update settings (in production, save to database)
    siteSettings = {
      ...siteSettings,
      ...body,
    }

    return NextResponse.json({
      success: true,
      message: 'Site settings updated successfully',
      settings: siteSettings,
    })
  } catch (error) {
    console.error('Error updating site settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update site settings' },
      { status: 500 }
    )
  }
}

