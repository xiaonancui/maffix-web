import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PrizeRedeemButton from '@/components/dashboard/PrizeRedeemButton'

export default async function PrizesPage() {
  // Dynamic import to avoid build-time database connection
  const { db } = await import('@/lib/db')

  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch user's prizes
  let userPrizes: any[] = []

  const allowTestAccounts =
    process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_ACCOUNTS === 'true'

  const isTestAccount =
    allowTestAccounts &&
    (session.user.id?.includes('test-') ||
      session.user.id?.includes('demo-') ||
      session.user.id?.includes('admin-'))

  if (isTestAccount) {
    // Mock prizes for test accounts
    userPrizes = [
      {
        id: 'user-prize-1',
        userId: session.user.id,
        prizeId: 'prize-1',
        source: 'GACHA',
        acquiredAt: new Date('2024-01-20'),
        redeemed: false,
        redeemedAt: null,
        prize: {
          id: 'prize-1',
          name: 'VIP Concert Backstage Pass',
          description: 'Exclusive access to backstage area at any concert on the 2024 World Tour',
          rarity: 'LEGENDARY',
          type: 'EXPERIENCE',
          image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400',
          diamondValue: 1000,
        },
      },
      {
        id: 'user-prize-2',
        userId: session.user.id,
        prizeId: 'prize-2',
        source: 'GACHA',
        acquiredAt: new Date('2024-01-18'),
        redeemed: false,
        redeemedAt: null,
        prize: {
          id: 'prize-2',
          name: 'Limited Edition Signed Vinyl',
          description: 'Hand-signed vinyl record of the latest album, numbered edition',
          rarity: 'SSR',
          type: 'MERCHANDISE',
          image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400',
          diamondValue: 500,
        },
      },
      {
        id: 'user-prize-3',
        userId: session.user.id,
        prizeId: 'prize-3',
        source: 'PURCHASE',
        acquiredAt: new Date('2024-01-15'),
        redeemed: true,
        redeemedAt: new Date('2024-01-16'),
        prize: {
          id: 'prize-3',
          name: 'Exclusive Photo Book',
          description: 'Behind-the-scenes photo book with 100+ exclusive photos',
          rarity: 'SSR',
          type: 'MERCHANDISE',
          image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
          diamondValue: 450,
        },
      },
      {
        id: 'user-prize-4',
        userId: session.user.id,
        prizeId: 'prize-4',
        source: 'REWARD',
        acquiredAt: new Date('2024-01-12'),
        redeemed: false,
        redeemedAt: null,
        prize: {
          id: 'prize-4',
          name: 'Premium Merchandise Bundle',
          description: 'Includes hoodie, t-shirt, cap, and sticker pack',
          rarity: 'EPIC',
          type: 'MERCHANDISE',
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
          diamondValue: 200,
        },
      },
      {
        id: 'user-prize-5',
        userId: session.user.id,
        prizeId: 'prize-5',
        source: 'GACHA',
        acquiredAt: new Date('2024-01-10'),
        redeemed: true,
        redeemedAt: new Date('2024-01-11'),
        prize: {
          id: 'prize-5',
          name: 'Digital Album + Bonus Tracks',
          description: 'Complete digital album with 5 exclusive bonus tracks',
          rarity: 'EPIC',
          type: 'DIGITAL',
          image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=400',
          diamondValue: 150,
        },
      },
      {
        id: 'user-prize-6',
        userId: session.user.id,
        prizeId: 'prize-6',
        source: 'GACHA',
        acquiredAt: new Date('2024-01-08'),
        redeemed: false,
        redeemedAt: null,
        prize: {
          id: 'prize-6',
          name: 'Concert Livestream Access',
          description: 'VIP access to exclusive concert livestream with chat',
          rarity: 'RARE',
          type: 'DIGITAL',
          image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400',
          diamondValue: 100,
        },
      },
      {
        id: 'user-prize-7',
        userId: session.user.id,
        prizeId: 'prize-7',
        source: 'REWARD',
        acquiredAt: new Date('2024-01-05'),
        redeemed: false,
        redeemedAt: null,
        prize: {
          id: 'prize-7',
          name: 'Artist Wallpaper Pack',
          description: 'HD wallpaper collection for desktop and mobile',
          rarity: 'RARE',
          type: 'DIGITAL',
          image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
          diamondValue: 80,
        },
      },
      {
        id: 'user-prize-8',
        userId: session.user.id,
        prizeId: 'prize-8',
        source: 'GACHA',
        acquiredAt: new Date('2024-01-03'),
        redeemed: true,
        redeemedAt: new Date('2024-01-04'),
        prize: {
          id: 'prize-8',
          name: 'Fan Club Sticker Pack',
          description: 'Set of 10 holographic stickers',
          rarity: 'COMMON',
          type: 'MERCHANDISE',
          image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
          diamondValue: 20,
        },
      },
    ]
  } else {
    try {
      userPrizes = await db.userPrize.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          prize: true,
        },
        orderBy: {
          acquiredAt: 'desc',
        },
      })
    } catch (error) {
      console.error('Database fetch failed:', error)
      userPrizes = []
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'border-yellow-400 bg-gradient-to-br from-yellow-900/20 to-orange-900/20'
      case 'SSR':
        return 'border-amber-400 bg-gradient-to-br from-amber-900/20 to-yellow-900/20'
      case 'EPIC':
        return 'border-purple-400 bg-gradient-to-br from-purple-900/20 to-pink-900/20'
      case 'RARE':
        return 'border-blue-400 bg-gradient-to-br from-blue-900/20 to-cyan-900/20'
      case 'COMMON':
        return 'border-gray-400 bg-gray-800'
      default:
        return 'border-gray-600 bg-gray-900'
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'GACHA':
        return '🎰'
      case 'PURCHASE':
        return '💳'
      case 'REWARD':
        return '🏆'
      case 'GIFT':
        return '🎁'
      default:
        return '❓'
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Prizes</h1>
        <p className="mt-2 text-sm text-gray-400">
          View and manage your collected prizes
        </p>
      </div>

      {userPrizes.length === 0 ? (
        <div className="rounded-lg bg-gray-900 border border-gray-800 p-12 text-center shadow">
          <div className="mb-4 text-6xl">🎁</div>
          <h3 className="mb-2 text-lg font-semibold text-white">
            No prizes yet
          </h3>
          <p className="mb-6 text-gray-400">
            Complete tasks and try the gacha to win prizes!
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/tasks"
              className="rounded-md bg-[#FF5656] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ff3333] transition-all"
            >
              View Tasks
            </a>
            <a
              href="/gacha"
              className="rounded-md border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:border-[#FF5656] hover:bg-gray-800 transition-all"
            >
              Try Gacha
            </a>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {userPrizes.map((userPrize) => (
            <div
              key={userPrize.id}
              className={`rounded-lg border-2 p-6 shadow transition-all hover:shadow-lg ${getRarityColor(
                userPrize.prize.rarity
              )}`}
            >
              <div className="mb-4 flex items-start justify-between">
                <span className="text-2xl">
                  {getSourceIcon(userPrize.source)}
                </span>
                <div className="text-right">
                  {userPrize.redeemed ? (
                    <span className="rounded-full bg-[#FF5656]/20 px-2 py-1 text-xs font-medium text-[#FF5656]">
                      ✓ Redeemed
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-700 px-2 py-1 text-xs font-medium text-gray-300">
                      Available
                    </span>
                  )}
                </div>
              </div>

              <h3 className="mb-2 text-lg font-semibold text-white">
                {userPrize.prize.name}
              </h3>
              <p className="mb-4 text-sm text-gray-400">
                {userPrize.prize.description}
              </p>

              <div className="mb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Rarity:</span>
                  <span className="font-medium text-gray-300">{userPrize.prize.rarity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium text-gray-300">{userPrize.prize.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Acquired:</span>
                  <span className="font-medium text-gray-300">
                    {new Date(userPrize.acquiredAt).toLocaleDateString()}
                  </span>
                </div>
                {userPrize.redeemed && userPrize.redeemedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Redeemed:</span>
                    <span className="font-medium text-gray-300">
                      {new Date(userPrize.redeemedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {!userPrize.redeemed && (
                <PrizeRedeemButton prizeId={userPrize.id} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

