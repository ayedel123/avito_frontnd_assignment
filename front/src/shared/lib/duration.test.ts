import { describe, expect, it } from "vitest"
import {
  durationToMinutes,
  formatDuration,
  minutesToDuration,
  timeToMinutes,
} from "./duration"

describe("duration", () => {
  it("durationToMinutes ↔ minutesToDuration round-trip", () => {
    expect(durationToMinutes({ hours: 1, minutes: 30 })).toBe(90)
    expect(minutesToDuration(90)).toEqual({ hours: 1, minutes: 30 })
    expect(minutesToDuration(45)).toEqual({ hours: 0, minutes: 45 })
    expect(minutesToDuration(120)).toEqual({ hours: 2, minutes: 0 })
  })

  it("timeToMinutes парсит HH:mm", () => {
    expect(timeToMinutes("00:00")).toBe(0)
    expect(timeToMinutes("09:15")).toBe(555)
    expect(timeToMinutes("22:00")).toBe(1320)
  })

  it("formatDuration формирует человекочитаемую строку", () => {
    expect(formatDuration({ hours: 1, minutes: 30 })).toBe("1 ч 30 мин")
    expect(formatDuration({ hours: 1, minutes: 0 })).toBe("1 ч")
    expect(formatDuration({ hours: 0, minutes: 45 })).toBe("45 мин")
    expect(formatDuration({ hours: 0, minutes: 0 })).toBe("0 мин")
  })
})
