import type { OfficeItem } from "@/entities/office/types"
import { getTodayInTimeZone } from "@/shared/lib/getTodayInTimeZone"
import { toIsoWithOffset } from "@/shared/lib/timeUtils"
import { useQuery } from "@tanstack/react-query"
import type { DateRange } from "react-day-picker"
import { getBookings } from "../api"
import type { UserBooking } from "../types"

export const QK_USE_BOOKINGS = "QK_USE_BOOKINGS"

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const startOfDayInTimeZone = (day: Date, timeZone: string): Date =>
  new Date(toIsoWithOffset(day, "00:00", timeZone) as string)

export const useBookings = (
  office: OfficeItem | undefined,
  range: DateRange | undefined
) => {
  const officeId = office?.id
  const timeZone =
    office?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone

  const query = useQuery({
    queryKey: [QK_USE_BOOKINGS, officeId],
    queryFn: () =>
      getBookings({ scope: "all", officeId: officeId ?? undefined }),
  })

  const items = query.data ?? []

  const fromInstant = range?.from
    ? startOfDayInTimeZone(range.from, timeZone).getTime()
    : null
  const rangeEnd = range?.to ?? range?.from
  const toInstant = rangeEnd
    ? startOfDayInTimeZone(addDays(rangeEnd, 1), timeZone).getTime()
    : null

  const filtered = items.filter((booking) => {
    const start = new Date(booking.startsAt).getTime()
    if (fromInstant !== null && start < fromInstant) return false
    if (toInstant !== null && start >= toInstant) return false
    return true
  })

  const todayStart = startOfDayInTimeZone(
    getTodayInTimeZone(timeZone),
    timeZone
  ).getTime()

  const past: UserBooking[] = []
  const upcoming: UserBooking[] = []
  for (const booking of filtered) {
    if (new Date(booking.endsAt).getTime() < todayStart) {
      past.push(booking)
    } else {
      upcoming.push(booking)
    }
  }

  return { ...query, items: filtered, past, upcoming }
}
