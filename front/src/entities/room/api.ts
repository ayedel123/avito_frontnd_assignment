import { axiosInstance } from "@/shared/lib/axiosInstance"
import { roomItemSchema, roomsSchema } from "./types"

export interface GetRoomsParams {
  officeId: string
  minCapacity?: number
  from?: string
  to?: string
}

export async function getRooms(params: GetRoomsParams) {
  const { data } = await axiosInstance.get("/rooms", { params })

  const result = roomsSchema.safeParse(data)
  if (!result.success) {
    const errorMessage = `Ответ /rooms не соответствует схеме: ${result.error.message}`
    console.error(errorMessage)
    throw new Error(errorMessage)
  }

  return result.data
}

export async function getRoom(roomId: string) {
  const { data } = await axiosInstance.get(`/rooms/${roomId}`)

  const result = roomItemSchema.safeParse(data)
  if (!result.success) {
    const errorMessage = `Ответ /rooms/${roomId} не соответствует схеме: ${result.error.message}`
    console.error(errorMessage)
    throw new Error(errorMessage)
  }

  return result.data
}
