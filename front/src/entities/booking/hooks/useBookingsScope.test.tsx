import { describe, expect, it } from "vitest"
import { renderHook } from "@testing-library/react"
import { NuqsTestingAdapter } from "nuqs/adapters/testing"
import type { PropsWithChildren } from "react"
import { useBookingsScope } from "./useBookingsScope"

const wrapperWith = (search: string) =>
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <NuqsTestingAdapter searchParams={search}>{children}</NuqsTestingAdapter>
    )
  }

describe("useBookingsScope", () => {
  it("по умолчанию upcoming", () => {
    const { result } = renderHook(() => useBookingsScope(), {
      wrapper: wrapperWith(""),
    })
    expect(result.current[0]).toBe("upcoming")
  })

  it("читает scope из URL", () => {
    const { result } = renderHook(() => useBookingsScope(), {
      wrapper: wrapperWith("?scope=past"),
    })
    expect(result.current[0]).toBe("past")
  })
})
