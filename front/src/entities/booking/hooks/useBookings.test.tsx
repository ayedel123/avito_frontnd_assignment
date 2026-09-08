import { describe, expect, it, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { PropsWithChildren } from "react"
import type { DateRange } from "react-day-picker"
import type { OfficeItem } from "@/entities/office/types"
import { useBookings } from "./useBookings"

const store = vi.hoisted(() => ({ bookings: [] as unknown[] }))

vi.mock("../api", () => ({
  getBookings: vi.fn(async () => store.bookings),
}))

vi.mock("@/shared/lib/getTodayInTimeZone", () => ({
  getTodayInTimeZone: () => new Date(2026, 9, 24),
}))

const office: OfficeItem = {
  id: "o1",
  name: "Офис Москва",
  address: "ул. Лесная 7",
  timezone: "Europe/Moscow",
}

const booking = (id: string, startsAt: string, endsAt: string) => ({
  id,
  startsAt,
  endsAt,
})

const wrapper = ({ children }: PropsWithChildren) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

const renderUseBookings = (range?: DateRange) =>
  renderHook(() => useBookings(office, range), { wrapper })

beforeEach(() => {
  store.bookings = []
})

describe("useBookings", () => {
  it("делит брони на прошедшие и предстоящие относительно сегодня в зоне офиса", async () => {
    store.bookings = [
      booking("past", "2026-10-20T09:00:00.000Z", "2026-10-20T10:00:00.000Z"),
      booking("up", "2026-10-25T09:00:00.000Z", "2026-10-25T10:00:00.000Z"),
    ]

    const { result } = renderUseBookings()
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.past.map((b) => b.id)).toEqual(["past"])
    expect(result.current.upcoming.map((b) => b.id)).toEqual(["up"])
  })

  it("фильтрует по выбранному диапазону дат (границы в зоне офиса)", async () => {
    store.bookings = [
      booking("d24", "2026-10-24T09:00:00.000Z", "2026-10-24T10:00:00.000Z"),
      booking("d25", "2026-10-25T09:00:00.000Z", "2026-10-25T10:00:00.000Z"),
      booking("d26", "2026-10-26T09:00:00.000Z", "2026-10-26T10:00:00.000Z"),
    ]

    const { result } = renderUseBookings({
      from: new Date(2026, 9, 25),
      to: new Date(2026, 9, 25),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.items.map((b) => b.id)).toEqual(["d25"])
  })

  it("без диапазона возвращает все брони", async () => {
    store.bookings = [
      booking("a", "2026-10-24T09:00:00.000Z", "2026-10-24T10:00:00.000Z"),
      booking("b", "2026-10-26T09:00:00.000Z", "2026-10-26T10:00:00.000Z"),
    ]

    const { result } = renderUseBookings()
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.items).toHaveLength(2)
  })
})
