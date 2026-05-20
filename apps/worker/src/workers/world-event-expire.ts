import type { Job } from 'bullmq'
import { prisma } from '@thien-nam/db'

export interface WorldEventExpireJob {
  now?: string
}

export async function processWorldEventExpirations(job?: Job<WorldEventExpireJob>): Promise<{
  expired: number
  eventIds: string[]
}> {
  const now = job?.data.now ? new Date(job.data.now) : new Date()

  return prisma.$transaction(async (tx) => {
    const expiredEvents = await tx.worldEvent.findMany({
      where: {
        isActive: true,
        endAt: { lte: now },
      },
      select: { id: true },
      take: 100,
    })

    if (expiredEvents.length === 0) {
      return { expired: 0, eventIds: [] }
    }

    const eventIds = expiredEvents.map((event) => event.id)

    await tx.worldEvent.updateMany({
      where: { id: { in: eventIds } },
      data: { isActive: false },
    })

    await tx.actionLog.create({
      data: {
        characterId: null,
        action: 'WORLD_EVENT_EXPIRED',
        details: { eventIds, expiredAt: now.toISOString() },
        publicLog: false,
      },
    })

    return {
      expired: eventIds.length,
      eventIds,
    }
  })
}
