/**
 * Injury Expire Worker — marks expired injuries as inactive and recomputes character.injuryLevel.
 *
 * This runs on a cron schedule (e.g. every 15 minutes). It:
 * 1. Finds all active injuries where expiresAt <= now
 * 2. Marks them isActive = false
 * 3. Recomputes character.injuryLevel from remaining active injuries (SUM of active levels)
 * 4. Writes ActionLog entries for each character affected
 */
import type { Job } from "bullmq";
import { prisma } from "@thien-nam/db";

export interface InjuryExpireJob {
  characterId?: string; // If provided, only process this character; otherwise batch all
}

interface ExpiredInjury {
  id: string;
  characterId: string;
  level: number;
}

interface CharacterInjuryUpdate {
  characterId: string;
  expiredIds: string[];
  expiredTotal: number;
  remainingLevel: number;
}

export async function processInjuryExpirations(job?: Job<InjuryExpireJob>): Promise<{
  processed: number;
  charactersUpdated: number;
}> {
  const now = new Date();
  let processed = 0;
  let charactersUpdated = 0;

  if (job?.data.characterId) {
    // Single-character cleanup (e.g. after a healing action)
    const result = await expireCharacterInjuries(job.data.characterId, now);
    return { processed: result.expiredIds.length, charactersUpdated: result.remainingLevel !== undefined ? 1 : 0 };
  }

  // Batch cleanup — process all expired injuries
  // Process in chunks to avoid holding locks too long
  while (true) {
    const expiredInjuries = await prisma.injury.findMany({
      where: { isActive: true, expiresAt: { lte: now } },
      select: { id: true, characterId: true, level: true },
      take: 500,
      orderBy: { characterId: "asc" },
    });

    if (expiredInjuries.length === 0) break;

    const updates = groupByCharacter(expiredInjuries);

    for (const update of updates) {
      await expireCharacterInjuries(update.characterId, now, update.expiredIds);
      charactersUpdated++;
    }

    processed += expiredInjuries.length;

    if (expiredInjuries.length < 500) break;

    // Small delay between chunks to reduce DB pressure
    await sleep(50);
  }

  console.log(
    `[Injury Expire] Processed ${processed} injuries across ${charactersUpdated} characters.`,
  );

  return { processed, charactersUpdated };
}

async function expireCharacterInjuries(
  characterId: string,
  now: Date,
  preFoundExpiredIds?: string[],
): Promise<{ expiredIds: string[]; remainingLevel: number }> {
  return prisma.$transaction(async (tx) => {
    // Find expired injuries (or use pre-found IDs for efficiency in batch mode)
    const expiredIds = preFoundExpiredIds ??
      (await tx.injury.findMany({
        where: { characterId, isActive: true, expiresAt: { lte: now } },
        select: { id: true },
      })).map((i) => i.id);

    if (expiredIds.length === 0) {
      return { expiredIds: [], remainingLevel: -1 };
    }

    // Mark all expired injuries as inactive
    await tx.injury.updateMany({
      where: { id: { in: expiredIds } },
      data: { isActive: false },
    });

    // Recompute injuryLevel from remaining active injuries
    const activeInjuries = await tx.injury.findMany({
      where: { characterId, isActive: true },
      select: { level: true },
    });

    const newInjuryLevel = activeInjuries.reduce((sum, injury) => sum + injury.level, 0);

    await tx.character.update({
      where: { id: characterId },
      data: { injuryLevel: newInjuryLevel },
    });

    // Write ActionLog
    await tx.actionLog.create({
      data: {
        characterId,
        action: "INJURY_EXPIRED",
        details: {
          expiredCount: expiredIds.length,
          newInjuryLevel,
        },
        publicLog: false,
      },
    });

    return { expiredIds, remainingLevel: newInjuryLevel };
  });
}

function groupByCharacter(injuries: ExpiredInjury[]): CharacterInjuryUpdate[] {
  const map = new Map<string, string[]>();
  for (const injury of injuries) {
    const existing = map.get(injury.characterId) ?? [];
    existing.push(injury.id);
    map.set(injury.characterId, existing);
  }
  return Array.from(map.entries()).map(([characterId, expiredIds]) => ({
    characterId,
    expiredIds,
    expiredTotal: expiredIds.length,
    remainingLevel: 0,
  }));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
