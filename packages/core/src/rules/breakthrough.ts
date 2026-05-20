/**
 * Breakthrough rules — pure functions for realm advancement.
 */
import { REALMS, type RealmId } from "../constants/realms.js";
import { CULTIVATION_CONSTANTS } from "../constants/cultivation.js";
import { INJURY_LEVELS } from "../constants/combat.js";
import type {
  CharacterState,
  BreakthroughResult,
  BreakthroughMode,
  InjuryLevel,
} from "../types/index.js";

/**
 * Calculate the actual breakthrough success rate for a character.
 */
export function calculateBreakthroughRate(
  character: CharacterState,
  mode: BreakthroughMode,
): number {
  const realmDef = REALMS[character.realm]!;
  let rate = realmDef.baseBreakthroughRate;

  // Foundation quality bonus: +1% per 5 quality
  rate += character.foundationQuality / 500;

  // Heart demon penalty
  const heartDemonPenalty = 1 - character.heartDemon / 200;
  rate *= heartDemonPenalty;

  // Injury penalty: -10% per level
  rate *= 1 - character.injuryLevel * 0.10;

  // Location bonus
  // In sect HQ: +10%
  // TODO: Check if character is in sect HQ

  // Mode modifiers
  if (mode === "STABLE") {
    // No modifier, base rate
  } else if (mode === "FORCED") {
    rate *= 0.70;
  } else if (mode === "PILL") {
    rate *= 1.30;
  } else if (mode === "SECT_FORMATION") {
    rate *= 1.50;
  }

  // Clamp between 1% and 99%
  return Math.max(0.01, Math.min(0.99, rate));
}

/**
 * Check if character meets all breakthrough prerequisites.
 */
export function checkBreakthroughPrerequisites(
  character: CharacterState,
): { valid: boolean; reason: string | null } {
  const realmDef = REALMS[character.realm]!;
  const totalRealmPoints = realmDef.pointsPerSubStage * 3;

  // Check cultivation points
  if (character.cultivationPoints < totalRealmPoints) {
    return {
      valid: false,
      reason: `Tu vi chưa đầy. Cần ${totalRealmPoints.toLocaleString()}, hiện có ${character.cultivationPoints.toLocaleString()}.`,
    };
  }

  // Check heart demon
  if (character.heartDemon >= CULTIVATION_CONSTANTS.HEART_DEMON_CRITICAL) {
    return {
      valid: false,
      reason: `Tâm ma quá cao (${character.heartDemon}). Cần giảm xuống dưới ${CULTIVATION_CONSTANTS.HEART_DEMON_CRITICAL} để đột phá.`,
    };
  }

  // Check injury
  if (character.injuryLevel >= INJURY_LEVELS.SEVERE) {
    return {
      valid: false,
      reason: `Thương thương quá nặng (cấp ${character.injuryLevel}). Cần chữa lành trước.`,
    };
  }

  // Check manual
  if (!character.manualId) {
    return {
      valid: false,
      reason: "Cần có công pháp phù hợp để đột phá.",
    };
  }

  return { valid: true, reason: null };
}

/**
 * Get the next realm after a given realm.
 */
export function getNextRealm(current: RealmId): RealmId | null {
  const order = [
    "LUYEN_THE",
    "KHI_TUC",
    "LUYEN_HON",
    "TRUC_MACH",
    "KIM_DAN",
    "NGUYEN_ANH",
    "HOA_THAN",
    "TRU_THAN",
    "DAI_THUA",
    "NGU_BAT_TON",
  ] as const;
  const idx = order.indexOf(current);
  return idx < order.length - 1 ? order[idx + 1]! : null;
}

/**
 * Resolve a breakthrough attempt.
 */
export function resolveBreakthrough(
  character: CharacterState,
  mode: BreakthroughMode,
): BreakthroughResult {
  // Validate prerequisites
  const prereq = checkBreakthroughPrerequisites(character);
  if (!prereq.valid) {
    throw new Error(prereq.reason ?? "Không thể đột phá.");
  }

  const successRate = calculateBreakthroughRate(character, mode);
  const roll = Math.random();

  // Calculate foundation gain on success
  const foundationGain =
    mode === "FORCED" ? 5 : mode === "SECT_FORMATION" ? 6 : 3;

  if (roll < successRate * 0.95) {
    // Normal success
    const nextRealm = getNextRealm(character.realm);
    if (!nextRealm) {
      // Already at max realm
      return {
        outcome: "CRITICAL_SUCCESS",
        newRealm: character.realm,
        newSubStage: character.subStage,
        foundationGain: 0,
        cultivationPointsLoss: 0,
        heartDemonGain: 0,
        injury: 0,
        cooldownDays: 1,
        publicLog: false,
        publicLogMessage: null,
        hiddenPotentialUnlocked: false,
      };
    }

    return {
      outcome: "SUCCESS",
      newRealm: nextRealm,
      newSubStage: "SO",
      foundationGain,
      cultivationPointsLoss: 0,
      heartDemonGain: 0,
      injury: 0,
      cooldownDays: mode === "STABLE" ? 1 : 2,
      publicLog: false,
      publicLogMessage: null,
      hiddenPotentialUnlocked: false,
    };
  } else if (roll < successRate) {
    // Critical success
    const nextRealm = getNextRealm(character.realm);
    if (!nextRealm) {
      return {
        outcome: "CRITICAL_SUCCESS",
        newRealm: character.realm,
        newSubStage: character.subStage,
        foundationGain: 6,
        cultivationPointsLoss: 0,
        heartDemonGain: 0,
        injury: 0,
        cooldownDays: 1,
        publicLog: true,
        publicLogMessage: `${character.name} dat sieu cap tai ${REALMS[character.realm]!.name} hau ky!`,
        hiddenPotentialUnlocked: Math.random() < 0.10,
      };
    }

    return {
      outcome: "CRITICAL_SUCCESS",
      newRealm: nextRealm,
      newSubStage: "SO",
      foundationGain: 6,
      cultivationPointsLoss: 0,
      heartDemonGain: 0,
      injury: 0,
      cooldownDays: 1,
      publicLog: true,
      publicLogMessage: `${character.name} dot pha thanh cong! ${REALMS[character.realm]!.name} hau ky → ${REALMS[nextRealm]!.name} so ky`,
      hiddenPotentialUnlocked: Math.random() < 0.10,
    };
  } else if (roll < successRate + 0.30) {
    // Minor failure
    const cultivationLoss = Math.floor(character.cultivationPoints * 0.10);
    return {
      outcome: "MINOR_FAILURE",
      newRealm: null,
      newSubStage: null,
      foundationGain: 0,
      cultivationPointsLoss: cultivationLoss,
      heartDemonGain: 5,
      injury: 1,
      cooldownDays: 1,
      publicLog: false,
      publicLogMessage: null,
      hiddenPotentialUnlocked: false,
    };
  } else {
    // Severe failure
    const cultivationLoss = Math.floor(character.cultivationPoints * 0.25);
    const extraInjury = mode === "FORCED" ? 2 : 1;
    return {
      outcome: "SEVERE_FAILURE",
      newRealm: null,
      newSubStage: null,
      foundationGain: 0,
      cultivationPointsLoss: cultivationLoss,
      heartDemonGain: 15,
      injury: extraInjury as InjuryLevel,
      cooldownDays: 3,
      publicLog: false,
      publicLogMessage: null,
      hiddenPotentialUnlocked: false,
    };
  }
}
