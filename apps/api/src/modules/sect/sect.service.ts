/**
 * Sect service.
 */
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class SectService {
  public constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.sect.findMany({
      include: { _count: { select: { members: true } } },
      orderBy: [{ rank: "asc" }, { name: "asc" }],
    });
  }

  async findById(id: string) {
    return this.prisma.sect.findUnique({
      where: { id },
      include: {
        members: {
          include: { realm: true },
          orderBy: { cultivationPoints: "desc" },
        },
        ranks: { orderBy: { level: "asc" } },
      },
    });
  }

  async joinSect(characterId: string, sectId: string) {
    return this.prisma.$transaction(async (tx) => {
      const character = await tx.character.update({
        where: { id: characterId },
        data: { sectId },
      });

      await tx.actionLog.create({
        data: {
          characterId,
          action: "SECT_JOIN",
          details: { sectId },
          publicLog: false,
        },
      });

      return character;
    });
  }

  async leaveSect(characterId: string) {
    return this.prisma.$transaction(async (tx) => {
      const character = await tx.character.findUnique({ where: { id: characterId } });
      if (!character?.sectId) {
        throw new Error("Character is not in a sect");
      }

      const updated = await tx.character.update({
        where: { id: characterId },
        data: { sectId: null },
      });

      await tx.actionLog.create({
        data: {
          characterId,
          action: "SECT_LEAVE",
          details: { previousSectId: character.sectId },
          publicLog: false,
        },
      });

      return updated;
    });
  }

  async getLeaderboard(limit = 10) {
    return this.prisma.sect.findMany({
      take: limit,
      orderBy: { treasury: "desc" },
    });
  }
}
