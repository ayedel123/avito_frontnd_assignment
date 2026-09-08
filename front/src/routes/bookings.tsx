import { BookingsHeader } from "@/features/bookings/ui/BookingsHeader/BookingsHeader"
import { BookingsList } from "@/features/bookings/ui/BookingsList/BookingsList"
import { BookingsTabs } from "@/features/bookings/ui/BookingsTabs"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/bookings")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4 text-sm leading-loose">
      <BookingsHeader />
      <BookingsTabs />
      <BookingsList />
    </div>
  )
}
