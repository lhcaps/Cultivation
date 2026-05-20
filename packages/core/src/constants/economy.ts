/**
 * Economy constants — currency values, generation rates, and sinks.
 * These drive the entire in-game economy.
 */
export const ECONOMY_CONSTANTS = {
  /** Base daily silver reward */
  DAILY_SILVER_BASE: 100,

  /** Silver earned per standard cultivation session */
  CULTIVATION_SILVER_BASE: 20,
  CULTIVATION_SILVER_MAX: 80,

  /** Spirit stone chance per cultivation session (0-1) */
  CULTIVATION_ST_CHANCE: 0.05,
  CULTIVATION_ST_MIN: 1,
  CULTIVATION_ST_MAX: 5,

  /** Exchange rate: 1 Spirit Stone = N Silver */
  ST_EXCHANGE_RATE: 100,

  /** Sell-back ratio for items (50% of base value) */
  SELL_BACK_RATIO: 0.50,

  /** Repair cost as ratio of item value */
  REPAIR_COST_RATIO: 0.20,

  /** Auction listing fee */
  AUCTION_FEE_RATIO: 0.05,

  /** Sect tax rate on member earnings */
  SECT_TAX_RATE: 0.10,

  /** Maximum currencies */
  SILVER_MAX: 99_999_999,
  SPIRIT_STONE_MAX: 9_999_999,
  MERIT_MAX: 999_999,
  REPUTATION_MAX: 99_999,
  HEAVEN_SEAL_MAX: 999,

  /** Soft caps for leaderboard scoring */
  SILVER_SOFT_CAP: 10_000,
  ST_SOFT_CAP: 10_000,
  REPUTATION_SOFT_CAP: 10_000,
  MERIT_SOFT_CAP: 5_000,

  /** Character deletion cooldown in days */
  CHARACTER_DELETION_COOLDOWN_DAYS: 30,

  /** Max characters per user */
  MAX_CHARACTERS_PER_USER: 3,
} as const;
