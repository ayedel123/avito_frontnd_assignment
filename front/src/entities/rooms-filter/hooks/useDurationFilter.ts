import { parseAsInteger, useQueryState } from "nuqs"
import {
  durationToMinutes,
  minutesToDuration,
  timeToMinutes,
  type Duration,
} from "@/shared/lib/duration"
import { START_HOURS, WORKDAY_END } from "@/shared/config/workday"

export const useDurationFilter = () => {
  const [durationMinutes, setDurationMinutes] = useQueryState(
    "duration",
    parseAsInteger
  )
  const [time] = useQueryState("book-time")

  const duration =
    durationMinutes != null ? minutesToDuration(durationMinutes) : null

  const setDuration = (value: Duration | null) =>
    setDurationMinutes(value ? durationToMinutes(value) : null)

  const maxMinutes =
    timeToMinutes(WORKDAY_END) -
    (time ? timeToMinutes(time) : START_HOURS[0] * 60)

  return { duration, setDuration, durationMinutes, maxMinutes }
}
