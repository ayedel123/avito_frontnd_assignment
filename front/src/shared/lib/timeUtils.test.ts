import { describe, expect, it } from "vitest"
import { toIsoWithOffset } from "./timeUtils"

describe("toIsoWithOffset", () => {
  it("трактует время как стенные часы офиса и отдаёт UTC ISO", () => {
    // 10:00 24 октября в Москве (+03:00) → 07:00 UTC
    const date = new Date(2026, 9, 24) // локальная полночь 2026-10-24
    expect(toIsoWithOffset(date, "10:00", "Europe/Moscow")).toBe(
      "2026-10-24T07:00:00.000Z"
    )
  })

  it("учитывает другую таймзону офиса", () => {
    const date = new Date(2026, 9, 24)
    // Калининград (+02:00) → 08:00 UTC
    expect(toIsoWithOffset(date, "10:00", "Europe/Kaliningrad")).toBe(
      "2026-10-24T08:00:00.000Z"
    )
  })

  it("возвращает undefined без даты или времени", () => {
    expect(toIsoWithOffset(null, "10:00", "Europe/Moscow")).toBeUndefined()
    expect(toIsoWithOffset(new Date(2026, 9, 24), null, "Europe/Moscow")).toBeUndefined()
  })
})
