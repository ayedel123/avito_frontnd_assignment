import { describe, expect, it } from "vitest"
import { roomItemSchema, roomsSchema } from "./types"

const validRoom = {
  id: "r1",
  officeId: "o1",
  name: "Эверест",
  floor: 4,
  capacity: 12,
  features: [{ code: "tv", name: "ТВ-панель" }],
  office: {
    id: "o1",
    name: "Офис Москва",
    address: "ул. Лесная 7",
    timezone: "Europe/Moscow",
  },
}

describe("roomItemSchema", () => {
  it("парсит комнату без available", () => {
    expect(roomItemSchema.safeParse(validRoom).success).toBe(true)
  })

  it("парсит комнату с available", () => {
    expect(
      roomItemSchema.safeParse({ ...validRoom, available: true }).success
    ).toBe(true)
  })

  it("отклоняет capacity строкой", () => {
    expect(
      roomItemSchema.safeParse({ ...validRoom, capacity: "12" }).success
    ).toBe(false)
  })

  it("отклоняет отсутствие office", () => {
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { office: _office, ...withoutOffice } = validRoom
    expect(roomItemSchema.safeParse(withoutOffice).success).toBe(false)
  })
})

describe("roomsSchema", () => {
  it("парсит { items: [...] }", () => {
    expect(roomsSchema.parse({ items: [validRoom] }).items).toHaveLength(1)
  })
})
