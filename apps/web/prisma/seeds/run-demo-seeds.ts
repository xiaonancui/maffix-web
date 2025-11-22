import { PrismaClient } from '@prisma/client'
import { seedMerchandise } from './merchandise-demo'
import { seedPremiumPacks } from './packs-demo'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting demo data seeding...\n')

  try {
    // Seed merchandise
    await seedMerchandise()
    console.log('')

    // Seed premium packs
    await seedPremiumPacks()
    console.log('')

    console.log('🎉 All demo data seeded successfully!')
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

