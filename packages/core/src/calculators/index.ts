/**
 * Index for all calculators — re-exports from rules for convenience.
 */
export {
  calculateCultivationGain,
  getBaseCultivationPoints,
  getRegionQiMultiplier,
  getSeasonalMultiplier,
  getHeartDemonPenalty,
  resolveCultivation,
  canCultivate,
  type CultivateInput,
} from "../rules/cultivation.js";

export {
  calculateBreakthroughRate,
  checkBreakthroughPrerequisites,
  getNextRealm,
  resolveBreakthrough,
} from "../rules/breakthrough.js";

export {
  FIRE_CONTROL_CHOICES,
  calculatePillQuality,
  determinePillQuality,
  resolveAlchemy,
  type RoundChoiceKey,
} from "../rules/alchemy.js";

export {
  calculateEncounterWeights,
  rollEncounter,
  resolveEncounterChoice,
} from "../rules/encounter.js";

export {
  canJoinSect,
  getSectMemberCap,
  calculateSectBenefits,
  calculateMeritContribution,
  calculateSectPower,
  getSectAlignmentColor,
} from "../rules/sect.js";

export {
  calculateMaxHp,
  calculateMaxQi,
  calculateAttack,
  calculateDamage,
  resolveCombat,
  type CombatParticipant,
  type CombatTarget,
} from "../rules/combat.js";
