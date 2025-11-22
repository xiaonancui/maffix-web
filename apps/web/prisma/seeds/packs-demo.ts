import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const demoPacks = [
  {
    name: 'Starter Pack',
    description: 'Perfect for new fans! Get started with bonus tickets and diamonds to kickstart your Maffix journey. This pack includes everything you need to begin collecting prizes and supporting your favorite artists.',
    price: 9.99,
    currency: 'USD',
    guaranteedPrizeId: null,
    bonusTickets: 5,
    bonusDiamonds: 500,
    imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&q=80',
    featured: true,
    sortOrder: 1,
    isActive: true,
  },
  {
    name: 'Fan Bundle',
    description: 'Best value! Triple your chances with this popular bundle. Get 15 draw tickets and 1,500 diamonds to maximize your prize opportunities. Our most popular choice among fans!',
    price: 24.99,
    currency: 'USD',
    guaranteedPrizeId: null,
    bonusTickets: 15,
    bonusDiamonds: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
    featured: true,
    sortOrder: 2,
    isActive: true,
  },
  {
    name: 'VIP Pack',
    description: 'Premium experience with guaranteed SSR prize and massive bonuses! This exclusive pack includes 35 draw tickets, 4,000 diamonds, and a guaranteed SSR-tier prize. The ultimate package for serious collectors.',
    price: 49.99,
    currency: 'USD',
    guaranteedPrizeId: null, // Will be set to an SSR prize ID if available
    bonusTickets: 35,
    bonusDiamonds: 4000,
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80',
    featured: true,
    sortOrder: 3,
    isActive: true,
  },
  {
    name: 'Diamond Booster',
    description: 'Pure diamond boost for your account. Get 2,000 diamonds instantly to use on missions, gacha draws, or save for special events. No tickets included - just pure diamond power!',
    price: 14.99,
    currency: 'USD',
    guaranteedPrizeId: null,
    bonusTickets: 0,
    bonusDiamonds: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=800&q=80',
    featured: false,
    sortOrder: 4,
    isActive: true,
  },
  {
    name: 'Ticket Bundle',
    description: 'Maximum draw opportunities with this ticket-focused bundle. Get 25 draw tickets to try your luck at winning amazing prizes. Perfect for those who love the thrill of the gacha!',
    price: 19.99,
    currency: 'USD',
    guaranteedPrizeId: null,
    bonusTickets: 25,
    bonusDiamonds: 0,
    imageUrl: 'https://images.unsplash.com/photo-1594834661180-4a1c7bb6d0e8?w=800&q=80',
    featured: false,
    sortOrder: 5,
    isActive: true,
  },
]

export async function seedPremiumPacks() {
  console.log('📦 Seeding demo premium packs...')

  // Try to find an SSR prize for the VIP Pack
  const ssrPrize = await prisma.prize.findFirst({
    where: {
      rarity: 'SSR',
      isActive: true,
    },
  })

  for (const pack of demoPacks) {
    const existing = await prisma.premiumPack.findFirst({
      where: { name: pack.name },
    })

    if (!existing) {
      // Set guaranteed prize for VIP Pack if SSR prize exists
      const packData = {
        ...pack,
        guaranteedPrizeId: pack.name === 'VIP Pack' && ssrPrize ? ssrPrize.id : null,
      }

      await prisma.premiumPack.create({
        data: packData,
      })
      console.log(`✅ Created: ${pack.name} ($${pack.price})`)
      if (packData.guaranteedPrizeId) {
        console.log(`   └─ Guaranteed Prize: ${ssrPrize?.name}`)
      }
    } else {
      console.log(`⏭️  Skipped (already exists): ${pack.name}`)
    }
  }

  console.log('✅ Demo premium packs seeding complete!')
}

// Run if called directly
if (require.main === module) {
  seedPremiumPacks()
    .catch((e) => {
      console.error('❌ Error seeding premium packs:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

