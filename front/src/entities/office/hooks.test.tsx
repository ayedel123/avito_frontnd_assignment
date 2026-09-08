import { beforeEach, describe, expect, it, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { NuqsTestingAdapter } from "nuqs/adapters/testing"
import type { PropsWithChildren } from "react"

vi.mock("./api", () => ({ getOffices: vi.fn() }))
import { getOffices } from "./api"
import { useOffices } from "./hooks"

const officesMock = vi.mocked(getOffices)

const office = {
  id: "o1",
  name: "Офис Москва",
  address: "ул. Лесная 7",
  timezone: "Europe/Moscow",
}

let client: QueryClient
const wrapper = ({ children }: PropsWithChildren) => (
  <NuqsTestingAdapter searchParams="">
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  </NuqsTestingAdapter>
)

beforeEach(() => {
  officesMock.mockReset()
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
})

describe("useOffices", () => {
  it("select разворачивает items в byId", async () => {
    officesMock.mockResolvedValue({ items: [office] })

    const { result } = renderHook(() => useOffices(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.items).toHaveLength(1)
    expect(result.current.data?.byId.o1).toEqual(office)
  })
})
