import { useQuery } from "@tanstack/react-query"
import { getRoomSchedule } from "./scheduleApi"
import { getTodayInTimeZone } from "@/shared/lib/getTodayInTimeZone"
import { toIsoWithOffset } from "@/shared/lib/timeUtils"

export const QK_USE_ROOM_SCHEDULE = "QK_USE_ROOM_SCHEDULE"

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const useRoomSchedule = (
  roomId: string,
  timeZone: string,
  date?: Date
) => {
  const day = date ?? getTodayInTimeZone(timeZone)
  const from = toIsoWithOffset(day, "00:00", timeZone) as string
  const to = toIsoWithOffset(addDays(day, 1), "00:00", timeZone) as string

  return useQuery({
    queryKey: [QK_USE_ROOM_SCHEDULE, roomId, from, to],
    queryFn: () => getRoomSchedule(roomId, { from, to }),
  })
}
