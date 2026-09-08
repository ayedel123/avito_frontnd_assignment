import { Button } from "@/shared/components/shadcn/button"
import { Input } from "@/shared/components/shadcn/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/shadcn/popover"
import { cn } from "cn"
import { Users } from "lucide-react"
import { useState } from "react"

const PRESETS = Array.from({ length: 10 }, (_, i) => i + 1) // 1..10
const MAX = 100

interface Props {
  value: number | null
  onChange: (value: number | null) => void
  className?: string
}

export const CapacityPicker = ({ value, onChange, className }: Props) => {
  const [open, setOpen] = useState(false)

  const selectPreset = (next: number) => {
    onChange(next)
    setOpen(false)
  }

  const clear = () => {
    onChange(null)
    setOpen(false)
  }

  const handleCustom = (raw: string) => {
    if (raw === "") {
      onChange(null)
      return
    }
    const parsed = Math.floor(Number(raw))
    if (Number.isNaN(parsed)) return
    onChange(Math.min(MAX, Math.max(1, parsed)))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            data-empty={value === null}
            className={cn(
              "min-w-0 justify-between text-left font-normal data-[empty=true]:text-muted-foreground",
              className
            )}
          >
            <span className="truncate">
              {value !== null ? `${value} чел.` : "Любая"}
            </span>
            <Users data-icon="inline-end" />
          </Button>
        }
      />
      <PopoverContent className="w-56 p-0" align="start">
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
        <div className="grid grid-cols-5 gap-1 p-1">
          {PRESETS.map((preset) => (
            <Button
              key={preset}
              variant={value === preset ? "default" : "ghost"}
              size="sm"
              className="tabular-nums"
              onClick={() => selectPreset(preset)}
            >
              {preset}
            </Button>
          ))}
        </div>
        <div className="border-t p-2">
          <label className="mb-1 block text-xs text-muted-foreground">
            Другое (до {MAX})
          </label>
          <Input
            type="number"
            min={1}
            max={MAX}
            step={1}
            placeholder="Число"
            value={String(value || "")}
            onChange={(event) => handleCustom(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") setOpen(false)
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
