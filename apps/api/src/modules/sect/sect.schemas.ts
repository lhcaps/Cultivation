import { z } from 'zod'

export const SectMembershipRequestSchema = z.object({
  characterId: z.string().min(1),
})

export type SectMembershipRequest = z.infer<typeof SectMembershipRequestSchema>
