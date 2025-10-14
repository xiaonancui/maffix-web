import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/auth/LogoutButton'

export default async function DashboardPage() {
  // Dynamic import to avoid build-time database connection
  const { db } = await import('@/lib/db')

  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch user data with gamification stats
  let user

  // Use mock data for test accounts in development
  const isTestAccount = process.env.NODE_ENV === 'development' &&
    (session.user.id?.includes('test-') || session.user.id?.includes('demo-') || session.user.id?.includes('admin-'))

  if (isTestAccount) {
    console.log('📊 Using mock data for test account:', session.user.email)
    user = {
      id: session.user.id,
      name: session.user.name || 'Test User',
      email: session.user.email || 'test@maffix.com',
      avatar: null,
      role: session.user.role || 'USER',
      diamondBalance: session.user.role === 'ADMIN' ? 10000 : 500,
      points: session.user.role === 'ADMIN' ? 5000 : 100,
      level: session.user.role === 'ADMIN' ? 10 : 1,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    }
  } else {
    // Fetch from database for real users
    try {
      user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
          diamondBalance: true,
          points: true,
          level: true,
          createdAt: true,
          lastLoginAt: true,
        },
      })

      if (!user) {
        redirect('/login')
      }
    } catch (error) {
      console.error('Database fetch failed:', error)
      redirect('/login')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.name}!
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Level {user.level} • {user.role}
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Diamonds */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                  💎
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Diamonds
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {user.diamondBalance.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Points */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-500 text-white">
                  ⭐
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Points
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {user.points.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Level */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-purple-500 text-white">
                  🏆
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Level
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {user.level}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Quick Actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="/tasks"
              className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              📋 View Tasks
            </a>
            <a
              href="/gacha"
              className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              🎰 Try Gacha
            </a>
            <a
              href="/prizes"
              className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              🎁 My Prizes
            </a>
            <a
              href="/profile"
              className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              👤 Profile
            </a>
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Account Information
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.role}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Member Since</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Login</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user.lastLoginAt
                  ? new Date(user.lastLoginAt).toLocaleDateString()
                  : 'Never'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

