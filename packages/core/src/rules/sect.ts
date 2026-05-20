/**
 * Sect rules — membership, benefits, and contribution.
 */
import type { CharacterState, SectState, SectAlignment } from "../types/index.js";
import { ECONOMY_CONSTANTS } from "../constants/economy.js";

/**
 * Check if a character can join a sect.
 */
export function canJoinSect(
  character: CharacterState,
  sect: SectState,
): { valid: boolean; reason: string | null } {
  // Already in a sect
  if (character.sectId) {
    return {
      valid: false,
      reason: "Bạn đã gia nhập tông môn. Hãy rời tông môn hiện tại trước.",
    };
  }

  // Sect is invite-only
  if (sect.isInviteOnly) {
    return {
      valid: false,
      reason: "Tông môn này chỉ nhận thành viên qua lời mời.",
    };
  }

  // Sect is full
  if (sect.memberCount >= getSectMemberCap(sect.rank)) {
    return {
      valid: false,
      reason: "Tông môn đã đầy thành viên.",
    };
  }

  return { valid: true, reason: null };
}

/**
 * Get maximum members for a sect based on rank.
 */
export function getSectMemberCap(rank: 1 | 2 | 3 | 4 | 5): number {
  const caps: Record<number, number> = {
    1: 10,   // ★
    2: 50,   // ★★
    3: 30,   // ★★★
    4: 20,   // ★★★★
    5: 10,   // ★★★★★
  };
  return caps[rank] ?? 10;
}

/**
 * Calculate sect benefits for a member.
 */
export function calculateSectBenefits(
  character: CharacterState,
  sect: SectState,
): {
  cultivationBonus: number;
  alchemyBonus: number;
  defenseBonus: number;
  reputationBonus: number;
} {
  // Base benefits from sect rank
  const rankBonus = {
    1: { cult: 1.05, alch: 1.05, def: 1.05, rep: 1.05 },
    2: { cult: 1.08, alch: 1.08, def: 1.08, rep: 1.08 },
    3: { cult: 1.10, alch: 1.10, def: 1.10, rep: 1.10 },
    4: { cult: 1.15, alch: 1.12, def: 1.12, rep: 1.12 },
    5: { cult: 1.20, alch: 1.15, def: 1.15, rep: 1.15 },
  }[sect.rank] ?? { cult: 1.05, alch: 1.05, def: 1.05, rep: 1.05 };

  return {
    cultivationBonus: rankBonus.cult,
    alchemyBonus: rankBonus.alch,
    defenseBonus: rankBonus.def,
    reputationBonus: rankBonus.rep,
  };
}

/**
 * Calculate merit contribution from an action.
 */
export function calculateMeritContribution(
  action: "daily" | "mission_easy" | "mission_hard" | "defend" | "kill_enemy" | "war_victory",
): number {
  const contributions: Record<string, number> = {
    daily: 1,
    mission_easy: 5,
    mission_hard: 20,
    defend: 20,
    kill_enemy: 15,
    war_victory: 30,
  };
  return contributions[action] ?? 0;
}

/**
 * Calculate sect treasury bonus from power.
 */
export function calculateSectPower(sect: SectState, memberCultivationPoints: number): number {
  const memberPower = memberCultivationPoints / 1000;
  const rankMultiplier = [1.0, 1.1, 1.2, 1.3, 1.5][sect.rank - 1] ?? 1.0;
  const treasuryBonus = 1.0 + (sect.treasury / 10_000) * 0.1;
  return memberPower * rankMultiplier * Math.min(1.5, treasuryBonus);
}

/**
 * Get alignment color for Discord embeds.
 */
export function getSectAlignmentColor(alignment: SectAlignment): number {
  const colors: Record<SectAlignment, number> = {
    CHINH: 0x00ff00,    // Green
    TA: 0x9900ff,       // Purple
    TRUNG: 0x888888,    // Gray
  };
  return colors[alignment] ?? 0xffffff;
}
