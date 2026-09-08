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

interface Props {
  date: Date | null
  setDate: (date: Date | null) => void
  trigger?: ReactElement
  calendarHeader?: ReactElement
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
}

export const DatePicker = ({
  date,
  setDate,
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
              data-empty={!date}
              disabled={disabled}
              className="min-w-0 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
            >
              <span className="truncate">
                {date
                  ? format(date, "dd MMM, EEEEEE", { locale: ru })
                  : "Выберите дату"}
              </span>
              <ChevronDownIcon data-icon="inline-end" />
            </Button>
          )
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        {calendarHeader}
        <Calendar
          mode="single"
          locale={ru}
          selected={date ?? undefined}
          onSelect={(value) => {
            setDate(value ?? null)
            setOpen(false)
          }}
          defaultMonth={date ?? minDate}
          startMonth={minDate}
          endMonth={maxDate}
          disabled={disabledMatchers}
        />
      </PopoverContent>
    </Popover>
  )
}
