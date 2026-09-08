import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

const state = vi.hoisted(() => ({
  bookings: {
    upcoming: [] as { id: string }[],
    past: [] as { id: string }[],
    isLoading: false,
    isError: false,
    refetch: () => {},
  },
}))

vi.mock("@/entities/booking/hooks/useBookings", () => ({
  useBookings: () => state.bookings,
}))
vi.mock("@/entities/booking/hooks/useBookingsScope", () => ({
  useBookingsScope: () => ["upcoming", vi.fn()],
}))
vi.mock("@/entities/office/hooks", () => ({
  useSelectedOffice: () => ({ office: undefined }),
}))
vi.mock("@/entities/booking/hooks/useBookingsDateRange", () => ({
  useBookingsDateRange: () => ({ range: undefined }),
}))
vi.mock("./BookingCard", () => ({
  BookingCard: ({ booking }: { booking: { id: string } }) => (
    <div data-testid="card">{booking.id}</div>
  ),
}))
vi.mock("./BookingCardSkeleton", () => ({
  BookingCardSkeleton: () => <div data-testid="skeleton" />,
}))
vi.mock("./BookingsEmpty", () => ({
  BookingsEmpty: () => <div data-testid="empty" />,
}))
vi.mock("./BookingsError", () => ({
  BookingsError: () => <div data-testid="error" />,
}))

import { BookingsList } from "./BookingsList"

beforeEach(() => {
  state.bookings = {
    upcoming: [],
    past: [],
    isLoading: false,
    isError: false,
    refetch: () => {},
  }
})

describe("BookingsList", () => {
  it("loading → скелетоны", () => {
    state.bookings.isLoading = true
    render(<BookingsList />)
    expect(screen.getAllByTestId("skeleton")).toHaveLength(3)
  })

  it("error → BookingsError", () => {
    state.bookings.isError = true
    render(<BookingsList />)
    expect(screen.getByTestId("error")).toBeInTheDocument()
  })

  it("пусто → BookingsEmpty", () => {
    render(<BookingsList />)
    expect(screen.getByTestId("empty")).toBeInTheDocument()
  })

  it("данные → карточки", () => {
    state.bookings.upcoming = [{ id: "1" }, { id: "2" }]
    render(<BookingsList />)
    expect(screen.getAllByTestId("card")).toHaveLength(2)
  })
})
