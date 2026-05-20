import { describe, expect, it } from 'vitest'
import {
  calculateAttack,
  calculateDamage,
  calculateMaxHp,
  calculateMaxQi,
  resolveCombat,
  type CombatParticipant,
  type CombatTarget,
  type Rng,
} from './combat.js'
import type { CharacterState } from '../types/index.js'

function fixedRng(values: number[]): Rng {
  let idx = 0
  return { next: () => values[idx++ % values.length] ?? 0.5 }
}

function makeCharacter(overrides: Partial<CharacterState> = {}): CharacterState {
  return {
    id: 'char-1',
    discordUserId: 'user-1',
    name: 'Tran An',
    realm: 'LUYEN_THE',
    subStage: 'SO',
    cultivationPoints: 1_000,
    foundationQuality: 20,
    heartDemon: 0,
    injuryLevel: 0,
    region: 'DAI_VIET',
    sectId: null,
    manualId: 'THANH_VAN_QUYET',
    currentHp: 100,
    maxHp: 100,
    currentQi: 50,
    maxQi: 50,
    silver: 500,
    spiritStones: 0,
    merit: 0,
    reputation: 0,
    heavenSeals: 0,
    luck: 10,
    element: 'THUY',
    lastCultivationAt: null,
    lastHeartDemonAt: null,
    ...overrides,
  }
}

function makeParticipant(overrides: Partial<CombatParticipant> = {}): CombatParticipant {
  const character = makeCharacter()
  return {
    character,
    attack: 50,
    defense: 10,
    speed: 20,
    critRate: 0.1,
    ...overrides,
  }
}

function makeTarget(overrides: Partial<CombatTarget> = {}): CombatTarget {
  return {
    id: 'enemy-1',
    name: 'Yeu Thu',
    realm: 'LUYEN_THE',
    maxHp: 40,
    attack: 5,
    defense: 0,
    speed: 5,
    critRate: 0,
    drops: { silver: 10, spiritStones: 2, items: ['DUOC_THAO'] },
    ...overrides,
  }
}

describe('combat stat calculators', () => {
  it('scales max HP, max Qi, and attack with realm and foundation', () => {
    expect(calculateMaxHp('KHI_TUC', 30)).toBeGreaterThan(calculateMaxHp('LUYEN_THE', 30))
    expect(calculateMaxQi('KHI_TUC', 30)).toBeGreaterThan(calculateMaxQi('LUYEN_THE', 30))
    expect(calculateAttack('KHI_TUC', 30)).toBeGreaterThan(calculateAttack('LUYEN_THE', 30))
  })
})

describe('calculateDamage', () => {
  it('uses injected RNG for deterministic damage', () => {
    const result = calculateDamage(makeParticipant(), 0, fixedRng([0.5, 0.5, 0.5, 0.5]))
    expect(result.damage).toBe(15)
    expect(result.isDodge).toBe(false)
    expect(result.isBlock).toBe(false)
    expect(result.isCrit).toBe(false)
  })

  it('can deterministically resolve dodge, block, and crit branches', () => {
    expect(calculateDamage(makeParticipant(), 0, fixedRng([0.5, 0.01])).isDodge).toBe(true)
    expect(calculateDamage(makeParticipant(), 0, fixedRng([0.5, 0.5, 0.01])).isBlock).toBe(true)
    expect(
      calculateDamage(makeParticipant({ critRate: 1 }), 0, fixedRng([0.5, 0.5, 0.5, 0.01])).isCrit,
    ).toBe(true)
  })
})

describe('resolveCombat', () => {
  it('returns deterministic victory, rewards, and loot', () => {
    const result = resolveCombat(
      makeParticipant(),
      makeTarget({ maxHp: 10 }),
      fixedRng([
        0.9,
        0.1, // initiative: attacker first
        0.5,
        0.5,
        0.5,
        0.5, // attacker damage
        0.01, // spirit stone loot
      ]),
    )

    expect(result.winner).toBe('attacker')
    expect(result.loot.silver).toBe(10)
    expect(result.loot.spiritStones).toBe(2)
    expect(result.rewards.cultivationPoints).toBeGreaterThan(0)
  })

  it('uses defender realm when resolving counterattack damage', () => {
    const weakResult = resolveCombat(
      makeParticipant({ defense: 0 }),
      makeTarget({ realm: 'LUYEN_THE', maxHp: 999, attack: 0, defense: 999, speed: 1 }),
      fixedRng([0.9, 0.1]),
    )
    const strongResult = resolveCombat(
      makeParticipant({ defense: 0 }),
      makeTarget({ realm: 'KIM_DAN', maxHp: 999, attack: 0, defense: 999, speed: 1 }),
      fixedRng([0.9, 0.1]),
    )

    expect(strongResult.damageTaken).toBeGreaterThan(weakResult.damageTaken)
  })
})
