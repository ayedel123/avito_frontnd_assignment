import * as React from "react"
import { useQueryState } from "nuqs"
import { cn } from "cn"
import { Skeleton } from "@/shared/components/shadcn/skeleton"
import { useOffices, useSelectedOffice } from "../hooks"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn/select"
import { Dot } from "lucide-react"

function formatLocalTime(timezone: string, date: Date) {
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  } catch {
    return "--"
  }
}

export const OfficeSelect = () => {
  const { isLoading, isError, data } = useOffices()
  const [officeId, setOfficeId] = useQueryState("office")

  if (isLoading) return <Skeleton className="h-9 w-32" />
  if (isError || !data)
    return (
      <Select>
        <SelectTrigger aria-invalid>
          <SelectValue placeholder="Офисы не пришли(" />
        </SelectTrigger>
      </Select>
    )
  return (
    <div>
      <Select value={officeId} onValueChange={(value) => setOfficeId(value)}>
        <SelectTrigger>
          <SelectValue>
            {(value) => (value ? data.byId[value]?.name : "Выберите офис")}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {data.items.map((el) => (
            <SelectItem key={el.id} value={el.id}>
              {el.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <OfficeMeta />
    </div>
  )
}

interface Props {
  className?: string
}

export const OfficeMeta = ({ className }: Props) => {
  const { isLoading, isError, office } = useSelectedOffice()
  const [now, setNow] = React.useState(() => new Date())

  React.useEffect(() => {
    const timerId = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(timerId)
  }, [])

  if (isLoading)
    return (
      <div>
        <Skeleton className="h-4 w-48" />
      </div>
    )
  if (isError || !office) return null

  if (!office)
    return (
      <div className="flex items-center text-muted-foreground">
        <span>Адрес не выбран</span>
        <Dot />
        <span>местное время: --</span>
      </div>
    )

  return (
    <div className={cn("flex items-center text-muted-foreground", className)}>
      <span>{office.address}</span>
      <Dot />
      <span>местное время: {formatLocalTime(office.timezone, now)}</span>
    </div>
  )
}
