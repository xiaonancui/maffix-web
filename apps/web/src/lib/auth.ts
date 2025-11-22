import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { db } from './db'
import bcrypt from 'bcryptjs'

// Custom TikTok OAuth Provider
const TikTokProvider = {
  id: 'tiktok',
  name: 'TikTok',
  type: 'oauth' as const,
  authorization: {
    url: 'https://www.tiktok.com/v2/auth/authorize/',
    params: {
      client_key: process.env.TIKTOK_CLIENT_KEY,
      response_type: 'code',
      scope: 'user.info.basic,user.info.profile,user.info.stats',
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/tiktok`,
    },
  },
  token: {
    url: 'https://open.tiktokapis.com/v2/oauth/token/',
    async request(context: any) {
      const { params } = context
      const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache',
        },
        body: new URLSearchParams({
          client_key: process.env.TIKTOK_CLIENT_KEY!,
          client_secret: process.env.TIKTOK_CLIENT_SECRET!,
          code: params.code,
          grant_type: 'authorization_code',
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/tiktok`,
        }),
      })

      const tokens = await response.json()

      if (tokens.error) {
        console.error('TikTok token error:', tokens)
        throw new Error(tokens.error_description || 'Failed to get TikTok access token')
      }

      return { tokens }
    },
  },
  userinfo: {
    url: 'https://open.tiktokapis.com/v2/user/info/',
    async request(context: any) {
      const { tokens } = context
      const response = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,username', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (result.error) {
        console.error('TikTok userinfo error:', result)
        throw new Error(result.error.message || 'Failed to get TikTok user info')
      }

      return result
    },
  },
  profile(profile: any) {
    return {
      id: profile.data.user.open_id,
      name: profile.data.user.display_name || profile.data.user.username,
      email: null, // TikTok doesn't provide email by default
      image: profile.data.user.avatar_url,
      tiktokUsername: profile.data.user.username,
      tiktokUserId: profile.data.user.union_id || profile.data.user.open_id,
    }
  },
}

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
    ...(process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET
      ? [TikTokProvider as any]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id
        token.role = user.role

        // Store TikTok data if available
        if ((user as any).tiktokUsername) {
          token.tiktokUsername = (user as any).tiktokUsername
          token.tiktokUserId = (user as any).tiktokUserId
        }
      }

      // Store OAuth provider info and tokens
      if (account) {
        token.provider = account.provider
        token.providerId = account.providerAccountId

        // Store TikTok access token for API calls
        if (account.provider === 'tiktok') {
          token.tiktokAccessToken = account.access_token
          token.tiktokRefreshToken = account.refresh_token
          token.tiktokTokenExpiry = account.expires_at
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.provider = token.provider as string
        session.user.providerId = token.providerId as string
        session.user.tiktokUsername = token.tiktokUsername as string
        session.user.tiktokUserId = token.tiktokUserId as string
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
          const updateData: any = {
            provider: account.provider,
            providerId: account.providerAccountId,
          }

          // Store TikTok-specific data
          if (account.provider === 'tiktok') {
            updateData.tiktokAccessToken = account.access_token
            updateData.tiktokRefreshToken = account.refresh_token
            updateData.tiktokTokenExpiry = account.expires_at
              ? new Date(account.expires_at * 1000)
              : null
            updateData.tiktokLinkedAt = new Date()

            // Extract TikTok username and user ID from profile
            if (profile && typeof profile === 'object') {
              const tiktokProfile = profile as any
              if (tiktokProfile.data?.user) {
                updateData.tiktokUsername = tiktokProfile.data.user.username
                updateData.tiktokUserId =
                  tiktokProfile.data.user.union_id || tiktokProfile.data.user.open_id
              }
            }
          }

          await db.user.update({
            where: { id: user.id },
            data: updateData,
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

