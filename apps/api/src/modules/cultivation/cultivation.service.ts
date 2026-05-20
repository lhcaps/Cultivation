/**
 * Cultivation service — applies cultivation rules from core package.
 */
import { Inject, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common'
import { CULTIVATION_MODES } from '@thien-nam/core/constants'
import { resolveCultivation, canCultivate, type Rng } from '@thien-nam/core/rules'
import { CharacterService } from '../character/character.service.js'
import { PrismaService } from '../prisma/prisma.service.js'
import type { CharacterState, CultivationMode } from '@thien-nam/core/types/index.js'
import {
  CultivationMenuResponseSchema,
  CultivationResultResponseSchema,
  type CultivationMenuResponse,
  type CultivationResultResponse,
} from './cultivation.schemas.js'

type CharacterForCultivation = NonNullable<Awaited<ReturnType<CharacterService['findById']>>>

@Injectable()
export class CultivationService {
  private readonly rng: Rng

  public constructor(
    @Inject(CharacterService)
    private readonly characterService: CharacterService,
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
    rng?: Rng,
  ) {
    this.rng = rng ?? { next: () => Math.random() }
  }

  async getMenuForDiscordUser(discordId: string): Promise<CultivationMenuResponse | null> {
    const user = await this.characterService.findByDiscordId(discordId)
    const character = user?.characters[0]

    if (!character) {
      return null
    }

    const totalPoints = character.realm.pointsPerSubStage * 3
    const progress = this.clampProgress(character.cultivationPoints, totalPoints)

    const modes = (Object.keys(CULTIVATION_MODES) as CultivationMode[]).map((mode) => {
      const modeConfig = CULTIVATION_MODES[mode]
      const cooldownRemaining = this.getCooldownRemainingHours(
        character.lastCultivationAt,
        modeConfig.cooldownHours,
      )
      const missingSect = mode === 'SECT' && !character.sectId
      const disabled = cooldownRemaining > 0 || missingSect
      const reason = missingSect
        ? 'Need a sect'
        : cooldownRemaining > 0
          ? `${cooldownRemaining.toFixed(1)} hours remaining`
          : null

      return {
        mode,
        label: this.getModeLabel(mode),
        disabled,
        reason,
      }
    })

    return CultivationMenuResponseSchema.parse({
      character: {
        id: character.id,
        name: character.name,
        realmName: character.realm.name,
        subStage: character.subStage,
        cultivationPoints: character.cultivationPoints,
        totalPoints,
        progress,
        regionName: character.region.name,
        heartDemon: character.heartDemon,
        sectName: character.sect?.name ?? null,
        sectId: character.sectId,
      },
      modes,
    })
  }

  async cultivateForDiscordUser(
    discordId: string,
    characterId: string,
    mode: CultivationMode,
  ): Promise<CultivationResultResponse> {
    const character = await this.characterService.findById(characterId)
    if (!character) {
      throw new BadRequestException('Character not found')
    }

    if (character.user.discordId !== discordId) {
      throw new ForbiddenException('Character does not belong to this Discord user')
    }

    return this.cultivateLoadedCharacter(character, mode)
  }

  private async cultivateLoadedCharacter(
    character: CharacterForCultivation,
    mode: CultivationMode,
  ): Promise<CultivationResultResponse> {
    const state = this.toCharacterState(character)

    try {
      canCultivate(state, mode)
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Cannot cultivate')
    }

    const result = resolveCultivation(state, mode, character.sectId, this.rng)
    const now = new Date()
    const injuryExpiresAt = new Date(now.getTime() + result.injury * 3 * 86_400_000)

    await this.prisma.$transaction(async (tx) => {
      await tx.character.update({
        where: { id: character.id },
        data: {
          cultivationPoints: { increment: result.pointsGained },
          heartDemon: { increment: result.heartDemonGained },
          lastCultivationAt: now,
          ...(result.spiritStonesGained > 0
            ? { spiritStones: { increment: result.spiritStonesGained } }
            : {}),
          ...(result.injury > 0 ? { injuryLevel: { increment: result.injury } } : {}),
        },
      })

      if (result.injury > 0) {
        await tx.injury.create({
          data: {
            characterId: character.id,
            level: result.injury,
            type: 'NOI_THUONG',
            source: mode,
            expiresAt: injuryExpiresAt,
          },
        })
      }

      await tx.cultivationSession.create({
        data: {
          characterId: character.id,
          mode,
          pointsGained: result.pointsGained,
          heartDemon: result.heartDemonGained,
          injury: result.injury,
          spiritStones: result.spiritStonesGained,
          stability: result.stability,
        },
      })

      await tx.actionLog.create({
        data: {
          characterId: character.id,
          action: 'CULTIVATE',
          details: {
            mode,
            points: result.pointsGained,
            heartDemon: result.heartDemonGained,
            injury: result.injury,
            stability: result.stability,
            spiritStones: result.spiritStonesGained,
          },
          publicLog: result.shouldPublicLog,
        },
      })
    })

    const totalPoints = character.realm.pointsPerSubStage * 3

    return CultivationResultResponseSchema.parse({
      ...result,
      characterId: character.id,
      characterName: character.name,
      realmName: character.realm.name,
      subStage: character.subStage,
      previousCultivationPoints: character.cultivationPoints,
      totalPoints,
    })
  }

  private toCharacterState(character: CharacterForCultivation): CharacterState {
    return {
      id: character.id,
      discordUserId: character.user.discordId,
      name: character.name,
      realm: character.realmId as CharacterState['realm'],
      subStage: character.subStage as CharacterState['subStage'],
      cultivationPoints: character.cultivationPoints,
      foundationQuality: character.foundationQuality,
      heartDemon: character.heartDemon,
      injuryLevel: character.injuryLevel,
      region: character.regionId as CharacterState['region'],
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
      element: character.element as CharacterState['element'],
      lastCultivationAt: character.lastCultivationAt,
      lastHeartDemonAt: character.lastHeartDemonAt,
    }
  }

  private getCooldownRemainingHours(lastCultivationAt: Date | null, cooldownHours: number): number {
    if (!lastCultivationAt) {
      return 0
    }

    const elapsedHours = (Date.now() - lastCultivationAt.getTime()) / 3_600_000
    return Math.max(0, cooldownHours - elapsedHours)
  }

  private getModeLabel(mode: CultivationMode): string {
    const labels: Record<CultivationMode, string> = {
      STABLE: 'On dinh',
      FORCED: 'Cuong ep',
      SECLUSION: 'Be quan 8 gio',
      SECT: 'Tong mon',
    }
    return labels[mode]
  }

  private clampProgress(points: number, totalPoints: number): number {
    if (totalPoints <= 0) {
      return 0
    }

    return Math.min(100, Math.max(0, Math.round((points / totalPoints) * 100)))
  }
}
