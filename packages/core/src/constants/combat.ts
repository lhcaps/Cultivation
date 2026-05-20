/**
 * Combat constants — all values driving combat calculations.
 */
export const COMBAT_CONSTANTS = {
  BASE_HP: 100,
  BASE_QI: 50,
  HP_PER_REALM: 50,
  QI_PER_REALM: 25,
  BASE_ATTACK: 10,
  BASE_DEFENSE: 5,
  BASE_SPEED: 10,
  BASE_CRIT_RATE: 0.05,
  CRIT_MULTIPLIER: 1.5,
  /** HP penalty per injury level */
  INJURY_HP_PENALTY: 0.10,
  /** Injury duration in days */
  INJURY_DURATION_DAYS: 3,
  /** Cultivation point penalty on death */
  DEATH_CULTIVATION_PENALTY: 0.10,
  /** Spirit stone cost for revival */
  REVIVAL_COST_ST: 50,
  /** Damage variance range (+/- %) */
  DAMAGE_VARIANCE: 0.1,
  /** Minimum damage per 3 turns */
  DAMAGE_FLOOR_TURNS: 3,
  /** Dodge chance base */
  BASE_DODGE_CHANCE: 0.05,
  /** Block damage reduction */
  BLOCK_DAMAGE_REDUCTION: 0.5,
  /** Block cooldown in turns */
  BLOCK_COOLDOWN_TURNS: 3,
} as const;

/**
 * Injury severity levels.
 * Higher levels impose greater penalties.
 */
export const INJURY_LEVELS = {
  NONE: 0,
  MINOR: 1, // -10% HP, 1-3 days
  MODERATE: 2, // -20% HP, 3-7 days
  SEVERE: 3, // -30% HP, breakthrough blocked, 7-14 days
  CRITICAL: 4, // Breakthrough blocked, death risk
} as const;

export type InjuryLevel = (typeof INJURY_LEVELS)[keyof typeof INJURY_LEVELS];
