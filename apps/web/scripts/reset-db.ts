import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(__dirname, '../.env') })

const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Resetting database...')

  // Delete all data in reverse order of dependencies
  await prisma.transaction.deleteMany()
  await prisma.gachaPull.deleteMany()
  await prisma.userPrize.deleteMany()
  await prisma.userTask.deleteMany()
  await prisma.gachaItem.deleteMany()
  await prisma.prize.deleteMany()
  await prisma.task.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Database reset complete!')
  console.log('')
  console.log('Run "npm run db:seed" to populate with test data.')
}

main()
  .catch((e) => {
    console.error('❌ Error resetting database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

