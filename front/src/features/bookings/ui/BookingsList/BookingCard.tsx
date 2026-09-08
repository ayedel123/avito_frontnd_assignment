import { useState } from "react"
import { Building2, CalendarDays, CalendarPlus } from "lucide-react"
import { Button } from "@/shared/components/shadcn/button"
import { buildBookingIcs, downloadIcs } from "@/shared/lib/ics"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/shadcn/alert-dialog"
import { useCancelBooking } from "@/features/cancel-booking/useCancelBooking"
import type { UserBooking } from "@/entities/booking/types"

const formatTime = (iso: string, timeZone: string) =>
  new Intl.DateTimeFormat("ru-RU", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso))

const tzLabel = (iso: string, timeZone: string) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "short",
  }).formatToParts(new Date(iso))
  return parts.find((part) => part.type === "timeZoneName")?.value ?? ""
}

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1)

const Dot = () => (
  <span className="size-1 shrink-0 rounded-full bg-muted-foreground/40" />
)

interface Props {
  booking: UserBooking
}

export const BookingCard = ({ booking }: Props) => {
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useCancelBooking()

  const timeZone = booking.office.timezone
  const start = new Date(booking.startsAt)

  const month = new Intl.DateTimeFormat("ru-RU", {
    timeZone,
    month: "long",
  }).format(start)
  const day = new Intl.DateTimeFormat("ru-RU", {
    timeZone,
    day: "numeric",
  }).format(start)

  const timeRange = `${formatTime(booking.startsAt, timeZone)} – ${formatTime(
    booking.endsAt,
    timeZone
  )}`
  const fullDate = capitalize(
    new Intl.DateTimeFormat("ru-RU", {
      timeZone,
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(start)
  )

  const onConfirm = () => {
    mutate(booking.id)
  }

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4">
      <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-lg bg-muted">
        <span className="text-[10px] font-medium text-muted-foreground uppercase">
          {month}
        </span>
        <span className="text-xl leading-none font-bold">{day}</span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="truncate font-semibold">{booking.title}</h3>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Building2 className="size-4 shrink-0" />
            <span className="font-medium text-primary">
              {booking.room.name}
            </span>
          </span>
          <Dot />
          <span>{booking.room.floor} этаж</span>
          <Dot />
          <span>
            {timeRange} {tzLabel(booking.startsAt, timeZone)}
          </span>
        </div>
        {booking.comment && (
          <p className="truncate text-sm text-muted-foreground">
            {booking.comment}
          </p>
        )}
      </div>
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() =>
            downloadIcs(`${booking.title}.ics`, buildBookingIcs(booking))
          }
          className="shrink-0"
        >
          <CalendarPlus data-icon="inline-start" />В календарь
        </Button>

        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="shrink-0 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          Отменить
        </Button>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Отменить бронирование?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя будет отменить. Освободившееся время станет
              доступно другим сотрудникам.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col gap-2 rounded-lg bg-muted p-3 text-sm">
            <p className="font-semibold">{booking.title}</p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="size-4 shrink-0" />
              Комната «{booking.room.name}», {booking.room.floor} этаж
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="size-4 shrink-0" />
              {fullDate}, {timeRange}
            </p>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Нет, оставить</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              disabled={isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isPending ? "Отменяем…" : "Да, отменить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
