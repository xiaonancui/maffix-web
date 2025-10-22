import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import PremiumPackCard from '@/components/dashboard/PremiumPackCard'

export default async function PremiumPacksPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch available premium packs
  let packs: any[] = []
  let user: any = null

  const allowTestAccounts =
    process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_ACCOUNTS === 'true'

  const isTestAccount =
    allowTestAccounts &&
    (session.user.id?.includes('test-') ||
      session.user.id?.includes('demo-') ||
      session.user.id?.includes('admin-'))

  if (isTestAccount) {
    // Mock data for test accounts
    user = {
      id: session.user.id,
      diamondBalance: 10000,
    }

    packs = [
      {
        id: 'pack-starter',
        name: '🌟 Starter Pack',
        description: 'Perfect for new fans! Get started with exclusive content and bonus rewards.',
        price: 9.99,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1549298916-acc8271f8b8d?w=500',
        featured: true,
        bonusTickets: 5,
        bonusDiamonds: 500,
        guaranteedPrize: {
          id: 'prize-sticker',
          name: 'Exclusive Holographic Sticker Pack',
          rarity: 'RARE',
          image: null,
        },
        isActive: true,
      },
      {
        id: 'pack-fan',
        name: '💎 Fan Pack',
        description: 'Show your support! Includes premium merchandise and extra draw tickets.',
        price: 24.99,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
        featured: true,
        bonusTickets: 15,
        bonusDiamonds: 1500,
        guaranteedPrize: {
          id: 'prize-tshirt',
          name: 'Limited Edition T-Shirt',
          rarity: 'EPIC',
          image: null,
        },
        isActive: true,
      },
      {
        id: 'pack-vip',
        name: '👑 VIP Pack',
        description: 'The ultimate fan experience! Guaranteed rare merchandise and massive bonuses.',
        price: 49.99,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1607083206325-cad1d8d91080?w=500',
        featured: true,
        bonusTickets: 30,
        bonusDiamonds: 3500,
        guaranteedPrize: {
          id: 'prize-hoodie',
          name: 'Premium Embroidered Hoodie',
          rarity: 'SSR',
          image: null,
        },
        isActive: true,
      },
      {
        id: 'pack-legend',
        name: '🔥 Legend Pack',
        description: 'For the ultimate superfan! Exclusive legendary items and VIP perks.',
        price: 99.99,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1606041011872-596597976b25?w=500',
        featured: true,
        bonusTickets: 50,
        bonusDiamonds: 8000,
        guaranteedPrize: {
          id: 'prize-signed',
          name: 'Signed Limited Edition Vinyl',
          rarity: 'LEGENDARY',
          image: null,
        },
        isActive: true,
      },
    ]
  } else {
    try {
      // Dynamic import to avoid build-time database connection
      const { db } = await import('@/lib/db')

      user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          diamondBalance: true,
        },
      })

      // Fetch active premium packs
      packs = await db.premiumPack.findMany({
        where: {
          isActive: true,
        },
        include: {
          guaranteedPrize: {
            select: {
              id: true,
              name: true,
              rarity: true,
              image: true,
            },
          },
        },
        orderBy: [
          { featured: 'desc' },
          { sortOrder: 'asc' },
          { price: 'asc' },
        ],
      })
    } catch (error) {
      console.error('Error fetching premium packs:', error)
      // Use empty arrays if database fails
      user = { id: session.user.id, diamondBalance: 0 }
      packs = []
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Premium Packs</h1>
        <p className="text-lg text-gray-600">
          Get exclusive merchandise, bonus diamonds, and draw tickets!
        </p>
      </div>

      {/* User Balance */}
      <div className="mb-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Your Diamond Balance</p>
            <p className="text-4xl font-bold">
              💎 {user?.diamondBalance?.toLocaleString() || 0}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Premium Packs Available</p>
            <p className="text-3xl font-bold">{packs.length}</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-8 rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">ℹ️</div>
          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              What are Premium Packs?
            </h3>
            <p className="text-blue-800 mb-3">
              Premium Packs are special bundles that give you guaranteed exclusive merchandise,
              bonus diamonds, and draw tickets. Each pack includes:
            </p>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              <li>🎁 <strong>Guaranteed Prize</strong> - Exclusive merchandise item</li>
              <li>💎 <strong>Bonus Diamonds</strong> - Use for gacha draws and more</li>
              <li>🎫 <strong>Draw Tickets</strong> - Free gacha pulls</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Premium Packs Grid */}
      {packs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            No Premium Packs Available
          </h3>
          <p className="text-gray-600">
            Check back soon for exclusive pack offers!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {packs.map((pack) => (
            <PremiumPackCard key={pack.id} pack={pack} />
          ))}
        </div>
      )}

      {/* Payment Methods */}
      <div className="mt-12 rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Secure Payment Methods
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-2xl">💳</span>
            <span>Credit Card</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-2xl">🏦</span>
            <span>Bank Transfer</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-2xl">📱</span>
            <span>Klarna</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-2xl">🔒</span>
            <span>Secure Checkout</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          All payments are processed securely through Klarna. Your payment information is never stored on our servers.
        </p>
      </div>

      {/* FAQ */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          <details className="rounded-lg border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer font-semibold text-gray-900">
              How do I receive my items?
            </summary>
            <p className="mt-2 text-gray-600">
              Digital items (diamonds and tickets) are added to your account immediately after payment.
              Physical merchandise will be shipped to your registered address within 5-7 business days.
            </p>
          </details>
          <details className="rounded-lg border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer font-semibold text-gray-900">
              Can I refund a Premium Pack?
            </summary>
            <p className="mt-2 text-gray-600">
              Digital items (diamonds and tickets) are non-refundable once granted. Physical merchandise
              can be returned within 30 days if unopened and in original condition.
            </p>
          </details>
          <details className="rounded-lg border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer font-semibold text-gray-900">
              Are Premium Packs limited time offers?
            </summary>
            <p className="mt-2 text-gray-600">
              Some packs may be limited time or limited quantity. Check the pack details for availability.
              Featured packs are usually available for a limited period.
            </p>
          </details>
        </div>
      </div>
    </div>
  )
}

