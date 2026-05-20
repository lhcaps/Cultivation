import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CharacterService } from './character.service.js'

const mockPrisma = {
  $transaction: vi.fn(),
  user: {
    findUnique: vi.fn(),
  },
  character: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
  },
}

describe('CharacterService', () => {
  let service: CharacterService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new CharacterService(mockPrisma as never)
  })

  it('creates a character through a transaction and writes an action log', async () => {
    const tx = {
      character: {
        findFirst: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({
          id: 'char-1',
          name: 'An',
          realmId: 'LUYEN_THE',
          subStage: 'SO',
          maxHp: 100,
          maxQi: 50,
          silver: 500,
          manualId: 'THANH_VAN_QUYET',
        }),
      },
      user: {
        upsert: vi.fn().mockResolvedValue({ id: 'user-1' }),
      },
      actionLog: {
        create: vi.fn().mockResolvedValue({ id: 'log-1' }),
      },
    }
    mockPrisma.$transaction.mockImplementation(async (fn: (txArg: typeof tx) => unknown) => fn(tx))

    const result = await service.createForDiscordUser({
      discordUserId: '123',
      username: 'tester',
      name: 'An',
    })

    expect(result.created).toBe(true)
    expect(tx.actionLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        characterId: 'char-1',
        action: 'CHARACTER_CREATED',
      }),
    })
  })

  it('returns the existing character instead of creating a duplicate', async () => {
    const tx = {
      character: {
        findFirst: vi.fn().mockResolvedValue({
          id: 'char-1',
          name: 'An',
          realmId: 'LUYEN_THE',
          subStage: 'SO',
          maxHp: 100,
          maxQi: 50,
          silver: 500,
          manualId: 'THANH_VAN_QUYET',
        }),
      },
      user: { upsert: vi.fn() },
      actionLog: { create: vi.fn() },
    }
    mockPrisma.$transaction.mockImplementation(async (fn: (txArg: typeof tx) => unknown) => fn(tx))

    const result = await service.createForDiscordUser({
      discordUserId: '123',
      username: 'tester',
      name: 'An',
    })

    expect(result.created).toBe(false)
    expect(tx.user.upsert).not.toHaveBeenCalled()
    expect(tx.actionLog.create).not.toHaveBeenCalled()
  })

  it("returns a profile DTO for the user's active character", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      characters: [
        {
          id: 'char-1',
          name: 'An',
          realmId: 'LUYEN_THE',
          realm: { id: 'LUYEN_THE', name: 'Luyen The', pointsPerSubStage: 1_000 },
          subStage: 'SO',
          cultivationPoints: 500,
          foundationQuality: 20,
          heartDemon: 0,
          injuryLevel: 0,
          currentHp: 100,
          maxHp: 100,
          currentQi: 50,
          maxQi: 50,
          silver: 500,
          spiritStones: 0,
          merit: 0,
          reputation: 0,
          region: { name: 'Dai Viet' },
          sect: null,
          manual: { name: 'Thanh Van Quyet' },
        },
      ],
    })

    const result = await service.getProfileByDiscordId('123')
    expect(result?.id).toBe('char-1')
    expect(result?.progress).toBe(17)
  })
})
