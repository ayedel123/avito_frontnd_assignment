import { z } from "zod"

export const officeItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  timezone: z.string(),
})

export type OfficeItem = z.infer<typeof officeItemSchema>

export const officesSchema = z.object({ items: z.array(officeItemSchema) })

export type Offices = z.infer<typeof officesSchema>
