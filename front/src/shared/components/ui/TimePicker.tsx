import { useState } from "react"
import { Clock } from "lucide-react"
import { cn } from "cn"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/shadcn/popover"
import { Button } from "@/shared/components/shadcn/button"

const DEFAULT_HOURS = Array.from({ length: 22 - 9 + 1 }, (_, i) => 9 + i) // 9..22
const MINUTES = [0, 15, 30, 45]

const pad = (value: number) => String(value).padStart(2, "0")

const toMinutes = (time: string) => {
  const [hour, minute] = time.split(":").map(Number)
  return hour * 60 + minute
}

interface Props {
  value: string | null
  onChange: (value: string | null) => void
  min?: string | null
  max?: string | null
  hours?: number[]
  className?: string
}

export const TimePicker = ({
  value,
  onChange,
  min,
  max,
  hours = DEFAULT_HOURS,
  className,
}: Props) => {
  const [open, setOpen] = useState(false)

  const [hour, minute] = value
    ? (value.split(":").map(Number) as [number, number])
    : [null, null]

  const minBound = min ? toMinutes(min) : null
  const maxBound = max ? toMinutes(max) : null

  const isValid = (h: number, m: number) => {
    const total = h * 60 + m
    return (
      (minBound === null || total >= minBound) &&
      (maxBound === null || total <= maxBound)
    )
  }

  const isHourEnabled = (h: number) => MINUTES.some((m) => isValid(h, m))

  const firstEnabledHour = hours.find(isHourEnabled) ?? hours[0]
  const effectiveHour = hour ?? firstEnabledHour

  const selectHour = (nextHour: number) => {
    const validMinutes = MINUTES.filter((m) => isValid(nextHour, m))
    const nextMinute =
      minute !== null && isValid(nextHour, minute) ? minute : validMinutes[0]
    onChange(`${pad(nextHour)}:${pad(nextMinute)}`)
  }

  const selectMinute = (nextMinute: number) => {
    onChange(`${pad(effectiveHour)}:${pad(nextMinute)}`)
    setOpen(false)
  }

  const clear = () => {
    onChange(null)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            data-empty={!value}
            className={cn(
              "min-w-0 justify-between text-left font-normal data-[empty=true]:text-muted-foreground",
              className
            )}
          >
            <span className="truncate">{value ?? "Выберите время"}</span>
            <Clock data-icon="inline-end" />
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <div className="border-b p-1">
          <Button
            variant={value === null ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start"
            onClick={clear}
          >
            Не выбрано
          </Button>
        </div>
        <div className="flex divide-x">
          <TimeColumn
            values={hours}
            selected={hour}
            onSelect={selectHour}
            isDisabled={(h) => !isHourEnabled(h)}
            ariaLabel="Часы"
          />
          <TimeColumn
            values={MINUTES}
            selected={minute}
            onSelect={selectMinute}
            isDisabled={(m) => !isValid(effectiveHour, m)}
            ariaLabel="Минуты"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface TimeColumnProps {
  values: number[]
  selected: number | null
  onSelect: (value: number) => void
  isDisabled: (value: number) => boolean
  ariaLabel: string
}

const TimeColumn = ({
  values,
  selected,
  onSelect,
  isDisabled,
  ariaLabel,
}: TimeColumnProps) => (
  <ul
    aria-label={ariaLabel}
    className="flex max-h-56 flex-col gap-1 overflow-y-auto p-1"
  >
    {values.map((value) => (
      <li key={value}>
        <Button
          variant={selected === value ? "default" : "ghost"}
          size="sm"
          disabled={isDisabled(value)}
          className="w-12 justify-center tabular-nums"
          onClick={() => onSelect(value)}
        >
          {pad(value)}
        </Button>
      </li>
    ))}
  </ul>
)
