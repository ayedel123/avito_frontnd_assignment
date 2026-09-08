import { shiftTime } from "@/shared/lib/shiftTime"
import { useDatePicker } from "./useDatePicker"
import { useStartTimeFilter } from "./useStartTimeFilter"
import { useDurationFilter } from "./useDurationFilter"
import { useCapacityFilter } from "./useCapacityFilter"

export const useRoomsFilters = () => {
  const { date, setDate } = useDatePicker()
  const { time, setTime } = useStartTimeFilter()
  const { duration, setDuration, durationMinutes } = useDurationFilter()
  const { capacity, setCapacity } = useCapacityFilter()

  const end =
    time && durationMinutes != null ? shiftTime(time, durationMinutes) : null

  const dropFilters = () => {
    setDate(null)
    setTime(null)
    setDuration(null)
    setCapacity(null)
  }

  return {
    date,
    setDate,
    time,
    setTime,
    duration,
    setDuration,
    end,
    capacity,
    setCapacity,
    dropFilters,
  }
}
