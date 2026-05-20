import { z } from 'zod'

export const DiscordUserIdSchema = z
  .string()
  .min(1)
  .max(32)
  .regex(/^\d+$/, 'Discord user ID must be numeric')

export const CharacterNameSchema = z
  .string()
  .trim()
  .min(2)
  .max(4)
  .regex(
    /^[\p{L}\s'-]+$/u,
    'Character name can only contain letters, spaces, apostrophes, and hyphens',
  )

export const StartCharacterRequestSchema = z.object({
  discordUserId: DiscordUserIdSchema,
  username: z.string().trim().min(1).max(100),
  name: CharacterNameSchema,
})

export type StartCharacterRequest = z.infer<typeof StartCharacterRequestSchema>

export const CharacterStartResponseSchema = z.object({
  created: z.boolean(),
  character: z.object({
    id: z.string(),
    name: z.string(),
    realmId: z.string(),
    subStage: z.string(),
    maxHp: z.number().int(),
    maxQi: z.number().int(),
    silver: z.number().int(),
    manualId: z.string().nullable(),
  }),
})

export type CharacterStartResponse = z.infer<typeof CharacterStartResponseSchema>

export const CharacterProfileResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  realm: z.object({
    id: z.string(),
    name: z.string(),
    pointsPerSubStage: z.number().int(),
  }),
  subStage: z.string(),
  cultivationPoints: z.number().int(),
  totalPoints: z.number().int(),
  progress: z.number().int().min(0),
  foundationQuality: z.number().int(),
  heartDemon: z.number().int(),
  injuryLevel: z.number().int(),
  currentHp: z.number().int(),
  maxHp: z.number().int(),
  currentQi: z.number().int(),
  maxQi: z.number().int(),
  silver: z.number().int(),
  spiritStones: z.number().int(),
  merit: z.number().int(),
  reputation: z.number().int(),
  regionName: z.string(),
  sectName: z.string().nullable(),
  manualName: z.string().nullable(),
})

export type CharacterProfileResponse = z.infer<typeof CharacterProfileResponseSchema>
