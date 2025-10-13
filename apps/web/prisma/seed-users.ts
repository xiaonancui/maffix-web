import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(__dirname, '../.env') })

const prisma = new PrismaClient()

async function main() {
  console.log('👥 Creating test users...')

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 12)

  // Create regular test user
  const testUser = await prisma.user.upsert({
    where: { email: 'user@maffix.com' },
    update: {},
    create: {
      email: 'user@maffix.com',
      name: 'Test User',
      password: hashedPassword,
      role: 'USER',
      diamondBalance: 500, // Give some diamonds for testing
      points: 100,
      level: 1,
    },
  })

  console.log('✅ Created test user:', {
    email: testUser.email,
    name: testUser.name,
    role: testUser.role,
    diamonds: testUser.diamondBalance,
    points: testUser.points,
  })

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@maffix.com' },
    update: {},
    create: {
      email: 'admin@maffix.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      diamondBalance: 10000,
      points: 5000,
      level: 10,
    },
  })

  console.log('✅ Created admin user:', {
    email: adminUser.email,
    name: adminUser.name,
    role: adminUser.role,
    diamonds: adminUser.diamondBalance,
    points: adminUser.points,
  })

  // Create artist user
  const artistUser = await prisma.user.upsert({
    where: { email: 'artist@maffix.com' },
    update: {},
    create: {
      email: 'artist@maffix.com',
      name: 'Artist User',
      password: hashedPassword,
      role: 'ARTIST',
      diamondBalance: 1000,
      points: 500,
      level: 5,
    },
  })

  console.log('✅ Created artist user:', {
    email: artistUser.email,
    name: artistUser.name,
    role: artistUser.role,
    diamonds: artistUser.diamondBalance,
    points: artistUser.points,
  })

  console.log('')
  console.log('🎉 Test users created successfully!')
  console.log('')
  console.log('📝 Login credentials:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Regular User:')
  console.log('  Email: user@maffix.com')
  console.log('  Password: password123')
  console.log('  Diamonds: 500 💎')
  console.log('')
  console.log('Admin User:')
  console.log('  Email: admin@maffix.com')
  console.log('  Password: password123')
  console.log('  Diamonds: 10000 💎')
  console.log('')
  console.log('Artist User:')
  console.log('  Email: artist@maffix.com')
  console.log('  Password: password123')
  console.log('  Diamonds: 1000 💎')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => {
    console.error('❌ Error creating test users:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

