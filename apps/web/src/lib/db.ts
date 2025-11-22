import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with better error handling and connection pooling
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

  // Add connection pooling parameters for Supabase
  const databaseUrl = new URL(process.env.DATABASE_URL)

  // Add pgbouncer=true for Supabase connection pooling
  if (databaseUrl.hostname.includes('supabase.co')) {
    databaseUrl.searchParams.set('pgbouncer', 'true')
    databaseUrl.searchParams.set('connection_limit', '1')
    databaseUrl.searchParams.set('pool_timeout', '20')
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: databaseUrl.toString(),
      },
    },
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

// Graceful shutdown
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await db.$disconnect()
  })
}

