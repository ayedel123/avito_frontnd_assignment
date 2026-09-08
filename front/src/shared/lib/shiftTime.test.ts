import { describe, expect, it } from "vitest"
import { shiftTime } from "./shiftTime"

describe("shiftTime", () => {
  it("сдвигает время вперёд", () => {
    expect(shiftTime("10:00", 30)).toBe("10:30")
    expect(shiftTime("10:45", 15)).toBe("11:00")
  })

  it("сдвигает назад", () => {
    expect(shiftTime("10:00", -15)).toBe("09:45")
    expect(shiftTime("22:00", -60)).toBe("21:00")
  })

  it("null остаётся null", () => {
    expect(shiftTime(null, 30)).toBeNull()
  })
})
