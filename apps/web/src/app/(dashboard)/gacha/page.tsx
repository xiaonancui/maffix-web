import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import GachaPullButton from '@/components/dashboard/GachaPullButton'
import GachaHeader from '@/components/dashboard/GachaHeader'
import { Gem, Target, Ticket } from 'lucide-react'

const GACHA_COST = 100 // Cost in diamonds per pull
const GACHA_COST_10X = 900 // Cost in diamonds for 10x pull (10% discount)

export default async function GachaPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Use mock data for all users (database not connected)
  let user
  let gachaItems: any[] = []
  let tickets = { single: 0, multi10x: 0 }

  // Always use mock data
  if (true) {
    user = {
      diamondBalance: session.user.role === 'ADMIN' ? 10000 : 500,
      gachaPityCounter: 5,
    }
    tickets = { single: 2, multi10x: 1 }

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
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'bg-gradient-to-r from-primary to-primary/80'
      case 'SSR':
        return 'bg-gradient-to-r from-primary to-primary/80'
      case 'EPIC':
        return 'bg-gradient-to-r from-purple-600 to-purple-700'
      case 'RARE':
        return 'bg-gradient-to-r from-blue-600 to-blue-700'
      case 'COMMON':
        return 'bg-gradient-to-r from-secondary to-secondary'
      default:
        return 'bg-secondary'
    }
  }

  const getRarityEmoji = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY':
        return '👑'
      case 'SSR':
        return '⭐'
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
      <GachaHeader />

      {/* Balance Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Diamond Balance */}
        <div className="rounded-lg bg-card border border-border p-6 text-foreground shadow-lg hover:border-primary transition-colors">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Gem className="h-4 w-4" />
            Diamond Balance
          </p>
          <p className="text-4xl font-bold flex items-center gap-2">
            <Gem className="h-8 w-8 text-primary" />
            {user?.diamondBalance.toLocaleString() || 0}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {Math.floor((user?.diamondBalance || 0) / GACHA_COST)} single pulls available
          </p>
        </div>

        {/* Draw Tickets */}
        <div className="rounded-lg bg-card border border-border p-6 text-foreground shadow-lg hover:border-primary transition-colors">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            Draw Tickets
          </p>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Ticket className="h-6 w-6 text-primary" />
              <div>
                <p className="text-2xl font-bold">{tickets.single}</p>
                <p className="text-xs text-muted-foreground">Single</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Ticket className="h-6 w-6 text-primary" />
              <div>
                <p className="text-2xl font-bold">{tickets.multi10x}</p>
                <p className="text-xs text-muted-foreground">10x</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pity Counter */}
        <div className="rounded-lg bg-card border border-border p-6 text-foreground shadow-lg hover:border-primary transition-colors">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Target className="h-4 w-4" />
            SSR Pity Counter
          </p>
          <p className="text-4xl font-bold text-primary">{user?.gachaPityCounter || 0} / 90</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {90 - (user?.gachaPityCounter || 0)} pulls until guaranteed SSR+
          </p>
        </div>
      </div>

      {/* Gacha Buttons */}
      <div className="mb-8">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold text-foreground">Choose Your Draw</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            10x Draw guarantees at least 1 SSR or higher rarity prize!
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Single Draw */}
          <div className="rounded-lg border-2 border-border bg-card p-6 text-center hover:border-primary transition-colors">
            <div className="mb-4">
              <div className="text-3xl font-bold text-foreground">Single Draw</div>
              <div className="mt-2 text-sm text-muted-foreground">Try your luck once</div>
            </div>
            <div className="mb-4 flex items-center justify-center gap-2">
              <Gem className="h-6 w-6 text-primary" />
              <div className="text-2xl font-bold text-primary">{GACHA_COST}</div>
            </div>
            <GachaPullButton
              currentBalance={user?.diamondBalance || 0}
              cost={GACHA_COST}
              pullType="single"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {(user?.diamondBalance || 0) < GACHA_COST
                ? 'Not enough diamonds'
                : `You can pull ${Math.floor((user?.diamondBalance || 0) / GACHA_COST)} times`}
            </p>
          </div>

          {/* 10x Draw */}
          <div className="relative rounded-lg border-2 border-primary bg-card p-6 text-center hover:shadow-lg transition-all">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                SSR GUARANTEED
              </span>
            </div>
            <div className="mb-4">
              <div className="text-3xl font-bold text-foreground">10x Draw</div>
              <div className="mt-2 text-sm text-muted-foreground">
                10 draws with guaranteed SSR+
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-center gap-2">
                <Gem className="h-6 w-6 text-primary" />
                <div className="text-2xl font-bold text-primary">{GACHA_COST_10X}</div>
              </div>
              <div className="text-xs text-primary font-semibold">
                Save {GACHA_COST * 10 - GACHA_COST_10X} diamonds! (10% off)
              </div>
            </div>
            <GachaPullButton
              currentBalance={user?.diamondBalance || 0}
              cost={GACHA_COST_10X}
              pullType="10x"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {(user?.diamondBalance || 0) < GACHA_COST_10X
                ? 'Not enough diamonds'
                : `You can do ${Math.floor((user?.diamondBalance || 0) / GACHA_COST_10X)} 10x draws`}
            </p>
          </div>
        </div>
      </div>

      {/* Prize Pool */}
      <div>
        <h2 className="mb-4 text-2xl font-bold text-foreground">Prize Pool</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gachaItems.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-lg bg-card border border-border shadow transition-all hover:border-[#FF5656] hover:shadow-lg"
            >
              <div className={`h-2 ${getRarityColor(item.prize.rarity)}`} />
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <span className="text-3xl">
                    {getRarityEmoji(item.prize.rarity)}
                  </span>
                  <span className="rounded-full bg-secondary border border-border px-2 py-1 text-xs font-medium text-muted-foreground">
                    {item.probability.toFixed(2)}%
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {item.prize.name}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {item.prize.description}
                </p>

                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium text-foreground ${getRarityColor(
                      item.prize.rarity
                    )}`}
                  >
                    {item.prize.rarity}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    💎 {item.prize.value}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {gachaItems.length === 0 && (
          <div className="rounded-lg bg-card border border-border p-12 text-center shadow">
            <p className="text-muted-foreground">No prizes available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}

