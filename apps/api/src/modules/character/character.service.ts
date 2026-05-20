/**
 * Character service — business logic for character operations.
 */
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class CharacterService {
  public constructor(private readonly prisma: PrismaService) {}

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
    });
  }

  async findById(id: string) {
    return this.prisma.character.findUnique({
      where: { id },
      include: {
        realm: true,
        region: true,
        sect: true,
        manual: true,
        inventories: {
          include: { item: true },
        },
      },
    });
  }

  async update(id: string, data: {
    cultivationPoints?: number;
    heartDemon?: number;
    silver?: number;
    spiritStones?: number;
    injuryLevel?: number;
    foundationQuality?: number;
    maxHp?: number;
    maxQi?: number;
    currentHp?: number;
    currentQi?: number;
  }) {
    return this.prisma.character.update({
      where: { id },
      data,
    });
  }

  async addCultivationPoints(id: string, points: number) {
    return this.prisma.character.update({
      where: { id },
      data: {
        cultivationPoints: { increment: points },
        lastCultivationAt: new Date(),
      },
    });
  }

  async getLeaderboard(limit = 10) {
    return this.prisma.character.findMany({
      take: limit,
      orderBy: { cultivationPoints: "desc" },
      include: {
        realm: true,
        sect: true,
      },
    });
  }
}
