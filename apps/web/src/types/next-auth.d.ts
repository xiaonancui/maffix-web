import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      provider?: string
      providerId?: string
      tiktokUsername?: string | null
      tiktokUserId?: string | null
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    role: string
    provider?: string
    providerId?: string
    tiktokUsername?: string | null
    tiktokUserId?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    role: string
    provider?: string
    providerId?: string
    tiktokUsername?: string | null
    tiktokUserId?: string | null
    tiktokAccessToken?: string | null
    tiktokRefreshToken?: string | null
    tiktokTokenExpiry?: number | null
  }
}
