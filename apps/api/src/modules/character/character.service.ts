/**
 * Character service — business logic for character operations.
 */
import { Injectable } from '@nestjs/common'
import type { PrismaService } from '../prisma/prisma.service.js'
import {
  CharacterProfileResponseSchema,
  CharacterStartResponseSchema,
  type CharacterProfileResponse,
  type CharacterStartResponse,
  type StartCharacterRequest,
} from './character.schemas.js'

@Injectable()
export class CharacterService {
  public constructor(private readonly prisma: PrismaService) {}

  async createForDiscordUser(input: StartCharacterRequest): Promise<CharacterStartResponse> {
    const name = input.name.trim()
    const maxHp = 100
    const maxQi = 50

    return this.prisma.$transaction(async (tx) => {
      const existingCharacter = await tx.character.findFirst({
        where: { user: { discordId: input.discordUserId } },
        select: {
          id: true,
          name: true,
          realmId: true,
          subStage: true,
          maxHp: true,
          maxQi: true,
          silver: true,
          manualId: true,
        },
      })

      if (existingCharacter) {
        return CharacterStartResponseSchema.parse({
          created: false,
          character: existingCharacter,
        })
      }

      const user = await tx.user.upsert({
        where: { discordId: input.discordUserId },
        update: { username: input.username },
        create: {
          discordId: input.discordUserId,
          username: input.username,
        },
      })

      const character = await tx.character.create({
        data: {
          userId: user.id,
          name,
          realmId: 'LUYEN_THE',
          subStage: 'SO',
          cultivationPoints: 0,
          maxHp,
          maxQi,
          currentHp: maxHp,
          currentQi: maxQi,
          manualId: 'THANH_VAN_QUYET',
        },
        select: {
          id: true,
          name: true,
          realmId: true,
          subStage: true,
          maxHp: true,
          maxQi: true,
          silver: true,
          manualId: true,
        },
      })

      await tx.actionLog.create({
        data: {
          characterId: character.id,
          action: 'CHARACTER_CREATED',
          details: { name },
          publicLog: false,
        },
      })

      return CharacterStartResponseSchema.parse({
        created: true,
        character,
      })
    })
  }

  async findByDiscordId(discordId: string) {
    return this.prisma.user.findUnique({
      where: { discordId },
      include: {
        characters: {
          include: {
            realm: true,
            region: true,
            sect: true,
            manual: true,
          },
        },
      },
    })
  }

  async getProfileByDiscordId(discordId: string): Promise<CharacterProfileResponse | null> {
    const user = await this.findByDiscordId(discordId)
    const character = user?.characters[0]

    if (!character) {
      return null
    }

    const totalPoints = character.realm.pointsPerSubStage * 3
    const progress = clampProgress(character.cultivationPoints, totalPoints)

    return CharacterProfileResponseSchema.parse({
      id: character.id,
      name: character.name,
      realm: {
        id: character.realmId,
        name: character.realm.name,
        pointsPerSubStage: character.realm.pointsPerSubStage,
      },
      subStage: character.subStage,
      cultivationPoints: character.cultivationPoints,
      totalPoints,
      progress,
      foundationQuality: character.foundationQuality,
      heartDemon: character.heartDemon,
      injuryLevel: character.injuryLevel,
      currentHp: character.currentHp,
      maxHp: character.maxHp,
      currentQi: character.currentQi,
      maxQi: character.maxQi,
      silver: character.silver,
      spiritStones: character.spiritStones,
      merit: character.merit,
      reputation: character.reputation,
      regionName: character.region.name,
      sectName: character.sect?.name ?? null,
      manualName: character.manual?.name ?? null,
    })
  }

  async findById(id: string) {
    return this.prisma.character.findUnique({
      where: { id },
      include: {
        user: true,
        realm: true,
        region: true,
        sect: true,
        manual: true,
        inventories: {
          include: { item: true },
        },
      },
    })
  }

  async getLeaderboard(limit = 10) {
    return this.prisma.character.findMany({
      take: limit,
      orderBy: { cultivationPoints: 'desc' },
      include: {
        realm: true,
        sect: true,
      },
    })
  }
}

function clampProgress(points: number, totalPoints: number): number {
  if (totalPoints <= 0) {
    return 0
  }

  return Math.min(100, Math.max(0, Math.round((points / totalPoints) * 100)))
}
