import { describe, expect, it } from "vitest"
import { renderHook } from "@testing-library/react"
import { NuqsTestingAdapter } from "nuqs/adapters/testing"
import type { PropsWithChildren } from "react"
import { useCapacityFilter } from "./useCapacityFilter"
import { useDatePicker } from "./useDatePicker"
import { useDurationFilter } from "./useDurationFilter"
import { useRoomsFilters } from "./useRoomsFilters"

const wrapperWith = (search: string) =>
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <NuqsTestingAdapter searchParams={search}>{children}</NuqsTestingAdapter>
    )
  }

describe("useCapacityFilter", () => {
  it("по умолчанию null, читает число из URL", () => {
    const empty = renderHook(() => useCapacityFilter(), {
      wrapper: wrapperWith(""),
    })
    expect(empty.result.current.capacity).toBeNull()

    const filled = renderHook(() => useCapacityFilter(), {
      wrapper: wrapperWith("?capacity=5"),
    })
    expect(filled.result.current.capacity).toBe(5)
  })
})

describe("useDatePicker", () => {
  it("по умолчанию дата null", () => {
    const { result } = renderHook(() => useDatePicker(), {
      wrapper: wrapperWith(""),
    })
    expect(result.current.date).toBeNull()
  })

  it("читает дату из URL как локальную (без UTC-сдвига)", () => {
    const { result } = renderHook(() => useDatePicker(), {
      wrapper: wrapperWith("?book-date=2026-10-24"),
    })
    expect(result.current.date?.getFullYear()).toBe(2026)
    expect(result.current.date?.getMonth()).toBe(9)
    expect(result.current.date?.getDate()).toBe(24)
  })
})

describe("useDurationFilter", () => {
  it("парсит минуты в {hours, minutes} и считает maxMinutes", () => {
    const { result } = renderHook(() => useDurationFilter(), {
      wrapper: wrapperWith("?duration=90&book-time=19:00"),
    })
    expect(result.current.duration).toEqual({ hours: 1, minutes: 30 })
    expect(result.current.durationMinutes).toBe(90)
    expect(result.current.maxMinutes).toBe(60)
  })

  it("без времени maxMinutes = весь рабочий день от первого часа", () => {
    const { result } = renderHook(() => useDurationFilter(), {
      wrapper: wrapperWith(""),
    })
    expect(result.current.maxMinutes).toBe(660)
  })
})

describe("useRoomsFilters", () => {
  it("выводит end из времени начала и длительности", () => {
    const { result } = renderHook(() => useRoomsFilters(), {
      wrapper: wrapperWith("?book-time=10:00&duration=60"),
    })
    expect(result.current.end).toBe("11:00")
  })

  it("без времени начала end = null", () => {
    const { result } = renderHook(() => useRoomsFilters(), {
      wrapper: wrapperWith("?duration=60"),
    })
    expect(result.current.end).toBeNull()
  })
})
