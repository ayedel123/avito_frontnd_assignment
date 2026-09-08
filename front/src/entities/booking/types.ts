import { z } from "zod"

export type BookRoomParams = {
  roomId: string
  title: string
  startsAt: string
  endsAt: string
  comment: string
}

const RoomFeatureSchema = z.object({
  code: z.string(),
  name: z.string(),
})

const RoomSchema = z.object({
  id: z.string(),
  officeId: z.string(),
  name: z.string(),
  floor: z.number(),
  capacity: z.number(),
  features: z.array(RoomFeatureSchema),
})

const OfficeSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  timezone: z.string(),
})

const BookingOwnerSchema = z.object({
  id: z.string(),
  login: z.string(),
  displayName: z.string(),
  email: z.email(),
  avatarUrl: z.string().nullable(),
  initials: z.string(),
})

export const UserBookingSchema = z.object({
  id: z.string(),
  roomId: z.string(),
  userId: z.string(),
  title: z.string(),
  comment: z.string().nullable(),
  startsAt: z.iso.datetime(),
  endsAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
  room: RoomSchema,
  office: OfficeSchema,
  owner: BookingOwnerSchema,
})

export type UserBooking = z.infer<typeof UserBookingSchema>

export const UserBookingsSchema = z.array(UserBookingSchema)

export type UserBookings = z.infer<typeof UserBookingsSchema>

export const UserBookingsResponseSchema = z.object({
  items: UserBookingsSchema,
})
