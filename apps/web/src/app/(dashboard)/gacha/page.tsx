import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import GachaPullButton from '@/components/dashboard/GachaPullButton'

const GACHA_COST = 100 // Cost in diamonds per pull

export default async function GachaPage() {
  // Dynamic import to avoid build-time database connection
  const { db } = await import('@/lib/db')

  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch user's diamond balance
  let user
  let gachaItems: any[] = []

  const isTestAccount = process.env.NODE_ENV === 'development' &&
    (session.user.id?.includes('test-') || session.user.id?.includes('demo-') || session.user.id?.includes('admin-'))

  if (isTestAccount) {
    user = {
      diamondBalance: session.user.role === 'ADMIN' ? 10000 : 500,
    }

    // Mock gacha items
    gachaItems = [
      {
        id: 'gacha-1',
        prizeId: 'prize-1',
        probability: 5,
        isActive: true,
        prize: {
          id: 'prize-1',
          name: 'VIP Concert Ticket',
          description: 'Front row seat at next concert',
          type: 'EXPERIENCE',
          rarity: 'LEGENDARY',
          value: 500,
          stock: 10,
          isActive: true,
        },
      },
      {
        id: 'gacha-2',
        prizeId: 'prize-2',
        probability: 15,
        isActive: true,
        prize: {
          id: 'prize-2',
          name: 'Signed Album',
          description: 'Limited edition signed album',
          type: 'PHYSICAL',
          rarity: 'EPIC',
          value: 200,
          stock: 50,
          isActive: true,
        },
      },
      {
        id: 'gacha-3',
        prizeId: 'prize-3',
        probability: 40,
        isActive: true,
        prize: {
          id: 'prize-3',
          name: 'Exclusive Sticker Pack',
          description: 'Limited edition stickers',
          type: 'PHYSICAL',
          rarity: 'COMMON',
          value: 10,
          stock: 100,
          isActive: true,
        },
      },
    ]
  } else {
    try {
      user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          diamondBalance: true,
        },
      })

      // Fetch active gacha items with prizes
      gachaItems = await db.gachaItem.findMany({
        where: {
          isActive: true,
        },
        include: {
          prize: true,
        },
        orderBy: {
          probability: 'asc', // Show rarest first
        },
      })
    } catch (error) {
      console.error('Database fetch failed:', error)
      user = { diamondBalance: 0 }
      gachaItems = []
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500'
      case 'EPIC':
        return 'bg-gradient-to-r from-purple-400 to-pink-500'
      case 'RARE':
        return 'bg-gradient-to-r from-blue-400 to-cyan-500'
      case 'COMMON':
        return 'bg-gradient-to-r from-gray-400 to-gray-500'
      default:
        return 'bg-gray-400'
    }
  }

  const getRarityEmoji = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY':
        return '👑'
      case 'EPIC':
        return '💜'
      case 'RARE':
        return '💙'
      case 'COMMON':
        return '⚪'
      default:
        return '❓'
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gacha System</h1>
        <p className="mt-2 text-sm text-gray-600">
          Try your luck and win amazing prizes!
        </p>
      </div>

      {/* Balance Card */}
      <div className="mb-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Your Diamond Balance</p>
            <p className="text-4xl font-bold">
              💎 {user?.diamondBalance.toLocaleString() || 0}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Cost per Pull</p>
            <p className="text-2xl font-bold">💎 {GACHA_COST}</p>
          </div>
        </div>
      </div>

      {/* Gacha Buttons */}
      <div className="mb-8">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Choose Your Draw</h2>
          <p className="mt-1 text-sm text-gray-600">
            10x Draw guarantees at least 1 SSR or higher rarity prize!
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Single Draw */}
          <div className="rounded-lg border-2 border-gray-300 bg-white p-6 text-center">
            <div className="mb-4">
              <div className="text-3xl font-bold text-gray-900">Single Draw</div>
              <div className="mt-2 text-sm text-gray-600">Try your luck once</div>
            </div>
            <div className="mb-4">
              <div className="text-2xl font-bold text-primary">💎 {GACHA_COST}</div>
            </div>
            <GachaPullButton
              currentBalance={user?.diamondBalance || 0}
              cost={GACHA_COST}
              pullType="single"
            />
            <p className="mt-2 text-xs text-gray-500">
              {(user?.diamondBalance || 0) < GACHA_COST
                ? 'Not enough diamonds'
                : `You can pull ${Math.floor((user?.diamondBalance || 0) / GACHA_COST)} times`}
            </p>
          </div>

          {/* 10x Draw */}
          <div className="relative rounded-lg border-2 border-primary bg-gradient-to-br from-purple-50 to-blue-50 p-6 text-center">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                SSR GUARANTEED
              </span>
            </div>
            <div className="mb-4">
              <div className="text-3xl font-bold text-gray-900">10x Draw</div>
              <div className="mt-2 text-sm text-gray-600">
                10 draws with guaranteed SSR+
              </div>
            </div>
            <div className="mb-4">
              <div className="text-2xl font-bold text-primary">💎 {GACHA_COST * 10}</div>
              <div className="text-xs text-gray-500">Save 0 diamonds (same price)</div>
            </div>
            <GachaPullButton
              currentBalance={user?.diamondBalance || 0}
              cost={GACHA_COST * 10}
              pullType="10x"
            />
            <p className="mt-2 text-xs text-gray-500">
              {(user?.diamondBalance || 0) < GACHA_COST * 10
                ? 'Not enough diamonds'
                : `You can do ${Math.floor((user?.diamondBalance || 0) / (GACHA_COST * 10))} 10x draws`}
            </p>
          </div>
        </div>
      </div>

      {/* Prize Pool */}
      <div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Prize Pool</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gachaItems.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-lg bg-white shadow transition-all hover:shadow-lg"
            >
              <div className={`h-2 ${getRarityColor(item.prize.rarity)}`} />
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <span className="text-3xl">
                    {getRarityEmoji(item.prize.rarity)}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                    {item.probability.toFixed(2)}%
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {item.prize.name}
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  {item.prize.description}
                </p>

                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium text-white ${getRarityColor(
                      item.prize.rarity
                    )}`}
                  >
                    {item.prize.rarity}
                  </span>
                  <span className="text-sm text-gray-500">
                    💎 {item.prize.value}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {gachaItems.length === 0 && (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <p className="text-gray-500">No prizes available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}

