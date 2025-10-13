import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back, {session.user.name}
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-3xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-3xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-3xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Pending Verifications
              </p>
              <p className="text-2xl font-semibold text-red-600">
                {pendingVerifications}
              </p>
            </div>
          </div>
          <Link
            href="/admin/tasks"
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Review now →
          </Link>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-3xl">🎁</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Prizes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalPrizes}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/tasks"
            className="rounded-lg bg-blue-600 p-4 text-center text-white hover:bg-blue-500"
          >
            <span className="text-2xl">✓</span>
            <p className="mt-2 font-semibold">Verify Tasks</p>
          </Link>
          <Link
            href="/admin/users"
            className="rounded-lg bg-green-600 p-4 text-center text-white hover:bg-green-500"
          >
            <span className="text-2xl">👥</span>
            <p className="mt-2 font-semibold">Manage Users</p>
          </Link>
          <Link
            href="/admin/prizes"
            className="rounded-lg bg-purple-600 p-4 text-center text-white hover:bg-purple-500"
          >
            <span className="text-2xl">🎁</span>
            <p className="mt-2 font-semibold">Manage Prizes</p>
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg bg-gray-600 p-4 text-center text-white hover:bg-gray-500"
          >
            <span className="text-2xl">👤</span>
            <p className="mt-2 font-semibold">User View</p>
          </Link>
        </div>
      </div>

      {/* Recent Users */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Recent Users
        </h2>
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Diamonds
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {recentUsers.map((user) => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        user.role === 'ADMIN'
                          ? 'bg-red-100 text-red-800'
                          : user.role === 'ARTIST'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    💎 {user.diamondBalance}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    ⭐ {user.points}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
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

