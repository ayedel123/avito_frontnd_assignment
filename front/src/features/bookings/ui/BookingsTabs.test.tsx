import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { NuqsTestingAdapter } from "nuqs/adapters/testing"
import type { PropsWithChildren } from "react"

vi.mock("@/entities/booking/hooks/useBookings", () => ({
  useBookings: () => ({ upcoming: [{ id: "1" }, { id: "2" }], past: [{ id: "3" }] }),
}))
vi.mock("@/entities/office/hooks", () => ({
  useSelectedOffice: () => ({ office: undefined }),
}))
vi.mock("@/entities/booking/hooks/useBookingsDateRange", () => ({
  useBookingsDateRange: () => ({ range: undefined }),
}))

import { BookingsTabs } from "./BookingsTabs"

const wrapper = ({ children }: PropsWithChildren) => (
  <NuqsTestingAdapter searchParams="">{children}</NuqsTestingAdapter>
)

describe("BookingsTabs", () => {
  it("показывает вкладки со счётчиками, активна upcoming по умолчанию", () => {
    render(<BookingsTabs />, { wrapper })

    const upcoming = screen.getByRole("button", { name: "Предстоящие (2)" })
    const past = screen.getByRole("button", { name: "Прошедшие (1)" })

    expect(upcoming).toBeInTheDocument()
    expect(past).toBeInTheDocument()
    expect(upcoming).toHaveAttribute("data-active", "true")
    expect(past).toHaveAttribute("data-active", "false")
  })
})
