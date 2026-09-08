import { beforeEach, describe, expect, it, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AxiosError, type AxiosResponse } from "axios"
import type { PropsWithChildren } from "react"
import { useBookRoomMutation } from "./useBookRoomMutation"

vi.mock("@/entities/booking/api", () => ({ bookRoom: vi.fn() }))
import { bookRoom } from "@/entities/booking/api"

const bookRoomMock = vi.mocked(bookRoom)

const params = {
  roomId: "r1",
  title: "Daily Sync",
  startsAt: "2026-10-24T07:00:00.000Z",
  endsAt: "2026-10-24T08:00:00.000Z",
  comment: "",
}

const axiosErrorWithStatus = (status: number) =>
  new AxiosError("Error", "ERR", undefined, undefined, {
    status,
    statusText: "",
    headers: {},
    config: { headers: {} },
    data: { error: { code: "X", message: "msg" } },
  } as AxiosResponse)

let client: QueryClient
let invalidateSpy: ReturnType<typeof vi.spyOn>

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
)

const renderMutation = () =>
  renderHook(() => useBookRoomMutation("r1"), { wrapper })

beforeEach(() => {
  bookRoomMock.mockReset()
  client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  invalidateSpy = vi.spyOn(client, "invalidateQueries")
})

describe("useBookRoomMutation", () => {
  it("успех: вызывает bookRoom и инвалидирует комнаты/расписание/брони", async () => {
    bookRoomMock.mockResolvedValue({ id: "b1" })

    const { result } = renderMutation()
    result.current.mutate(params)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(bookRoomMock.mock.calls[0][0]).toEqual(params)
    expect(invalidateSpy).toHaveBeenCalledTimes(3)
  })

  it("409: конфликт — тоже инвалидирует (resync доступности)", async () => {
    bookRoomMock.mockRejectedValue(axiosErrorWithStatus(409))

    const { result } = renderMutation()
    result.current.mutate(params)

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(invalidateSpy).toHaveBeenCalledTimes(3)
  })

  it("прочая ошибка: НЕ инвалидирует", async () => {
    bookRoomMock.mockRejectedValue(new Error("network"))

    const { result } = renderMutation()
    result.current.mutate(params)

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(invalidateSpy).not.toHaveBeenCalled()
  })

  it("не-409 axios ошибка (напр. 400): НЕ инвалидирует", async () => {
    bookRoomMock.mockRejectedValue(axiosErrorWithStatus(400))

    const { result } = renderMutation()
    result.current.mutate(params)

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(invalidateSpy).not.toHaveBeenCalled()
  })
})
