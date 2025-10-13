import { db } from '../src/lib/db'

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Try to connect to the database
    await db.$connect()
    console.log('✅ Database connection successful!')
    
    // Try a simple query
    const userCount = await db.user.count()
    console.log(`📊 Current user count: ${userCount}`)
    
    await db.$disconnect()
    console.log('👋 Disconnected from database')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  }
}

testConnection()

