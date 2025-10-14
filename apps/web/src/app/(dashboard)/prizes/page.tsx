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

  const isTestAccount = process.env.NODE_ENV === 'development' &&
    (session.user.id?.includes('test-') || session.user.id?.includes('demo-') || session.user.id?.includes('admin-'))

  if (isTestAccount) {
    // Mock prizes for test accounts
    userPrizes = []
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
        return 'border-yellow-400 bg-yellow-50'
      case 'EPIC':
        return 'border-purple-400 bg-purple-50'
      case 'RARE':
        return 'border-blue-400 bg-blue-50'
      case 'COMMON':
        return 'border-gray-400 bg-gray-50'
      default:
        return 'border-gray-300 bg-white'
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
        <h1 className="text-3xl font-bold text-gray-900">My Prizes</h1>
        <p className="mt-2 text-sm text-gray-600">
          View and manage your collected prizes
        </p>
      </div>

      {userPrizes.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <div className="mb-4 text-6xl">🎁</div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            No prizes yet
          </h3>
          <p className="mb-6 text-gray-500">
            Complete tasks and try the gacha to win prizes!
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/tasks"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              View Tasks
            </a>
            <a
              href="/gacha"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
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
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      ✓ Redeemed
                    </span>
                  ) : (
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      Available
                    </span>
                  )}
                </div>
              </div>

              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {userPrize.prize.name}
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                {userPrize.prize.description}
              </p>

              <div className="mb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Rarity:</span>
                  <span className="font-medium">{userPrize.prize.rarity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium">{userPrize.prize.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Acquired:</span>
                  <span className="font-medium">
                    {new Date(userPrize.acquiredAt).toLocaleDateString()}
                  </span>
                </div>
                {userPrize.redeemed && userPrize.redeemedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Redeemed:</span>
                    <span className="font-medium">
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

