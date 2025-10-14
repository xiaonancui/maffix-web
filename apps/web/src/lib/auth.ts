import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { db } from './db'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        // Allow test accounts in development OR when explicitly enabled via environment variable
        const allowTestAccounts =
          process.env.NODE_ENV === 'development' ||
          process.env.ENABLE_TEST_ACCOUNTS === 'true'

        // Detailed logging for debugging
        console.log('🔍 Auth attempt:', {
          email: credentials.email,
          nodeEnv: process.env.NODE_ENV,
          enableTestAccounts: process.env.ENABLE_TEST_ACCOUNTS,
          allowTestAccounts,
        })

        if (allowTestAccounts) {
          const testAccounts = [
            {
              email: 'test@maffix.com',
              password: 'password123',
              id: 'test-user-id',
              name: 'Test User',
              role: 'USER',
            },
            {
              email: 'admin@maffix.com',
              password: 'password123',
              id: 'admin-user-id',
              name: 'Admin User',
              role: 'ADMIN',
            },
            {
              email: 'user@maffix.com',
              password: 'password123',
              id: 'demo-user-id',
              name: 'Demo User',
              role: 'USER',
            },
          ]

          const testAccount = testAccounts.find(
            (acc) => acc.email === credentials.email && acc.password === credentials.password
          )

          if (testAccount) {
            console.log('✅ Test account login SUCCESS:', testAccount.email, '(Environment:', process.env.NODE_ENV, ')')
            return {
              id: testAccount.id,
              email: testAccount.email,
              name: testAccount.name,
              role: testAccount.role,
            }
          } else {
            console.log('❌ Test account not found or password mismatch for:', credentials.email)
          }
        } else {
          console.log('⚠️ Test accounts are DISABLED. Set ENABLE_TEST_ACCOUNTS=true to enable.')
        }

        // Try database authentication
        try {
          // Skip database auth if no DATABASE_URL in production
          if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
            throw new Error('Database not available in production')
          }

          const user = await db.user.findUnique({
            where: {
              email: credentials.email,
            },
          })

          if (!user || !user.password) {
            throw new Error('Invalid credentials')
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isCorrectPassword) {
            throw new Error('Invalid credentials')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Database authentication failed:', error)
          throw new Error('Invalid credentials')
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      
      // Store OAuth provider info
      if (account) {
        token.provider = account.provider
        token.providerId = account.providerAccountId
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.provider = token.provider as string
        session.user.providerId = token.providerId as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Skip database operations for test accounts when test accounts are enabled
      const allowTestAccounts =
        process.env.NODE_ENV === 'development' ||
        process.env.ENABLE_TEST_ACCOUNTS === 'true'

      const isTestAccount = user.id?.includes('test-') || user.id?.includes('demo-') || user.id?.includes('admin-')

      if (allowTestAccounts && isTestAccount) {
        console.log('✅ Test account sign in:', user.email)
        return true
      }

      // Update last login time for real users
      try {
        // Skip database updates if no DATABASE_URL in production
        if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
          return true
        }

        if (user.id) {
          await db.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          })
        }

        // Store OAuth provider info
        if (account && profile) {
          await db.user.update({
            where: { id: user.id },
            data: {
              provider: account.provider,
              providerId: account.providerAccountId,
            },
          })
        }
      } catch (error) {
        console.error('Database update failed during sign in:', error)
        // Continue anyway for test accounts when enabled
        const allowTestAccounts =
          process.env.NODE_ENV === 'development' ||
          process.env.ENABLE_TEST_ACCOUNTS === 'true'
        if (allowTestAccounts) {
          return true
        }
      }

      return true
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

