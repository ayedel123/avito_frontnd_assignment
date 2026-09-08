import { describe, expect, it } from "vitest"
import {
  addDays,
  collectUntil,
  fromDateKey,
  nextOccurrence,
  toDateKey,
  type Anchor,
} from "./occurrences"

const weekly = (weekday: number): Anchor => ({
  mode: "weekly",
  weekday,
  dayOfMonth: 1,
})
const monthly = (dayOfMonth: number): Anchor => ({
  mode: "monthly",
  weekday: 0,
  dayOfMonth,
})

describe("toDateKey / fromDateKey", () => {
  it("round-trip без UTC-сдвига", () => {
    const date = new Date(2026, 9, 24) // 24 октября 2026, локальная полночь
    expect(toDateKey(date)).toBe("2026-10-24")
    const back = fromDateKey("2026-10-24")
    expect(back.getFullYear()).toBe(2026)
    expect(back.getMonth()).toBe(9)
    expect(back.getDate()).toBe(24)
  })
})

describe("nextOccurrence (weekly)", () => {
  it("даёт тот же день недели через 7 дней", () => {
    const from = new Date(2026, 9, 5) // понедельник
    const next = nextOccurrence(weekly(from.getDay()), from)
    expect(toDateKey(next)).toBe("2026-10-12")
    expect(next.getDay()).toBe(from.getDay())
  })
})

describe("nextOccurrence (monthly)", () => {
  it("даёт то же число в следующем месяце", () => {
    const next = nextOccurrence(monthly(15), new Date(2026, 9, 15))
    expect(toDateKey(next)).toBe("2026-11-15")
  })

  it("пропускает месяцы без нужного числа (31 → февраль)", () => {
    const next = nextOccurrence(monthly(31), new Date(2027, 0, 31)) // 31 января 2027
    expect(next.getMonth()).toBe(2) // март, февраль пропущен
    expect(next.getDate()).toBe(31)
  })
})

describe("collectUntil", () => {
  it("weekly: собирает вхождения в окне и отдаёт первое за окном", () => {
    const from = new Date(2026, 9, 5) // Пн
    const until = addDays(from, 30)
    const { dates, next } = collectUntil(weekly(from.getDay()), from, until)
    // 5, 12, 19, 26 октября, 2 ноября — 5 штук в пределах 30 дней
    expect(dates.map(toDateKey)).toEqual([
      "2026-10-05",
      "2026-10-12",
      "2026-10-19",
      "2026-10-26",
      "2026-11-02",
    ])
    expect(toDateKey(next)).toBe("2026-11-09")
    expect(next.getTime()).toBeGreaterThan(until.getTime())
  })

  it("monthly: одно вхождение в 30-дневном окне (15 окт + 30 = 14 ноя)", () => {
    const from = new Date(2026, 9, 15)
    const until = addDays(from, 30)
    const { dates, next } = collectUntil(monthly(15), from, until)
    expect(dates.map(toDateKey)).toEqual(["2026-10-15"])
    expect(toDateKey(next)).toBe("2026-11-15")
  })
})
