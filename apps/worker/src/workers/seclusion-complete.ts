import type { Job } from 'bullmq'
import { prisma } from '@thien-nam/db'
import { z } from 'zod'

const SeclusionCompleteJobSchema = z.object({
  characterId: z.string().min(1),
  pointsEarned: z.number().int().positive(),
  startedAt: z.string().datetime().optional(),
})

export type SeclusionCompleteJob = z.infer<typeof SeclusionCompleteJobSchema>

export async function processSeclusionCompletion(job: Job<SeclusionCompleteJob>): Promise<{
  skipped: boolean
  pointsAwarded: number
}> {
  const parsed = SeclusionCompleteJobSchema.safeParse(job.data)
  if (!parsed.success) {
    throw new Error(`Invalid seclusion job data: ${parsed.error.message}`)
  }

  const { characterId, pointsEarned } = parsed.data
  const startedAt = parsed.data.startedAt ? new Date(parsed.data.startedAt) : null

  return prisma.$transaction(async (tx) => {
    const character = await tx.character.findUnique({
      where: { id: characterId },
      select: { id: true },
    })

    if (!character) {
      throw new Error(`Character ${characterId} not found`)
    }

    if (startedAt) {
      const existingSession = await tx.cultivationSession.findFirst({
        where: {
          characterId,
          mode: 'SECLUSION',
          createdAt: { gte: startedAt },
        },
        select: { id: true },
      })

      if (existingSession) {
        return { skipped: true, pointsAwarded: 0 }
      }
    }

    await tx.character.update({
      where: { id: characterId },
      data: {
        cultivationPoints: { increment: pointsEarned },
        lastCultivationAt: new Date(),
      },
    })

    await tx.cultivationSession.create({
      data: {
        characterId,
        mode: 'SECLUSION',
        pointsGained: pointsEarned,
        heartDemon: 0,
        injury: 0,
        spiritStones: 0,
        stability: 100,
      },
    })

    await tx.actionLog.create({
      data: {
        characterId,
        action: 'SECLUSION_COMPLETE',
        details: { pointsEarned, startedAt: startedAt?.toISOString() ?? null },
        publicLog: false,
      },
    })

    return { skipped: false, pointsAwarded: pointsEarned }
  })
}
