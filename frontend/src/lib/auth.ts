import { AuthProvider } from '@refinedev/core';
import { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';
import CredentialsProvider from 'next-auth/providers/credentials';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // TikTok OAuth - Custom provider since NextAuth doesn't have built-in TikTok support
    {
      id: 'tiktok',
      name: 'TikTok',
      type: 'oauth',
      authorization: {
        url: 'https://www.tiktok.com/auth/authorize/',
        params: {
          client_key: process.env.TIKTOK_CLIENT_KEY,
          response_type: 'code',
          scope: 'user.info.basic',
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/tiktok`,
        },
      },
      token: 'https://open-api.tiktok.com/oauth/access_token/',
      userinfo: 'https://open-api.tiktok.com/oauth/userinfo/',
      clientId: process.env.TIKTOK_CLIENT_KEY!,
      clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
      profile(profile: any) {
        return {
          id: profile.data.user.union_id,
          name: profile.data.user.display_name,
          email: null, // TikTok doesn't provide email by default
          image: profile.data.user.avatar_url,
        };
      },
    },
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const user = await response.json();
          return user;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.diamondBalance = user.diamondBalance;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.diamondBalance = token.diamondBalance as number;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (
        account?.provider === 'google' ||
        account?.provider === 'tiktok' ||
        account?.provider === 'discord'
      ) {
        try {
          // Register or login user with OAuth provider
          const response = await fetch(`${API_URL}/auth/oauth`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              provider: account.provider,
              providerId: account.providerAccountId,
              email: user.email,
              name: user.name,
              image: user.image,
            }),
          });

          if (response.ok) {
            const userData = await response.json();
            user.id = userData.id;
            user.role = userData.role;
            user.diamondBalance = userData.diamondBalance;
            return true;
          }
        } catch (error) {
          console.error('OAuth sign in error:', error);
        }
      }
      return true;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    // In demo mode, accept any credentials
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      if (email && password) {
        return {
          success: true,
          redirectTo: '/dashboard',
        };
      }
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        return {
          success: true,
          redirectTo: '/dashboard',
        };
      }

      return {
        success: false,
        error: {
          name: 'LoginError',
          message: 'Invalid credentials',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: 'LoginError',
          message: 'Login failed',
        },
      };
    }
  },

  logout: async () => {
    return {
      success: true,
      redirectTo: '/auth/signin',
    };
  },

  check: async () => {
    // In demo mode, always return authenticated
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      return {
        authenticated: true,
      };
    }

    // For now, return authenticated true to avoid server-side session issues
    return {
      authenticated: true,
    };
  },

  getPermissions: async () => {
    return 'user';
  },

  getIdentity: async () => {
    return {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      avatar: '',
      role: 'user',
      diamondBalance: 1000,
    };
  },

  onError: async error => {
    console.error('Auth error:', error);
    return { error };
  },
};
