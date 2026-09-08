import { useState } from "react"
import { Hourglass } from "lucide-react"
import { cn } from "cn"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/shadcn/popover"
import { Button } from "@/shared/components/shadcn/button"
import { formatDuration, type Duration } from "@/shared/lib/duration"
import { STEP_MINUTES } from "@/shared/config/workday"

const MINUTES = [0, 15, 30, 45]
const pad = (value: number) => String(value).padStart(2, "0")

interface Props {
  value: Duration | null
  onChange: (value: Duration | null) => void
  maxMinutes?: number
  className?: string
}

export const DurationPicker = ({
  value,
  onChange,
  maxMinutes = 12 * 60,
  className,
}: Props) => {
  const [open, setOpen] = useState(false)

  const hour = value?.hours ?? null
  const minute = value?.minutes ?? null

  const hours = Array.from({ length: Math.floor(maxMinutes / 60) + 1 }, (_, i) => i)

  const isValid = (h: number, m: number) => {
    const total = h * 60 + m
    return total >= STEP_MINUTES && total <= maxMinutes
  }

  const isHourEnabled = (h: number) => MINUTES.some((m) => isValid(h, m))

  const firstEnabledHour = hours.find(isHourEnabled) ?? hours[0]
  const effectiveHour = hour ?? firstEnabledHour

  const selectHour = (nextHour: number) => {
    const validMinutes = MINUTES.filter((m) => isValid(nextHour, m))
    const nextMinute =
      minute !== null && isValid(nextHour, minute) ? minute : validMinutes[0]
    onChange({ hours: nextHour, minutes: nextMinute })
  }

  const selectMinute = (nextMinute: number) => {
    onChange({ hours: effectiveHour, minutes: nextMinute })
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
            <span className="truncate">
              {value ? formatDuration(value) : "Длительность"}
            </span>
            <Hourglass data-icon="inline-end" />
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
          <DurationColumn
            values={hours}
            selected={hour}
            onSelect={selectHour}
            isDisabled={(h) => !isHourEnabled(h)}
            suffix="ч"
            ariaLabel="Часы"
          />
          <DurationColumn
            values={MINUTES}
            selected={minute}
            onSelect={selectMinute}
            isDisabled={(m) => !isValid(effectiveHour, m)}
            suffix="мин"
            ariaLabel="Минуты"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface DurationColumnProps {
  values: number[]
  selected: number | null
  onSelect: (value: number) => void
  isDisabled: (value: number) => boolean
  suffix: string
  ariaLabel: string
}

const DurationColumn = ({
  values,
  selected,
  onSelect,
  isDisabled,
  suffix,
  ariaLabel,
}: DurationColumnProps) => (
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
          className="w-16 justify-center tabular-nums"
          onClick={() => onSelect(value)}
        >
          {pad(value)} {suffix}
        </Button>
      </li>
    ))}
  </ul>
)
