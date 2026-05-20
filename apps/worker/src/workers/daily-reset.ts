import type { Job } from 'bullmq'
import { prisma } from '@thien-nam/db'

export interface DailyResetJob {
  resetDate?: string
}

export async function processDailyReset(job?: Job<DailyResetJob>): Promise<{
  skipped: boolean
  charactersUpdated: number
  resetDate: string
}> {
  const now = new Date()
  const resetDate = job?.data.resetDate ?? now.toISOString().slice(0, 10)
  const todayStart = new Date(`${resetDate}T00:00:00.000Z`)
  const tomorrowStart = new Date(todayStart.getTime() + 86_400_000)

  const existingReset = await prisma.actionLog.findFirst({
    where: {
      action: 'DAILY_RESET',
      createdAt: {
        gte: todayStart,
        lt: tomorrowStart,
      },
    },
    select: { id: true },
  })

  if (existingReset) {
    return { skipped: true, charactersUpdated: 0, resetDate }
  }

  return prisma.$transaction(async (tx) => {
    const updateResult = await tx.character.updateMany({
      where: { heartDemon: { gt: 0 } },
      data: { heartDemon: { decrement: 1 }, lastHeartDemonAt: now },
    })

    await tx.actionLog.create({
      data: {
        characterId: null,
        action: 'DAILY_RESET',
        details: {
          resetDate,
          heartDemonDecay: 1,
          charactersUpdated: updateResult.count,
        },
        publicLog: false,
      },
    })

    return {
      skipped: false,
      charactersUpdated: updateResult.count,
      resetDate,
    }
  })
}
