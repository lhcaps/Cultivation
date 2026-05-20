/**
 * Cultivation service — applies cultivation rules from core package.
 */
import { Injectable, BadRequestException } from "@nestjs/common";
import { resolveCultivation, canCultivate } from "@thien-nam/core/rules/cultivation.js";
import { CharacterService } from "../character/character.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import type { CharacterState, CultivationMode } from "@thien-nam/core/types/index.js";

@Injectable()
export class CultivationService {
  public constructor(
    private readonly characterService: CharacterService,
    private readonly prisma: PrismaService,
  ) {}

  async cultivate(characterId: string, mode: CultivationMode) {
    const character = await this.characterService.findById(characterId);
    if (!character) {
      throw new BadRequestException("Character not found");
    }

    // Convert to game engine input
    const state: CharacterState = {
      id: character.id,
      discordUserId: character.user.discordId,
      name: character.name,
      realm: character.realmId as never,
      subStage: character.subStage as never,
      cultivationPoints: character.cultivationPoints,
      foundationQuality: character.foundationQuality,
      heartDemon: character.heartDemon,
      injuryLevel: character.injuryLevel,
      region: character.regionId as never,
      sectId: character.sectId,
      manualId: character.manualId,
      currentHp: character.currentHp,
      maxHp: character.maxHp,
      currentQi: character.currentQi,
      maxQi: character.maxQi,
      silver: character.silver,
      spiritStones: character.spiritStones,
      merit: character.merit,
      reputation: character.reputation,
      heavenSeals: character.heavenSeals,
      luck: character.luck,
      element: character.element as never,
      lastCultivationAt: character.lastCultivationAt,
      lastHeartDemonAt: character.lastHeartDemonAt,
    };

    // Check prerequisites
    try {
      canCultivate(state, mode);
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : "Cannot cultivate");
    }

    // Resolve cultivation
    const result = resolveCultivation(state, mode, character.sectId);

    // Apply to database in transaction
    await this.prisma.$transaction(async (tx) => {
      await tx.character.update({
        where: { id: characterId },
        data: {
          cultivationPoints: { increment: result.pointsGained },
          heartDemon: { increment: result.heartDemonGained },
          lastCultivationAt: new Date(),
        },
      });

      if (result.spiritStonesGained > 0) {
        await tx.character.update({
          where: { id: characterId },
          data: { spiritStones: { increment: result.spiritStonesGained } },
        });
      }

      await tx.cultivationSession.create({
        data: {
          characterId,
          mode,
          pointsGained: result.pointsGained,
          heartDemon: result.heartDemonGained,
          injury: result.injury,
          spiritStones: result.spiritStonesGained,
          stability: result.stability,
        },
      });

      await tx.actionLog.create({
        data: {
          characterId,
          action: "CULTIVATE",
          details: {
            mode,
            points: result.pointsGained,
            heartDemon: result.heartDemonGained,
          },
          publicLog: result.shouldPublicLog,
        },
      });
    });

    return {
      ...result,
      characterId,
    };
  }
}
