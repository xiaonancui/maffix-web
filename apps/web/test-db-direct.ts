import { PrismaClient } from '@prisma/client'

async function testConnection() {
  console.log('🔍 Testing database connection with direct Prisma Client...')

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

  try {
    console.log('🔍 Connecting to database...')

    // Try to connect to the database
    await prisma.$connect()
    console.log('✅ Database connection successful!')

    // Try a simple query
    const userCount = await prisma.user.count()
    console.log(`📊 Current user count: ${userCount}`)

    await prisma.$disconnect()
    console.log('👋 Disconnected from database')

    process.exit(0)
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  }
}

testConnection()
