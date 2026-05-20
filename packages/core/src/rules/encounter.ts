/**
 * Encounter rules — encounter rolling and choice resolution.
 */
import { getRealmIndex } from '../constants/realms.js'
import type { CharacterState, EncounterDefinition, EncounterChoice } from '../types/index.js'

/** Default RNG using Math.random(), injectable for deterministic tests. */
const defaultRng = () => Math.random()

export interface Rng {
  next(): number
}

/**
 * Calculate encounter weights for a character in a region.
 */
export function calculateEncounterWeights(
  character: CharacterState,
  encounters: EncounterDefinition[],
  eventBonus?: Record<string, number>,
): Map<string, number> {
  const weights = new Map<string, number>()

  for (const encounter of encounters) {
    // Skip if wrong region
    if (encounter.region !== character.region) continue

    // Check realm requirements
    const charRealmIdx = getRealmIndex(character.realm)
    const minRealmIdx = getRealmIndex(encounter.requiredRealmMin)
    const maxRealmIdx = getRealmIndex(encounter.requiredRealmMax)
    if (charRealmIdx < minRealmIdx || charRealmIdx > maxRealmIdx) continue

    // Calculate weight
    let weight = encounter.weight

    // Heart demon increases evil cultist encounters
    if (encounter.id.includes('ta_giacao') && character.heartDemon > 30) {
      weight += character.heartDemon - 30
    }

    // Luck bonus
    if (character.luck > 50) {
      weight += Math.floor((character.luck - 50) / 10)
    }

    // Event modifier
    if (eventBonus) {
      for (const [key, bonus] of Object.entries(eventBonus)) {
        if (encounter.id.includes(key)) {
          weight += bonus
        }
      }
    }

    weights.set(encounter.id, weight)
  }

  return weights
}

/**
 * Roll for a random encounter based on weights.
 */
export function rollEncounter(
  character: CharacterState,
  encounters: EncounterDefinition[],
  eventBonus?: Record<string, number>,
  rng: Rng = { next: defaultRng },
): EncounterDefinition | null {
  const weights = calculateEncounterWeights(character, encounters, eventBonus)

  if (weights.size === 0) {
    return null
  }

  const totalWeight = Array.from(weights.values()).reduce((a, b) => a + b, 0)
  let roll = rng.next() * totalWeight

  for (const [id, weight] of weights.entries()) {
    roll -= weight
    if (roll <= 0) {
      return encounters.find((e) => e.id === id) ?? null
    }
  }

  return null
}

/**
 * Resolve an encounter choice and return effects.
 */
export function resolveEncounterChoice(
  character: CharacterState,
  encounter: EncounterDefinition,
  choice: EncounterChoice,
  rng: Rng = { next: defaultRng },
): {
  effects: EncounterChoice['effects']
  narrative: string
} {
  const effects = { ...choice.effects }

  // Apply random variance to certain effects
  if (effects.cultivationPoints) {
    const variance = 0.8 + rng.next() * 0.4
    effects.cultivationPoints = Math.floor(effects.cultivationPoints * variance)
  }

  if (effects.spiritStones) {
    const variance = 0.8 + rng.next() * 0.4
    effects.spiritStones = Math.floor(effects.spiritStones * variance)
  }

  // Roll for injury risk
  let injuryRoll = false
  if (effects.riskInjuryChance && rng.next() < effects.riskInjuryChance) {
    injuryRoll = true
  }

  // Generate narrative
  const narratives: Record<string, string> = {
    kien_ngo: `Bạn đã gặp được kỳ ngộ tại ${character.region}.`,
    tao_giacao: injuryRoll
      ? `Bạn đối đầu với tà giáo và bị thương trong quá trình truy đuổi.`
      : `Bạn đã điều tra và ngăn chặn âm mưu của tà giáo.`,
    yeu_thu: injuryRoll
      ? `Bạn chiến đấu với yêu thú nhưng bị thương nhẹ.`
      : `Bạn đánh bại yêu thú và thu hoạch được nguyên liệu.`,
    duec_nong: `Bạn giúp đỡ dược nông và được tặng dược liệu quý.`,
    thinh_tai: `Bạn gặp được một thiên tài tu tiên, tiếp nhận được truyền thừa.`,
  }

  const narrativeTemplate = narratives[encounter.id] ?? encounter.description

  return {
    effects,
    narrative: narrativeTemplate,
  }
}
