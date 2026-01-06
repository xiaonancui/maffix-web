import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@maffix.com' },
    })

    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email)
      console.log('📧 Email: admin@maffix.com')
      console.log('🔑 Password: password123')
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 12)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@maffix.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
        diamonds: 10000,
        points: 5000,
        level: 10,
      },
    })

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email: admin@maffix.com')
    console.log('🔑 Password: password123')
    console.log('👤 Name:', admin.name)
    console.log('🔖 Role:', admin.role)
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()
