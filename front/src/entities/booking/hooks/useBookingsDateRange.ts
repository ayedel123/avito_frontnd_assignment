import { useQueryState } from "nuqs"
import type { DateRange } from "react-day-picker"
import { parseAsLocalDate } from "@/shared/lib/parseAsLocalDate"

export const useBookingsDateRange = () => {
  const [from, setFrom] = useQueryState("from", parseAsLocalDate)
  const [to, setTo] = useQueryState("to", parseAsLocalDate)

  const range: DateRange | undefined = from
    ? { from, to: to ?? undefined }
    : undefined

  const setRange = (next: DateRange | undefined) => {
    setFrom(next?.from ?? null)
    setTo(next?.to ?? null)
  }

  return { range, setRange }
}
