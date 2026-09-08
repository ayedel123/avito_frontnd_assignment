import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { BOOKING_WINDOW_DAYS } from "@/shared/config/workday"
import { getTodayInTimeZone } from "@/shared/lib/getTodayInTimeZone"
import { QK_USE_ROOMS } from "@/entities/room/hooks"
import { QK_USE_ROOM_SCHEDULE } from "@/entities/room/useRoomSchedule"
import { QK_USE_BOOKINGS } from "@/entities/booking/hooks/useBookings"
import type { RoomItem } from "@/entities/room/types"
import { addDays, collectUntil, toDateKey } from "./occurrences"
import { fireSeries, type SeriesResult } from "./materialize"
import { addRule } from "./storage"
import type { RecurringMode, RecurringRule } from "./types"

interface CreateSeriesInput {
  room: RoomItem
  title: string
  comment: string
  date: Date
  time: string
  durationMinutes: number
  mode: RecurringMode
}

const summary = (result: SeriesResult): string => {
  const parts = [`создано ${result.created}`]
  if (result.conflict > 0) parts.push(`занято ${result.conflict}`)
  if (result.error > 0) parts.push(`ошибок ${result.error}`)
  return `${parts.join(", ")}. Следующие даты добронируются автоматически.`
}

export const useCreateRecurring = () => {
  const queryClient = useQueryClient()

  const createSeries = async (input: CreateSeriesInput): Promise<void> => {
    const { room, date, time, durationMinutes, title, comment, mode } = input
    const timezone = room.office.timezone

    const anchor = {
      mode,
      weekday: date.getDay(),
      dayOfMonth: date.getDate(),
    }

    const today = getTodayInTimeZone(timezone)
    const windowEnd = addDays(today, BOOKING_WINDOW_DAYS)
    const { dates, next } = collectUntil(anchor, date, windowEnd)

    const template = { roomId: room.id, title, comment, time, durationMinutes, timezone }
    const result = await fireSeries(template, dates)

    const rule: RecurringRule = {
      id: crypto.randomUUID(),
      roomId: room.id,
      roomName: room.name,
      timezone,
      title,
      comment,
      time,
      durationMinutes,
      mode,
      weekday: anchor.weekday,
      dayOfMonth: anchor.dayOfMonth,
      nextDate: toDateKey(next),
    }
    addRule(rule)

    queryClient.invalidateQueries({ queryKey: [QK_USE_ROOMS] })
    queryClient.invalidateQueries({ queryKey: [QK_USE_ROOM_SCHEDULE] })
    queryClient.invalidateQueries({ queryKey: [QK_USE_BOOKINGS] })

    const label = mode === "weekly" ? "еженедельно" : "ежемесячно"
    if (result.created > 0) {
      toast.success(`Повторяющееся бронирование создано (${label})`, {
        description: summary(result),
      })
    } else {
      toast.error("Не удалось создать повторяющееся бронирование", {
        description: summary(result),
      })
    }
  }

  return { createSeries }
}
