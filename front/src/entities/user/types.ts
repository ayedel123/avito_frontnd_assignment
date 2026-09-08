import { z } from "zod"

export const userSchema = z.object({
  id: z.string(),
  login: z.string(),
  displayName: z.string(),
  email: z.email(),
  avatarUrl: z.url().optional().nullable(),
  initials: z.string(),
})

export type User = z.infer<typeof userSchema>
