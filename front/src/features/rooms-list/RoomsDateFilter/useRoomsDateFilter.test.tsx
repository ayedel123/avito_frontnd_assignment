import { afterEach, describe, expect, it, vi } from "vitest"
import { renderHook } from "@testing-library/react"
import { NuqsTestingAdapter } from "nuqs/adapters/testing"
import type { PropsWithChildren } from "react"
import { useRoomsDateFilter } from "./useRoomsDateFilter"

const DAY_MS = 24 * 60 * 60 * 1000

const wrapperWith = (search: string) =>
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <NuqsTestingAdapter searchParams={search}>{children}</NuqsTestingAdapter>
    )
  }

afterEach(() => vi.useRealTimers())

describe("useRoomsDateFilter", () => {
  it("считает границы: min = сегодня в зоне офиса, окно 30 дней", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-10-24T10:00:00.000Z"))

    const { result } = renderHook(() => useRoomsDateFilter("Europe/Moscow"), {
      wrapper: wrapperWith(""),
    })

    expect([
      result.current.minDate.getFullYear(),
      result.current.minDate.getMonth(),
      result.current.minDate.getDate(),
    ]).toEqual([2026, 9, 24])
    expect(
      Math.round(
        (result.current.maxDate.getTime() - result.current.minDate.getTime()) /
          DAY_MS
      )
    ).toBe(30)
  })

  it("читает выбранную дату из URL", () => {
    const { result } = renderHook(() => useRoomsDateFilter("Europe/Moscow"), {
      wrapper: wrapperWith("?book-date=2026-10-25"),
    })
    expect(result.current.date?.getDate()).toBe(25)
  })
})
