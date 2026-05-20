/**
 * Combat rules — auto-resolve combat calculations.
 */
import { COMBAT_CONSTANTS } from '../constants/index.js'
import { getRealmIndex, type RealmId } from '../constants/realms.js'
import type { CharacterState, CombatResult, InjuryLevel } from '../types/index.js'

/** Default RNG using Math.random(), injectable for deterministic tests. */
const defaultRng = () => Math.random()

export interface Rng {
  next(): number
}

export interface CombatParticipant {
  character: CharacterState
  attack: number
  defense: number
  speed: number
  critRate: number
  element?: string
}

export interface CombatTarget {
  id: string
  name: string
  realm: string
  maxHp: number
  attack: number
  defense: number
  speed: number
  critRate: number
  element?: string
  drops?: { silver: number; spiritStones: number; items: string[] }
}

export function calculateMaxHp(realm: string, foundationQuality: number): number {
  const realmIdx = getRealmIndex(realm as never)
  return COMBAT_CONSTANTS.BASE_HP + realmIdx * COMBAT_CONSTANTS.HP_PER_REALM + foundationQuality * 2
}

export function calculateMaxQi(realm: string, foundationQuality: number): number {
  const realmIdx = getRealmIndex(realm as never)
  return COMBAT_CONSTANTS.BASE_QI + realmIdx * COMBAT_CONSTANTS.QI_PER_REALM + foundationQuality
}

export function calculateAttack(realm: string, foundationQuality: number): number {
  const realmIdx = getRealmIndex(realm as never)
  return COMBAT_CONSTANTS.BASE_ATTACK + realmIdx * 5 + Math.floor(foundationQuality / 10)
}

export function calculateDamage(
  attacker: CombatParticipant,
  defenderDef: number,
  rng: Rng = { next: defaultRng },
): { damage: number; isCrit: boolean; isDodge: boolean; isBlock: boolean } {
  const realmIdx = getRealmIndex(attacker.character.realm)
  const baseDamage = COMBAT_CONSTANTS.BASE_ATTACK + realmIdx * 10

  let damage = baseDamage * (1 + attacker.attack / 100)

  const defenseReduction = defenderDef * 0.5
  damage = Math.max(1, damage - defenseReduction)

  const variance = 1 + (rng.next() - 0.5) * COMBAT_CONSTANTS.DAMAGE_VARIANCE * 2
  damage = Math.floor(damage * variance)

  const isDodge = rng.next() < COMBAT_CONSTANTS.BASE_DODGE_CHANCE
  if (isDodge) {
    return { damage: 0, isCrit: false, isDodge: true, isBlock: false }
  }

  const isBlock = rng.next() < 0.1
  if (isBlock) {
    damage = Math.floor(damage * COMBAT_CONSTANTS.BLOCK_DAMAGE_REDUCTION)
    return { damage, isCrit: false, isDodge: false, isBlock: true }
  }

  const isCrit = rng.next() < attacker.critRate
  if (isCrit) {
    damage = Math.floor(damage * COMBAT_CONSTANTS.CRIT_MULTIPLIER)
  }

  return { damage, isCrit, isDodge: false, isBlock: false }
}

