/**
 * Cultivation API integration tests — verify service + game engine integration.
 */
import type { MockInstance } from 'vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Rng } from '@thien-nam/core/rules'
import { CultivationService } from './cultivation.service.js'
import type { CharacterService } from '../character/character.service.js'

// Minimal character data as returned by Prisma
const mockCharacter = {
  id: 'char-1',
  userId: 'user-1',
  name: 'TestChar',
  realmId: 'LUYEN_THE',
  subStage: 'SO',
  cultivationPoints: 0,
  foundationQuality: 20,
  heartDemon: 0,
  injuryLevel: 0,
  regionId: 'DAI_VIET',
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
  user: { id: 'user-1', discordId: '123' },
  realm: { id: 'LUYEN_THE', name: 'Luyen The', pointsPerSubStage: 1_000 },
}

const mockPrisma = {
  $transaction: vi.fn(),
  character: {
    update: vi.fn(),
    findUnique: vi.fn(),
  },
  injury: {
    create: vi.fn(),
  },
  cultivationSession: {
    create: vi.fn(),
  },
  actionLog: {
    create: vi.fn(),
  },
}

describe('CultivationService', () => {
  let service: CultivationService
  let characterService: CharacterService

  beforeEach(() => {
    vi.clearAllMocks()
    characterService = {
      findById: vi.fn().mockResolvedValue(mockCharacter),
      findByDiscordId: vi.fn(),
    } as unknown as CharacterService
    service = new CultivationService(characterService, mockPrisma as never)
  })

  /**
   * Build a deterministic RNG that returns specific values in sequence.
   * Resolves the flaky injury test by controlling all RNG calls.
   * Calls: variance (1), injury check (1), spirit stone check (1), public log (1) = 4 total
   */
  function makeRng(values: number[]): Rng {
    let i = 0
    return { next: () => values[i++] ?? 0 }
  }

  it('creates cultivation session row after successful cultivation', async () => {
    mockPrisma.$transaction.mockImplementation(async (fn: Function) =>
      fn({
        character: {
          update: vi.fn().mockResolvedValue({ id: 'char-1' }),
        },
        injury: { create: vi.fn() },
        cultivationSession: { create: vi.fn().mockResolvedValue({ id: 'sess-1' }) },
        actionLog: { create: vi.fn().mockResolvedValue({ id: 'log-1' }) },
      }),
    )

    const result = await service.cultivateForDiscordUser('123', 'char-1', 'STABLE')
    expect(result.pointsGained).toBeGreaterThan(0)
    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1)
  })

  it('creates injury row when forced cultivation causes injury', async () => {
    const injuredChar = {
      ...mockCharacter,
      lastCultivationAt: new Date(Date.now() - 86400_000 * 2),
    }
    ;(characterService.findById as ReturnType<typeof vi.fn>).mockResolvedValue(injuredChar)

    let txCtx!: {
      character: { update: MockInstance }
      injury: { create: MockInstance }
      cultivationSession: { create: MockInstance }
      actionLog: { create: MockInstance }
    }
    mockPrisma.$transaction.mockImplementation(async (fn: Function) =>
      fn(
        (txCtx = {
          character: { update: vi.fn().mockResolvedValue({ id: 'char-1' }) },
          injury: { create: vi.fn().mockResolvedValue({ id: 'inj-1' }) },
          cultivationSession: { create: vi.fn().mockResolvedValue({ id: 'sess-1' }) },
          actionLog: { create: vi.fn().mockResolvedValue({ id: 'log-1' }) },
        }),
      ),
    )

    // Inject deterministic RNG: variance=0.5, injury triggers (< riskChance), spiritStone=0.5, publicLog=0.5
    const forcedService = new CultivationService(
      characterService,
      mockPrisma as never,
      makeRng([0.5, 0.05, 0.5, 0.5]),
    )
    await forcedService.cultivateForDiscordUser('123', 'char-1', 'FORCED')

    // Verify injury row is created
    expect(txCtx.injury.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        characterId: 'char-1',
        level: expect.any(Number),
        source: 'FORCED',
      }),
    })
  })

  it('creates action log entry for cultivation', async () => {
    let txCtx!: {
      character: { update: MockInstance }
      injury: { create: MockInstance }
      cultivationSession: { create: MockInstance }
      actionLog: { create: MockInstance }
    }
    mockPrisma.$transaction.mockImplementation(async (fn: Function) =>
      fn(
        (txCtx = {
          character: { update: vi.fn().mockResolvedValue({ id: 'char-1' }) },
          injury: { create: vi.fn() },
          cultivationSession: { create: vi.fn().mockResolvedValue({ id: 'sess-1' }) },
          actionLog: { create: vi.fn().mockResolvedValue({ id: 'log-1' }) },
        }),
      ),
    )

    await service.cultivateForDiscordUser('123', 'char-1', 'STABLE')

    // Verify action log was created
    expect(txCtx.actionLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        characterId: 'char-1',
        action: 'CULTIVATE',
        publicLog: expect.any(Boolean),
      }),
    })
  })

  it('throws when character not found', async () => {
    ;(characterService.findById as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    await expect(service.cultivateForDiscordUser('123', 'nonexistent', 'STABLE')).rejects.toThrow()
  })

  it('rejects cultivation for a character owned by another Discord user', async () => {
    await expect(service.cultivateForDiscordUser('wrong-user', 'char-1', 'STABLE')).rejects.toThrow(
      'Character does not belong',
    )
  })

  it('returns menu data with unavailable sect mode when character has no sect', async () => {
    ;(characterService.findByDiscordId as ReturnType<typeof vi.fn>).mockResolvedValue({
      characters: [
        {
          ...mockCharacter,
          realm: { id: 'LUYEN_THE', name: 'Luyen The', pointsPerSubStage: 1_000 },
          region: { name: 'Dai Viet' },
          sect: null,
        },
      ],
    })

    const menu = await service.getMenuForDiscordUser('123')
    expect(menu?.character.id).toBe('char-1')
    expect(menu?.modes.find((mode) => mode.mode === 'SECT')?.disabled).toBe(true)
  })
})
