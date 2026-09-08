import { Button } from "@/shared/components/shadcn/button"
import { Calendar } from "@/shared/components/shadcn/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/shadcn/popover"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { ChevronDownIcon } from "lucide-react"
import { useState, type ReactElement } from "react"
import type { DateRange } from "react-day-picker"

interface Props {
  range: DateRange | undefined
  setRange: (range: DateRange | undefined) => void
  trigger?: ReactElement
  calendarHeader?: ReactElement
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
}

const formatRange = (range: DateRange | undefined) => {
  if (!range?.from) return "Выберите период"
  if (!range.to) return format(range.from, "dd MMM", { locale: ru })
  return `${format(range.from, "dd MMM", { locale: ru })} – ${format(
    range.to,
    "dd MMM",
    { locale: ru }
  )}`
}

export const DateRangePicker = ({
  range,
  setRange,
  trigger,
  calendarHeader,
  disabled = false,
  minDate,
  maxDate,
}: Props) => {
  const [open, setOpen] = useState(false)

  const disabledMatchers = [
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          trigger ?? (
            <Button
              variant={"outline"}
              data-empty={!range?.from}
              disabled={disabled}
              className="min-w-0 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
            >
              <span className="truncate">{formatRange(range)}</span>
              <ChevronDownIcon data-icon="inline-end" />
            </Button>
          )
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        {calendarHeader}
        <Calendar
          mode="range"
          locale={ru}
          numberOfMonths={2}
          selected={range}
          onSelect={setRange}
          defaultMonth={range?.from ?? minDate}
          startMonth={minDate}
          endMonth={maxDate}
          disabled={disabledMatchers}
        />
      </PopoverContent>
    </Popover>
  )
}
