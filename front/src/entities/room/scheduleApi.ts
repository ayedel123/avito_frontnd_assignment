import { axiosInstance } from "@/shared/lib/axiosInstance"
import { UserBookingsResponseSchema } from "@/entities/booking/types"

export interface GetRoomScheduleParams {
  from: string
  to: string
}

export async function getRoomSchedule(
  roomId: string,
  params: GetRoomScheduleParams
) {
  const { data } = await axiosInstance.get(`/rooms/${roomId}/bookings`, {
    params,
  })

  const result = UserBookingsResponseSchema.safeParse(data)
  if (!result.success) {
    const errorMessage = `Ответ /rooms/${roomId}/bookings не соответствует схеме: ${result.error.message}`
    console.error(errorMessage)
    throw new Error(errorMessage)
  }

  return result.data.items
}
