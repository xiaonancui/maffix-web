import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'
import bcrypt from 'bcryptjs'

// Load environment variables
config({ path: resolve(__dirname, '../.env') })

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create test users
  console.log('👥 Creating test users...')
  const hashedPassword = await bcrypt.hash('password123', 12)

  const testUser = await prisma.user.upsert({
    where: { email: 'user@maffix.com' },
    update: {},
    create: {
      email: 'user@maffix.com',
      name: 'Test User',
      password: hashedPassword,
      role: 'USER',
      diamonds: 500,
      points: 100,
      level: 1,
    },
  })

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@maffix.com' },
    update: {},
    create: {
      email: 'admin@maffix.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      diamonds: 10000,
      points: 5000,
      level: 10,
    },
  })

  console.log('✅ Created users:', {
    user: testUser.email,
    admin: adminUser.email,
  })

  // Create sample tasks
  console.log('📋 Creating tasks...')
  
  const task1 = await prisma.task.create({
    data: {
      title: 'Follow on Social Media',
      description: 'Follow our official social media accounts',
      type: 'SOCIAL',
      difficulty: 'EASY',
      points: 10,
      diamonds: 5,
      isActive: true,
    },
  })

  const task2 = await prisma.task.create({
    data: {
      title: 'Write a Review',
      description: 'Write a review about your favorite song',
      type: 'CONTENT',
      difficulty: 'MEDIUM',
      points: 50,
      diamonds: 25,
      isActive: true,
    },
  })

  const task3 = await prisma.task.create({
    data: {
      title: 'Daily Check-in',
      description: 'Check in daily to earn rewards',
      type: 'DAILY',
      difficulty: 'EASY',
      points: 5,
      diamonds: 2,
      isActive: true,
    },
  })

  const task4 = await prisma.task.create({
    data: {
      title: 'Complete Your Profile',
      description: 'Add your avatar and bio to your profile',
      type: 'PROFILE',
      difficulty: 'EASY',
      points: 20,
      diamonds: 10,
      isActive: true,
    },
  })

  const task5 = await prisma.task.create({
    data: {
      title: 'Refer a Friend',
      description: 'Invite a friend to join Maffix',
      type: 'REFERRAL',
      difficulty: 'HARD',
      points: 100,
      diamonds: 50,
      isActive: true,
    },
  })

  console.log(`✅ Created ${5} tasks`)

  // Create sample prizes
  console.log('🎁 Creating prizes...')

  const prize1 = await prisma.prize.create({
    data: {
      name: 'Exclusive Sticker Pack',
      description: 'A set of exclusive digital stickers',
      rarity: 'COMMON',
      type: 'DIGITAL',
      value: 10,
      isActive: true,
      stock: 100,
    },
  })

  const prize2 = await prisma.prize.create({
    data: {
      name: 'Limited Edition T-Shirt',
      description: 'Official Maffix limited edition t-shirt',
      rarity: 'RARE',
      type: 'PHYSICAL',
      value: 100,
      isActive: true,
      stock: 50,
    },
  })

  const prize3 = await prisma.prize.create({
    data: {
      name: 'VIP Concert Ticket',
      description: 'VIP access to exclusive concert',
      rarity: 'SSR',
      type: 'EXPERIENCE',
      value: 500,
      isActive: true,
      stock: 10,
    },
  })

  const prize4 = await prisma.prize.create({
    data: {
      name: 'Meet & Greet Pass',
      description: 'Personal meet and greet with the artist',
      rarity: 'LEGENDARY',
      type: 'EXPERIENCE',
      value: 1000,
      isActive: true,
      stock: 5,
    },
  })

  const prize5 = await prisma.prize.create({
    data: {
      name: '20% Discount Code',
      description: '20% off on merchandise store',
      rarity: 'COMMON',
      type: 'DISCOUNT',
      value: 20,
      isActive: true,
      stock: null, // Unlimited
    },
  })

  const prize6 = await prisma.prize.create({
    data: {
      name: 'Exclusive Album Access',
      description: 'Early access to unreleased album',
      rarity: 'SSR',
      type: 'EXCLUSIVE',
      value: 300,
      isActive: true,
      stock: 20,
    },
  })

  console.log(`✅ Created ${6} prizes`)

  // Create default gacha banner
  console.log('🎪 Creating default gacha banner...')
  const defaultBanner = await prisma.gachaBanner.create({
    data: {
      name: 'Default Diamond Banner',
      slug: 'default-diamond',
      description: 'The classic diamond gacha with exclusive prizes',
      backgroundVideoUrl: 'https://example.com/default-video.mp4', // TODO: Replace with real video URL
      currencyType: 'DIAMONDS',
      costPerPull: 100, // 100 diamonds per single pull
      startDate: new Date('2024-01-01'),
      endDate: new Date('2030-12-31'), // Far future end date
      isActive: true,
      sortOrder: 0,
    },
  })
  console.log(`✅ Created default banner: ${defaultBanner.name}`)

  // Create gacha items
  console.log('🎰 Creating gacha items...')

  await prisma.gachaItem.create({
    data: {
      bannerId: defaultBanner.id,
      prizeId: prize1.id,
      probability: 40.0, // 40% chance
      isActive: true,
    },
  })

  await prisma.gachaItem.create({
    data: {
      bannerId: defaultBanner.id,
      prizeId: prize2.id,
      probability: 25.0, // 25% chance
      isActive: true,
    },
  })

  await prisma.gachaItem.create({
    data: {
      bannerId: defaultBanner.id,
      prizeId: prize3.id,
      probability: 15.0, // 15% chance
      isActive: true,
    },
  })

  await prisma.gachaItem.create({
    data: {
      bannerId: defaultBanner.id,
      prizeId: prize4.id,
      probability: 5.0, // 5% chance
      isActive: true,
    },
  })

  await prisma.gachaItem.create({
    data: {
      bannerId: defaultBanner.id,
      prizeId: prize5.id,
      probability: 10.0, // 10% chance
      isActive: true,
    },
  })

  await prisma.gachaItem.create({
    data: {
      bannerId: defaultBanner.id,
      prizeId: prize6.id,
      probability: 5.0, // 5% chance
      isActive: true,
    },
  })

  console.log(`✅ Created ${6} gacha items`)

  console.log('')
  console.log('🎉 Database seed completed successfully!')
  console.log('')
  console.log('📝 Test Accounts:')
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
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')
  console.log('🚀 You can now:')
  console.log('  1. Login at http://localhost:3001/login')
  console.log('  2. View tasks at http://localhost:3001/tasks')
  console.log('  3. Try gacha at http://localhost:3001/gacha')
  console.log('  4. Admin panel at http://localhost:3001/admin')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

