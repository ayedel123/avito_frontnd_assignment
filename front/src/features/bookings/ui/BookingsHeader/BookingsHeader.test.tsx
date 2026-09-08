import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("./OfficeFilter", () => ({
  OfficeFilter: () => <div data-testid="office-filter" />,
}))
vi.mock("@/shared/components/ui/DateRangePicker", () => ({
  DateRangePicker: () => <div data-testid="range-picker" />,
}))
vi.mock("@/entities/booking/hooks/useBookingsDateRange", () => ({
  useBookingsDateRange: () => ({ range: undefined, setRange: vi.fn() }),
}))

import { BookingsHeader } from "./BookingsHeader"

describe("BookingsHeader", () => {
  it("рендерит заголовок, фильтр офиса и пикер диапазона", () => {
    render(<BookingsHeader />)
    expect(screen.getByText("Мои бронирования")).toBeInTheDocument()
    expect(screen.getByTestId("office-filter")).toBeInTheDocument()
    expect(screen.getByTestId("range-picker")).toBeInTheDocument()
  })
})
