import { describe, expect, it } from 'vitest'
import {
  calculateEncounterWeights,
  resolveEncounterChoice,
  rollEncounter,
  type Rng,
} from './encounter.js'
import type { CharacterState, EncounterChoice, EncounterDefinition } from '../types/index.js'

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
    cultivationPoints: 0,
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

function makeEncounter(overrides: Partial<EncounterDefinition> = {}): EncounterDefinition {
  return {
    id: 'kien_ngo',
    region: 'DAI_VIET',
    requiredRealmMin: 'LUYEN_THE',
    requiredRealmMax: 'KIM_DAN',
    weight: 10,
    title: 'Ky ngo',
    description: 'Gap mot co duyen tren duong.',
    choices: [],
    ...overrides,
  }
}

describe('calculateEncounterWeights', () => {
  it('filters encounters by region and realm', () => {
    const weights = calculateEncounterWeights(makeCharacter(), [
      makeEncounter({ id: 'valid', region: 'DAI_VIET' }),
      makeEncounter({ id: 'wrong-region', region: 'U_MINH' }),
      makeEncounter({ id: 'too-high', requiredRealmMin: 'KIM_DAN' }),
    ])

    expect(weights.has('valid')).toBe(true)
    expect(weights.has('wrong-region')).toBe(false)
    expect(weights.has('too-high')).toBe(false)
  })

  it('adds luck and event bonuses', () => {
    const weights = calculateEncounterWeights(
      makeCharacter({ luck: 80 }),
      [makeEncounter({ id: 'event-kien_ngo', weight: 10 })],
      { kien_ngo: 5 },
    )

    expect(weights.get('event-kien_ngo')).toBe(18)
  })
})

describe('rollEncounter', () => {
  it('uses injected RNG to select a deterministic weighted encounter', () => {
    const encounters = [
      makeEncounter({ id: 'first', weight: 10 }),
      makeEncounter({ id: 'second', weight: 30 }),
    ]

    expect(rollEncounter(makeCharacter(), encounters, undefined, fixedRng([0.1]))?.id).toBe('first')
    expect(rollEncounter(makeCharacter(), encounters, undefined, fixedRng([0.9]))?.id).toBe(
      'second',
    )
  })

  it('returns null when no encounter is eligible', () => {
    const result = rollEncounter(
      makeCharacter({ region: 'U_MINH' }),
      [makeEncounter({ region: 'DAI_VIET' })],
      undefined,
      fixedRng([0.5]),
    )

    expect(result).toBeNull()
  })
})

describe('resolveEncounterChoice', () => {
  it('applies deterministic variance to rewards', () => {
    const choice: EncounterChoice = {
      label: 'Nhan truyen thua',
      effects: {
        cultivationPoints: 100,
        spiritStones: 10,
      },
    }

    const result = resolveEncounterChoice(
      makeCharacter(),
      makeEncounter(),
      choice,
      fixedRng([0.5, 0.5]),
    )

    expect(result.effects.cultivationPoints).toBe(100)
    expect(result.effects.spiritStones).toBe(10)
  })

  it('uses injury RNG when a risky choice is selected', () => {
    const choice: EncounterChoice = {
      label: 'Doi dau',
      effects: {
        riskInjuryChance: 0.5,
      },
    }

    const risky = resolveEncounterChoice(
      makeCharacter(),
      makeEncounter({ id: 'yeu_thu' }),
      choice,
      fixedRng([0.1]),
    )
    const safe = resolveEncounterChoice(
      makeCharacter(),
      makeEncounter({ id: 'yeu_thu' }),
      choice,
      fixedRng([0.9]),
    )

    expect(risky.narrative).not.toBe(safe.narrative)
  })
})
