/**
 * Sect service.
 */
import { Injectable, Inject } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class SectService {
  public constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

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
      const character = await tx.character.findUnique({ where: { id: characterId } });
      if (!character) {
        throw new Error("Character not found");
      }

      if (character.sectId === sectId) {
        throw new Error("Already a member of this sect");
      }

      const sect = await tx.sect.findUnique({ where: { id: sectId } });
      if (!sect) {
        throw new Error("Sect not found");
      }

      if (sect.isInviteOnly) {
        throw new Error("This sect is invite-only");
      }

      const previousSectId = character.sectId;

      const updated = await tx.character.update({
        where: { id: characterId },
        data: { sectId },
      });

      await tx.actionLog.create({
        data: {
          characterId,
          action: "SECT_JOIN",
          details: { sectId, previousSectId },
          publicLog: false,
        },
      });

      return updated;
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
