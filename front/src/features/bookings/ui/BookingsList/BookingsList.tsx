import { useBookings } from "@/entities/booking/hooks/useBookings"
import { useBookingsDateRange } from "@/entities/booking/hooks/useBookingsDateRange"
import { useBookingsScope } from "@/entities/booking/hooks/useBookingsScope"
import { useSelectedOffice } from "@/entities/office/hooks"
import { CalendarPlus } from "lucide-react"
import { Button } from "@/shared/components/shadcn/button"
import { buildBookingsIcs, downloadIcs } from "@/shared/lib/ics"
import { BookingCard } from "./BookingCard"
import { BookingCardSkeleton } from "./BookingCardSkeleton"
import { BookingsEmpty } from "./BookingsEmpty"
import { BookingsError } from "./BookingsError"

const EMPTY_DESCRIPTION: Record<string, string> = {
  upcoming:
    "У вас пока нет предстоящих бронирований. Перейдите в раздел переговорных, чтобы забронировать комнату.",
  past: "У вас пока нет прошедших бронирований.",
}

export const BookingsList = () => {
  const [scope] = useBookingsScope()
  const { office } = useSelectedOffice()
  const { range } = useBookingsDateRange()
  const { upcoming, past, isLoading, isError, refetch } = useBookings(
    office,
    range
  )

  if (isLoading)
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <BookingCardSkeleton key={index} />
        ))}
      </div>
    )

  if (isError) return <BookingsError onRetry={() => refetch()} />

  const bookings = scope === "past" ? past : upcoming

  if (bookings.length === 0)
    return <BookingsEmpty description={EMPTY_DESCRIPTION[scope]} />

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => downloadIcs("bookings.ics", buildBookingsIcs(bookings))}
        >
          <CalendarPlus data-icon="inline-start" />
          Экспорт в .ics
        </Button>
      </div>
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  )
}
