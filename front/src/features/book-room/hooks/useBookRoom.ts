import { useState } from "react"

import { useRoomsFilters } from "@/entities/rooms-filter/hooks"
import { getTodayInTimeZone } from "@/shared/lib/getTodayInTimeZone"
import { shiftTime } from "@/shared/lib/shiftTime"
import {
  durationToMinutes,
  timeToMinutes,
  type Duration,
} from "@/shared/lib/duration"
import {
  BOOKING_WINDOW_DAYS,
  START_HOURS,
  WORKDAY_END,
} from "@/shared/config/workday"
import { toIsoWithOffset } from "@/shared/lib/timeUtils"
import { getApiError } from "@/shared/lib/apiError"
import { toast } from "sonner"
import { formatBookingSummary } from "@/shared/lib/formatBookingSummary"
import { useCreateRecurring } from "@/features/recurring-booking/useCreateRecurring"
import type { RepeatMode } from "@/features/recurring-booking/types"
import type { RoomItem } from "@/entities/room/types"
import type { useBookRoomMutation } from "./useBookRoomMutation"

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

interface Params {
  room: RoomItem
  onClose: () => void
  onConflict: () => void
  mutation: ReturnType<typeof useBookRoomMutation>
}

export const useBookRoom = ({
  room,
  onClose,
  mutation,
  onConflict,
}: Params) => {
  const filters = useRoomsFilters()
  const { mutate, isPending, error, isError } = mutation
  const { createSeries } = useCreateRecurring()

  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [date, setDate] = useState<Date | null>(filters.date)
  const [time, setTime] = useState<string | null>(filters.time)
  const [duration, setDuration] = useState<Duration | null>(filters.duration)
  const [dateOpen, setDateOpen] = useState(false)
  const [repeat, setRepeat] = useState<RepeatMode>("none")
  const [isSubmittingSeries, setIsSubmittingSeries] = useState(false)

  const timeZone = room.office.timezone
  const minDate = getTodayInTimeZone(timeZone)
  const maxDate = addDays(minDate, BOOKING_WINDOW_DAYS)

  const durationMinutes = duration ? durationToMinutes(duration) : null
  const end =
    time && durationMinutes != null ? shiftTime(time, durationMinutes) : null

  const startMax =
    durationMinutes != null
      ? shiftTime(WORKDAY_END, -durationMinutes)
      : undefined
  const maxDurationMinutes =
    timeToMinutes(WORKDAY_END) -
    (time ? timeToMinutes(time) : START_HOURS[0] * 60)

  const startsAt = toIsoWithOffset(date, time, timeZone)
  const endsAt = toIsoWithOffset(date, end, timeZone)

  const canSubmit = title.trim() !== "" && Boolean(startsAt) && Boolean(endsAt)

  const apiError = isError ? getApiError(error) : null
  const errorMessage =
    apiError && apiError.status !== 409 ? apiError.message : undefined
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!canSubmit || !startsAt || !endsAt) return

    if (repeat !== "none" && date && time && durationMinutes != null) {
      setIsSubmittingSeries(true)
      try {
        await createSeries({
          room,
          title: title.trim(),
          comment: comment.trim(),
          date,
          time,
          durationMinutes,
          mode: repeat,
        })
        onClose()
      } finally {
        setIsSubmittingSeries(false)
      }
      return
    }

    mutate(
      {
        roomId: room.id,
        title: title.trim(),
        comment: comment.trim(),
        startsAt,
        endsAt,
      },
      {
        onSuccess: () => {
          onClose()
          toast.success("Бронирование создано", {
            description: formatBookingSummary(
              room.name,
              new Date(startsAt),
              new Date(endsAt),
              timeZone
            ),
          })
        },
        onError: (error) => {
          const apiError = getApiError(error)

          if (apiError.status === 409) {
            onConflict()
            return
          }

          toast.error("Не удалось создать бронирование", {
            description: "Попробуйте ещё раз",
          })
        },
      }
    )
  }

  return {
    title,
    setTitle,
    comment,
    setComment,
    date,
    setDate,
    time,
    setTime,
    duration,
    setDuration,
    dateOpen,
    setDateOpen,
    repeat,
    setRepeat,
    minDate,
    maxDate,
    startMax,
    maxDurationMinutes,
    end,
    canSubmit,
    isPending: isPending || isSubmittingSeries,
    errorMessage,
    onSubmit,
  }
}
