/**
 * Utility functions for Discord interactions.
 */

/**
 * Parse custom_id from buttons/select menus.
 * Pattern: action:subAction:targetId:nonce
 */
export function parseCustomId(customId: string): {
  action: string;
  subAction: string;
  targetId: string;
  nonce: string;
} | null {
  const parts = customId.split(":");
  if (parts.length < 4) return null;
  return {
    action: parts[0]!,
    subAction: parts[1]!,
    targetId: parts[2]!,
    nonce: parts[3]!,
  };
}

/**
 * Build a custom_id with pattern: action:subAction:targetId:nonce
 * Pass deterministic nonce for testable buttons, or omit for random.
 */
export function buildCustomId(
  action: string,
  subAction: string,
  targetId: string,
  nonce?: string,
): string {
  return `${action}:${subAction}:${targetId}:${nonce ?? Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Colors for Discord embeds (hex as number).
 */
export const EmbedColors = {
  SUCCESS: 0x00ff00,
  ERROR: 0xff0000,
  WARNING: 0xffaa00,
  INFO: 0x0099ff,
  CULTIVATION: 0x9966ff,
  BREAKTHROUGH: 0xffcc00,
  ALCHEMY: 0xff6600,
  SECT: 0x00ccff,
  ENCOUNTER: 0x66ffcc,
  COMBAT: 0xff3333,
  NEUTRAL: 0x888888,
} as const;
