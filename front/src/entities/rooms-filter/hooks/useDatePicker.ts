import { parseAsLocalDate } from "@/shared/lib/parseAsLocalDate"
import { useQueryState } from "nuqs"

export const useDatePicker = () => {
  const [date, setDate] = useQueryState(
    "book-date",
    parseAsLocalDate.withOptions({ throttleMs: 0 })
  )

  return { date, setDate }
}
