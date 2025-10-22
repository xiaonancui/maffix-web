import {
  Currency,
  JobStatus,
  TransactionStatus,
  TransactionType,
  VerificationStatus,
} from '@prisma/client'
import { db } from '@/lib/db'

const DEFAULT_RETRY_MINUTES = 5
const MAX_BACKOFF_MINUTES = 30

type ProcessResult = {
  processed: number
  alreadyCompleted: number
  retried: number
  failed: number
}

const calculateNextRetry = (attempt: number, maxAttempts: number): Date | null => {
  if (attempt >= maxAttempts) {
    return null
  }

  const delayExponent = Math.max(0, attempt - 1)
  const delayMinutes = Math.min(MAX_BACKOFF_MINUTES, DEFAULT_RETRY_MINUTES * Math.pow(2, delayExponent))
  const nextRetry = new Date()
  nextRetry.setMinutes(nextRetry.getMinutes() + delayMinutes)
  return nextRetry
}

const hasDatabaseConnection = () => {
  if (!process.env.DATABASE_URL) {
    console.warn('[MissionWorker] DATABASE_URL not configured. Skipping mission processing.')
    return false
  }
  return true
}

export async function processPendingJobs(limit = 10): Promise<ProcessResult> {
  if (!hasDatabaseConnection()) {
    return { processed: 0, alreadyCompleted: 0, retried: 0, failed: 0 }
  }

  const now = new Date()

  const jobs = await db.missionVerificationJob.findMany({
    where: {
      status: JobStatus.PENDING,
      OR: [
        { nextRetryAt: null },
        {
          nextRetryAt: {
            lte: now,
          },
        },
      ],
    },
    orderBy: { createdAt: 'asc' },
    take: limit,
  })

  if (jobs.length === 0) {
    return { processed: 0, alreadyCompleted: 0, retried: 0, failed: 0 }
  }

  let processed = 0
  let alreadyCompleted = 0
  let retried = 0
  let failed = 0

  for (const job of jobs) {
    try {
      const outcome = await db.$transaction(async (tx) => {
        const processingJob = await tx.missionVerificationJob.update({
          where: { id: job.id },
          data: {
            status: JobStatus.PROCESSING,
            attempts: { increment: 1 },
            nextRetryAt: null,
            errorMessage: null,
          },
        })

        const userTask = await tx.userTask.findUnique({
          where: { id: processingJob.userTaskId },
          include: {
            task: true,
          },
        })

        if (!userTask) {
          throw new Error('Associated user task not found')
        }

        if (userTask.verified) {
          await tx.missionVerificationJob.update({
            where: { id: job.id },
            data: {
              status: JobStatus.COMPLETED,
              verificationResult: true,
              completedAt: new Date(),
            },
          })
          return 'ALREADY_VERIFIED' as const
        }

        const completionTime = new Date()

        await tx.userTask.update({
          where: { id: userTask.id },
          data: {
            verified: true,
            verifiedAt: completionTime,
            completedAt: completionTime,
            verificationStatus: VerificationStatus.APPROVED,
            verifiedBy: 'system',
          },
        })

        // Increment completion count for reporting/limits
        await tx.task.update({
          where: { id: userTask.taskId },
          data: {
            completionCount: {
              increment: 1,
            },
          },
        })

        // Award rewards if applicable
        if (userTask.diamondsEarned > 0 || userTask.pointsEarned > 0) {
          await tx.user.update({
            where: { id: userTask.userId },
            data: {
              diamondBalance: {
                increment: userTask.diamondsEarned,
              },
              points: {
                increment: userTask.pointsEarned,
              },
            },
          })

          if (userTask.diamondsEarned > 0) {
            await tx.transaction.create({
              data: {
                userId: userTask.userId,
                type: TransactionType.EARN,
                amount: userTask.diamondsEarned,
                currency: Currency.DIAMONDS,
                description: `Auto-verified mission: ${userTask.task.title}`,
                reference: userTask.taskId,
                status: TransactionStatus.COMPLETED,
              },
            })
          }

          if (userTask.pointsEarned > 0) {
            await tx.transaction.create({
              data: {
                userId: userTask.userId,
                type: TransactionType.EARN,
                amount: userTask.pointsEarned,
                currency: Currency.POINTS,
                description: `Auto-verified mission: ${userTask.task.title}`,
                reference: userTask.taskId,
                status: TransactionStatus.COMPLETED,
              },
            })
          }
        }

        await tx.missionVerificationJob.update({
          where: { id: job.id },
          data: {
            status: JobStatus.COMPLETED,
            verificationResult: true,
            completedAt: completionTime,
            errorMessage: null,
          },
        })

        return 'PROCESSED' as const
      })

      if (outcome === 'ALREADY_VERIFIED') {
        alreadyCompleted += 1
      } else {
        processed += 1
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown mission processing error'
      const nextAttempt = job.attempts + 1
      const nextRetryAt = calculateNextRetry(nextAttempt, job.maxAttempts)

      await db.missionVerificationJob.update({
        where: { id: job.id },
        data: {
          attempts: { increment: 1 },
          status: nextRetryAt ? JobStatus.PENDING : JobStatus.FAILED,
          nextRetryAt,
          errorMessage: message,
          verificationResult: nextRetryAt ? null : false,
        },
      })

      if (nextRetryAt) {
        retried += 1
      } else {
        failed += 1
      }
    }
  }

  return { processed, alreadyCompleted, retried, failed }
}

export async function getJobStatistics() {
  if (!hasDatabaseConnection()) {
    return {
      total: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
      oldestPendingCreatedAt: null as Date | null,
      nextRetryAt: null as Date | null,
    }
  }

  const grouped = await db.missionVerificationJob.groupBy({
    by: ['status'],
    _count: {
      status: true,
    },
  })

  const counts = new Map<JobStatus, number>()
  grouped.forEach((item) => {
    counts.set(item.status, item._count.status)
  })

  const total = grouped.reduce((sum, item) => sum + item._count.status, 0)

  const oldestPending = await db.missionVerificationJob.findFirst({
    where: {
      status: JobStatus.PENDING,
    },
    orderBy: {
      createdAt: 'asc',
    },
    select: {
      createdAt: true,
    },
  })

  const nextRetry = await db.missionVerificationJob.findFirst({
    where: {
      status: JobStatus.PENDING,
      nextRetryAt: {
        not: null,
      },
    },
    orderBy: {
      nextRetryAt: 'asc',
    },
    select: {
      nextRetryAt: true,
    },
  })

  return {
    total,
    pending: counts.get(JobStatus.PENDING) ?? 0,
    processing: counts.get(JobStatus.PROCESSING) ?? 0,
    completed: counts.get(JobStatus.COMPLETED) ?? 0,
    failed: counts.get(JobStatus.FAILED) ?? 0,
    cancelled: counts.get(JobStatus.CANCELLED) ?? 0,
    oldestPendingCreatedAt: oldestPending?.createdAt ?? null,
    nextRetryAt: nextRetry?.nextRetryAt ?? null,
  }
}

