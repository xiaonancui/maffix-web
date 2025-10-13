import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

async function main() {
  console.log('🔧 Quick user creation...')
  
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  try {
    // Try to create user
    const user = await prisma.user.create({
      data: {
        email: 'test@maffix.com',
        name: 'Test User',
        password: hashedPassword,
        role: 'USER',
        diamondBalance: 500,
        points: 100,
        level: 1,
      },
    })
    
    console.log('✅ User created:', user.email)
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('ℹ️  User already exists')
    } else {
      console.error('❌ Error:', error.message)
    }
  }
  
  // List all users
  const users = await prisma.user.findMany({
    select: {
      email: true,
      name: true,
      role: true,
      diamondBalance: true,
    },
  })
  
  console.log('\n📋 All users:')
  console.table(users)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

