import { useState } from "react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "cn"
import { Separator } from "@/shared/components/shadcn/separator"
import { Button } from "@/shared/components/shadcn/button"
import { DatePicker } from "@/shared/components/ui/DatePicker"
import { useDatePicker } from "@/entities/rooms-filter/hooks"
import { getTodayInTimeZone } from "@/shared/lib/getTodayInTimeZone"
import { getDateBounds } from "@/shared/lib/getDateBounds"
import {
  BOOKING_WINDOW_DAYS,
  START_HOURS,
  WORK_START_HOUR,
} from "@/shared/config/workday"
import { useUser } from "@/entities/user/hooks"
import { BookRoomDialog } from "@/features/book-room/ui/BookRoomDialog"
import type { RoomItem } from "@/entities/room/types"
import { useRoomSchedule } from "@/entities/room/useRoomSchedule"

const HOUR_PX = 40
const LABEL_PX = 40
const GAP_PX = 16
const LEFT_PX = LABEL_PX + GAP_PX

const minutesInTimeZone = (iso: string, timeZone: string) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date(iso))
  const hour = Number(parts.find((p) => p.type === "hour")?.value)
  const minute = Number(parts.find((p) => p.type === "minute")?.value)
  return hour * 60 + minute
}

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1)

interface GridProps {
  disabled?: boolean
  children?: React.ReactNode
}

export const ScheduleGrid = ({ disabled, children }: GridProps) => (
  <div className="relative">
    {children}
    {START_HOURS.map((hour) => (
      <div
        key={hour}
        className={cn(
          "flex items-start gap-4",
          disabled && "pointer-events-none"
        )}
        style={{ height: HOUR_PX }}
      >
        <span className="w-10 text-sm text-muted-foreground">
          {`${hour.toString().padStart(2, "0")}:00`}
        </span>
        <div className="flex-1">
          <Separator />
        </div>
      </div>
    ))}
  </div>
)

interface Props {
  room: RoomItem
}

export const RoomSchedule = ({ room }: Props) => {
  const timeZone = room.office.timezone
  const [bookOpen, setBookOpen] = useState(false)

  const { date, setDate } = useDatePicker()
  const { minDate, maxDate } = getDateBounds(timeZone, BOOKING_WINDOW_DAYS)
  const effectiveDate = date ?? getTodayInTimeZone(timeZone)

  const { data: bookings = [] } = useRoomSchedule(room.id, timeZone, date ?? undefined)
  const { data: me } = useUser()

  return (
    <div className="flex flex-col rounded-xl border bg-card p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Расписание на день</h2>
          <p className="text-sm text-muted-foreground">
            {capitalize(
              format(effectiveDate, "EEEE, d MMMM", { locale: ru })
            )}
          </p>
        </div>
        <DatePicker
          date={effectiveDate}
          setDate={setDate}
          minDate={minDate}
          maxDate={maxDate}
          trigger={
            <Button variant="outline">
              <CalendarIcon data-icon="inline-start" />
              {format(effectiveDate, "d MMMM", { locale: ru })}
            </Button>
          }
        />
      </div>

      <ScheduleGrid>
        {bookings.map((booking) => {
          const startMin = minutesInTimeZone(booking.startsAt, timeZone)
          const endMin = minutesInTimeZone(booking.endsAt, timeZone)

          const top = ((startMin - WORK_START_HOUR * 60) / 60) * HOUR_PX
          const height = ((endMin - startMin) / 60) * HOUR_PX
          const isMine = me?.id === booking.userId

          return (
            <div
              key={booking.id}
              className={cn(
                "absolute right-0 flex items-center overflow-hidden rounded-lg px-3 text-sm",
                isMine
                  ? "border border-primary/50 bg-primary/10 text-foreground"
                  : "bg-muted text-muted-foreground"
              )}
              style={{ top, left: LEFT_PX, height }}
            >
              {isMine ? booking.title : "Занято"}
            </div>
          )
        })}
      </ScheduleGrid>

      <div className="mt-4 flex justify-end">
        <Button onClick={() => setBookOpen(true)}>Забронировать комнату</Button>
      </div>

      <BookRoomDialog
        open={bookOpen}
        setOpen={setBookOpen}
        room={bookOpen ? room : null}
      />
    </div>
  )
}
