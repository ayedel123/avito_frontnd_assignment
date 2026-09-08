import { describe, expect, it } from "vitest"
import { UserBookingSchema, UserBookingsResponseSchema } from "./types"

const validBooking = {
  id: "b1",
  roomId: "r1",
  userId: "u1",
  title: "Daily Sync",
  comment: null,
  startsAt: "2026-10-24T07:00:00.000Z",
  endsAt: "2026-10-24T08:00:00.000Z",
  createdAt: "2026-10-20T10:00:00.000Z",
  room: {
    id: "r1",
    officeId: "o1",
    name: "Эверест",
    floor: 4,
    capacity: 12,
    features: [{ code: "tv", name: "ТВ-панель" }],
  },
  office: {
    id: "o1",
    name: "Офис Москва",
    address: "ул. Лесная 7",
    timezone: "Europe/Moscow",
  },
  owner: {
    id: "u1",
    login: "kk",
    displayName: "Константин К.",
    email: "kk@example.com",
    avatarUrl: null,
    initials: "КК",
  },
}

describe("UserBookingSchema", () => {
  it("парсит валидное бронирование", () => {
    expect(UserBookingSchema.parse(validBooking)).toMatchObject({
      id: "b1",
      title: "Daily Sync",
    })
  })

  it("допускает comment: null", () => {
    expect(UserBookingSchema.safeParse(validBooking).success).toBe(true)
  })

  it("отклоняет некорректную дату", () => {
    const bad = { ...validBooking, startsAt: "24.10.2026" }
    expect(UserBookingSchema.safeParse(bad).success).toBe(false)
  })

  it("отклоняет невалидный email владельца", () => {
    const bad = { ...validBooking, owner: { ...validBooking.owner, email: "нет" } }
    expect(UserBookingSchema.safeParse(bad).success).toBe(false)
  })

  it("отклоняет отсутствие обязательного поля", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { title: _title, ...withoutTitle } = validBooking
    expect(UserBookingSchema.safeParse(withoutTitle).success).toBe(false)
  })
})

describe("UserBookingsResponseSchema", () => {
  it("парсит { items: [...] }", () => {
    const parsed = UserBookingsResponseSchema.parse({ items: [validBooking] })
    expect(parsed.items).toHaveLength(1)
  })

  it("отклоняет items не массивом", () => {
    expect(
      UserBookingsResponseSchema.safeParse({ items: validBooking }).success
    ).toBe(false)
  })
})
