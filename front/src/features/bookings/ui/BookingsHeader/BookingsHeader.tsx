import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/shared/components/shadcn/button"
import { DateRangePicker } from "@/shared/components/ui/DateRangePicker"
import { useBookingsDateRange } from "@/entities/booking/hooks/useBookingsDateRange"
import { OfficeFilter } from "./OfficeFilter"

const formatRange = (range: DateRange | undefined) => {
  if (!range?.from) return "За всё время"
  if (!range.to) return format(range.from, "dd MMM, EEEEEE", { locale: ru })
  return `${format(range.from, "dd MMM", { locale: ru })} – ${format(
    range.to,
    "dd MMM",
    { locale: ru }
  )}`
}

export const BookingsHeader = () => {
  const { range, setRange } = useBookingsDateRange()

  return (
    <div className="flex w-full flex-wrap items-center justify-between">
      <h1 className="text-lg font-bold">Мои бронирования</h1>
      <div className="flex gap-4">
        <OfficeFilter />
        <DateRangePicker
          range={range}
          setRange={setRange}
          trigger={
            <Button
              variant={"outline"}
              data-empty={!range?.from}
              className="min-w-0 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
            >
              <span className="truncate">{formatRange(range)}</span>
              <ChevronDownIcon data-icon="inline-end" />
            </Button>
          }
          calendarHeader={
            <Button variant={"ghost"} onClick={() => setRange(undefined)}>
              За всё время
            </Button>
          }
        />
      </div>
    </div>
  )
}
