import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

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
    <div className="mx-auto max-w-7xl px-6 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <AdminPageHeader
        title="Admin Dashboard"
        description={`Welcome back, ${session.user.name}`}
        badge={
          <span className="rounded-full bg-red-500/20 px-4 py-2 text-xs font-bold text-red-400 backdrop-blur-sm border border-red-500/30 shadow-lg shadow-red-500/20">
            🛡️ ADMIN MODE
          </span>
        }
      />

      {/* Statistics Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-[#1a1a1a] p-6 shadow-lg shadow-red-500/20 border border-red-500/20 hover:border-red-500/40 transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-3xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white">
                {totalUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-[#1a1a1a] p-6 shadow-lg shadow-red-500/20 border border-red-500/20 hover:border-red-500/40 transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-3xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-400">Total Tasks</p>
              <p className="text-2xl font-bold text-white">
                {totalTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-[#1a1a1a] p-6 shadow-lg shadow-red-500/20 border-2 border-red-500/50 hover:border-red-500/70 transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-3xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-400">
                Pending Verifications
              </p>
              <p className="text-2xl font-bold text-[#FF5656]">
                {pendingVerifications}
              </p>
            </div>
          </div>
          <Link
            href="/admin/tasks"
            className="mt-2 inline-block text-sm font-semibold text-[#FF5656] hover:text-red-400 transition-colors"
          >
            Review now →
          </Link>
        </div>

        <div className="rounded-lg bg-[#1a1a1a] p-6 shadow-lg shadow-red-500/20 border border-red-500/20 hover:border-red-500/40 transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-3xl">🎁</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-400">Total Prizes</p>
              <p className="text-2xl font-bold text-white">
                {totalPrizes}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold tracking-tight text-white">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/tasks"
            className="rounded-md bg-gradient-to-r from-red-600 to-red-500 p-4 text-center text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all hover:scale-105"
          >
            <span className="text-2xl">✓</span>
            <p className="mt-2 font-bold">Verify Tasks</p>
          </Link>
          <Link
            href="/admin/users"
            className="rounded-md bg-[#1a1a1a] p-4 text-center text-white border border-red-500/30 hover:border-red-500/50 hover:bg-gray-800 transition-all hover:scale-105"
          >
            <span className="text-2xl">👥</span>
            <p className="mt-2 font-bold">Manage Users</p>
          </Link>
          <Link
            href="/admin/prizes"
            className="rounded-md bg-gradient-to-r from-red-600 to-red-500 p-4 text-center text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all hover:scale-105"
          >
            <span className="text-2xl">🎁</span>
            <p className="mt-2 font-bold">Manage Prizes</p>
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md bg-[#1a1a1a] p-4 text-center text-white border border-red-500/30 hover:border-red-500/50 hover:bg-gray-800 transition-all hover:scale-105"
          >
            <span className="text-2xl">👤</span>
            <p className="mt-2 font-bold">User View</p>
          </Link>
        </div>
      </div>

      {/* Recent Users */}
      <div>
        <h2 className="mb-4 text-xl font-bold tracking-tight text-white">
          Recent Users
        </h2>
        <div className="overflow-hidden rounded-lg bg-[#1a1a1a] shadow-lg shadow-red-500/20 border border-red-500/20">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-red-900/20 border-b-2 border-red-500/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-400">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-400">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-400">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-400">
                  Diamonds
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-400">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-400">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-[#1a1a1a]">
              {recentUsers.map((user) => (
                <tr key={user.id} className="odd:bg-red-500/5 hover:bg-red-500/10 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-white">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-semibold border shadow-sm ${
                        user.role === 'ADMIN'
                          ? 'bg-red-500/20 text-red-400 border-red-500/30 shadow-red-500/20'
                          : user.role === 'ARTIST'
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/30 shadow-purple-500/20'
                          : 'bg-gray-800 text-gray-300 border-gray-700'
                      }`}
                    >
                      {user.role === 'ADMIN' && '● '}
                      {user.role === 'ARTIST' && '● '}
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                    💎 {user.diamondBalance}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                    ⭐ {user.points}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
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

