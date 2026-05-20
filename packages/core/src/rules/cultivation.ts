/**
 * Cultivation rules — pure functions with no external dependencies.
 * These are the heart of the game engine.
 */
import { z } from "zod";
import { CULTIVATION_CONSTANTS, CULTIVATION_MODES } from "../constants/cultivation.js";
import { REALMS, type RealmId } from "../constants/realms.js";
import type {
  CharacterState,
  CultivationResult,
  CultivationMode,
  InjuryLevel,
} from "../types/index.js";

/** Default RNG using Math.random() */
const defaultRng = () => Math.random();

/** Rng interface for deterministic testing */
export interface Rng {
  next(): number;
}

/** Validation schema for cultivation input */
export const CultivateInputSchema = z.object({
  characterId: z.string().min(1),
  mode: z.enum(["STABLE", "FORCED", "SECLUSION", "SECT"]),
  sectId: z.string().nullable(),
});

export type CultivateInput = z.infer<typeof CultivateInputSchema>;

/**
 * Calculate base cultivation points for a realm.
 * This is the foundation for all cultivation calculations.
 */
export function getBaseCultivationPoints(realm: RealmId): number {
  return REALMS[realm]!.pointsPerSubStage;
}

/**
 * Get the Qi multiplier for a region.
 * Used to adjust cultivation speed based on location.
 */
export function getRegionQiMultiplier(regionId: string): number {
  const multipliers: Record<string, number> = {
    // Region bonuses/penalties
    DAI_VIET: 1.00,
    TRUNG_NGUYEN: 1.00,
    TAY_VUC: 1.00,
    U_MINH: 1.30,
    DONG_HAI: 1.00,
    BAC_MAC: 0.85,
    NAM_MAN: 1.00,
    CON_LON: 1.00,
  };
  return multipliers[regionId] ?? 1.00;
}

/**
 * Get the cultivation bonus multiplier for a sect.
 * Sect HQ bonuses are separate from region bonuses.
 */
export function getSectCultivationMultiplier(sectId: string): number {
  const multipliers: Record<string, number> = {
    // Sect HQ bonuses — these override region bonuses when in sect mode
    CHINH_DUONG_TONG: 1.20,
    THANH_VAN_TONG: 1.20,
    THIEN_Y_DAN_QUOC: 1.20,
  };
  return multipliers[sectId] ?? 1.00;
}

/**
 * Get seasonal multiplier based on current month.
 */
export function getSeasonalMultiplier(month: number): number {
  // Spring/Summer: bonus (Mar-Aug)
  if (month >= 3 && month <= 8) {
    return CULTIVATION_CONSTANTS.SEASONAL_CULTIVATION_BONUS;
  }
  // Winter: penalty (Dec-Feb)
  if (month === 12 || month <= 2) {
    return CULTIVATION_CONSTANTS.SEASONAL_CULTIVATION_PENALTY;
  }
  return 1.00;
}

/**
 * Calculate heart demon penalty multiplier.
 * Starts at 0% penalty, increases as heart demon rises.
 */
export function getHeartDemonPenalty(heartDemon: number): number {
  if (heartDemon < 20) return 1.00;
  if (heartDemon < 50) return 0.95;
  if (heartDemon < 80) return 0.85;
  if (heartDemon < CULTIVATION_CONSTANTS.HEART_DEMON_CRITICAL) return 0.70;
  return 0.40;
}

/**
 * Calculate cultivation points gained from a session.
 * This is a pure calculation with no side effects.
 */
export function calculateCultivationGain(
  realm: RealmId,
  mode: CultivationMode,
  foundationQuality: number,
  regionId: string,
  heartDemon: number,
  hasManual: boolean,
  sectId: string | null,
  rng: Rng = { next: defaultRng },
): number {
  const modeConfig = CULTIVATION_MODES[mode]!;
  const baseGain = getBaseCultivationPoints(realm);
  const regionMultiplier = getRegionQiMultiplier(regionId);
  const sectMultiplier = mode === "SECT" && sectId ? getSectCultivationMultiplier(sectId) : 1.00;

  // Foundation quality: 20 base = 1.0, each 10 above = +0.1, each 10 below = -0.1
  const foundationMultiplier = 1 + (foundationQuality - 20) / 100;
  const heartDemonPenalty = getHeartDemonPenalty(heartDemon);
  const manualBonus = hasManual ? 1.10 : 1.00;
  const sectBonus = mode === "SECT" ? sectMultiplier : 1.00;

  const gain = Math.floor(
    baseGain *
      modeConfig.multiplier *
      regionMultiplier *
      foundationMultiplier *
      heartDemonPenalty *
      manualBonus *
      sectBonus,
  );

  // Random variance: ±10%
  const variance = 0.9 + rng.next() * 0.2;
  return Math.max(1, Math.floor(gain * variance));
}

