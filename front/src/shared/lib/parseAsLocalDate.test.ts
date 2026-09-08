import { describe, expect, it } from "vitest"
import { parseAsLocalDate } from "./parseAsLocalDate"

describe("parseAsLocalDate", () => {
  it("парсит YYYY-MM-DD в локальную дату", () => {
    const date = parseAsLocalDate.parse("2026-10-24")
    expect(date?.getFullYear()).toBe(2026)
    expect(date?.getMonth()).toBe(9) // октябрь
    expect(date?.getDate()).toBe(24)
  })

  it("сериализует по локальным компонентам (без UTC-сдвига)", () => {
    const date = new Date(2026, 9, 24)
    expect(parseAsLocalDate.serialize(date)).toBe("2026-10-24")
  })

  it("round-trip не съедает день", () => {
    expect(parseAsLocalDate.serialize(parseAsLocalDate.parse("2026-01-01")!)).toBe(
      "2026-01-01"
    )
  })

  it("некорректная строка → null", () => {
    expect(parseAsLocalDate.parse("не дата")).toBeNull()
  })
})
