export type CultivationMode = 'STABLE' | 'FORCED' | 'SECLUSION' | 'SECT'

export interface CharacterStartResponse {
  created: boolean
  character: {
    id: string
    name: string
    realmId: string
    subStage: string
    maxHp: number
    maxQi: number
    silver: number
    manualId: string | null
  }
}

export interface CharacterProfileResponse {
  id: string
  name: string
  realm: {
    id: string
    name: string
    pointsPerSubStage: number
  }
  subStage: string
  cultivationPoints: number
  totalPoints: number
  progress: number
  foundationQuality: number
  heartDemon: number
  injuryLevel: number
  currentHp: number
  maxHp: number
  currentQi: number
  maxQi: number
  silver: number
  spiritStones: number
  merit: number
  reputation: number
  regionName: string
  sectName: string | null
  manualName: string | null
}

export interface CultivationMenuResponse {
  character: {
    id: string
    name: string
    realmName: string
    subStage: string
    cultivationPoints: number
    totalPoints: number
    progress: number
    regionName: string
    heartDemon: number
    sectName: string | null
    sectId: string | null
  }
  modes: {
    mode: CultivationMode
    label: string
    disabled: boolean
    reason: string | null
  }[]
}

export interface CultivationResultResponse {
  characterId: string
  characterName: string
  realmName: string
  subStage: string
  previousCultivationPoints: number
  totalPoints: number
  pointsGained: number
  heartDemonGained: number
  injury: number
  spiritStonesGained: number
  meridianBonus: boolean
  stability: number
  shouldPublicLog: boolean
  publicLogMessage: string | null
}

class ApiClient {
  private readonly baseUrl = (process.env.API_BASE_URL ?? 'http://localhost:3000/api/v1').replace(
    /\/+$/,
    '',
  )

  async createCharacter(input: {
    discordUserId: string
    username: string
    name: string
  }): Promise<CharacterStartResponse> {
    return this.request<CharacterStartResponse>('/characters/start', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  }

  async getProfile(discordUserId: string): Promise<CharacterProfileResponse | null> {
    return this.request<CharacterProfileResponse | null>(
      `/characters/discord/${encodeURIComponent(discordUserId)}/profile`,
      { method: 'GET' },
      { notFoundAsNull: true },
    )
  }

  async getCultivationMenu(discordUserId: string): Promise<CultivationMenuResponse | null> {
    return this.request<CultivationMenuResponse | null>(
      `/cultivation/discord/${encodeURIComponent(discordUserId)}/menu`,
      { method: 'GET' },
      { notFoundAsNull: true },
    )
  }

  async cultivate(input: {
    discordUserId: string
    characterId: string
    mode: CultivationMode
  }): Promise<CultivationResultResponse> {
    return this.request<CultivationResultResponse>(
      `/cultivation/discord/${encodeURIComponent(input.discordUserId)}/${encodeURIComponent(input.characterId)}`,
      {
        method: 'POST',
        body: JSON.stringify({ mode: input.mode }),
      },
    )
  }

  private async request<T>(
    path: string,
    init: RequestInit,
    options: { notFoundAsNull?: boolean } = {},
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...init.headers,
      },
    })

    if (options.notFoundAsNull && response.status === 404) {
      return null as T
    }

    const body = await readJson(response)
    if (!response.ok) {
      throw new Error(getApiErrorMessage(body, response.status))
    }

    return body as T
  }
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

function getApiErrorMessage(body: unknown, status: number): string {
  if (isRecord(body)) {
    const message = body.message
    if (typeof message === 'string') {
      return message
    }
    if (Array.isArray(message) && message.every((item) => typeof item === 'string')) {
      return message.join('; ')
    }

    const error = body.error
    if (typeof error === 'string') {
      return error
    }
  }

  return `API request failed with status ${status}`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export const apiClient = new ApiClient()
