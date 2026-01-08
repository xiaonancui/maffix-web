import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AuraZoneClient from './aura-zone-client'

export const metadata = {
  title: 'Aura Zone - Maffix',
  description: 'Draw exclusive prizes in the Aura Zone',
}

// Banner type for client component
export interface BannerData {
  id: string
  name: string
  slug: string
  description: string | null
  backgroundVideoUrl: string
  currencyType: 'DIAMONDS' | 'TICKETS'
  costPerPull: number
  isActive: boolean
}

export default async function AuraZonePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch user data for balances
  let diamonds = 0
  let tickets = 0

  const allowTestAccounts =
    process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_ACCOUNTS === 'true'

  const isTestAccount =
    allowTestAccounts &&
    (session.user.id?.includes('test-') ||
      session.user.id?.includes('demo-') ||
      session.user.id?.includes('admin-'))

  // Default banners for test accounts or fallback
  const defaultBanners: BannerData[] = [
    {
      id: 'beat-like-dat',
      name: 'Beat Like Dat',
      slug: 'beat-like-dat',
      description: 'Exclusive rewards from the Beat Like Dat collection',
      backgroundVideoUrl: '/banners/beat-like-dat.mp4',
      currencyType: 'DIAMONDS',
      costPerPull: 300,
      isActive: true,
    },
    {
      id: 'sybau',
      name: 'SYBAU',
      slug: 'sybau',
      description: 'Special SYBAU collection rewards',
      backgroundVideoUrl: '/banners/sybau.mp4',
      currencyType: 'DIAMONDS',
      costPerPull: 300,
      isActive: true,
    },
  ]

  let banners: BannerData[] = defaultBanners

  if (isTestAccount) {
    // Mock data for test accounts
    diamonds = session.user.role === 'ADMIN' ? 10000 : 3000
    tickets = session.user.role === 'ADMIN' ? 50 : 10
  } else {
    try {
      const { db } = await import('@/lib/db')

      // Fetch user data
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          diamonds: true,
          tickets: true,
        },
      })

      diamonds = user?.diamonds || 0
      tickets = user?.tickets || 0

      // Fetch active banners
      const now = new Date()
      const dbBanners = await db.gachaBanner.findMany({
        where: {
          isActive: true,
          startDate: { lte: now },
          endDate: { gte: now },
        },
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          backgroundVideoUrl: true,
          currencyType: true,
          costPerPull: true,
          isActive: true,
        },
      })

      // Use database banners if available, otherwise use defaults
      if (dbBanners.length > 0) {
        banners = dbBanners.map((b) => ({
          id: b.id,
          name: b.name,
          slug: b.slug,
          description: b.description,
          backgroundVideoUrl: b.backgroundVideoUrl,
          currencyType: b.currencyType as 'DIAMONDS' | 'TICKETS',
          costPerPull: b.costPerPull,
          isActive: b.isActive,
        }))
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  return (
    <AuraZoneClient
      diamonds={diamonds}
      tickets={tickets}
      userId={session.user.id}
      userRole={session.user.role || 'USER'}
      banners={banners}
    />
  )
}
