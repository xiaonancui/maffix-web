import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { hasAdminAccess } from '@/lib/rbac'
import VerificationClient from './verification-client'

export const metadata = {
  title: 'Mission Verification - Admin',
  description: 'Review and verify mission submissions',
}

export default async function MissionVerificationPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Check admin access
  if (!hasAdminAccess((session.user.role || 'USER') as 'USER' | 'ADMIN' | 'ARTIST')) {
    redirect('/admin')
  }

  // Fetch pending submissions
  let pendingSubmissions: any[] = []

  try {
    const { db } = await import('@/lib/db')

    const submissions = await db.userTask.findMany({
      where: {
        verificationStatus: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
            description: true,
            missionType: true,
            difficulty: true,
            diamonds: true,
            points: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    })

    pendingSubmissions = submissions
  } catch (error) {
    console.error('Failed to fetch submissions:', error)
  }

  return <VerificationClient initialSubmissions={pendingSubmissions} />
}
