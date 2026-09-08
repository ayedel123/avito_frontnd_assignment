import { z } from "zod"

export const roomFeatureSchema = z.object({
  code: z.string(),
  name: z.string(),
})

export const roomOfficeSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  timezone: z.string(),
})

export const roomItemSchema = z.object({
  id: z.string(),
  officeId: z.string(),
  name: z.string(),
  floor: z.number(),
  capacity: z.number(),
  features: z.array(roomFeatureSchema),
  office: roomOfficeSchema,
  available: z.boolean().optional(),
})

export const roomsSchema = z.object({
  items: z.array(roomItemSchema),
})

export type RoomFeature = z.infer<typeof roomFeatureSchema>
export type RoomItem = z.infer<typeof roomItemSchema>
export type Rooms = z.infer<typeof roomsSchema>
