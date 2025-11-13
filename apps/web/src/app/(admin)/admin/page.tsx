import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  // Dynamic import to avoid build-time database connection
  const { db } = await import('@/lib/db')

  // Fetch statistics
  const [
    totalUsers,
    totalTasks,
    pendingVerifications,
    totalPrizes,
    totalGachaPulls,
    recentUsers,
  ] = await Promise.all([
    db.user.count(),
    db.task.count(),
    db.userTask.count({ where: { verified: false } }),
    db.prize.count(),
    db.gachaPull.count(),
    db.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        diamondBalance: true,
        points: true,
      },
    }),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-400">
          Welcome back, {session.user.name}
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-gray-900 p-6 shadow border border-gray-800 hover:border-[#FF5656] transition-colors">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-3xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Users</p>
              <p className="text-2xl font-semibold text-white">
                {totalUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gray-900 p-6 shadow border border-gray-800 hover:border-[#FF5656] transition-colors">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-3xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Tasks</p>
              <p className="text-2xl font-semibold text-white">
                {totalTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gray-900 p-6 shadow border border-gray-800 hover:border-[#FF5656] transition-colors">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-3xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">
                Pending Verifications
              </p>
              <p className="text-2xl font-semibold text-[#FF5656]">
                {pendingVerifications}
              </p>
            </div>
          </div>
          <Link
            href="/admin/tasks"
            className="mt-2 text-sm text-[#FF5656] hover:underline"
          >
            Review now →
          </Link>
        </div>

        <div className="rounded-lg bg-gray-900 p-6 shadow border border-gray-800 hover:border-[#FF5656] transition-colors">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-3xl">🎁</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Prizes</p>
              <p className="text-2xl font-semibold text-white">
                {totalPrizes}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/tasks"
            className="rounded-lg bg-[#FF5656] p-4 text-center text-white hover:bg-[#FF5656]/90 transition-all hover:scale-105"
          >
            <span className="text-2xl">✓</span>
            <p className="mt-2 font-semibold">Verify Tasks</p>
          </Link>
          <Link
            href="/admin/users"
            className="rounded-lg bg-gray-800 p-4 text-center text-white hover:bg-gray-700 transition-all hover:scale-105 border border-gray-700"
          >
            <span className="text-2xl">👥</span>
            <p className="mt-2 font-semibold">Manage Users</p>
          </Link>
          <Link
            href="/admin/prizes"
            className="rounded-lg bg-[#FF5656] p-4 text-center text-white hover:bg-[#FF5656]/90 transition-all hover:scale-105"
          >
            <span className="text-2xl">🎁</span>
            <p className="mt-2 font-semibold">Manage Prizes</p>
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg bg-gray-800 p-4 text-center text-white hover:bg-gray-700 transition-all hover:scale-105 border border-gray-700"
          >
            <span className="text-2xl">👤</span>
            <p className="mt-2 font-semibold">User View</p>
          </Link>
        </div>
      </div>

      {/* Recent Users */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-white">
          Recent Users
        </h2>
        <div className="overflow-hidden rounded-lg bg-gray-900 shadow border border-gray-800">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-950">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Diamonds
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-gray-900">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        user.role === 'ADMIN'
                          ? 'bg-[#FF5656]/20 text-[#FF5656]'
                          : user.role === 'ARTIST'
                          ? 'bg-[#FF5656]/10 text-[#FF5656]'
                          : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                    💎 {user.diamondBalance}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                    ⭐ {user.points}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

