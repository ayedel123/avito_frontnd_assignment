import { describe, expect, it, vi } from "vitest"
import { act, renderHook } from "@testing-library/react"
import { AxiosError, type AxiosResponse } from "axios"
import { NuqsTestingAdapter } from "nuqs/adapters/testing"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { PropsWithChildren } from "react"

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { useBookRoom } from "./useBookRoom"
import type { useBookRoomMutation } from "./useBookRoomMutation"

type MutationResult = ReturnType<typeof useBookRoomMutation>

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

const queryClient = new QueryClient()
const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>
    <NuqsTestingAdapter searchParams="">{children}</NuqsTestingAdapter>
  </QueryClientProvider>
)

type MutateImpl = (
  vars: unknown,
  opts: { onSuccess?: () => void; onError?: (e: unknown) => void }
) => void

const makeMutation = (mutate: MutateImpl) =>
  ({
    mutate: vi.fn(mutate),
    isPending: false,
    error: null,
    isError: false,
  }) as unknown as MutationResult & { mutate: ReturnType<typeof vi.fn> }

const fillValidForm = (result: { current: ReturnType<typeof useBookRoom> }) => {
  act(() => result.current.setTitle("Daily Sync"))
  act(() => result.current.setDate(new Date(2026, 9, 24)))
  act(() => result.current.setTime("10:00"))
  act(() => result.current.setDuration({ hours: 1, minutes: 0 }))
}

const submit = (result: { current: ReturnType<typeof useBookRoom> }) =>
  act(async () => {
    await result.current.onSubmit({
      preventDefault: () => {},
    } as React.FormEvent)
  })

describe("useBookRoom", () => {
  it("canSubmit=false пока не заполнены тема/дата/время", () => {
    const mutation = makeMutation(() => {})
    const { result } = renderHook(
      () => useBookRoom({ room, mutation, onClose: vi.fn(), onConflict: vi.fn() }),
      { wrapper }
    )
    expect(result.current.canSubmit).toBe(false)
  })

  it("после заполнения выводит end и canSubmit=true", () => {
    const mutation = makeMutation(() => {})
    const { result } = renderHook(
      () => useBookRoom({ room, mutation, onClose: vi.fn(), onConflict: vi.fn() }),
      { wrapper }
    )
    fillValidForm(result)
    expect(result.current.end).toBe("11:00")
    expect(result.current.canSubmit).toBe(true)
  })

  it("submit: зовёт mutate и onClose при успехе", async () => {
    const onClose = vi.fn()
    const mutation = makeMutation((_vars, opts) => opts.onSuccess?.())
    const { result } = renderHook(
      () => useBookRoom({ room, mutation, onClose, onConflict: vi.fn() }),
      { wrapper }
    )
    fillValidForm(result)
    await submit(result)

    expect(mutation.mutate).toHaveBeenCalledTimes(1)
    expect(mutation.mutate.mock.calls[0][0]).toMatchObject({
      roomId: "r1",
      title: "Daily Sync",
    })
    expect(onClose).toHaveBeenCalled()
  })

  it("submit: при 409 зовёт onConflict", async () => {
    const onConflict = vi.fn()
    const err = new AxiosError("c", "ERR", undefined, undefined, {
      status: 409,
      statusText: "",
      headers: {},
      config: { headers: {} },
      data: {},
    } as AxiosResponse)
    const mutation = makeMutation((_vars, opts) => opts.onError?.(err))
    const { result } = renderHook(
      () => useBookRoom({ room, mutation, onClose: vi.fn(), onConflict }),
      { wrapper }
    )
    fillValidForm(result)
    await submit(result)

    expect(onConflict).toHaveBeenCalledTimes(1)
  })
})
