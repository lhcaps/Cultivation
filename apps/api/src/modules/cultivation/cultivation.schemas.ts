import { z } from 'zod'

export const CultivationModeSchema = z.enum(['STABLE', 'FORCED', 'SECLUSION', 'SECT'])
export type CultivationModeDto = z.infer<typeof CultivationModeSchema>

export const CultivateRequestSchema = z.object({
  mode: CultivationModeSchema,
})

export type CultivateRequest = z.infer<typeof CultivateRequestSchema>

export const CultivationMenuResponseSchema = z.object({
  character: z.object({
    id: z.string(),
    name: z.string(),
    realmName: z.string(),
    subStage: z.string(),
    cultivationPoints: z.number().int(),
    totalPoints: z.number().int(),
    progress: z.number().int().min(0),
    regionName: z.string(),
    heartDemon: z.number().int(),
    sectName: z.string().nullable(),
    sectId: z.string().nullable(),
  }),
  modes: z.array(
    z.object({
      mode: CultivationModeSchema,
      label: z.string(),
      disabled: z.boolean(),
      reason: z.string().nullable(),
    }),
  ),
})

export type CultivationMenuResponse = z.infer<typeof CultivationMenuResponseSchema>

export const CultivationResultResponseSchema = z.object({
  characterId: z.string(),
  characterName: z.string(),
  realmName: z.string(),
  subStage: z.string(),
  previousCultivationPoints: z.number().int(),
  totalPoints: z.number().int(),
  pointsGained: z.number().int(),
  heartDemonGained: z.number().int(),
  injury: z.number().int(),
  spiritStonesGained: z.number().int(),
  meridianBonus: z.boolean(),
  stability: z.number().int(),
  shouldPublicLog: z.boolean(),
  publicLogMessage: z.string().nullable(),
})

export type CultivationResultResponse = z.infer<typeof CultivationResultResponseSchema>
