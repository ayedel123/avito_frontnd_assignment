import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, renderHook } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { PropsWithChildren } from "react"
import { useRealtimeSync } from "./useRealtimeSync"

class MockWebSocket {
  static instances: MockWebSocket[] = []
  onopen: (() => void) | null = null
  onclose: (() => void) | null = null
  onmessage: ((event: { data: string }) => void) | null = null
  closed = false

  url: string
  constructor(url: string) {
    this.url = url
    MockWebSocket.instances.push(this)
  }

  close() {
    this.closed = true
  }
}

const latest = () => MockWebSocket.instances.at(-1)!

const emit = (type: string) =>
  act(() => {
    latest().onmessage?.({
      data: JSON.stringify({ type, occurredAt: "", data: {} }),
    })
  })

let client: QueryClient
let invalidateSpy: ReturnType<typeof vi.spyOn>

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
)

beforeEach(() => {
  MockWebSocket.instances = []
  vi.stubGlobal("WebSocket", MockWebSocket)
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  invalidateSpy = vi.spyOn(client, "invalidateQueries")
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe("useRealtimeSync", () => {
  it("стартует в connecting и переходит в open по onopen", () => {
    const { result } = renderHook(() => useRealtimeSync(), { wrapper })
    expect(result.current.status).toBe("connecting")

    act(() => latest().onopen?.())
    expect(result.current.status).toBe("open")
  })

  it("после обрыва статус reconnecting", () => {
    const { result } = renderHook(() => useRealtimeSync(), { wrapper })
    act(() => latest().onopen?.())
    act(() => latest().onclose?.())
    expect(result.current.status).toBe("reconnecting")
  })

  it("инвалидирует запросы на known-событие и игнорирует неизвестное", () => {
    renderHook(() => useRealtimeSync(), { wrapper })
    act(() => latest().onopen?.())
    invalidateSpy.mockClear()

    emit("booking.created")
    expect(invalidateSpy).toHaveBeenCalled()

    invalidateSpy.mockClear()
    emit("something.unknown")
    expect(invalidateSpy).not.toHaveBeenCalled()
  })

  it("реконнектится и делает resync (invalidate всех запросов)", () => {
    vi.useFakeTimers()
    renderHook(() => useRealtimeSync(), { wrapper })

    act(() => latest().onopen?.())
    act(() => latest().onclose?.())
    expect(MockWebSocket.instances).toHaveLength(1)

    act(() => vi.advanceTimersByTime(3000))
    expect(MockWebSocket.instances).toHaveLength(2)

    invalidateSpy.mockClear()
    act(() => latest().onopen?.())
    // resync = invalidateQueries() без ключа
    expect(
      invalidateSpy.mock.calls.some((call: unknown[]) => call.length === 0)
    ).toBe(true)
  })

  it("на unmount закрывает сокет", () => {
    const { unmount } = renderHook(() => useRealtimeSync(), { wrapper })
    const socket = latest()
    unmount()
    expect(socket.closed).toBe(true)
  })
})
