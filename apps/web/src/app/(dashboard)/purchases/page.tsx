import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function PurchasesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch user's purchase history
  let purchases: any[] = []

  const allowTestAccounts =
    process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_ACCOUNTS === 'true'

  const isTestAccount =
    allowTestAccounts &&
    (session.user.id?.includes('test-') ||
      session.user.id?.includes('demo-') ||
      session.user.id?.includes('admin-'))

  if (isTestAccount) {
    // Mock data for test accounts
    purchases = [
      {
        id: 'purchase-1',
        createdAt: new Date('2024-01-15'),
        completedAt: new Date('2024-01-15'),
        amount: 24.99,
        currency: 'USD',
        status: 'COMPLETED',
        pack: {
          name: '💎 Fan Pack',
          description: 'Show your support! Includes premium merchandise and extra draw tickets.',
          bonusTickets: 15,
          bonusDiamonds: 1500,
          guaranteedPrize: {
            name: 'Limited Edition T-Shirt',
            rarity: 'EPIC',
          },
        },
        itemsGranted: true,
        ticketsGranted: true,
        diamondsGranted: true,
      },
      {
        id: 'purchase-2',
        createdAt: new Date('2024-01-10'),
        completedAt: new Date('2024-01-10'),
        amount: 9.99,
        currency: 'USD',
        status: 'COMPLETED',
        pack: {
          name: '🌟 Starter Pack',
          description: 'Perfect for new fans! Get started with exclusive content and bonus rewards.',
          bonusTickets: 5,
          bonusDiamonds: 500,
          guaranteedPrize: {
            name: 'Exclusive Holographic Sticker Pack',
            rarity: 'RARE',
          },
        },
        itemsGranted: true,
        ticketsGranted: true,
        diamondsGranted: true,
      },
    ]
  } else {
    try {
      // Dynamic import to avoid build-time database connection
      const { db } = await import('@/lib/db')

      purchases = await db.purchase.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          pack: {
            include: {
              guaranteedPrize: {
                select: {
                  name: true,
                  rarity: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } catch (error) {
      console.error('Error fetching purchases:', error)
      purchases = []
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800'
      case 'REFUNDED':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return '✅'
      case 'PROCESSING':
        return '⏳'
      case 'PENDING':
        return '⏸️'
      case 'FAILED':
        return '❌'
      case 'CANCELLED':
        return '🚫'
      case 'REFUNDED':
        return '↩️'
      default:
        return '❓'
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'text-yellow-600'
      case 'SSR':
        return 'text-amber-600'
      case 'EPIC':
        return 'text-[#FF5656]'
      case 'RARE':
        return 'text-[#FF5656]'
      case 'COMMON':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Purchase History</h1>
        <p className="text-lg text-gray-600">
          View your Premium Pack purchases and receipts
        </p>
      </div>

      {/* Purchases List */}
      {purchases.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛍️</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            No Purchases Yet
          </h3>
          <p className="text-gray-600 mb-6">
            You haven&apos;t purchased any Premium Packs yet.
          </p>
          <Link
            href="/store/packs"
            className="inline-block rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            Browse Premium Packs
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="rounded-lg border-2 border-gray-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl"
            >
              {/* Purchase Header */}
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {purchase.pack.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Purchased on {new Date(purchase.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ${purchase.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">{purchase.currency}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                    purchase.status
                  )}`}
                >
                  {getStatusEmoji(purchase.status)} {purchase.status}
                </span>
              </div>

              {/* Pack Contents */}
              <div className="mb-4 rounded-lg bg-gray-50 p-4">
                <h4 className="mb-3 font-semibold text-gray-900">
                  What You Received:
                </h4>
                <div className="space-y-2">
                  {/* Guaranteed Prize */}
                  {purchase.pack.guaranteedPrize && (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🎁</span>
                      <span className="text-sm text-gray-700">
                        <strong className={getRarityColor(purchase.pack.guaranteedPrize.rarity)}>
                          {purchase.pack.guaranteedPrize.name}
                        </strong>{' '}
                        ({purchase.pack.guaranteedPrize.rarity})
                      </span>
                      {purchase.itemsGranted && (
                        <span className="text-green-600">✓</span>
                      )}
                    </div>
                  )}

                  {/* Bonus Diamonds */}
                  {purchase.pack.bonusDiamonds > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💎</span>
                      <span className="text-sm text-gray-700">
                        <strong>{purchase.pack.bonusDiamonds.toLocaleString()}</strong> Bonus Diamonds
                      </span>
                      {purchase.diamondsGranted && (
                        <span className="text-green-600">✓</span>
                      )}
                    </div>
                  )}

                  {/* Bonus Tickets */}
                  {purchase.pack.bonusTickets > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🎫</span>
                      <span className="text-sm text-gray-700">
                        <strong>{purchase.pack.bonusTickets}</strong> Draw Tickets
                      </span>
                      {purchase.ticketsGranted && (
                        <span className="text-green-600">✓</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => alert('Receipt download feature coming soon!')}
                  className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
                >
                  📄 Download Receipt
                </button>
                {purchase.status === 'COMPLETED' && (
                  <Link
                    href="/store/packs"
                    className="flex-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-center text-sm font-semibold text-white transition-all hover:scale-105"
                  >
                    🛍️ Buy Again
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {purchases.length > 0 && (
        <div className="mt-8 rounded-lg border-2 border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-bold text-gray-900">
            Purchase Summary
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#FF5656]">
                {purchases.length}
              </p>
              <p className="text-sm text-gray-600">Total Purchases</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                $
                {purchases
                  .filter((p) => p.status === 'COMPLETED')
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#FF5656]">
                {purchases.filter((p) => p.status === 'COMPLETED').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
