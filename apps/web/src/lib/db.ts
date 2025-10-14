import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with better error handling
function createPrismaClient(): PrismaClient {
  // For build time, create a minimal client that won't actually connect
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not found, creating build-time Prisma client')
    // Return a client with a placeholder URL for build time
    return new PrismaClient({
      log: [],
      datasources: {
        db: {
          url: 'postgresql://build:build@localhost:5432/build',
        },
      },
    })
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