/**
 * Resolve a cultivation session.
 * Returns the result with all effects applied.
 */
export function resolveCultivation(
  character: CharacterState,
  mode: CultivationMode,
  _sectId: string | null,
  rng: Rng = { next: defaultRng },
): CultivationResult {
  const modeConfig = CULTIVATION_MODES[mode]!;
  const now = new Date();

  // Check cooldowns
  if (character.lastCultivationAt) {
    const hoursSinceLastCultivation =
      (now.getTime() - character.lastCultivationAt.getTime()) / 3_600_000;
    if (hoursSinceLastCultivation < modeConfig.cooldownHours) {
      const remaining = modeConfig.cooldownHours - hoursSinceLastCultivation;
      throw new Error(
        `Cultivation cooldown active. ${remaining.toFixed(1)} hours remaining.`,
      );
    }
  }

  // Calculate base gain
  const pointsGained = calculateCultivationGain(
    character.realm,
    mode,
    character.foundationQuality,
    character.region,
    character.heartDemon,
    character.manualId !== null,
    character.sectId,
    rng,
  );

  // Calculate heart demon gain
  let heartDemonGained = modeConfig.heartDemon;

  // U Minh special: +2 heart demon per day
  if (character.region === "U_MINH") {
    heartDemonGained += CULTIVATION_CONSTANTS.HEART_DEMON_PER_DAY_UMINH;
  }

  // Risk check for forced cultivation
  let injury: InjuryLevel = 0;
  if (mode === "FORCED" && rng.next() < modeConfig.riskChance) {
    injury = 1;
  }

  // Stability calculation (0-100)
  let stability: number = CULTIVATION_CONSTANTS.CULTIVATION_STABILITY_BASE;
  stability += mode === "STABLE" ? 20 : mode === "SECLUSION" ? 30 : 0;
  stability += character.foundationQuality > 50 ? 10 : 0;
  stability = Math.min(100, stability);

  // Spirit stones chance (only for high-stability cultivation)
  let spiritStonesGained = 0;
  if (rng.next() < CULTIVATION_CONSTANTS.CULTIVATION_ST_CHANCE && stability >= 60) {
    spiritStonesGained =
      CULTIVATION_CONSTANTS.CULTIVATION_ST_MIN +
      Math.floor(rng.next() * (CULTIVATION_CONSTANTS.CULTIVATION_ST_MAX - CULTIVATION_CONSTANTS.CULTIVATION_ST_MIN));
  }

  // Public log conditions
  const shouldPublicLog = stability >= 90 && rng.next() < 0.05;
  const publicLogMessage = shouldPublicLog
    ? `${character.name} đạt tu vi cực cao tại khu vực ${character.region}, khí tức bùng nổ!`
    : null;

  return {
    pointsGained,
    heartDemonGained,
    injury,
    spiritStonesGained,
    meridianBonus: stability >= 80,
    stability,
    shouldPublicLog,
    publicLogMessage,
  };
}

/**
 * Check if a character can cultivate (no blocking conditions).
 */
export function canCultivate(character: CharacterState, mode: CultivationMode): void {
  if (character.injuryLevel >= 4) {
    throw new Error("Trọng thương. Không thể tu luyện.");
  }
  if (character.heartDemon >= 100) {
    throw new Error("Tâm ma bùng phát. Không thể tu luyện.");
  }
  if (mode === "SECT" && !character.sectId) {
    throw new Error("Cần gia nhập tông môn để dùng chế độ Tu Luyện Tông Môn.");
  }
}
