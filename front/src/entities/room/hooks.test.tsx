import { beforeEach, describe, expect, it, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { NuqsTestingAdapter } from "nuqs/adapters/testing"
import type { PropsWithChildren } from "react"

vi.mock("./api", () => ({ getRoom: vi.fn(), getRooms: vi.fn() }))
vi.mock("@/entities/office/api", () => ({ getOffices: vi.fn() }))

import { getRoom, getRooms } from "./api"
import { getOffices } from "@/entities/office/api"
import { useRoom, useRooms } from "./hooks"

const getRoomMock = vi.mocked(getRoom)
const getRoomsMock = vi.mocked(getRooms)
const getOfficesMock = vi.mocked(getOffices)

const room = {
  id: "r1",
  officeId: "o1",
  name: "Эверест",
  floor: 4,
  capacity: 12,
  features: [],
  office: {
    id: "o1",
    name: "Офис Москва",
    address: "ул. Лесная 7",
    timezone: "Europe/Moscow",
  },
}

let client: QueryClient
const wrapper = ({ children }: PropsWithChildren) => (
  <NuqsTestingAdapter searchParams="">
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  </NuqsTestingAdapter>
)

beforeEach(() => {
  getRoomMock.mockReset()
  getRoomsMock.mockReset()
  getOfficesMock.mockReset()
  getOfficesMock.mockResolvedValue({ items: [] })
  getRoomsMock.mockResolvedValue({ items: [] })
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
})

describe("useRoom", () => {
  it("грузит комнату по id", async () => {
    getRoomMock.mockResolvedValue(room)
    const { result } = renderHook(() => useRoom("r1"), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(room)
  })
})

describe("useRooms", () => {
  it("без выбранного офиса запрос выключен, partialInterval=false", () => {
    const { result } = renderHook(() => useRooms(), { wrapper })
    expect(result.current.partialInterval).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })
})
