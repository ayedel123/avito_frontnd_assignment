import { axiosInstance } from "@/shared/lib/axiosInstance"
import { UserBookingsResponseSchema, type BookRoomParams } from "./types"

export interface GetBookingsParams {
  scope?: "upcoming" | "past" | "all"
  officeId?: string
}

export async function getBookings(params: GetBookingsParams = {}) {
  const { data } = await axiosInstance.get("/bookings", { params })

  const result = UserBookingsResponseSchema.safeParse(data)
  if (!result.success) {
    const errorMessage = `Ответ /bookings не соответствует схеме: ${result.error.message}`
    console.error(errorMessage)
    throw new Error(errorMessage)
  }

  return result.data.items
}

export async function cancelBooking(bookingId: string) {
  await axiosInstance.delete(`/bookings/${bookingId}`)
}

export async function bookRoom(params: BookRoomParams) {
  const { data } = await axiosInstance.post("/bookings", params)
  return data
}
