import {
  useBookingsScope,
  type BookingScope,
} from "@/entities/booking/hooks/useBookingsScope"
import { useBookings } from "@/entities/booking/hooks/useBookings"
import { useSelectedOffice } from "@/entities/office/hooks"
import { useBookingsDateRange } from "@/entities/booking/hooks/useBookingsDateRange"

interface Tab {
  value: BookingScope
  label: string
  count: number
}

export const BookingsTabs = () => {
  const [scope, setScope] = useBookingsScope()
  const { office } = useSelectedOffice()
  const { range } = useBookingsDateRange()
  const { upcoming, past } = useBookings(office, range)

  const TABS: Tab[] = [
    { value: "upcoming", label: "Предстоящие", count: upcoming.length },
    { value: "past", label: "Прошедшие", count: past.length },
  ]

  return (
    <div className="flex gap-6 border-b">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => setScope(tab.value)}
          data-active={scope === tab.value}
          className="relative -mb-px border-b-2 border-transparent px-1 pb-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[active=true]:border-primary data-[active=true]:font-medium data-[active=true]:text-foreground"
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  )
}
