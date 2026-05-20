/**
 * Cultivation constants — source of truth for all cultivation calculations.
 * These values drive the entire progression system.
 * Changing any value here requires admin audit log documentation.
 */
export const CULTIVATION_CONSTANTS = {
  /** Base cultivation points per standard session */
  BASE_EXP_PER_SESSION: 100,

  /** Heart demon gained per forced cultivation action */
  HEART_DEMON_PER_FORCED_CULTIVATE: 8,

  /** Heart demon gained per day in U Minh region */
  HEART_DEMON_PER_DAY_UMINH: 2,

  /** Natural heart demon decay per day */
  HEART_DEMON_DECAY_PER_DAY: 1,

  /** Heart demon threshold where risk begins */
  HEART_DEMON_THRESHOLD: 50,

  /** Heart demon level where breakthrough penalty becomes active */
  HEART_DEMON_CRITICAL: 80,

  /** Maximum foundation quality value */
  FOUNDATION_QUALITY_MAX: 100,

  /** Foundation quality gained on successful breakthrough */
  FOUNDATION_QUALITY_GAIN_BREAKTHROUGH: 5,

  /** Foundation quality gained on critical breakthrough */
  FOUNDATION_QUALITY_GAIN_CRITICAL: 6,

  /** Seclusion duration in hours */
  CULTIVATION_SESSION_DURATION_HOURS: 8,

  /** Cooldown between standard cultivation sessions in hours */
  CULTIVATION_COOLDOWN_HOURS: 1,

  /** Cooldown between forced cultivation sessions in hours */
  FORCED_CULTIVATION_COOLDOWN_HOURS: 2,

  /** Seclusion cooldown before next action in hours */
  SECLUSION_COOLDOWN_HOURS: 4,

  /** Seasonal cultivation bonus multiplier */
  SEASONAL_CULTIVATION_BONUS: 1.15,

  /** Seasonal cultivation penalty multiplier */
  SEASONAL_CULTIVATION_PENALTY: 0.85,

  /** Risk chance for forced cultivation */
  FORCED_CULTIVATION_RISK_CHANCE: 0.12,

  /** Stability base for cultivation (reputation/reward) */
  CULTIVATION_STABILITY_BASE: 50,

  /** Maximum heart demon */
  HEART_DEMON_MAX: 100,
} as const;

export const CULTIVATION_MODES = {
  STABLE: {
    multiplier: 0.8,
    heartDemon: 0,
    riskChance: 0,
    cooldownHours: CULTIVATION_CONSTANTS.CULTIVATION_COOLDOWN_HOURS,
    lockedActions: [],
  },
  FORCED: {
    multiplier: 1.5,
    heartDemon: CULTIVATION_CONSTANTS.HEART_DEMON_PER_FORCED_CULTIVATE,
    riskChance: CULTIVATION_CONSTANTS.FORCED_CULTIVATION_RISK_CHANCE,
    cooldownHours: CULTIVATION_CONSTANTS.FORCED_CULTIVATION_COOLDOWN_HOURS,
    lockedActions: [],
  },
  SECLUSION: {
    multiplier: 3.0,
    heartDemon: 2,
    riskChance: 0,
    durationHours: CULTIVATION_CONSTANTS.CULTIVATION_SESSION_DURATION_HOURS,
    cooldownHours: CULTIVATION_CONSTANTS.SECLUSION_COOLDOWN_HOURS,
    lockedActions: ["combat", "mission", "travel", "alchemy"],
  },
  SECT: {
    multiplier: 1.2,
    heartDemon: 0,
    riskChance: 0,
    cooldownHours: CULTIVATION_CONSTANTS.CULTIVATION_COOLDOWN_HOURS,
    lockedActions: [],
    meritGain: 1,
  },
} as const;
