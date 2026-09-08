import { beforeEach, describe, expect, it, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { PropsWithChildren } from "react"

vi.mock("./scheduleApi", () => ({ getRoomSchedule: vi.fn() }))
import { getRoomSchedule } from "./scheduleApi"
import { useRoomSchedule } from "./useRoomSchedule"

const scheduleMock = vi.mocked(getRoomSchedule)

let client: QueryClient
const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
)

beforeEach(() => {
  scheduleMock.mockReset()
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
})

describe("useRoomSchedule", () => {
  it("грузит расписание комнаты за день", async () => {
    scheduleMock.mockResolvedValue([{ id: "b1" }] as never)

    const { result } = renderHook(
      () => useRoomSchedule("r1", "Europe/Moscow", new Date(2026, 9, 24)),
      { wrapper }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([{ id: "b1" }])
    expect(scheduleMock.mock.calls[0][0]).toBe("r1")
  })
})
