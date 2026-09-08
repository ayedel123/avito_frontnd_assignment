import { useSelectedOffice } from "@/entities/office/hooks"
import { DatePicker } from "@/shared/components/ui/DatePicker"
import { useRoomsDateFilter } from "./useRoomsDateFilter"

export const RoomsDateFilter = () => {
  const { office } = useSelectedOffice()
  const { date, setDate, minDate, maxDate } = useRoomsDateFilter(
    office?.timezone
  )

  return (
    <DatePicker
      date={date}
      setDate={setDate}
      minDate={minDate}
      maxDate={maxDate}
      disabled={!office}
    />
  )
}
