import { afterEach, describe, expect, it, vi } from "vitest"
import { getTodayInTimeZone } from "./getTodayInTimeZone"

afterEach(() => vi.useRealTimers())

describe("getTodayInTimeZone", () => {
  it("учитывает таймзону при переходе через полночь", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-10-24T23:30:00.000Z"))

    const msk = getTodayInTimeZone("Europe/Moscow")
    expect([msk.getFullYear(), msk.getMonth(), msk.getDate()]).toEqual([
      2026, 9, 25,
    ])

    const utc = getTodayInTimeZone("UTC")
    expect([utc.getFullYear(), utc.getMonth(), utc.getDate()]).toEqual([
      2026, 9, 24,
    ])
  })

  it("возвращает локальную полночь (без времени)", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-10-24T10:00:00.000Z"))
    const today = getTodayInTimeZone("Europe/Moscow")
    expect(today.getHours()).toBe(0)
    expect(today.getMinutes()).toBe(0)
  })
})
