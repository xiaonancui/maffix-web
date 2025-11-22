import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'

/**
 * GET /api/admin/users
 * List all users with statistics (admin only)
 */
export async function GET(request: Request) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Use mock data (database not connected)
    const mockUsers = [
      {
        id: 'user-1',
        email: 'sarah@example.com',
        name: 'Sarah Johnson',
        role: 'USER',
        avatar: null,
        diamondBalance: 1250,
        points: 850,
        level: 5,
        gachaPityCounter: 23,
        hasCompletedTenDraw: true,
        provider: 'credentials',
        tiktokUsername: '@sarah_music',
        tiktokLinkedAt: new Date('2024-01-15'),
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-20'),
        lastLoginAt: new Date('2024-01-20'),
        _count: {
          completedTasks: 15,
          prizes: 8,
          gachaPulls: 23,
          purchases: 2,
          orders: 3,
        },
      },
      {
        id: 'user-2',
        email: 'mike@example.com',
        name: 'Mike Chen',
        role: 'USER',
        avatar: null,
        diamondBalance: 800,
        points: 450,
        level: 3,
        gachaPityCounter: 45,
        hasCompletedTenDraw: false,
        provider: 'credentials',
        tiktokUsername: '@mike_chen',
        tiktokLinkedAt: new Date('2024-01-12'),
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-19'),
        lastLoginAt: new Date('2024-01-19'),
        _count: {
          completedTasks: 8,
          prizes: 3,
          gachaPulls: 12,
          purchases: 1,
          orders: 1,
        },
      },
      {
        id: 'user-3',
        email: 'emma@example.com',
        name: 'Emma Davis',
        role: 'USER',
        avatar: null,
        diamondBalance: 2100,
        points: 1200,
        level: 7,
        gachaPityCounter: 8,
        hasCompletedTenDraw: true,
        provider: 'credentials',
        tiktokUsername: '@emma_d',
        tiktokLinkedAt: new Date('2024-01-05'),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-20'),
        lastLoginAt: new Date('2024-01-20'),
        _count: {
          completedTasks: 25,
          prizes: 15,
          gachaPulls: 42,
          purchases: 5,
          orders: 7,
        },
      },
      {
        id: 'user-4',
        email: 'alex@example.com',
        name: 'Alex Martinez',
        role: 'USER',
        avatar: null,
        diamondBalance: 500,
        points: 300,
        level: 2,
        gachaPityCounter: 67,
        hasCompletedTenDraw: false,
        provider: 'credentials',
        tiktokUsername: null,
        tiktokLinkedAt: null,
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-19'),
        lastLoginAt: new Date('2024-01-19'),
        _count: {
          completedTasks: 5,
          prizes: 2,
          gachaPulls: 7,
          purchases: 0,
          orders: 0,
        },
      },
      {
        id: 'user-5',
        email: 'lisa@example.com',
        name: 'Lisa Wang',
        role: 'USER',
        avatar: null,
        diamondBalance: 3500,
        points: 2000,
        level: 10,
        gachaPityCounter: 15,
        hasCompletedTenDraw: true,
        provider: 'credentials',
        tiktokUsername: '@lisa_official',
        tiktokLinkedAt: new Date('2023-12-20'),
        createdAt: new Date('2023-12-15'),
        updatedAt: new Date('2024-01-20'),
        lastLoginAt: new Date('2024-01-20'),
        _count: {
          completedTasks: 45,
          prizes: 28,
          gachaPulls: 85,
          purchases: 12,
          orders: 15,
        },
      },
    ]

    // Apply filters
    let filteredUsers = mockUsers

    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.tiktokUsername?.toLowerCase().includes(searchLower)
      )
    }

    if (role) {
      filteredUsers = filteredUsers.filter((user) => user.role === role)
    }

    const total = filteredUsers.length
    const start = (page - 1) * limit
    const paginatedUsers = filteredUsers.slice(start, start + limit)

    return NextResponse.json({
      success: true,
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

