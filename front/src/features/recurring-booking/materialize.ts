import { bookRoom } from "@/entities/booking/api"
import type { BookRoomParams } from "@/entities/booking/types"
import { getApiError } from "@/shared/lib/apiError"
import { shiftTime } from "@/shared/lib/shiftTime"
import { toIsoWithOffset } from "@/shared/lib/timeUtils"
import type { RecurringRule } from "./types"

export interface SeriesResult {
  created: number
  conflict: number
  error: number
}

export type BookingTemplate = Pick<
  RecurringRule,
  "roomId" | "title" | "comment" | "time" | "durationMinutes" | "timezone"
>

const buildParams = (
  template: BookingTemplate,
  date: Date
): BookRoomParams | null => {
  const startsAt = toIsoWithOffset(date, template.time, template.timezone)
  const endsAt = toIsoWithOffset(
    date,
    shiftTime(template.time, template.durationMinutes),
    template.timezone
  )
  if (!startsAt || !endsAt) return null

  return {
    roomId: template.roomId,
    title: template.title,
    comment: template.comment,
    startsAt,
    endsAt,
  }
}

const fireOne = async (
  template: BookingTemplate,
  date: Date
): Promise<keyof SeriesResult> => {
  const params = buildParams(template, date)
  if (!params) return "error"

  try {
    await bookRoom(params)
    return "created"
  } catch (error) {
    return getApiError(error).status === 409 ? "conflict" : "error"
  }
}

export const fireSeries = async (
  template: BookingTemplate,
  dates: Date[]
): Promise<SeriesResult> => {
  const result: SeriesResult = { created: 0, conflict: 0, error: 0 }
  const outcomes = await Promise.all(
    dates.map((date) => fireOne(template, date))
  )
  for (const outcome of outcomes) result[outcome] += 1
  return result
}
