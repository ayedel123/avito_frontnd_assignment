import { describe, expect, it } from "vitest"
import { formatBookingSummary } from "./formatBookingSummary"

describe("formatBookingSummary", () => {
  it("собирает строку с комнатой, датой и интервалом в зоне офиса", () => {
    const summary = formatBookingSummary(
      "Эверест",
      new Date("2026-10-24T07:00:00.000Z"),
      new Date("2026-10-24T08:00:00.000Z"),
      "Europe/Moscow"
    )
    expect(summary).toContain("Комната Эверест")
    expect(summary).toContain("24 октября")
    expect(summary).toContain("10:00–11:00")
  })
})
