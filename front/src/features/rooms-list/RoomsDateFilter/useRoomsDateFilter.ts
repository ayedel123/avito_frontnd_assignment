import { useDatePicker } from "@/entities/rooms-filter/hooks"
import { getDateBounds } from "@/shared/lib/getDateBounds"
import { BOOKING_WINDOW_DAYS } from "@/shared/config/workday"

export const useRoomsDateFilter = (timeZone?: string) => {
  const { date, setDate } = useDatePicker()
  const { minDate, maxDate } = getDateBounds(timeZone, BOOKING_WINDOW_DAYS)

  return { date, setDate, minDate, maxDate }
}