export function resolveCombat(
  attacker: CombatParticipant,
  defenderTarget: CombatTarget,
  rng: Rng = { next: defaultRng },
): CombatResult {
  const maxTurns = 20
  let attackerHp = attacker.character.currentHp
  let defenderHp = defenderTarget.maxHp
  let turns = 0
  let damageDealt = 0
  let damageTaken = 0
  let criticalHits = 0
  const combatLog: string[] = []

  const attackerInit = attacker.speed + rng.next() * (attacker.speed / 10)
  const defenderInit = defenderTarget.speed + rng.next() * (defenderTarget.speed / 10)
  const attackerFirst = attackerInit > defenderInit
  const defender = targetToParticipant(defenderTarget, attacker.character)

  combatLog.push(
    `Combat: ${attacker.character.name} vs ${defenderTarget.name}`,
    attackerFirst ? `${attacker.character.name} acts first!` : `${defenderTarget.name} acts first!`,
    '',
  )

  while (attackerHp > 0 && defenderHp > 0 && turns < maxTurns) {
    turns++
    combatLog.push(`Turn ${turns}`)

    if ((turns === 1 && attackerFirst) || (turns > 1 && attackerFirst)) {
      const atkResult = calculateDamage(attacker, defenderTarget.defense, rng)

      defenderHp = Math.max(0, defenderHp - atkResult.damage)
      damageDealt += atkResult.damage

      if (atkResult.isCrit) criticalHits++

      combatLog.push(
        `> ${attacker.character.name} attacks: ${atkResult.damage} damage${atkResult.isCrit ? ' CRIT' : ''}`,
        `  ${defenderTarget.name} HP: ${defenderHp}/${defenderTarget.maxHp}`,
      )

      if (defenderHp <= 0) break

      const defResult = calculateDamage(defender, attacker.defense, rng)

      attackerHp = Math.max(0, attackerHp - defResult.damage)
      damageTaken += defResult.damage

      combatLog.push(
        `> ${defenderTarget.name} counterattacks: ${defResult.damage} damage${defResult.isCrit ? ' CRIT' : ''}`,
        `  ${attacker.character.name} HP: ${attackerHp}/${attacker.character.currentHp}`,
      )
    } else {
      const defResult = calculateDamage(defender, attacker.defense, rng)

      attackerHp = Math.max(0, attackerHp - defResult.damage)
      damageTaken += defResult.damage

      combatLog.push(
        `> ${defenderTarget.name} attacks: ${defResult.damage} damage${defResult.isCrit ? ' CRIT' : ''}`,
        `  ${attacker.character.name} HP: ${attackerHp}/${attacker.character.currentHp}`,
      )

      if (attackerHp <= 0) break

      const atkResult = calculateDamage(attacker, defenderTarget.defense, rng)

      defenderHp = Math.max(0, defenderHp - atkResult.damage)
      damageDealt += atkResult.damage

      if (atkResult.isCrit) criticalHits++

      combatLog.push(
        `> ${attacker.character.name} counterattacks: ${atkResult.damage} damage${atkResult.isCrit ? ' CRIT' : ''}`,
        `  ${defenderTarget.name} HP: ${defenderHp}/${defenderTarget.maxHp}`,
      )
    }

    combatLog.push('')
  }

  const attackerWon =
    defenderHp <= 0 || (attackerHp > 0 && turns >= maxTurns && damageDealt >= damageTaken)

  let loot = { silver: 0, spiritStones: 0, items: [] as string[] }
  if (attackerWon && defenderTarget.drops) {
    loot = {
      silver: defenderTarget.drops.silver,
      spiritStones: rng.next() < 0.25 ? defenderTarget.drops.spiritStones : 0,
      items: defenderTarget.drops.items ?? [],
    }
  }

  const rewards = {
    cultivationPoints: attackerWon ? Math.floor(damageDealt / 2) : 0,
    reputation: attackerWon ? Math.floor(damageDealt / 10) : 0,
    merit: attackerWon ? Math.floor(damageDealt / 20) : 0,
  }

  let injury: InjuryLevel = 0
  let cultivationLoss = 0
  let heartDemonGain = 0
  let deathCheck = false

  if (!attackerWon) {
    const injuryChance = attacker.character.injuryLevel * COMBAT_CONSTANTS.INJURY_HP_PENALTY
    deathCheck = rng.next() < injuryChance
    injury = deathCheck ? 3 : Math.max(1, attacker.character.injuryLevel)
    cultivationLoss = Math.floor(
      attacker.character.cultivationPoints * COMBAT_CONSTANTS.DEATH_CULTIVATION_PENALTY,
    )
    heartDemonGain = 10
  } else if (attackerHp < attacker.character.currentHp * 0.2) {
    injury = 1
    heartDemonGain = 5
  }

  combatLog.push('========================================')
  if (attackerWon) {
    combatLog.push(`Victory! (${turns} turns)`)
    if (loot.silver > 0) combatLog.push(`Loot: ${loot.silver} Silver`)
    if (rewards.cultivationPoints > 0) combatLog.push(`Cultivation: +${rewards.cultivationPoints}`)
  } else {
    combatLog.push(`Defeat! (${turns} turns)`)
    if (deathCheck) combatLog.push('You died! Revival required.')
  }
  combatLog.push('========================================')

  return {
    winner: attackerWon ? 'attacker' : 'defender',
    turns,
    attackerHpRemaining: attackerHp,
    defenderHpRemaining: defenderHp,
    damageDealt,
    damageTaken,
    criticalHits,
    loot,
    rewards,
    penalties: {
      injury,
      cultivationLoss,
      heartDemonGain,
      deathCheck,
    },
    combatLog,
  }
}

function targetToParticipant(
  target: CombatTarget,
  baseCharacter: CharacterState,
): CombatParticipant {
  return {
    character: {
      ...baseCharacter,
      id: target.id,
      name: target.name,
      realm: target.realm as RealmId,
      currentHp: target.maxHp,
      maxHp: target.maxHp,
    },
    attack: target.attack,
    defense: target.defense,
    speed: target.speed,
    critRate: target.critRate,
    element: target.element,
  }
}
