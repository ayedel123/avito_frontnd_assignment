import { afterEach, describe, expect, it, vi } from "vitest"
import { getDateBounds } from "./getDateBounds"

const DAY_MS = 24 * 60 * 60 * 1000

afterEach(() => vi.useRealTimers())

describe("getDateBounds", () => {
  it("min = сегодня в зоне офиса (локальная полночь, не в прошлое)", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-10-24T10:00:00.000Z"))

    const { minDate } = getDateBounds("Europe/Moscow", 30)
    expect([minDate.getFullYear(), minDate.getMonth(), minDate.getDate()]).toEqual(
      [2026, 9, 24]
    )
    expect(minDate.getHours()).toBe(0)
  })

  it("max = сегодня + 30 дней (окно бронирования)", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-10-24T10:00:00.000Z"))

    const { minDate, maxDate } = getDateBounds("Europe/Moscow", 30)
    expect(Math.round((maxDate.getTime() - minDate.getTime()) / DAY_MS)).toBe(30)
  })
})
