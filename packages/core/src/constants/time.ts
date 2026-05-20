/**
 * Time constants — all time-related values in the game.
 * Times are stored in milliseconds for precision.
 */
export const TIME_CONSTANTS = {
  /** Daily reset hour (UTC, 0-23) */
  DAILY_RESET_HOUR: 0,

  /** Weekly reset day (0=Sunday, 1=Monday, etc.) */
  WEEKLY_RESET_DAY: 0,

  /** Season duration in days */
  SEASON_DURATION_DAYS: 30,

  /** Dungeon lockout duration in hours */
  DUNGEON_LOCKOUT_HOURS: 24,

  /** Cooldown tick interval in minutes */
  COOLDOWN_TICK_MINUTES: 5,

  /** Action log retention in days */
  ACTION_LOG_RETENTION_DAYS: 365,

  /** Admin audit log retention in days (forever-ish) */
  ADMIN_AUDIT_RETENTION_DAYS: 9999,

  /** Session token expiry in days */
  SESSION_TOKEN_EXPIRY_DAYS: 7,

  /** Refresh token expiry in days */
  REFRESH_TOKEN_EXPIRY_DAYS: 30,

  /** Alchemy round timeout in seconds */
  ALCHEMY_ROUND_TIMEOUT_SECONDS: 30,

  /** Combat turn timeout in seconds */
  COMBAT_TURN_TIMEOUT_SECONDS: 60,
} as const;

/** Millisecond conversions */
export const MS = {
  SECOND: 1_000,
  MINUTE: 60_000,
  HOUR: 3_600_000,
  DAY: 86_400_000,
  WEEK: 604_800_000,
} as const;
