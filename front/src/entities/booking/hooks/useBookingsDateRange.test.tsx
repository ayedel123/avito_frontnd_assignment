import { describe, expect, it } from "vitest"
import { renderHook } from "@testing-library/react"
import { NuqsTestingAdapter } from "nuqs/adapters/testing"
import type { PropsWithChildren } from "react"
import { useBookingsDateRange } from "./useBookingsDateRange"

const wrapperWith = (search: string) =>
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <NuqsTestingAdapter searchParams={search}>{children}</NuqsTestingAdapter>
    )
  }

describe("useBookingsDateRange", () => {
  it("без параметров range = undefined", () => {
    const { result } = renderHook(() => useBookingsDateRange(), {
      wrapper: wrapperWith(""),
    })
    expect(result.current.range).toBeUndefined()
  })

  it("читает from/to из URL как локальные даты", () => {
    const { result } = renderHook(() => useBookingsDateRange(), {
      wrapper: wrapperWith("?from=2026-10-24&to=2026-10-26"),
    })
    const { from, to } = result.current.range ?? {}
    expect(from?.getFullYear()).toBe(2026)
    expect(from?.getMonth()).toBe(9)
    expect(from?.getDate()).toBe(24)
    expect(to?.getDate()).toBe(26)
  })
})
