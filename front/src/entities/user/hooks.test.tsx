import { beforeEach, describe, expect, it, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { PropsWithChildren } from "react"

vi.mock("./api", () => ({ whoami: vi.fn() }))
import { whoami } from "./api"
import { useUser } from "./hooks"

const whoamiMock = vi.mocked(whoami)

const user = {
  id: "u1",
  login: "kk",
  displayName: "Константин К.",
  email: "kk@example.com",
  avatarUrl: null,
  initials: "КК",
}

let client: QueryClient
const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
)

beforeEach(() => {
  whoamiMock.mockReset()
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
})

describe("useUser", () => {
  it("возвращает текущего пользователя", async () => {
    whoamiMock.mockResolvedValue(user)
    const { result } = renderHook(() => useUser(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(user)
  })

  it("прокидывает ошибку", async () => {
    whoamiMock.mockRejectedValue(new Error("boom"))
    const { result } = renderHook(() => useUser(), { wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
