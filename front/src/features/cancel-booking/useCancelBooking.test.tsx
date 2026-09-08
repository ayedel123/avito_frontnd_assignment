import { beforeEach, describe, expect, it, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { PropsWithChildren } from "react"

vi.mock("@/entities/booking/api", () => ({ cancelBooking: vi.fn() }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
import { cancelBooking } from "@/entities/booking/api"
import { toast } from "sonner"
import { QK_USE_BOOKINGS } from "@/entities/booking/hooks/useBookings"
import { useCancelBooking } from "./useCancelBooking"

const cancelMock = vi.mocked(cancelBooking)
const toastSuccess = vi.mocked(toast.success)
const toastError = vi.mocked(toast.error)

let client: QueryClient
const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
)

const seedBookings = (ids: string[]) =>
  client.setQueryData(
    [QK_USE_BOOKINGS, "o1"],
    ids.map((id) => ({ id }))
  )

const cachedIds = () =>
  (
    client.getQueryData<{ id: string }[]>([QK_USE_BOOKINGS, "o1"]) ?? []
  ).map((b) => b.id)

beforeEach(() => {
  cancelMock.mockReset()
  toastSuccess.mockReset()
  toastError.mockReset()
  client = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
    },
  })
})

describe("useCancelBooking (оптимистично)", () => {
  it("успех: зовёт cancelBooking и инвалидирует 3 ключа", async () => {
    const invalidateSpy = vi.spyOn(client, "invalidateQueries")
    cancelMock.mockResolvedValue(undefined)

    const { result } = renderHook(() => useCancelBooking(), { wrapper })
    result.current.mutate("b1")

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(cancelMock.mock.calls[0][0]).toBe("b1")
    expect(invalidateSpy).toHaveBeenCalledTimes(3)
    expect(toastSuccess).toHaveBeenCalledTimes(1)
  })

  it("успех: в тост попадает описание брони из кэша", async () => {
    client.setQueryData(
      [QK_USE_BOOKINGS, "o1"],
      [
        {
          id: "b1",
          startsAt: "2026-10-24T07:00:00.000Z",
          endsAt: "2026-10-24T08:00:00.000Z",
          room: { name: "Эверест" },
          office: { timezone: "Europe/Moscow" },
        },
      ]
    )
    cancelMock.mockResolvedValue(undefined)

    const { result } = renderHook(() => useCancelBooking(), { wrapper })
    result.current.mutate("b1")

    await waitFor(() => expect(toastSuccess).toHaveBeenCalledTimes(1))
    expect(toastSuccess.mock.calls[0][1]?.description).toContain("Эверест")
  })

  it("оптимистично убирает бронь из кэша до ответа сервера", async () => {
    seedBookings(["b1", "b2"])
    // запрос «висит» — проверяем состояние до резолва
    cancelMock.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useCancelBooking(), { wrapper })
    result.current.mutate("b1")

    await waitFor(() => expect(cachedIds()).toEqual(["b2"]))
  })

  it("откат: при ошибке возвращает бронь в кэш", async () => {
    seedBookings(["b1", "b2"])
    cancelMock.mockRejectedValue(new Error("network"))

    const { result } = renderHook(() => useCancelBooking(), { wrapper })
    result.current.mutate("b1")

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(cachedIds()).toEqual(["b1", "b2"])
    expect(toastError).toHaveBeenCalledTimes(1)
  })
})
