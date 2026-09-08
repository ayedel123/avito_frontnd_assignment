import { parseAsInteger, useQueryState } from "nuqs"
import { shiftTime } from "@/shared/lib/shiftTime"
import { START_HOURS, WORKDAY_END } from "@/shared/config/workday"

export const useStartTimeFilter = () => {
  const [time, setTime] = useQueryState("book-time")
  const [durationMinutes] = useQueryState("duration", parseAsInteger)

  const max =
    durationMinutes != null ? shiftTime(WORKDAY_END, -durationMinutes) : undefined

  return { time, setTime, hours: START_HOURS, max }
}
